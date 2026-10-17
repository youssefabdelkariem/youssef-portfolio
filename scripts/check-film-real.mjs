// Checks the real published film on the built Aurelia page (dist/ served locally): poster first, no third-party request before play,
// keyboard-operable play button that creates the privacy-enhanced YouTube embed, external watch link, no overflow at 390/820/1440 px.
// Usage: node scripts/check-film-real.mjs [outDir for screenshots]
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const film = JSON.parse(fs.readFileSync('src/data/aurelia-film.json', 'utf8')).film;
if (!film) { console.log('no film configured: nothing to check'); process.exit(0); }
const out = process.argv[2];
if (out) fs.mkdirSync(out, { recursive: true });
const problems = []; const fail = (m) => problems.push(m);
const srv = await serve(path.resolve('dist'));
const origin = `http://localhost:${srv.port ?? srv.address?.().port}`;
const browser = await launchBrowser();
try {
  for (const w of [390, 820, 1440]) {
    const page = await browser.newPage();
    const external = [];
    page.on('request', (r) => { const u = r.url(); if (!u.startsWith(origin) && !u.startsWith('data:') && !u.startsWith('blob:')) external.push(u); });
    await page.setViewport({ width: w, height: 900 });
    await page.goto(origin + '/work/aurelia/', { waitUntil: 'networkidle0' });
    if (external.length) fail(`@${w}: third-party requests before play: ${external.join(', ')}`);
    const o = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      iframe: !!document.querySelector('#film iframe'), video: !!document.querySelector('#film video'),
      btn: !!document.querySelector('.film-play') && !document.querySelector('.film-play').hidden,
      link: document.querySelector('.film-links a')?.href, poster: document.querySelector('.film-stage img')?.currentSrc.split('/').pop(),
      posterLoaded: document.querySelector('.film-stage img')?.naturalWidth > 0, jsonld: !!document.querySelector('script[type="application/ld+json"]'),
    }));
    if (o.overflow > 0) fail(`@${w}: overflow ${o.overflow}px`);
    if (o.iframe || o.video) fail(`@${w}: player exists before play`);
    if (!o.btn) fail(`@${w}: play button not visible`);
    if (!o.posterLoaded) fail(`@${w}: poster did not load`);
    if (o.link !== film.externalUrl) fail(`@${w}: watch link ${o.link}`);
    console.log(`@${w}: poster=${o.poster} button=${o.btn} link=${o.link} overflow=${o.overflow}`);
    await page.evaluate(() => document.querySelector('#film').scrollIntoView());
    await new Promise((r) => setTimeout(r, 1500));
    if (out) await page.screenshot({ path: path.join(out, `film-${w}-before.jpg`), type: 'jpeg', quality: 85 });
    if (w === 1440) {
      await page.focus('.film-play'); await page.keyboard.press('Enter');
      await page.waitForSelector('#film iframe', { timeout: 10000 }).catch(() => fail('no embed after pressing Enter'));
      const src = await page.$eval('#film iframe', (f) => f.src).catch(() => '');
      if (!src.startsWith('https://www.youtube-nocookie.com/embed/' + film.playback.id)) fail(`unexpected embed ${src}`);
      console.log('after Enter:', src);
      if (out) await page.screenshot({ path: path.join(out, 'film-1440-after-play.jpg'), type: 'jpeg', quality: 85 });
    }
    await page.close();
  }
} finally { await browser.close(); srv.server.close(); }
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-film-real: OK');
