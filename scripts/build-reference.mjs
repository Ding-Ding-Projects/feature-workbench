import {readdir,readFile,mkdir,writeFile,cp} from 'node:fs/promises';
import path from 'node:path';
const escape=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inline=s=>escape(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
export function renderMarkdown(source){
 let code=false,list=false,output=[];
 for(const line of source.split(/\r?\n/)){
  if(line.startsWith('```')){if(list){output.push('</ul>');list=false;}output.push(code?'</code></pre>':'<pre><code>');code=!code;continue;}
  if(code){output.push(escape(line)+'\n');continue;}
  if(/^[-*] /.test(line)){if(!list){output.push('<ul>');list=true;}output.push('<li>'+inline(line.slice(2))+'</li>');continue;}
  if(list){output.push('</ul>');list=false;}
  const heading=line.match(/^(#{1,6})\s+(.+)$/);if(heading){output.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`);continue;}
  if(line.trim())output.push('<p>'+inline(line)+'</p>');
 }
 if(list)output.push('</ul>');if(code)output.push('</code></pre>');return output.join('\n');
}
const page=(title,body)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} | Reference</title><style>body{font:1rem/1.65 system-ui,sans-serif;color:#183337;background:#faf9f5;max-width:55rem;margin:auto;padding:2rem}a{color:#146d62}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#e7efeb;padding:1rem}code{font-family:monospace}h1,h2{line-height:1.2}nav{display:flex;gap:1rem;flex-wrap:wrap}</style></head><body><nav><a href="../#guide">Interactive guide</a><a href="index.html">Reference index</a></nav>${body}</body></html>`;
export async function buildReference(){
 await mkdir('dist/reference',{recursive:true});const entries=[];
 for(const name of (await readdir('docs')).filter(n=>n.endsWith('.md')).sort()){
  const source=await readFile(path.join('docs',name),'utf8'),title=source.match(/^#\s+(.+)/m)?.[1]||name,target=name.replace(/\.md$/,'.html');
  await writeFile(path.join('dist/reference',target),page(title,renderMarkdown(source)));await cp(path.join('docs',name),path.join('dist/reference',name));entries.push({title,target,name});
 }
 await writeFile('dist/reference/index.html',page('Reference library','<h1>Reference library</h1><p>Complete repository documentation, bundled with this build. Start with the interactive guide for task-led walkthroughs. These supporting articles are currently in English.</p><ul>'+entries.map(e=>`<li><a href="${e.target}">${escape(e.title)}</a> (<a href="${e.name}">Markdown source</a>)</li>`).join('')+'</ul>'));
}
