// Build reproducibility: two builds from the same tree must produce byte-identical artifacts (ADR 0006).
// Usage: node scripts/check-reproducible.mjs  (writes dist/ last; compares file lists and SHA-256 of every file)
import { execFileSync } from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const tree = (dir) => {
  const out = {};
  for (const e of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
    if (!e.isFile()) continue;
    const f = path.join(e.parentPath ?? e.path, e.name);
    out[path.relative(dir, f).split(path.sep).join('/')] = crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
  }
  return out;
};
const build = () => { fs.rmSync('dist', { recursive: true, force: true }); execFileSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { stdio: 'ignore' }); execFileSync(process.execPath, ['scripts/prune-dist.mjs'], { stdio: 'ignore' }); return tree('dist'); };
const a = build(); const b = build();
const names = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
const diff = names.filter((n) => a[n] !== b[n]);
const overall = crypto.createHash('sha256').update(names.map((n) => `${n} ${a[n]}`).join('\n')).digest('hex');
console.log(`${names.length} files, artifact digest ${overall}`);
if (diff.length) { console.error('FAIL: builds differ in\n' + diff.map((d) => ' - ' + d).join('\n')); process.exit(1); }
console.log('check-reproducible: OK');
