// Static checks on the built output (dist/): route files, metadata, headings, links, assets, no external requests.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = path.resolve('dist');
const routes = ['/', '/work/', '/work/aurelia/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/', '/contact/'];
const problems = [];
const fail = (m) => problems.push(m);
const fileFor = (r) => path.join(dist, r.endsWith('/') ? r + 'index.html' : r);
const read = (f) => fs.readFileSync(f, 'utf8');

if (!fs.existsSync(dist)) { console.error('dist/ missing: run npm run build'); process.exit(1); }
if (!fs.existsSync(path.join(dist, '404.html'))) fail('404.html missing');

const titles = new Set();
let totalJs = 0, totalCss = 0;
for (const r of [...routes, '/404.html']) {
  const f = fileFor(r);
  if (!fs.existsSync(f)) { fail(`${r}: file missing`); continue; }
  const html = read(f);
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  const desc = /<meta name="description" content="([^"]+)"/.exec(html)?.[1];
  const canon = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  if (!/<html lang="en"/.test(html)) fail(`${r}: missing html lang`);
  if (!title) fail(`${r}: missing title`); else if (titles.has(title)) fail(`${r}: duplicate title "${title}"`); else titles.add(title);
  if (!desc) fail(`${r}: missing description`);
  if (!canon) fail(`${r}: missing canonical`);
  else if (r !== '/404.html' && canon !== `https://youssef.studio${r}`) fail(`${r}: canonical ${canon}`);
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) fail(`${r}: expected exactly one h1, found ${h1s.length}`);
  if (!/<main id="main"/.test(html)) fail(`${r}: missing main landmark`);
  if (!/class="skip"/.test(html)) fail(`${r}: missing skip link`);
  if (r === '/404.html' ? !/noindex/.test(html) : /noindex/.test(html)) fail(`${r}: unexpected robots meta`);
  // heading order must not skip levels
  let prev = 0;
  for (const m of html.matchAll(/<h([1-6])[\s>]/g)) { const l = +m[1]; if (prev && l > prev + 1) fail(`${r}: heading jumps h${prev} -> h${l}`); prev = l; }
  // internal links and assets resolve
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(#[^"]*)?"/g)) {
    const u = m[1];
    if (/^https?:\/\//.test(u)) { if (!u.startsWith('https://youssef.studio')) fail(`${r}: external reference ${u}`); continue; }
    if (u.startsWith('mailto:')) continue;
    if (!u.startsWith('/')) { fail(`${r}: relative URL ${u} (use root-absolute)`); continue; }
    const target = path.join(dist, u.endsWith('/') ? u + 'index.html' : u);
    if (!fs.existsSync(target)) fail(`${r}: broken reference ${u}`);
  }
  // in-page anchors resolve
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) fail(`${r}: missing anchor #${m[1]}`);
  if (/<img(?![^>]*\balt=)/.test(html)) fail(`${r}: img without alt`);
}
for (const f of fs.readdirSync(path.join(dist, '_astro'), { recursive: true })) {
  const p = path.join(dist, '_astro', f);
  if (!fs.statSync(p).isFile()) continue;
  const gz = zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length;
  if (p.endsWith('.js')) totalJs += gz; if (p.endsWith('.css')) totalCss += gz;
}
const sitemap = fs.existsSync(path.join(dist, 'sitemap-0.xml')) ? read(path.join(dist, 'sitemap-0.xml')) : '';
for (const r of routes) if (!sitemap.includes(`<loc>https://youssef.studio${r}</loc>`)) fail(`sitemap missing ${r}`);
if (sitemap.includes('/404')) fail('sitemap contains 404');
if (totalJs > 150 * 1024) fail(`external JS ${totalJs} B gzip exceeds QA-07 budget`);

// Entry transfer for each route: gzip of HTML plus every linked stylesheet/script/icon (QA-07 budget: 1 MB).
const gzLen = (f) => zlib.gzipSync(fs.readFileSync(f), { level: 9 }).length;
for (const r of routes) {
  const f = fileFor(r);
  if (!fs.existsSync(f)) continue;
  const html = read(f);
  let bytes = gzLen(f);
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#]+\.(?:css|js|svg))"/g)) { const a = path.join(dist, m[1]); if (fs.existsSync(a)) bytes += gzLen(a); }
  if (bytes > 1024 * 1024) fail(`${r}: entry transfer ${bytes} B exceeds 1 MB`);
  if (r === '/') console.log(`home entry transfer (gzip, html+css+js+icon): ${bytes} B`);
}
console.log(`routes checked: ${routes.length + 1}; external JS gzip: ${totalJs} B; CSS gzip: ${totalCss} B`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-dist: OK');
