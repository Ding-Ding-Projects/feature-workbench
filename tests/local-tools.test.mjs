import test from 'node:test';
import assert from 'node:assert/strict';
import {TOOL_LIMITS, ToolError, parseCsv, jsonToCsv, csvToJson, protectCsvCell, generateLogoSvg, createToolsPanel} from '../src/local-tools.js';
const rejects = (fn, code) => assert.throws(fn, error => error instanceof ToolError && (!code || error.code === code));
test('string table converts with exact quotes, comma, Unicode, empty strings and embedded newlines', () => {
  const table = [['name','note'],['香港','a,"b"\r\nc'],['','']];
  const csv = jsonToCsv(JSON.stringify(table));
  assert.equal(csv, '"name","note"\r\n"香港","a,""b""\r\nc"\r\n"",""\r\n');
  assert.deepEqual(JSON.parse(csvToJson(csv)), table);
});
test('CSV record styles, UTF-8 BOM and header-only tables', () => {
  for (const newline of ['\r\n','\r','\n']) assert.deepEqual(parseCsv('\ufeffa,b'+newline+'x,y'+newline), [['a','b'],['x','y']]);
  assert.deepEqual(parseCsv('a,b'), [['a','b']]);
  assert.deepEqual(parseCsv('a\n""'), [['a'],['']]);
  assert.equal(csvToJson('code\n0012'), '[\n  [\n    "code"\n  ],\n  [\n    "0012"\n  ]\n]');
});
test('CSV parser refuses malformed quotes, ragged data, duplicate/blank headers', () => {
  for (const value of ['a\n"unfinished','a\na"b','a\n"a"junk','a,b\nx','a,a','a,','a,b\n\n']) rejects(() => parseCsv(value));
});
test('JSON accepts only rectangular string arrays, never objects or inferred values', () => {
  for (const value of ['{','[]','{}','[["a"],[1]]','[["a"],[null]]','[["a"],[{}]]','[["a","b"],["x"]]','[["a","a"]]','[[" "]]']) rejects(() => jsonToCsv(value));
  assert.equal(jsonToCsv('[["__proto__"],["constructor"]]'), '"__proto__"\r\n"constructor"\r\n');
});
test('generated CSV formula protection covers headers, whitespace, controls and all triggers', () => {
  for (const value of ['=1+1','+cmd','-1','@SUM(A1)','  =1','\t=1','\rhello','\nhello','\u0000=1']) assert.equal(protectCsvCell(value), "'" + value);
  for (const value of ['hello','1','a=b',"'=1",'']) assert.equal(protectCsvCell(value), value);
  const result = parseCsv(jsonToCsv(JSON.stringify([['=header'],[' =1']])));
  assert.deepEqual(result, [["'=header"],["' =1"]]);
  rejects(() => jsonToCsv(JSON.stringify([['=x',"'=x"]])), 'header');
});
test('limits bound bytes, cell width, columns, rows and expanded output', () => {
  rejects(() => parseCsv('a'.repeat(TOOL_LIMITS.bytes + 1)), 'limit');
  rejects(() => parseCsv('字'.repeat(400000)), 'limit');
  rejects(() => parseCsv('a\n' + 'x'.repeat(TOOL_LIMITS.cell + 1)), 'limit');
  rejects(() => parseCsv(Array.from({length:101},(_,i) => String(i)).join(',')), 'limit');
  rejects(() => parseCsv('a\n' + 'x\n'.repeat(10001)), 'limit');
  assert.equal(parseCsv('a\n' + 'x\n'.repeat(10000)).length,10001);
  rejects(() => csvToJson('a\n' + ('"'+'\t'.repeat(60000)+'"\n').repeat(9)), 'limit');
});
test('SVG validates color and initials, escapes XML and chooses contrasting ink', () => {
  const svg = generateLogoSvg({initials:'<&"\'',color:'#ffffff'});
  assert.match(svg, /&lt;&amp;&quot;&apos;/); assert.match(svg, /fill="#000000"/);
  assert.match(generateLogoSvg({initials:'香港',color:'#000000'}), /fill="#ffffff"/);
  for (const initials of ['', '     ', '<script>', '\n', 'abcde', '😀']) rejects(() => generateLogoSvg({initials}), 'initials');
  for (const color of ['red','#fff','#ffffff" onload="x','url(x)']) rejects(() => generateLogoSvg({color}), 'color');
  assert.doesNotMatch(generateLogoSvg(), /<script|href=|onload=|foreignObject/);
});

// Minimal semantic DOM double tests callback wiring, not browser rendering/accessibility.
function mountPanel(options) {
  const elements = [];
  const previous = globalThis.document;
  globalThis.document = {createElement(tag) {
    const element = {tag, textContent:'', value:'', style:{}, handlers:{}, children:[],
      append(...items) { this.children.push(...items); },
      setAttribute(name, value) { this[name] = value; },
      removeAttribute(name) { delete this[name]; },
      addEventListener(name, callback) { this.handlers[name] = callback; }, focus() {}};
    elements.push(element); return element;
  }};
  try { createToolsPanel(options); } finally { globalThis.document = previous; }
  return {elements, click: prefix => elements.find(el => el.tag === 'button' && el.textContent.startsWith(prefix)).handlers.click()};
}
test('notices retain localized first argument and independent language metadata without user content', async () => {
  for (const language of ['en', 'yue', 'both']) {
    const notices = [];
    const {elements} = mountPanel({language, onNotice:(...args) => notices.push(args), onDownload:async () => { throw new Error('private download detail'); }});
    const source = elements.find(el => el.tag === 'textarea');
    const buttons = elements.filter(el => el.tag === 'button');
    source.value = '[[' + JSON.stringify('PRIVATE_SENTINEL') + ']]';
    buttons[0].handlers.click();
    const [text, metadata] = notices.at(-1);
    assert.deepEqual(Object.keys(metadata).sort(), ['category','en','error','yue']);
    assert.equal(metadata.category, 'local-tools:done'); assert.equal(metadata.error, false);
    assert.equal(text, language === 'en' ? metadata.en : language === 'yue' ? metadata.yue : metadata.en + ' · ' + metadata.yue);
    assert.notEqual(metadata.en, metadata.yue);
    buttons[2].handlers.click();
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(notices.at(-1)[1].category, 'local-tools:failed');
    assert.equal(notices.at(-1)[1].error, true);
    source.value = 'PRIVATE_SENTINEL'; buttons[0].handlers.click();
    assert.equal(notices.at(-1)[1].category, 'local-tools:json');
    assert.equal(notices.at(-1)[1].error, true);
    const initials = elements.find(el => el.tag === 'input' && el.type === 'text');
    initials.value = 'PRIVATE_SENTINEL'; initials.handlers.input();
    assert.equal(notices.at(-1)[1].category, 'local-tools:initialsError');
    assert.equal(notices.at(-1)[1].error, true);
    buttons[3].handlers.click();
    assert.equal(notices.at(-1)[1].error, false);
    assert.equal(notices.at(-1)[1].category, 'local-tools:cleared');
    assert.doesNotMatch(JSON.stringify(notices), /PRIVATE_SENTINEL|private download detail/);
  }
});
test('successful download notices are not marked as errors', async () => {
  const notices = [];
  const {elements} = mountPanel({onNotice:(...args) => notices.push(args), onDownload:async () => {}});
  const buttons = elements.filter(el => el.tag === 'button');
  buttons.at(-1).handlers.click();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(notices.at(-1)[1].category, 'local-tools:started');
  assert.equal(notices.at(-1)[1].error, false);
});
