import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,mkdir,symlink,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {request} from 'node:http';
import {startStaticServer} from '../scripts/serve.mjs';
const get=(url,path,method='GET')=>new Promise((resolve,reject)=>{const req=request(new URL(url),{path,method},res=>{let body='';res.on('data',chunk=>body+=chunk);res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body}));});req.on('error',reject);req.end();});
test('real static HTTP server serves MIME, blocks escapes and shuts down its own listener',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sample-server-'));let server;
 try{
  const root=join(dir,'dist');await mkdir(root);await writeFile(join(root,'index.html'),'<h1>Built fixture</h1>');await writeFile(join(root,'app.js'),'export const value=1;');await writeFile(join(dir,'private.txt'),'not public');
  await writeFile(join(root,'fixture.ttf'),'synthetic font transport fixture');
  const running=await startStaticServer({root,port:0});server=running.server;const {url}=running;
  assert.equal(server.address().address,'127.0.0.1');
  const home=await get(url,'/');assert.equal(home.status,200);assert.match(home.headers['content-type'],/text\/html/);assert.match(home.body,/Built fixture/);assert.match(home.headers['content-security-policy'],/worker-src 'self' blob:/);
  assert.match((await get(url,'/app.js')).headers['content-type'],/javascript/);
  assert.equal((await get(url,'/app.js','HEAD')).body,'');
  assert.equal((await get(url,'/fixture.ttf')).headers['content-type'],'font/ttf');
  assert.equal((await get(url,'/','POST')).status,405);
  assert.equal((await get(url,'/missing')).status,404);
  assert.equal((await get(url,'/%zz')).status,400);
  for(const path of ['/../private.txt','/%2e%2e/private.txt','/a/%2e%2e/private.txt','/a%5c..%5cprivate.txt','//private.txt','/.hidden','/C:/private.txt'])assert.equal((await get(url,path)).status,403,path);
  // Windows standard-user symlink creation may be unavailable; junction covers directory escape there.
  await symlink(dir,join(root,'escape'),process.platform==='win32'?'junction':'dir');
  assert.equal((await get(url,'/escape/private.txt')).status,403);
 }finally{if(server)await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});}
});
test('server rejects invalid bind configuration',async()=>{
 await assert.rejects(startStaticServer({host:'example.com'}),/HOST/);
 await assert.rejects(startStaticServer({port:-1}),/PORT/);
});
test('successful interactive build offers run but silent cannot launch',async()=>{
 const script=await readFile('scripts/build.ps1','utf8');
 assert.match(script,/if \(!\$Silent\) \{\s*\$answer = Read-Host/);
 assert.match(script,/\$env:HOST = '127\.0\.0\.1'/);
 assert.match(script,/\$env:PORT = '0'/);
 assert.match(script,/& \$node scripts\/serve\.mjs --open/);
 assert.ok(script.indexOf('$result -ne 0')<script.indexOf('Read-Host'));
});
test('CLI prints actual loopback URL and stops gracefully on SIGTERM',{skip:process.platform==='win32'?'POSIX signal check; Windows Ctrl+C needs host verification':false},async()=>{
 const {spawn}=await import('node:child_process');
 const {once}=await import('node:events');
 const {fileURLToPath}=await import('node:url');
 const dir=await mkdtemp(join(tmpdir(),'sample-server-cli-'));let child;
 try{
  await mkdir(join(dir,'dist'));await writeFile(join(dir,'dist','index.html'),'CLI fixture');
  child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/serve.mjs',import.meta.url))],{cwd:dir,env:{...process.env,HOST:'127.0.0.1',PORT:'0'},stdio:['ignore','pipe','pipe']});
  const url=await new Promise((accept,reject)=>{
   let output='';const timeout=setTimeout(()=>reject(Error('Server startup timed out')),5000);
   child.once('error',error=>{clearTimeout(timeout);reject(error);});
   child.stdout.on('data',data=>{output+=data;const match=output.match(/http:\/\/127\.0\.0\.1:\d+\//);if(match){clearTimeout(timeout);accept(match[0]);}});
  });
  assert.equal((await get(url,'/')).body,'CLI fixture');
  const ended=once(child,'exit');child.kill('SIGTERM');
  const [code,signal]=await ended;assert.equal(code,0);assert.equal(signal,null);
 }finally{if(child&&child.exitCode===null)child.kill('SIGTERM');await rm(dir,{recursive:true,force:true});}
});
