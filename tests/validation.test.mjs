import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateVocabulary,parseBoundedJSON} from '../src/validation.js';
test('accepts empty dynamic inventory and neutral Unicode entries',()=>{assert.equal(Object.keys(validateVocabulary('{"schemaVersion":1,"entries":{}}').entries).length,0); assert.equal(validateVocabulary(JSON.stringify({schemaVersion:1,entries:{'Label':'Example'}})).entries.Label,'Example');});
for(const [name,input] of Object.entries({duplicate:'{"schemaVersion":1,"entries":{"x":"a","x":"b"}}',unsafe:'{"schemaVersion":1,"entries":{"__proto__":"x"}}',version:'{"schemaVersion":2,"entries":{}}',unknown:'{"schemaVersion":1,"entries":{},"other":0}',nonstring:'{"schemaVersion":1,"entries":{"x":2}}',malformed:'{',empty:'',longkey:JSON.stringify({schemaVersion:1,entries:{['a'.repeat(161)]:'x'}}),longvalue:JSON.stringify({schemaVersion:1,entries:{a:'x'.repeat(1001)}}),large:' '.repeat(262145),depth:'['.repeat(10)+'0'+']'.repeat(10)})) test(`rejects ${name} without leaking content`,()=>assert.throws(()=>validateVocabulary(input)));
test('escaped equivalent duplicate keys rejected',()=>assert.throws(()=>parseBoundedJSON('{"a":1,"\\u0061":2}')));
test('allows Unicode code-point limits',()=>assert.ok(validateVocabulary(JSON.stringify({schemaVersion:1,entries:{['😀'.repeat(160)]:'😀'.repeat(1000)}}))));

test('rejects non-JSON whitespace and trailing tokens',()=>{for(const text of ['\u00a0{}','{} true','[1,]','{\"a\":1,}'])assert.throws(()=>parseBoundedJSON(text));});

// Independently authored synthetic inputs; never real user wording.
import { parseVocabularyBytes, serialiseVocabulary } from '../src/validation.js';
const encode = value => new TextEncoder().encode(value);
const document = entries => ({ schemaVersion: 1, entries });
const normalize = value => JSON.parse(JSON.stringify(value));
test('portable semantic round trip retains every accepted entry', () => {
  for (const entries of [{}, { alpha: 'beta', blank: '', lines: '\t\n\r', '😀': '界' }, { ['x'.repeat(160)]: 'y'.repeat(1000) }]) {
    const input = document(entries);
    const parsed = parseVocabularyBytes(encode(JSON.stringify(input)));
    assert.deepEqual(normalize(parseVocabularyBytes(encode(serialiseVocabulary(parsed)))), input);
  }
});
test('strict original-byte ingress and BOM handling', () => {
  for (const bytes of [new Uint8Array([0xc3, 0x28]), new Uint8Array([0xff]), new Uint8Array(262145)]) assert.throws(() => parseVocabularyBytes(bytes));
  assert.throws(() => parseVocabularyBytes('not bytes'));
  const body = encode(JSON.stringify(document({ label: 'value' })));
  assert.equal(parseVocabularyBytes(new Uint8Array([239,187,191,...body])).entries.label, 'value');
});
test('replacement control characters rejected; tab, newline and carriage return preserved', () => {
  for (const code of [...Array(9).keys(), 11, 12, ...Array.from({length:18}, (_, i) => i+14), 127]) {
    assert.throws(() => validateVocabulary(JSON.stringify(document({ label: String.fromCharCode(code) }))));
  }
  assert.equal(validateVocabulary(JSON.stringify(document({ label: '\t\n\r' }))).entries.label, '\t\n\r');
});
test('all unsupported versions and unknown fields reject instead of silently migrating', () => {
  for (const schemaVersion of [0, 2, -1, 1.1, '1', null, true]) assert.throws(() => validateVocabulary(JSON.stringify({schemaVersion, entries:{}})));
  for (const input of [{version:1,replacements:{}}, {schemaVersion:1,entries:{},extension:{}}, {schemaVersion:1,entries:[]}]) assert.throws(() => validateVocabulary(JSON.stringify(input)));
  assert.throws(() => serialiseVocabulary({schemaVersion:1, entries:{label:undefined}}));
  assert.throws(() => serialiseVocabulary({schemaVersion:1, entries:{}, unknown:undefined}));
});
test('raw-byte bound is inclusive and independent of whitespace', () => {
  const text = JSON.stringify(document({}));
  assert.ok(parseVocabularyBytes(encode(text + ' '.repeat(262144-text.length))));
  assert.throws(() => parseVocabularyBytes(encode(text + ' '.repeat(262145-text.length))));
});
test('escaped duplicates reject without echoing input', () => {
  for (const text of ['{"schemaVersion":1,"entries":{"a":"first","\\u0061":"second"}}','{"schemaVersion":1,"entries":{"/":"first","\\/":"second"}}']) {
    assert.throws(() => parseVocabularyBytes(encode(text)), error => !error.message.includes('first') && !error.message.includes('second'));
  }
});
