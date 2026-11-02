import test from 'node:test';
import assert from 'node:assert/strict';
import { createWordingMatcher } from '../src/wording.js';

test('replaces phrases inside owned labels, retaining surrounding text', () => {
  const matcher = createWordingMatcher({ 'sample page': 'demo screen' });
  assert.equal(matcher.replace('Open the sample page now.'), 'Open the demo screen now.');
  assert.equal(matcher.replace('sample pages'), 'sample pages');
});
test('longest leftmost boundary-valid match wins independent of insertion order', () => {
  for (const entries of [{red:'R','red blue':'RB',blue:'B'},{blue:'B','red blue':'RB',red:'R'}]) {
    const matcher = createWordingMatcher(entries);
    assert.equal(matcher.replace('red blue red blues blue'), 'RB R blues B');
    assert.deepEqual(matcher.spans('red blue'), [{start:0,end:8,replacement:'RB'}]);
  }
});
test('matching is case sensitive and does not normalize Unicode', () => {
  const matcher = createWordingMatcher({Save:'Store','é':'accent'});
  assert.equal(matcher.replace('Save save SAVE é e\u0301'), 'Store save SAVE accent e\u0301');
});
test('letters, numbers, combining marks and underscores block boundaries', () => {
  const matcher = createWordingMatcher({marker:'replacement'});
  for (const edge of ['a','2','_','界','\u0301','𝒜']) {
    assert.equal(matcher.replace(`${edge}marker marker${edge}`), `${edge}marker marker${edge}`);
  }
  assert.equal(matcher.replace('(marker),marker! 😀marker😀'), '(replacement),replacement! 😀replacement😀');
});
test('punctuation phrases still require external word boundaries', () => {
  const matcher = createWordingMatcher({'!':'notice','a!':'alert','😀':'smile'});
  assert.equal(matcher.replace('a! x! !x ! 😀 x😀 😀x'), 'alert x! !x notice smile x😀 😀x');
});
test('replacement is literal, nonrecursive and permits deletion', () => {
  const matcher = createWordingMatcher({one:'two',two:'three',drop:'',literal:'$&<b>'});
  assert.equal(matcher.replace('one two drop literal'), 'two three  $&<b>');
});
test('empty dictionary and supplementary characters keep exact text', () => {
  assert.equal(createWordingMatcher().replace('Text 😀'), 'Text 😀');
  assert.deepEqual(createWordingMatcher({'😀':'X'}).spans('😀 😀'), [{start:0,end:2,replacement:'X'},{start:3,end:5,replacement:'X'}]);
});
test('matcher never mutates caller entries or inputs', () => {
  const entries=Object.freeze({label:'value'});
  const matcher=createWordingMatcher(entries);
  assert.equal(matcher.replace('label'), 'value');
  assert.deepEqual(entries, {label:'value'});
});
test('lone-surrogate source never consumes half a Unicode character', () => {
  assert.equal(createWordingMatcher({'a\ud83d':'X'}).replace('a😀'), 'a😀');
  assert.equal(createWordingMatcher({'a\ud83d':'X'}).replace('a\ud83d'), 'X');
});
