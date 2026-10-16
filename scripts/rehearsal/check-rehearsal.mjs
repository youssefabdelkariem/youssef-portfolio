// Functional checks of a deployed (or locally emulated) rehearsal site served under a sub-path.
// Usage: node scripts/rehearsal/check-rehearsal.mjs <siteUrl incl. /repo> [--browser=chrome|firefox] [--expect-build <id>]
// Only read-only requests. Reports what was actually observed; nothing is assumed from the production build.
import puppeteer from 'puppeteer-core';
import { launchBrowser } from '../lib/browser.mjs';

let arg = process.argv[2]?.replace(/\/$/, '');
if (!arg?.startsWith('http')) { console.error('usage: check-rehearsal.mjs <siteUrl> [--browser=firefox] [--expect-build id]'); process.exit(2); }
// The project URL may redirect (for example to a custom domain of the user site): follow it once and test the final location.
const first = await fetch(arg + '/');
if (first.url) arg = first.url.replace(/\/$/, '');
const engine = (process.argv.find((a) => a.startsWith('--browser=')) ?? '--browser=chrome').split('=')[1];
const expectBuild = process.argv.includes('--expect-build') ? process.argv[process.argv.indexOf('--expect-build') + 1] : null;
const problems = [], notes = [];
const fail = (m) => problems.push(m);
const origin = new URL(arg).origin; const basePath = new URL(arg).pathname.replace(/\/$/, '');
const routes = ['/', '/work/', '/work/aurelia/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/'];

