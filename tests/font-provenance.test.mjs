import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../src/fonts/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('provenance.json',root),'utf8'));
test('all vendored fonts and original licenses match the pinned official source manifest',async()=>{
 assert.equal(manifest.commit,'6c1dbe27dcf7d817d4b62cec033ba77fa8e2a5ec');
 assert.equal(manifest.license,'OFL-1.1');assert.equal(manifest.files.length,12);
 for(const row of manifest.files){
  assert.ok(row.source.startsWith(`https://raw.githubusercontent.com/google/fonts/${manifest.commit}/ofl/`));
  const data=await readFile(new URL(row.path,root));
  assert.equal(data.length,row.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256,row.path);
  if(row.path.endsWith('.ttf'))assert.equal(data.readUInt32BE(0),0x00010000);
  if(row.path.endsWith('OFL.txt'))assert.match(data.toString(),/SIL OPEN FONT LICENSE Version 1.1/);
 }
 for(const name of ['bricolagegrotesque','inter','jetbrainsmono','notosanshk']){
  const files=await readdir(new URL(name+'/',root));assert.equal(files.length,3);
  assert.ok(files.includes('OFL.txt'));assert.ok(files.includes('METADATA.pb'));
 }
});
test('font-face references resolve locally without CDN or local-font substitution',async()=>{
 const css=await readFile(new URL('fonts.css',root),'utf8');
 assert.doesNotMatch(css,/https?:|@import|local\(/);
 const urls=[...css.matchAll(/url\("(.+?)"\)/g)];assert.equal(urls.length,4);
 for(const [,url] of urls){assert.ok(url.startsWith('./'));assert.ok((await readFile(new URL(url,root))).length>100000);}
 assert.equal((css.match(/font-display:swap/g)||[]).length,4);
});
