import {cp,mkdir,rm,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
const pkg=JSON.parse(await readFile('package.json','utf8'));
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const updatedAt=execFileSync('git',['show','-s','--format=%cI',sourceCommit],{encoding:'utf8'}).trim();
if(!/^\d{4}-/.test(updatedAt))throw Error('Missing source provenance');
await rm('dist',{recursive:true,force:true});await mkdir('dist');await cp('src','dist',{recursive:true});
await writeFile('dist/build-info.json',JSON.stringify({version:pkg.version,sourceCommit,updatedAt},null,2)+'\n');
console.log(`Built version ${pkg.version} from ${sourceCommit}. Uncommitted edits are not release proof.`);
