// Tests the dormant film component with synthetic fixtures (never part of the production build): a hosted-file film and a YouTube
// film. Verifies poster-first behaviour, no third-party request before play, the no-JavaScript fallback link, keyboard operation,
// the player created on click, VideoObject metadata, axe, and reflow at 320 px.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const problems = [];
const fail = (m) => problems.push(m);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const browser = await launchBrowser();
try {
  for (const kind of ['file', 'youtube']) {
    const out = `dist-film-${kind}`;
    const r = spawnSync(npx, ['astro', 'build', '--outDir', out], { stdio: 'ignore', shell: process.platform === 'win32', env: { ...process.env, YS_FILM_FIXTURE: kind } });
    if (r.status !== 0) { fail(`${kind}: fixture build failed`); continue; }
    const { server, port } = await serve(path.resolve(out));
    const base = `http://localhost:${port}`;
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });
    await page.setRequestInterception(true);
    const external = [];
    page.on('request', (q) => { const u = q.url(); if (!u.startsWith(base) && !u.startsWith('data:')) { external.push(u); q.abort(); } else q.continue(); });
    await page.goto(`${base}/work/aurelia/`, { waitUntil: 'networkidle0' });
    const tag = `[${kind}]`;
    const o = await page.evaluate(() => ({
      h2: document.querySelector('#film-title')?.textContent, btnHidden: document.querySelector('.film-play')?.hidden, cta: [...document.querySelectorAll('.hero-copy a.btn')].map((a) => a.textContent.trim()),
      link: (() => { const a = document.querySelector('.film-links a'); return a ? { href: a.href, rel: a.rel, target: a.target } : null; })(),
      ld: JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent ?? 'null'),
      alt: document.querySelector('.film-alt p')?.textContent.length, posterOk: (() => { const i = document.querySelector('.film-stage img'); return !!i && i.alt.length > 0; })(),
    }));
    if (o.h2 !== 'Watch the film') fail(`${tag} heading missing`);
    if (o.btnHidden !== false) fail(`${tag} the play button should be visible with JavaScript`);
    if (!o.cta.includes('Watch the film')) fail(`${tag} hero lacks the "Watch the film" action`);
    if (!o.link || !/noopener/.test(o.link.rel) || o.link.target !== '_blank') fail(`${tag} external watch link: ${JSON.stringify(o.link)}`);
    if (!o.ld || o.ld['@type'] !== 'VideoObject' || !o.ld.name || !o.ld.duration || !o.ld.uploadDate || !String(o.ld.thumbnailUrl).startsWith('https://youssef.studio/')) fail(`${tag} VideoObject metadata: ${JSON.stringify(o.ld)}`);
    if (kind === 'file' && !String(o.ld?.contentUrl).startsWith('https://youssef.studio/')) fail(`${tag} contentUrl`);
    if (kind === 'youtube' && !o.ld?.embedUrl) fail(`${tag} embedUrl`);
    if (!o.alt || !o.posterOk) fail(`${tag} text alternative or poster alt missing`);
    if (external.length) fail(`${tag} third-party requests before play: ${external.join(', ')}`);

    // axe before play (let finite entrance animations settle so contrast is measured at rest)
    await page.evaluate(() => Promise.all(document.getAnimations().filter((x) => x.effect?.getComputedTiming().iterations !== Infinity).map((x) => x.finished.catch(() => {}))));
    await page.evaluate(axeSource);
    const ax = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    for (const v of ax.violations) fail(`${tag} axe ${v.id}: ${v.nodes[0].target.join(' ')}`);

    // keyboard: focus the play button and press Enter
    await page.evaluate(() => document.querySelector('.film-play').scrollIntoView());
    await page.focus('.film-play');
    await page.keyboard.press('Enter');
    const after = await page.evaluate(() => {
      const el = document.querySelector('.film-stage .film-player');
      return el ? { tag: el.tagName, src: el.tagName === 'IFRAME' ? el.src : el.querySelector('source')?.getAttribute('src'), type: el.querySelector('source')?.type, track: el.querySelector('track')?.getAttribute('srclang'), controls: el.controls, label: el.getAttribute('aria-label') || el.title, focused: document.activeElement === el } : null;
    });
    if (!after) fail(`${tag} no player after pressing Enter on the play button`);
    else {
      if (kind === 'file' && (after.tag !== 'VIDEO' || after.type !== 'video/mp4' || after.track !== 'en' || !after.controls)) fail(`${tag} video player: ${JSON.stringify(after)}`);
      if (kind === 'youtube' && (after.tag !== 'IFRAME' || !after.src.startsWith('https://www.youtube-nocookie.com/embed/'))) fail(`${tag} embed: ${JSON.stringify(after)}`);
      if (!after.label) fail(`${tag} the player has no accessible name`);
      if (!after.focused) fail(`${tag} focus did not move to the player`);
    }
    if (kind === 'youtube' && !external.some((u) => u.startsWith('https://www.youtube-nocookie.com/'))) fail(`${tag} the embed was not requested after play`);

    // reflow and no JavaScript
    await page.setViewport({ width: 320, height: 800 });
    await page.reload({ waitUntil: 'networkidle0' });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 0) fail(`${tag} overflow ${over}px at 320`);
    await page.setJavaScriptEnabled(false);
    await page.reload({ waitUntil: 'load' });
    const nj = await page.evaluate(() => ({ hidden: document.querySelector('.film-play')?.hidden, link: !!document.querySelector('.film-links a') }));
    if (nj.hidden !== true || !nj.link) fail(`${tag} without JavaScript the button must stay hidden and the watch link visible: ${JSON.stringify(nj)}`);
    await page.close(); server.close();
    fs.rmSync(out, { recursive: true, force: true });
  }
} finally { await browser.close(); }
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-film: OK (hosted file and YouTube fixtures)');
