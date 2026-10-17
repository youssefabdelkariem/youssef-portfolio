// Captures /work/aurelia/walkthrough/ at several scroll positions from dist/ for visual review.
// Usage: node scripts/shoot-walkthrough.mjs <out dir> [desktop|mobile] (defaults to both)
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const out = path.resolve(process.argv[2] ?? 'walkthrough-shots');
const only = process.argv[3];
fs.mkdirSync(out, { recursive: true });
const { server, port } = await serve(path.resolve('dist'));
const browser = await launchBrowser();
const sizes = [['desktop', 1440, 900], ['mobile', 390, 844]].filter(([k]) => !only || k === only);

for (const [kind, w, h] of sizes) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: kind === 'mobile', hasTouch: kind === 'mobile' });
  await page.goto(`http://localhost:${port}/work/aurelia/walkthrough/`, { waitUntil: 'networkidle0' });
  const shot = async (name, sel, where = 'center', offset = 0) => {
    await page.evaluate((sel, where, offset) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error('missing ' + sel);
      const r = el.getBoundingClientRect();
      const y = where === 'top' ? r.top : r.top + r.height / 2 - innerHeight / 2;
      window.scrollTo(0, scrollY + y + offset);
    }, sel, where, offset);
    await new Promise((r) => setTimeout(r, 1800));
    await page.screenshot({ path: path.join(out, `${kind}-${name}.jpg`), type: 'jpeg', quality: 80 });
  };
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(out, `${kind}-00-hero.jpg`), type: 'jpeg', quality: 80 });
  await shot('01-intro', '#intro', 'top', -80);
  await shot('02-ch1-head', '#design .chapter-head', 'top', -80);
  await shot('03-ch1-step1', '#design .step[data-step="0"]');
  await shot('04-ch1-step3', '#design .step[data-step="2"]');
  await shot('05-ch2-step2', '#form .step[data-step="1"]');
  await shot('06-ch3-step3', '#surface .step[data-step="2"]');
  await shot('07-ch4-step3', '#motion .step[data-step="2"]');
  await shot('08-ch5-step3', '#comp .step[data-step="2"]');
  await shot('09-compare', '[data-compare]');
  await shot('10-result-head', '#result .chapter-head', 'top', -80);
  await shot('11-result-1', '#result .final:nth-child(1)');
  await shot('12-result-23', '#result .final:nth-child(2)');
  await shot('13-end', '.wt-end');
  await page.close();
}
await browser.close();
server.close();
console.log('screenshots in', out);