// ---- HTTP level
for (const r of routes) {
  const res = await fetch(arg + r, { headers: { 'accept-encoding': 'gzip' } });
  const html = await res.text();
  if (res.status !== 200) fail(`${r}: status ${res.status}`);
  if (!/text\/html/.test(res.headers.get('content-type') ?? '')) fail(`${r}: content-type ${res.headers.get('content-type')}`);
  if (!/<meta name="robots" content="noindex/.test(html)) fail(`${r}: rehearsal page is not noindex`);
  if (html.includes('https://youssef.studio')) fail(`${r}: refers to the production domain`);
  if (basePath && new RegExp(`(href|src)="/(?!${basePath.slice(1)}/)`).test(html)) fail(`${r}: root-absolute URL outside ${basePath}/`);
  notes.push(`${r} ${res.status} ${res.headers.get('content-encoding') ?? 'identity'} cache-control=${res.headers.get('cache-control')}`);
}
const noSlash = await fetch(arg + '/work', { redirect: 'manual' }); if (![301, 308].includes(noSlash.status)) fail(`/work gave ${noSlash.status}, expected a redirect`);
const nf = await fetch(arg + '/no-such-page/'); const nfText = await nf.text();
if (nf.status !== 404) fail(`unknown path status ${nf.status}`); if (!nfText.includes('Page not found')) fail('404 page content missing');
const robots = await fetch(origin + basePath + '/robots.txt'); notes.push(`robots ${robots.status}`);

// ---- browser level
const browser = engine === 'firefox'
  ? await puppeteer.launch({ browser: 'firefox', executablePath: process.env.FIREFOX_PATH ?? 'C:/Program Files/Mozilla Firefox/firefox.exe', headless: true, timeout: 40000 })
  : await launchBrowser();
try {
  notes.push(`browser ${await browser.version()}`);
  const seenLinks = new Set();
  for (const w of [390, 1440]) for (const r of routes) {
    const page = await browser.newPage(); await page.setViewport({ width: w, height: 900 });
    const errs = [], bad = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('response', (res) => { if (res.status() >= 400) bad.push(`${res.status()} ${res.url()}`); });
    await page.goto(arg + r, { waitUntil: 'networkidle0' });
    const tag = `${r} @${w}`;
    for (const b of bad) fail(`${tag}: ${b}`);
    for (const e of errs) fail(`${tag}: console ${e.slice(0, 120)}`);
    const o = await page.evaluate(async () => {
      document.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; });
      await new Promise((r) => setTimeout(r, 800));
      await document.fonts.ready;
      const imgs = [...document.images]; const hero = document.querySelector('.hero .plate img');
      return {
        over: document.documentElement.scrollWidth - innerWidth,
        broken: imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src),
        fontOk: document.fonts.check('16px "Instrument Serif"'),
        hero: hero ? hero.currentSrc.split('/').pop() : null,
        canon: document.querySelector('link[rel=canonical]')?.href ?? null,
        build: document.querySelector('meta[name=rehearsal-build]')?.content ?? null,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      };
    });
    if (o.over > 0) fail(`${tag}: horizontal overflow ${o.over}px`);
    for (const b of o.broken) fail(`${tag}: image failed ${b}`);
    if (!o.fontOk && w === 1440) fail(`${tag}: display font not loaded`);
    if (o.canon && !o.canon.startsWith(arg)) fail(`${tag}: canonical ${o.canon}`);
    if (expectBuild && o.build !== expectBuild) fail(`${tag}: build ${o.build}, expected ${expectBuild}`);
    if (r === '/' ) notes.push(`home hero @${w}: ${o.hero}`);
    if (r === '/work/aurelia/' && w === 390) {
      // hero art direction: phones get the 4:5 crop
      if (o.hero && !/^hero-m-/.test(o.hero)) fail(`${tag}: phone hero is ${o.hero}`);
    }
    o.links.forEach((l) => seenLinks.add(l));
    await page.close();
  }
  // links: every internal link resolves; external links are exactly the two approved ones
  const ext = [...seenLinks].filter((l) => !l.startsWith(origin));
  const allowed = ['https://github.com/youssefabdelkariem/IBM-AI-Racing-League', 'https://youtu.be/lp-c8A3NIJI'];
  for (const l of ext) if (!allowed.includes(l)) fail(`unexpected external link ${l}`);
  for (const l of [...seenLinks].filter((l) => l.startsWith(origin))) { const u = l.split('#')[0]; const res = await fetch(u); if (res.status !== 200) fail(`internal link ${u} -> ${res.status}`); }
  notes.push(`links: ${seenLinks.size} distinct, ${ext.length} external`);

  // interactive parts
  const p = await browser.newPage(); await p.setViewport({ width: 1440, height: 900 });
  await p.goto(arg + '/work/aurelia/', { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.querySelector('.vw-radio')?.scrollIntoView());
  const viewer = await p.evaluate(() => ({ radios: document.querySelectorAll('.vw-radio').length }));
  if (viewer.radios !== 5) fail(`render-pass viewer has ${viewer.radios} stages`);
  await p.focus('.vw-radio'); await p.keyboard.press('ArrowRight'); await p.keyboard.press('ArrowRight');
  const stage = await p.evaluate(() => document.querySelector('.vw-radio:checked')?.id);
  if (!/glossy/.test(stage ?? '')) fail(`keyboard did not reach the third viewer stage (checked: ${stage})`);
  notes.push(`viewer: arrow keys moved to ${stage}`);
  await p.goto(arg + '/engineering/ibm-ai-racing/', { waitUntil: 'networkidle0' });
  const race = await p.evaluate(() => ({ pts: (document.querySelector('.chart .trace')?.getAttribute('d')?.match(/[ML]/g) ?? []).length, rungs: document.querySelectorAll('.rung').length, thumb: !!document.querySelector('.thumb img') }));
  if (race.pts !== 314 || race.rungs !== 13) fail(`racing visuals: ${JSON.stringify(race)}`);
  await p.keyboard.press('Tab'); const first = await p.evaluate(() => document.activeElement?.className);
  if (first !== 'skip') fail(`first Tab stop is "${first}"`);
  notes.push(`racing: ${race.pts} chart points, ${race.rungs} ladder rows`);
  await p.close();
} finally { await browser.close(); }
console.log(`rehearsal check (${engine}) against ${arg}\n` + notes.map((n) => '  ' + n).join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-rehearsal: OK');
