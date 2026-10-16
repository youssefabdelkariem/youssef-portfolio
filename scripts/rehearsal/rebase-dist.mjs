// Rehearsal-only transform: copies a production dist/ to a directory that works under a project-site sub-path
// (https://host/<repo>/) and cannot be mistaken for production. Production configuration (site, base, canonical) is
// not changed: the production build stays rooted at https://youssef.studio/.
// Usage: node scripts/rehearsal/rebase-dist.mjs <in> <out> --base /repo --url https://host/repo [--build <id>]
import fs from 'node:fs';
import path from 'node:path';

const [inDir, outDir] = process.argv.slice(2, 4);
const opt = (name) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };
const base = (opt('base') ?? '').replace(/\/$/, '');
const url = (opt('url') ?? '').replace(/\/$/, '');
const build = opt('build') ?? 'local';
const run = opt('run') ?? 'local';
if (!inDir || !outDir || !base.startsWith('/') || !url.startsWith('http')) { console.error('usage: rebase-dist.mjs <in> <out> --base /repo --url https://host/repo [--build id] [--run id]'); process.exit(2); }

const prefix = (u) => (u.startsWith('/') && !u.startsWith('//') && !u.startsWith(base + '/') ? base + u : u);
const html = (s) => {
  s = s.replace(/\b(href|src|poster|action)="(\/[^"]*)"/g, (_, a, u) => `${a}="${prefix(u)}"`);
  s = s.replace(/\bsrcset="([^"]*)"/g, (_, v) => `srcset="${v.split(',').map((p) => { const t = p.trim().split(/\s+/); t[0] = prefix(t[0]); return t.join(' '); }).join(', ')}"`);
  s = s.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, u) => `url(${q}${prefix(u)}${q})`);
  s = s.replaceAll('https://youssef.studio', url);
  return s.replace('</head>', `<meta name="robots" content="noindex, nofollow"><meta name="rehearsal-build" content="${build}"><meta name="rehearsal-run" content="${run}"></head>`);
};
const css = (s) => s.replace(/url\((['"]?)(\/[^)'"]*)\1\)/g, (_, q, u) => `url(${q}${prefix(u)}${q})`);

fs.rmSync(outDir, { recursive: true, force: true });
let n = 0;
for (const e of fs.readdirSync(inDir, { recursive: true, withFileTypes: true })) {
  if (!e.isFile()) continue;
  const src = path.join(e.parentPath ?? e.path, e.name); const rel = path.relative(inDir, src);
  if (/^(CNAME|robots\.txt|sitemap.*\.xml)$/.test(rel)) continue; // a rehearsal claims no domain and offers no sitemap
  const dst = path.join(outDir, rel); fs.mkdirSync(path.dirname(dst), { recursive: true });
  if (rel.endsWith('.html')) fs.writeFileSync(dst, html(fs.readFileSync(src, 'utf8')));
  else if (rel.endsWith('.css')) fs.writeFileSync(dst, css(fs.readFileSync(src, 'utf8')));
  else fs.copyFileSync(src, dst);
  n++;
}
fs.writeFileSync(path.join(outDir, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`rebased ${n} files to ${base}/ (${url}), build ${build}`);
