import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const excluded = /(^|\/)(?:node_modules|vendor|dist|coverage|\.git|\.cache)(\/|$)/;
const generated = /(^|\/)(?:generated|build-info)(\/|\.)|^src\/(?:features|required-ids)\.json$/;
export function classify(file) {
  if (excluded.test(file)) return 'excluded';
  if (generated.test(file)) return 'generated';
  if (/(^|\/)(tests?|__tests__)(\/|$)|\.(?:test|spec)\./.test(file)) return 'tests';
  if (/\.(?:css|scss|html|svg)$/i.test(file)) return 'styles-or-markup';
  if (/\.(?:js|mjs|cjs|ts|tsx|jsx|py|ps1|bat|sh)$/i.test(file)) return 'source';
  if (/\.(?:md|txt|json|ya?ml|toml)$/i.test(file) || /(?:^|\/)(?:Dockerfile|LICENSE)$/.test(file)) return 'documentation-or-configuration';
  return 'other';
}
export function countText(text) {
  if (!text) return { total: 0, nonBlank: 0 };
  const lines = text.split('\n');
  if (lines.at(-1) === '') lines.pop();
  return { total: lines.length, nonBlank: lines.filter(line => line.trim()).length };
}
export function estimate(nonBlank) {
  return { label: 'Illustrative manual writing estimate, not measured effort', lines: nonBlank,
    ratesLinesPerHour: [10, 30], multiplier: 1,
    hours: { low: nonBlank / 30, high: nonBlank / 10 },
    arithmetic: `${nonBlank} nonblank handwritten lines / 30 to ${nonBlank} / 10 lines per hour` };
}
export function countRevision(cwd, revision = 'HEAD', roles = {}) {
  const git = args => execFileSync('git', args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const commit = git(['rev-parse', '--verify', `${revision}^{commit}`]).trim();
  const files = git(['ls-tree', '-r', '--name-only', '-z', commit]).split('\0').filter(Boolean);
  const categories = {}, attribution = { agent: 0, human: 0, unknown: 0 };
  const excludedFiles = [], binaryFiles = [];
  for (const file of files) {
    const category = classify(file);
    if (category === 'excluded') { excludedFiles.push(file); continue; }
    const bytes = execFileSync('git', ['show', `${commit}:${file}`], { cwd, maxBuffer: 64 * 1024 * 1024 });
    let text;
    try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
    catch { binaryFiles.push(file); continue; }
    if (text.includes('\0')) { binaryFiles.push(file); continue; }
    const counts = countText(text);
    const row = categories[category] ??= { files: 0, total: 0, nonBlank: 0 };
    row.files++; row.total += counts.total; row.nonBlank += counts.nonBlank;
    if (category === 'generated') continue;
    // Count every surviving committed line exactly once. Never expose author identity.
    const blame = git(['blame', '--line-porcelain', commit, '--', file]);
    let role = 'unknown';
    for (const line of blame.split('\n')) {
      if (line.startsWith('author-mail ')) {
        const email = line.slice(12).replace(/^<|>$/g, '');
        role = roles[email] ?? 'unknown';
        if (!['agent', 'human', 'unknown'].includes(role)) throw new Error('Invalid author role');
      }
      if (line.startsWith('\t')) attribution[role]++;
    }
  }
  const handwritten = Object.entries(categories).filter(([key]) => key !== 'generated')
    .reduce((sum, [, row]) => ({ total: sum.total + row.total, nonBlank: sum.nonBlank + row.nonBlank }), { total: 0, nonBlank: 0 });
  const grand = Object.values(categories).reduce((sum, row) => ({ total: sum.total + row.total, nonBlank: sum.nonBlank + row.nonBlank }), { total: 0, nonBlank: 0 });
  if (Object.values(attribution).reduce((a, b) => a + b, 0) !== handwritten.total) throw new Error('Attribution totals do not reconcile');
  return { schemaVersion: 1, sourceCommit: commit, command: 'node scripts/source-count.mjs <revision> [private-author-role-map.json]',
    rule: 'Tracked committed UTF-8 text; terminal newline is not an extra line; whitespace-only lines are blank. Generated directories, build-info files and generated feature/ID inventories are separate. Attribution uses surviving git blame lines and explicit author-email role mapping; unclassified authors are unknown.',
    exclusions: ['node_modules/', 'vendor/', 'dist/', 'coverage/', '.git/', '.cache/', 'binary or invalid UTF-8 files'],
    excludedFiles, binaryFiles, categories, handwritten, grand, attribution, estimate: estimate(handwritten.nonBlank) };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const roles = process.argv[3] ? JSON.parse(readFileSync(process.argv[3], 'utf8')) : {};
  process.stdout.write(`${JSON.stringify(countRevision(process.cwd(), process.argv[2] || 'HEAD', roles), null, 2)}\n`);
}
