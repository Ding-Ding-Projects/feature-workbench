import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { validateInventory, parseReferenceQuery, selectReference, referenceRoute } from '../src/design-reference.js';
const root = new URL('../', import.meta.url);
const inventory = JSON.parse(readFileSync(new URL('docs/design-parity-inventory.json', root)));
// Hand-written canonical source list: no directory-derived inventory that silently shrinks.
const originals = ['Main-1440.png', 'Main-390.png', 'Guide-1440.png', 'Guide-390.png', 'Settings-1440.png', 'Settings-390.png', 'Setup-1440.png', 'Setup-390.png', 'Mobile-390.png'];
function verifyOriginals(data, pathExists = existsSync) {
  const frames = validateInventory(data);
  assert.deepEqual(frames.map(f => f.originalFile).sort(), originals.map(f => `design/frames/${f}`).sort());
  for (const f of frames) {
    const path = new URL(f.originalFile, root);
    assert.ok(pathExists(path), `Required original path missing: ${f.originalFile}`);
    const bytes = readFileSync(path);
    assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(bytes.readUInt32BE(16), f.pixelWidth);
    assert.equal(bytes.readUInt32BE(20), f.pixelHeight);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256);
  }
}
test('all nine explicit originals have matching PNG dimensions and SHA-256', () => verifyOriginals(inventory));
test('removing an original record fails closed', () => {
  const broken = structuredClone(inventory); broken.frames.pop();
  assert.throws(() => verifyOriginals(broken), /exactly nine/);
});
test('removing a required original path fails closed', () => {
  assert.throws(() => verifyOriginals(inventory, path => !path.pathname.endsWith('Mobile-390.png') && existsSync(path)), /Required original path missing/);
});
test('missing required metadata and substituted images fail', () => {
  for (const field of ['originalFile', 'imagePath', 'sha256', 'pixelWidth', 'realCapture', 'diff', 'sourceUrl']) {
    const broken = structuredClone(inventory); delete broken.frames[0][field];
    assert.throws(() => validateInventory(broken));
  }
  const broken = structuredClone(inventory); broken.frames[0].imagePath = './placeholder.png';
  assert.throws(() => validateInventory(broken));
});
test('all canonical routes round-trip exactly', () => {
  for (const frame of inventory.frames) {
    const selection = parseReferenceQuery(frame.referenceRoute.split('?')[1]);
    assert.equal(referenceRoute(selection), frame.referenceRoute);
    assert.equal(selectReference(inventory.frames, selection), frame);
  }
});
test('invalid query values, duplicate keys and unknown keys fail closed', () => {
  for (const route of ['?screen=Main', '?screen=main&width=1440&theme=light', '?screen=Main&width=1440x&theme=light', '?screen=Main&width=1440&theme=auto', '?screen=Main&width=1440&theme=light&theme=dark', '?screen=Main&width=1440&theme=light&extra=1', '?screen=../Main&width=1440&theme=light']) assert.throws(() => parseReferenceQuery(route));
});
test('unsupported width/theme combinations never fall back to another image', () => {
  assert.equal(selectReference(inventory.frames, parseReferenceQuery('?screen=Main&width=1440&theme=dark')), null);
  assert.equal(selectReference(inventory.frames, parseReferenceQuery('?screen=Mobile&width=1440&theme=dark')), null);
  assert.equal(selectReference(inventory.frames, parseReferenceQuery('?screen=Mobile&width=390&theme=light')), null);
});
test('viewer is separate from product and does not execute designer dependencies', () => {
  const html = readFileSync(new URL('src/design-reference.html', root), 'utf8');
  const js = readFileSync(new URL('src/design-reference.js', root), 'utf8');
  assert.match(html, /Static design references/);
  assert.match(html, /href="\.\/#workspace"/);
  assert.match(html, /href="\.\/#guide"/);
  assert.match(html, /<select name="screen">/);
  assert.doesNotMatch(html + js, /support\.js|fonts\.googleapis|iframe|innerHTML/);
  for (const f of inventory.frames) { assert.equal(f.realCapture, null); assert.equal(f.diff, null); assert.equal(f.parityVerified, false); }
});
