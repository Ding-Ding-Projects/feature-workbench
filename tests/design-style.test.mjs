import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
// Source-level design contracts only: these do not establish rendered parity.
test('designer light and dark palette tokens remain local and explicit',()=>{
  for(const color of ['#f3f5f9','#ffffff','#0d1526','#475467','#dce2ec','#2546d6','#e8edff','#e9edf4','#ffeedd','#0b1220','#172238','#26334f','#f2f5fa','#a9b4c8','#8ea2ff']){
    assert.ok(css.includes(color),color);
  }
  assert.doesNotMatch(css,/@import|https?:\/\//i);
});
test('decorative tile is replaced visually by the retained text wordmark',()=>{
  assert.match(css,/\.brand-mark\{display:none\}/);
  assert.ok(app.includes('aria-hidden="true">c.'));
  assert.ok(app.includes("esc(t('brand'))"));
});
test('top provenance and richer controls remain in source',()=>{
  assert.ok(app.includes('<div class="front-provenance">${provenance()}</div>'));
  assert.doesNotMatch(css,/\.command-trigger\{display:none/);
  for(const action of ['notifications','history','undo','settings','palette'])assert.ok(app.includes(`data-action="${action}"`));
  assert.match(css,/\.board\{grid-template-columns:1fr\}/);
  assert.match(css,/@media\(pointer:coarse\)/);
  assert.match(css,/\.range-label input\{grid-row:2;grid-column:1\/-1\}/);
  assert.match(css,/prefers-reduced-motion:reduce/);
});
test('modal preferences are styled without claiming a new settings route',()=>{
  assert.match(css,/dialog:has\(\.preferences\)/);
  assert.ok(app.includes('function settings(){openModal('));
});
