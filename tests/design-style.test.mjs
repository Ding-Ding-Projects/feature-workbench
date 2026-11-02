import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const css=await readFile(new URL('../src/styles.css',import.meta.url),'utf8');
const app=await readFile(new URL('../src/app.js',import.meta.url),'utf8');
// Source-level design contracts only: these do not establish rendered parity.
// The palette is now the Material 3 tonal role set from the v2 design source (seed cobalt, amber tertiary).
test('designer light and dark palette tokens remain local and explicit',()=>{
  for(const color of ['#2546d6','#dde1ff','#001257','#dee1f9','#ffdcbe','#2d1600','#fbf8ff','#ffffff','#1b1b21','#45464f','#c6c5d0','#b9c3ff','#0035c2','#424659','#6a3c00','#121318','#e4e1e9']){
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
