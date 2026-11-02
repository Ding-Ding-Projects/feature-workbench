import {createServer} from 'node:http';
import {lstat, realpath, readFile} from 'node:fs/promises';
import {resolve, sep, extname} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.txt':'text/plain; charset=utf-8','.woff2':'font/woff2','.wasm':'application/wasm'};
export async function createStaticServer({root=resolve('dist')}={}) {
 const base=await realpath(root);
 if(!(await lstat(base)).isDirectory())throw Error('Static root is not a directory');
 return createServer(async(req,res)=>{
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; worker-src 'self' blob:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
  const fail=(code,message)=>{res.writeHead(code,{'Content-Type':'text/plain; charset=utf-8'});res.end(message);};
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');fail(405,'Method not allowed');return;}
  try {
   const path=decodeURIComponent((req.url||'/').split('?')[0]);
   const segments=path.split('/').filter(Boolean);
   if(!path.startsWith('/')||path.startsWith('//')||/[\\\x00-\x1f:]/.test(path)||segments.some(s=>s==='..'||s==='.'||s.startsWith('.'))){fail(403,'Forbidden path');return;}
   if(!segments.length)segments.push('index.html');
   let target=base;
   for(const segment of segments){target=resolve(target,segment);if((await lstat(target)).isSymbolicLink()){fail(403,'Symbolic links are not served');return;}}
   const canonical=await realpath(target);
   if(!canonical.startsWith(base+sep)||!(await lstat(canonical)).isFile()){fail(404,'Not found');return;}
   const bytes=await readFile(canonical);
   res.writeHead(200,{'Content-Type':mime[extname(canonical).toLowerCase()]||'application/octet-stream','Content-Length':bytes.length,'Cache-Control':'no-cache'});
   res.end(req.method==='HEAD'?undefined:bytes);
  } catch(error){
   if(error instanceof URIError){fail(400,'Malformed path');return;}
   fail(['ENOENT','ENOTDIR'].includes(error.code)?404:500,'Unable to serve requested file');
  }
 });
}

export async function startStaticServer({root,host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||8080)}={}) {
 if(!['127.0.0.1','localhost','::1','0.0.0.0'].includes(host))throw Error('Unsupported HOST; use loopback or explicitly select 0.0.0.0 for a container');
 if(!Number.isInteger(port)||port<0||port>65535)throw Error('PORT must be an integer from 0 to 65535');
 const server=await createStaticServer({root});
 await new Promise((accept,reject)=>{server.once('error',reject);server.listen(port,host,()=>{server.removeListener('error',reject);accept();});});
 const address=server.address();
 const browserHost=host==='0.0.0.0'?'127.0.0.1':host;
 const url=`http://${browserHost.includes(':')?'['+browserHost+']':browserHost}:${address.port}/`;
 return {server,url};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try {
  const {server,url}=await startStaticServer();
  console.log(`Serving built application at ${url}`);
  console.log('Press Ctrl+C to stop this server.');
  if(process.argv.includes('--open')){
   if(process.env.HOST==='0.0.0.0')throw Error('Browser launch is not supported for the container bind address');
   const command=process.platform==='win32'?'explorer.exe':process.platform==='darwin'?'open':'xdg-open';
   const browser=spawn(command,[url],{stdio:'ignore'});
   browser.on('error',()=>console.error(`Browser launch unavailable; open ${url}`));
   browser.unref();
  }
  let closing=false;
  const stop=()=>{if(closing)return;closing=true;server.close();server.closeIdleConnections();const timeout=setTimeout(()=>{server.closeAllConnections();},2000);timeout.unref();};
  process.once('SIGINT',stop);process.once('SIGTERM',stop);
 } catch(error){console.error(`Server incomplete: ${error.message}`);process.exit(1);}
}
