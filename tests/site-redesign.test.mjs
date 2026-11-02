import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=p=>readFile(new URL('../'+p,import.meta.url),'utf8');
const [css,app,i18n,search]=await Promise.all(['src/styles.css','src/app.js','src/i18n.js','src/search-builder.js'].map(read));
// Source-level contracts for the second redesign pass; not browser or screenshot proof.
test('an empty query selects every item without waiting for a worker',()=>{
  assert.match(search,/state\.query===''&&!replacement\.value\?\{ok:true,indices:items\.map\(\(_,i\)=>i\)/);
});
test('ledger rows and the ledger summary carry their real status',()=>{
  assert.ok(app.includes('<span class="badge" data-status="${esc(x.status||\'incomplete\')}">'));
  assert.ok(app.includes('class="ledger-counts"'));
  for(const key of ['statusPartial','statusIncomplete','statusComplete'])assert.match(i18n,new RegExp(key+":\\['[^']+','[^']+'\\]"));
  for(const status of ['partial','incomplete','complete'])assert.ok(css.includes(`.badge[data-status=${status}]`));
});
test('search fields show a visible placeholder and the theme choice previews its palette',()=>{
  assert.ok(search.includes("placeholder:label??tr('search')"));
  assert.ok(css.includes('button[data-choice=theme]::before'));
  assert.ok(css.includes('button[data-choice=theme][data-value=dark]::before'));
});
