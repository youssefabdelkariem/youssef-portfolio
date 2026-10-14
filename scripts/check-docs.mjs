// Documentation checks: relative links, anchors, requirement/question IDs defined and referenced, ADR status vs register.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const files = execFileSync('git', ['ls-files', '*.md'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const problems = [];
const slug = (h) => h.trim().toLowerCase().replace(/[^\w\- ]/g, '').replace(/ /g, '-');
const text = Object.fromEntries(files.map((f) => [f, fs.readFileSync(f, 'utf8')]));

const heads = {};
for (const f of files) {
  let fence = false; heads[f] = [];
  for (const l of text[f].split('\n')) {
    if (l.startsWith('```')) fence = !fence;
    if (!fence && /^#{1,6} /.test(l)) heads[f].push(slug(l.replace(/^#+/, '')));
  }
}
for (const f of files) {
  for (const m of text[f].matchAll(/\]\(([^)\s]+)\)/g)) {
    const u = m[1];
    if (/^(https?:|mailto:)/.test(u)) continue;
    const [p, a] = u.split('#');
    const target = p ? path.posix.normalize(path.posix.join(path.posix.dirname(f), p)) : f;
    if (!fs.existsSync(target)) { problems.push(`${f}: broken link ${u}`); continue; }
    if (a && target.endsWith('.md') && !heads[target]?.includes(a)) problems.push(`${f}: missing anchor ${u}`);
  }
}
const all = Object.values(text).join('\n');
const defined = new Set([...text['docs/REQUIREMENTS.md'].matchAll(/^\| ((?:M0|FR|QA|OPS|Q)-?\d+[a-c]?) \|/gm)].map((m) => m[1]));
const used = new Set([...all.matchAll(/\b(FR-\d+[a-c]?|QA-\d+|OPS-\d+|M0-\d+|Q\d{2})\b/g)].map((m) => m[1]));
for (const u of used) if (!defined.has(u)) problems.push(`undefined requirement/question ID ${u}`);

const register = text['docs/adr/README.md'];
for (const f of files.filter((x) => /^docs\/adr\/\d{4}-/.test(x))) {
  const n = path.basename(f).slice(0, 4);
  const status = /^Status: \*\*(\w+)\*\*/m.exec(text[f])?.[1];
  const line = register.split(/\r?\n/).find((l) => l.startsWith(`| [${n}]`));
  const row = line?.split('|')[3]?.trim();
  if (!status) problems.push(`${f}: no status line`);
  else if (status !== row) problems.push(`${f}: status ${status} != register ${row}`);
}
console.log(`docs checked: ${files.length} files`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-docs: OK');
