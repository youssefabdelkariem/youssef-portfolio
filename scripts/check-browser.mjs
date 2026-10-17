// Browser checks against the built output served with Pages-like routing.
// Requires a local Chrome/Edge (CHROME_PATH or a default install path). Nothing is fetched from the network.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

const routes = process.env.YS_ROUTES ? process.env.YS_ROUTES.split(',') : ['/', '/work/', '/work/aurelia/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/', ...['golden-hour-departure','cedar-and-concrete','cobalt-charge','night-shift','crimson-corridor','earthlight','still-water'].map((s) => `/work/${s}/`)];
const widths = [320, 390, 768, 1024, 1440];
const problems = [];
const fail = (m) => problems.push(m);

const { server, port } = await serve(path.resolve(process.env.YS_DIST ?? 'dist'));
const base = `http://localhost:${port}`;
const browser = await launchBrowser();

try {
  // status / redirect behaviour
  for (const r of routes) { const res = await fetch(base + r); if (res.status !== 200) fail(`${r}: status ${res.status}`); }
  const nf = await fetch(base + '/does-not-exist/'); if (nf.status !== 404) fail(`unknown route status ${nf.status}`);
  const noSlash = await fetch(base + '/work', { redirect: 'manual' }); if (noSlash.status !== 301) fail(`/work redirect status ${noSlash.status}`);

  for (const r of routes) {
    const page = await browser.newPage();
    const issues = [];
    page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) issues.push(m.text()); });
    page.on('pageerror', (e) => issues.push(String(e)));
    page.on('requestfailed', (q) => issues.push('request failed ' + q.url()));
    page.on('response', (res) => { if (res.status() >= 400) issues.push(`${res.status()} ${res.url()}`); });
    const external = [];
    page.on('request', (q) => { if (!q.url().startsWith(base) && !q.url().startsWith('data:')) external.push(q.url()); });

    // direct load + refresh of each route
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(base + r, { waitUntil: 'networkidle0' });
    const h1 = await page.$eval('h1', (e) => e.textContent);
    await page.reload({ waitUntil: 'networkidle0' });
    if ((await page.$eval('h1', (e) => e.textContent)) !== h1) fail(`${r}: h1 changed on refresh`);

    // keyboard: first Tab stop is the skip link; it moves focus to main
    await page.keyboard.press('Tab');
    const first = await page.evaluate(() => document.activeElement?.className);
    if (first !== 'skip') fail(`${r}: first tab stop is "${first}", expected skip link`);

    // accessibility (axe, WCAG 2.x A/AA tags) at mobile and desktop widths
    for (const w of [390, 1440]) {
      await page.setViewport({ width: w, height: 900 });
      // let finite entrance animations settle so contrast is measured at rest
      await page.evaluate(() => Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {}))));
      await page.evaluate(axeSource);
      const result = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
      for (const v of result.violations) fail(`${r} @${w}: axe ${v.id} (${v.impact}) ${v.nodes.length} node(s): ${v.nodes[0].target.join(' ')}`);
    }

    // reflow: no horizontal page scroll from 320 CSS px up
    for (const w of widths) {
      await page.setViewport({ width: w, height: 800 });
      const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (over > 0) fail(`${r} @${w}: horizontal overflow ${over}px`);
    }

    // reduced motion: nothing animates and reveal content is visible
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.reload({ waitUntil: 'networkidle0' });
    const motion = await page.evaluate(() => ({
      running: document.getAnimations().filter((a) => a.playState === 'running').length,
      hidden: [...document.querySelectorAll('.reveal')].filter((e) => getComputedStyle(e).opacity !== '1').length,
    }));
    if (motion.running) fail(`${r}: ${motion.running} animation(s) running with reduced motion`);
    if (motion.hidden) fail(`${r}: ${motion.hidden} reveal element(s) hidden with reduced motion`);
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);

    // JavaScript disabled: content still present and visible
    await page.setJavaScriptEnabled(false);
    await page.reload({ waitUntil: 'load' });
    const noJs = await page.evaluate(() => ({ h1: !!document.querySelector('h1')?.textContent, hidden: [...document.querySelectorAll('.reveal')].filter((e) => getComputedStyle(e).opacity !== '1').length }));
    if (!noJs.h1) fail(`${r}: no h1 without JS`);
    if (noJs.hidden) fail(`${r}: ${noJs.hidden} element(s) hidden without JS`);
    await page.setJavaScriptEnabled(true);

    for (const i of issues) fail(`${r}: console/network issue: ${i}`);
    for (const e of external) fail(`${r}: external request ${e}`);
    await page.close();
  }

  // 404 page renders with 404 status and a way home
  const p404 = await browser.newPage();
  const res = await p404.goto(base + '/missing/page/', { waitUntil: 'networkidle0' });
  if (res.status() !== 404) fail(`404 page status ${res.status()}`);
  if (!(await p404.$('a[href="/"]'))) fail('404 page has no link home');
  await p404.close();
} finally {
  await browser.close();
  server.close();
}

console.log(`browser: ${routes.length} routes x ${widths.length} widths, axe, reduced-motion, no-JS, refresh`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-browser: OK');
