// Static checks on the built output (dist/): route files, metadata, headings, links, assets, no external requests.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const dist = path.resolve('dist');
const contactOn = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(JSON.parse(fs.readFileSync('src/data/contact.json', 'utf8')).endpoint ?? '');
const routes = ['/', '/work/', '/work/aurelia/', '/work/aurelia/walkthrough/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/', ...['golden-hour-departure','cedar-and-concrete','cobalt-charge','night-shift','crimson-corridor','earthlight','still-water','iron-run','skyline-intruder'].map((s) => `/work/${s}/`)];
if (contactOn) routes.push('/contact/');
// Outbound links the owner has verified (QA-11: plain links, nothing loaded from them).
const outbound = new Set(['https://github.com/youssefabdelkariem/IBM-AI-Racing-League', 'https://github.com/youssefabdelkariem/IBM-AI-Racing-League/tree/release/p1-65968', 'https://www.artstation.com/stampvfx']);
const filmCfg = JSON.parse(fs.readFileSync('src/data/aurelia-film.json', 'utf8'));
if (filmCfg.film?.externalUrl) outbound.add(filmCfg.film.externalUrl);
const racingVideoCfg = JSON.parse(fs.readFileSync('src/data/racing-video.json', 'utf8'));
if (racingVideoCfg.video?.externalUrl) outbound.add(racingVideoCfg.video.externalUrl);
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
  if (r === '/404.html') { if (canon) fail('404.html must not declare a canonical URL'); }
  else if (!canon) fail(`${r}: missing canonical`);
  else if (canon !== `https://youssef.studio${r}`) fail(`${r}: canonical ${canon}`);
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
    if (/^https?:\/\//.test(u)) {
      // Plain outbound links to owner-verified destinations are allowed (never src, never scripts or styles).
      if (u.startsWith('https://youssef.studio')) continue;
      if (!outbound.has(u)) { fail(`${r}: external reference ${u}`); continue; }
      const tag = [...html.matchAll(/<a\s[^>]*>/g)].map((t) => t[0]).find((t) => t.includes(`href="${u}"`)) ?? '';
      if (m[0].startsWith('src') || !/rel="[^"]*noopener[^"]*"/.test(tag)) fail(`${r}: outbound link ${u} must be an <a> with rel="noopener"`);
      continue;
    }
    if (u.startsWith('mailto:')) continue;
    if (!u.startsWith('/')) { fail(`${r}: relative URL ${u} (use root-absolute)`); continue; }
    const target = path.join(dist, u.endsWith('/') ? u + 'index.html' : u);
    if (!fs.existsSync(target)) fail(`${r}: broken reference ${u}`);
  }
  // in-page anchors resolve
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) fail(`${r}: missing anchor #${m[1]}`);
  if (/<img(?![^>]*\balt=)/.test(html)) fail(`${r}: img without alt`);
  // Verified work only: no planned, coming-soon or empty-slot project placeholders on any public page.
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  for (const bad of [/coming soon/i, /planned,? not built/i, /\bempty slot\b/i, /project slot/i, /none verified yet/i, /appears here when/i, /reserved,? no project/i, /robotic arm/i, /not published yet/i, /pending confirmation/i, /biography pending/i, /credits pending/i, /in preparation/i, /placeholder/i, /not approved/i, /pending owner approval/i, /provisional/i, /role wording/i, /\bEUI\b/, /egypt university/i, /universit/i, /informatics/i]) if (bad.test(text)) fail(`${r}: placeholder wording ${bad}`);
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
