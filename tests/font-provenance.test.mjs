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
 const urls=[...css.matchAll(/url\("(.+?)"\)/g)];assert.equal(urls.length,5);
 for(const [,url] of urls){assert.ok(url.startsWith('./'));const data=await readFile(new URL(url,root));if(url.endsWith('.woff2'))assert.equal(data.subarray(0,4).toString('latin1'),'wOF2');else assert.ok(data.length>100000);}
 assert.equal((css.match(/font-display:swap/g)||[]).length,4);
 // The icon subset blocks briefly instead of swapping so ligature names never flash as text.
 assert.equal((css.match(/font-display:block/g)||[]).length,1);
});
test('vendored Material Symbols subset matches its recorded source, licence and hash',async()=>{
 const icon=manifest.iconFont;
 assert.equal(icon.family,'Material Symbols Rounded');assert.equal(icon.license,'Apache-2.0');
 assert.ok(icon.subsetRequest.startsWith('https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@24,500,0..1&icon_names='));
 assert.deepEqual([...icon.glyphs].sort(),icon.glyphs,'icon_names must be sorted');
 assert.equal(icon.files.length,2);
 for(const row of icon.files){
  const data=await readFile(new URL(row.path,root));
  assert.equal(data.length,row.bytes);assert.equal(createHash('sha256').update(data).digest('hex'),row.sha256,row.path);
  if(row.path.endsWith('.woff2')){assert.ok(row.source.startsWith('https://fonts.gstatic.com/'));assert.equal(data.subarray(0,4).toString('latin1'),'wOF2');}
  if(row.path.endsWith('LICENSE')){assert.ok(row.source.startsWith(`https://raw.githubusercontent.com/google/material-design-icons/${icon.licenseCommit}/`));assert.match(data.toString(),/Apache License\s+Version 2\.0/);}
 }
 assert.deepEqual((await readdir(new URL('materialsymbolsrounded/',root))).sort(),['LICENSE','MaterialSymbolsRounded-subset.woff2']);
 // Every glyph the app and stylesheet name must be in the vendored subset.
 const [app,styles]=await Promise.all(['../app.js','../styles.css'].map(p=>readFile(new URL(p,root),'utf8')));
 const tables=['NAV_ITEMS','PREF_SECTIONS','LANE_ICONS'].map(name=>{const m=app.match(new RegExp('const '+name+'=([^;]+);'));assert.ok(m,name);return m[1];}).join(' ');
 const used=new Set([...app.matchAll(/icon\('([a-z_]+)'/g),...tables.matchAll(/'[A-Za-z]+'(?:,|:)'([a-z_]+)'/g),...styles.matchAll(/content:"([a-z_]{3,})"/g)].map(m=>m[1]));
 assert.ok(used.size>=25,'expected the icon inventory to be discovered');
 for(const name of used)assert.ok(icon.glyphs.includes(name),name);
});
