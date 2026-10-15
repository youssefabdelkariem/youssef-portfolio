// Homepage-specific checks.
// (1) Headline line breaks and overflow on the production build (dist/).
// (2) Hero layout stability and crop safety with synthetic artwork on the explore build (dist-explore/),
//     with the image load delayed so any layout shift would show.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from './lib/serve.mjs';
import { findBrowser } from './lib/browser.mjs';

const exe = findBrowser();
const prod = await serve(path.resolve('dist'));
const exp = fs.existsSync('dist-explore') ? await serve(path.resolve('dist-explore')) : null;
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const problems = [];
const rows = [];
const settle = (page) => page.evaluate(() => Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {}))));

try {
  const widths = [320, 360, 390, 430, 560, 768, 1024, 1440];
  for (const w of widths) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900 });
    await page.goto(`http://localhost:${prod.port}/`, { waitUntil: 'networkidle0' });
    await settle(page);
    const r = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      const lh = parseFloat(getComputedStyle(h1).lineHeight);
      const lines = [...h1.querySelectorAll(':scope > span')].map((s) => Math.round(s.getBoundingClientRect().height / lh));
      return { lines, size: Math.round(parseFloat(getComputedStyle(h1).fontSize)), overflow: h1.scrollWidth - h1.clientWidth, doc: document.documentElement.scrollWidth - innerWidth };
    });
    rows.push(`headline @${w}: ${r.size}px, lines per sentence ${r.lines.join('+')}`);
    if (r.overflow > 0 || r.doc > 0) problems.push(`headline @${w}: overflow h1 ${r.overflow}px, page ${r.doc}px`);
    if (w >= 360 && r.lines.some((n) => n > 1)) problems.push(`headline @${w}: a sentence wraps (${r.lines.join('+')})`);
    if (w < 360 && r.lines.some((n) => n > 2)) problems.push(`headline @${w}: more than 2 lines per sentence`);
    await page.close();
  }

  if (exp) {
    const views = [[320, 640], [390, 844], [560, 900], [768, 1024], [1024, 768], [1440, 900], [1920, 1080], [2560, 1080]];
    for (const [w, h] of views) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        if (req.url().includes('/explore-fixtures/')) setTimeout(() => req.continue().catch(() => {}), 1200);
        else req.continue().catch(() => {});
      });
      await page.goto(`http://localhost:${exp.port}/explore/hero-fixture/`, { waitUntil: 'domcontentloaded' });
      const measure = () => page.evaluate(() => {
        const p = document.querySelector('.plate').getBoundingClientRect();
        return { w: p.width, h: p.height, copyTop: document.querySelector('.hero-copy').getBoundingClientRect().top + scrollY };
      });
      const before = await measure();
      await page.waitForFunction(() => document.querySelector('.plate img')?.complete && document.querySelector('.plate img').naturalWidth > 0, { timeout: 8000 });
      await settle(page);
      const after = await measure();
      const crop = await page.evaluate(() => {
        const img = document.querySelector('.plate img');
        const b = document.querySelector('.plate').getBoundingClientRect();
        const s = Math.max(b.width / img.naturalWidth, b.height / img.naturalHeight);
        return { src: img.currentSrc.split('/').pop(), visH: b.height / (img.naturalHeight * s), visW: b.width / (img.naturalWidth * s) };
      });
      const shift = Math.max(Math.abs(before.h - after.h), Math.abs(before.w - after.w), Math.abs(before.copyTop - after.copyTop));
      const vh = Math.min(1, crop.visH);
      const vw = Math.min(1, crop.visW);
      rows.push(`hero @${w}x${h}: box ${Math.round(after.w)}x${Math.round(after.h)}, ${crop.src}, shows ${Math.round(vw * 100)}% of width x ${Math.round(vh * 100)}% of height, shift ${shift.toFixed(1)}px`);
      if (shift > 0.5) problems.push(`hero @${w}x${h}: layout moved ${shift.toFixed(1)}px when the image loaded`);
      const mobileArt = w <= 560;
      if (crop.src !== (mobileArt ? 'hero-mobile.svg' : 'hero-desktop.svg')) problems.push(`hero @${w}x${h}: wrong source ${crop.src}`);
      if (vh < 0.7) problems.push(`hero @${w}x${h}: only ${Math.round(vh * 100)}% of the height is visible (safe band is 70%)`);
      if ((w > 860 || mobileArt) && vw < 0.99) problems.push(`hero @${w}x${h}: horizontal crop (${Math.round(vw * 100)}%)`);
      await page.close();
    }
  } else rows.push('hero fixture checks skipped: run npm run build:explore first');
} finally {
  await browser.close();
  prod.server.close();
  exp?.server.close();
}
console.log(rows.join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-home: OK');
