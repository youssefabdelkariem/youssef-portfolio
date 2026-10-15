// Captures homepage screenshots from dist/ into docs/design/m1b/ (placeholder content only).
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from './lib/serve.mjs';
import { findBrowser } from './lib/browser.mjs';

const out = path.resolve('docs/design/m1b');
fs.mkdirSync(out, { recursive: true });
const exe = findBrowser();
const { server, port } = await serve(path.resolve('dist'));
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const sizes = [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 390, 844]];
for (const [kind, w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
    await Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {})));
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.screenshot({ path: path.join(out, `home-${kind}-hero.jpg`), type: 'jpeg', quality: 82 });
  await page.screenshot({ path: path.join(out, `home-${kind}-full.jpg`), type: 'jpeg', quality: 78, fullPage: true });
  if (kind === 'mobile') {
    await page.evaluate(() => { document.querySelector('.nav-menu').open = true; });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({ path: path.join(out, 'home-mobile-menu.jpg'), type: 'jpeg', quality: 82 });
  }
  await page.close();
}
await browser.close();
server.close();
console.log('home screenshots written to docs/design/m1b');
