// Verifies the plate media contract on the local explore build: a failing image falls back to the
// labelled placeholder with the layout intact; a loading image hides the placeholder label.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from './lib/serve.mjs';

const exe = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean).find((p) => fs.existsSync(p));
const { server, port } = await serve(path.resolve('dist-explore'));
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const problems = [];
try {
  for (const w of [390, 1440]) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 900 });
    await page.goto(`http://localhost:${port}/explore/media-fallback/`, { waitUntil: 'networkidle0' });
    const r = await page.evaluate(() => {
      const [bad, good] = [...document.querySelectorAll('.plate')];
      const vis = (e) => getComputedStyle(e).display !== 'none';
      return {
        badState: bad.dataset.state, badLabel: vis(bad.querySelector('.tag-label')), badImg: vis(bad.querySelector('img')), badH: bad.getBoundingClientRect().height,
        goodState: good.dataset.state ?? null, goodLabel: vis(good.querySelector('.tag-label')), goodLoaded: good.querySelector('img').naturalWidth > 0,
        overflow: document.documentElement.scrollWidth - innerWidth,
      };
    });
    if (r.badState !== 'failed') problems.push(`@${w}: failing image not marked failed (${r.badState})`);
    if (!r.badLabel) problems.push(`@${w}: placeholder label hidden after failure`);
    if (r.badImg) problems.push(`@${w}: broken image still visible`);
    if (r.badH < 100) problems.push(`@${w}: plate collapsed (${r.badH}px)`);
    if (r.goodState) problems.push(`@${w}: valid image marked ${r.goodState}`);
    if (r.goodLabel) problems.push(`@${w}: placeholder label visible over a loaded image`);
    if (!r.goodLoaded) problems.push(`@${w}: valid image did not load`);
    if (r.overflow > 0) problems.push(`@${w}: overflow ${r.overflow}px`);
    await page.close();
  }
} finally { await browser.close(); server.close(); }
console.log('media fallback: missing image and valid image at 390 and 1440 px');
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-media-fallback: OK');
