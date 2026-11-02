import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { classify, countText, countRevision, estimate } from '../scripts/source-count.mjs';

const manifest = JSON.parse(readFileSync(new URL('../docs/process-requirements.json', import.meta.url)));
const docs = readFileSync(new URL('../docs/process-verification.md', import.meta.url), 'utf8');
export function validateAudit(rows, document) {
  assert.equal(rows.length, 40);
  assert.equal(new Set(rows.map(row => row.id)).size, 40);
  assert.equal(rows.filter(row => row.kind === 'process').length, 30);
  assert.equal(rows.filter(row => row.kind === 'external-service').length, 10);
  for (const row of rows) {
    assert.match(row.id, /^[a-z][a-z0-9-]+$/);
    assert.ok(['open', 'partial', 'blocked', 'conditional', 'not-applicable', 'suspended'].includes(row.status), 'Audit must not promote requirements to verified');
    assert.ok(document.includes(`### ${row.id}\n**Status: ${row.status}.** `));
  }
}
test('audit covers all scoped process/service rows without completion assertions', () => validateAudit(manifest.requirements, docs));
test('audit rejects removed rows, duplicate rows, missing prose and invented verification', () => {
  assert.throws(() => validateAudit(manifest.requirements.slice(1), docs));
  assert.throws(() => validateAudit([...manifest.requirements.slice(1), manifest.requirements[1]], docs));
  assert.throws(() => validateAudit(manifest.requirements, docs.replace('### screen-recording', '### other')));
  const rows = structuredClone(manifest.requirements); rows[0].status = 'verified';
  assert.throws(() => validateAudit(rows, docs));
});
test('counter distinguishes text categories and newline/blank edge cases', () => {
  assert.deepEqual(countText(''), { total: 0, nonBlank: 0 });
  assert.deepEqual(countText('a\n \nlast'), { total: 3, nonBlank: 2 });
  assert.deepEqual(countText('a\r\n\r\n'), { total: 2, nonBlank: 1 });
  assert.equal(classify('vendor/a.js'), 'excluded');
  assert.equal(classify('src/generated/a.js'), 'generated');
  assert.equal(classify('tests/x.test.mjs'), 'tests');
  assert.equal(classify('src/a.css'), 'styles-or-markup');
  assert.equal(classify('src/a.mjs'), 'source');
  assert.deepEqual(estimate(30).hours, { low: 1, high: 3 });
});
test('counter uses immutable blobs, reconciles blame without exposing author details', () => {
  const dir = mkdtempSync(path.join(tmpdir(), 'sample-count-'));
  const git = args => execFileSync('git', args, { cwd: dir, stdio: 'pipe' }).toString().trim();
  try {
    git(['init']); git(['config', 'user.name', 'Fixture author']); git(['config', 'user.email', 'fixture@example.invalid']);
    mkdirSync(path.join(dir, 'src')); mkdirSync(path.join(dir, 'vendor'));
    writeFileSync(path.join(dir, 'src/a.js'), 'first\n\nlast\n');
    writeFileSync(path.join(dir, 'vendor/a.js'), 'excluded\n');
    writeFileSync(path.join(dir, 'image.png'), Buffer.from([0, 1, 2]));
    git(['add', '.']); git(['commit', '-m', 'fixture']);
    const before = countRevision(dir);
    writeFileSync(path.join(dir, 'src/a.js'), 'dirty\n');
    assert.deepEqual(countRevision(dir), before);
    assert.deepEqual(before.handwritten, { total: 3, nonBlank: 2 });
    assert.equal(before.attribution.unknown, 3);
    const classified = countRevision(dir, 'HEAD', { 'fixture@example.invalid': 'agent' });
    assert.equal(classified.attribution.agent, 3);
    assert.ok(!JSON.stringify(classified).includes('fixture@example.invalid'));
    assert.ok(!JSON.stringify(classified).includes('Fixture author'));
    assert.deepEqual(before.excludedFiles, ['vendor/a.js']);
    assert.deepEqual(before.binaryFiles, ['image.png']);
    assert.throws(() => countRevision(dir, 'HEAD', { 'fixture@example.invalid': 'invented' }));
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
