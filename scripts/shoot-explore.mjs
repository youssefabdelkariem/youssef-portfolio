// Captures desktop/mobile screenshots of the exploration pages from dist-explore/ into docs/design/m1b/.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { serve } from './lib/serve.mjs';

const out = path.resolve('docs/design/m1b');
fs.mkdirSync(out, { recursive: true });
const exe = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe'].filter(Boolean).find((p) => fs.existsSync(p));
const { server, port } = await serve(path.resolve('dist-explore'));
const browser = await puppeteer.launch({ executablePath: exe, headless: true });
const shots = [
  ['a', 'desktop', 1440, 900],
  ['a', 'mobile', 390, 844],
  ['b', 'desktop', 1440, 900],
  ['b', 'mobile', 390, 844],
];
const settle = (p) => p.evaluate(async () => {
  document.querySelectorAll('.reveal').forEach((e) => e.classList.add('in'));
  await Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {})));
  await new Promise((r) => setTimeout(r, 400));
});
for (const [dir, kind, w, h] of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${port}/explore/${dir}/`, { waitUntil: 'networkidle0' });
  await settle(page);
  await page.screenshot({ path: path.join(out, `${dir}-${kind}-hero.jpg`), type: 'jpeg', quality: 82 });
  await page.screenshot({ path: path.join(out, `${dir}-${kind}-full.jpg`), type: 'jpeg', quality: 78, fullPage: true });
  if (dir === 'a' && kind === 'mobile') {
    await page.evaluate(() => { document.querySelector('.menu').open = true; });
    await new Promise((r) => setTimeout(r, 200));
    await page.screenshot({ path: path.join(out, 'a-mobile-menu.jpg'), type: 'jpeg', quality: 82 });
  }
  await page.close();
}
await browser.close();
server.close();
console.log('screenshots written to docs/design/m1b');
