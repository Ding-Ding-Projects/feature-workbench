import {buildReference} from './build-reference.mjs';
import {cp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const pkg=JSON.parse(await readFile('package.json','utf8'));
let sourceCommit=null,updatedAt=null,dirty=null;
try {
 sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();
 dirty=execFileSync('git',['status','--porcelain'],{encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim().length>0;
 if(!dirty)updatedAt=execFileSync('git',['show','-s','--format=%cI',sourceCommit],{encoding:'utf8'}).trim();
} catch { sourceCommit=null;updatedAt=null; }
if(updatedAt&&!Number.isFinite(Date.parse(updatedAt)))updatedAt=null;
await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('src','dist',{recursive:true});
await writeFile('dist/build-info.json',JSON.stringify({version:pkg.version,sourceCommit,updatedAt,dirty,provenance:updatedAt?'clean-source-commit':'unavailable'},null,2)+'\n');
await buildReference();
await mkdir('dist/design',{recursive:true});
await cp('design/frames','dist/design/frames',{recursive:true});
await cp('docs/design-parity-inventory.json','dist/design-parity-inventory.json');
console.log(updatedAt?`Built version ${pkg.version} from ${sourceCommit}.`:`Built version ${pkg.version}; exact timestamp provenance unavailable for this uncommitted or archive source. Not release proof.`);
