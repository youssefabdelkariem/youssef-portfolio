// Read-only browser checks of a live site: every route at 390, 820 and 1440 px for status, console errors, failed requests,
// horizontal overflow, broken images, fonts and brand metadata; plus the Aurelia viewer by keyboard and a reduced-motion pass.
// Usage: node scripts/check-production-browser.mjs [baseUrl] [--browser=chrome|firefox]
import { launchBrowser } from './lib/browser.mjs';

const base = (process.argv[2]?.startsWith('http') ? process.argv[2] : 'https://youssef.studio').replace(/\/$/, '');
const routes = ['/', '/work/', '/work/aurelia/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/', '/does-not-exist/'];
const widths = [390, 820, 1440];
const problems = [];
const fail = (m) => problems.push(m);
const browser = await launchBrowser();
try {
  for (const w of widths) for (const r of routes) {
    const page = await browser.newPage();
    const errs = []; const bad = [];
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('requestfailed', (q) => bad.push(q.url()));
    page.on('response', (s) => { if (s.status() >= 400 && !(r === '/does-not-exist/' && s.url() === base + r)) bad.push(`${s.status()} ${s.url()}`); });
    await page.setViewport({ width: w, height: 900 });
    const res = await page.goto(base + r, { waitUntil: 'networkidle0' });
    const want = r === '/does-not-exist/' ? 404 : 200;
    if (res.status() !== want) fail(`${r} @${w}: status ${res.status()}`);
    const info = await page.evaluate(async () => {
      await document.fonts.ready;
      const imgs = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        brokenImgs: imgs, fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family + ' ' + f.style),
        icon: [...document.querySelectorAll('link[rel~=icon],link[rel=apple-touch-icon],link[rel=manifest]')].map((l) => l.href),
        og: document.querySelector('meta[property="og:image"]')?.content, tw: document.querySelector('meta[name="twitter:image"]')?.content,
        canon: document.querySelector('link[rel=canonical]')?.href, h1: document.querySelector('h1')?.textContent.trim().slice(0, 50),
        hero: [...document.images].filter((i) => /hero/.test(i.currentSrc)).map((i) => i.currentSrc.split('/').pop()),
      };
    });
    if (info.overflow > 0) fail(`${r} @${w}: horizontal overflow ${info.overflow}px`);
    if (info.brokenImgs.length) fail(`${r} @${w}: broken images ${info.brokenImgs}`);
    if (!info.fonts.some((f) => f.startsWith('Instrument Serif'))) fail(`${r} @${w}: Instrument Serif not loaded`);
    if (r === '/does-not-exist/') errs.splice(0, errs.length, ...errs.filter((e) => !/status of 404/.test(e)));
    if (errs.length) fail(`${r} @${w}: console errors ${errs.join(' | ')}`);
    if (bad.length) fail(`${r} @${w}: failed requests ${bad.join(' | ')}`);
    if (info.og !== 'https://youssef.studio/og-image.png' || info.tw !== info.og) fail(`${r}: og/twitter image ${info.og} ${info.tw}`);
    if (w === 390 || w === 1440) console.log(`${r} @${w}: ${res.status()} h1="${info.h1}" hero=${info.hero.join(',')} overflow=${info.overflow}`);
    // every icon/manifest/og URL resolves
    if (w === 1440) for (const u of [...info.icon, info.og]) { const x = await page.evaluate((u) => fetch(u).then((q) => q.status), u); if (x !== 200) fail(`${r}: ${u} -> ${x}`); }
    await page.close();
  }
  // internal links
  const page = await browser.newPage();
  const seen = new Set(); const links = new Set();
  for (const r of routes.slice(0, 6)) {
    await page.goto(base + r, { waitUntil: 'load' });
    for (const h of await page.$$eval('a[href]', (a) => a.map((x) => x.href))) if (h.startsWith(base)) links.add(h.split('#')[0]);
  }
  for (const l of links) { if (seen.has(l)) continue; seen.add(l); const s = await page.evaluate((u) => fetch(u).then((q) => q.status), l); if (s !== 200) fail(`internal link ${l} -> ${s}`); }
  console.log(`internal links checked: ${seen.size}`);
  await page.setViewport({ width: 1440, height: 900 });
  // Aurelia viewer by keyboard: covered by scripts/rehearsal/check-rehearsal.mjs (run it against the same URL)
  // reduced motion
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  const anim = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations === Infinity).length);
  console.log(`reduced motion: ${anim} infinite running animations`);
  if (anim) fail(`reduced motion: ${anim} infinite animations still running`);
  // mobile nav
  await page.setViewport({ width: 390, height: 800 });
  await page.goto(base + '/', { waitUntil: 'load' });
  const summary = await page.$('.nav-menu summary');
  if (!summary) fail('mobile menu summary missing'); else { await summary.click(); const open = await page.$eval('.nav-menu', (d) => d.open); const links2 = await page.$$eval('.nav-menu a', (a) => a.map((x) => x.getAttribute('href'))); console.log(`mobile menu opens: ${open}; links ${links2.join(' ')}`); if (!open) fail('mobile menu did not open'); }
} finally { await browser.close(); }
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-production-browser: OK');
