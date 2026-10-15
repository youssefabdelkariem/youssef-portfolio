// Screenshots of built pages (dist/) at desktop, tablet and phone widths.
// Usage: node scripts/shoot-pages.mjs <outDir> [route ...]    e.g. node scripts/shoot-pages.mjs ../shots / /work/ /work/aurelia/
// Screenshots that contain unapproved media must not be written inside the repository.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from './lib/serve.mjs';
import { findBrowser } from './lib/browser.mjs';

const [out, ...routes] = process.argv.slice(2);
if (!out) { console.error('usage: shoot-pages.mjs <outDir> [route ...]'); process.exit(2); }
const list = routes.length ? routes : ['/', '/work/', '/work/aurelia/'];
fs.mkdirSync(out, { recursive: true });
const { server, port } = await serve(path.resolve('dist'));
const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: true });
const sizes = [['desktop', 1440, 900], ['tablet', 768, 1024], ['mobile', 390, 844]];
for (const route of list) {
  for (const [kind, w, h] of sizes) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
    await page.evaluate(async () => {
      document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
      // scroll through the page so lazy images start loading, then return to the top
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
      window.scrollTo(0, 0);
      const visible = [...document.images].filter((i) => i.offsetParent !== null); // hidden viewer panels never load
      await Promise.race([Promise.all(visible.map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))), new Promise((r) => setTimeout(r, 8000))]);
      await Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {})));
      await new Promise((r) => setTimeout(r, 400));
    });
    const slug = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '-');
    await page.screenshot({ path: path.join(out, `${slug}-${kind}-hero.jpg`), type: 'jpeg', quality: 85 });
    await page.screenshot({ path: path.join(out, `${slug}-${kind}-full.jpg`), type: 'jpeg', quality: 80, fullPage: true });
    await page.close();
  }
}
await browser.close();
server.close();
console.log('screenshots written to', out);
