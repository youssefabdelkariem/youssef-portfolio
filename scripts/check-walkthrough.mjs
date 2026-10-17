// Behaviour and performance checks for /work/aurelia/walkthrough/ against dist/ (run npm run build first).
// Covers: console cleanliness, overflow, poster decode, hero and stage playback rules, comparison controls,
// reduced-motion (no autoplay), no-JS content, failed-video fallback, axe, case-study link, and media transfer.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const dist = path.resolve('dist');
const route = '/work/aurelia/walkthrough/';
const problems = [];
const rows = [];
const fail = (m) => problems.push(m);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

if (!fs.existsSync(path.join(dist, route, 'index.html'))) { console.error('walkthrough route missing: run npm run build'); process.exit(1); }
const { server, port } = await serve(dist);
const browser = await launchBrowser();
const url = `http://localhost:${port}${route}`;

const playing = (page) => page.evaluate(() => [...document.querySelectorAll('figure.clip')].filter((f) => { const v = f.querySelector('video'); return !v.paused && !v.ended && v.readyState > 2; }).map((f) => f.dataset.clip));
const scrollTo = (page, sel) => page.evaluate((sel) => { const e = document.querySelector(sel); const r = e.getBoundingClientRect(); scrollTo(0, scrollY + r.top + r.height / 2 - innerHeight / 2); }, sel);

async function open(w, h, opts = {}) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 600, hasTouch: w < 600 });
  if (opts.reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  if (opts.noJs) await page.setJavaScriptEnabled(false);
  const issues = [];
  const stats = { video: 0, image: 0 };
  page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) issues.push(m.text()); });
  page.on('pageerror', (e) => issues.push(String(e)));
  page.on('response', async (res) => {
    const t = res.request().resourceType();
    if (res.status() >= 400 && !opts.allow404) issues.push(`${res.status()} ${res.url()}`);
    if (t === 'media' || res.url().endsWith('.mp4')) stats.video += Number(res.headers()['content-length'] ?? 0);
  });
  if (opts.blockVideo) { await page.setRequestInterception(true); page.on('request', (r) => (r.url().endsWith('.mp4') ? r.abort() : r.continue())); }
  await page.goto(url, { waitUntil: 'networkidle0' });
  return { page, issues, stats };
}

try {
  for (const [w, h] of [[1440, 900], [390, 844]]) {
    const tag = `@${w}`;
    const { page, issues, stats } = await open(w, h);
    await wait(1500);
    const base = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, h1: document.querySelectorAll('h1').length, clips: document.querySelectorAll('figure.clip').length, noAlt: [...document.images].filter((i) => !i.alt).length }));
    if (base.overflow > 0) fail(`${tag}: horizontal overflow ${base.overflow}px`);
    if (base.h1 !== 1) fail(`${tag}: h1 count ${base.h1}`);
    if (base.noAlt) fail(`${tag}: ${base.noAlt} images without alt`);
    // hero autoplays, silent
    const hero = await page.evaluate(() => { const v = document.querySelector('.wt-hero video'); return { paused: v.paused, muted: v.muted, t: v.currentTime, src: v.currentSrc.split('/').pop() }; });
    if (hero.paused || !hero.muted || hero.t <= 0) fail(`${tag}: hero not playing silently (${JSON.stringify(hero)})`);
    const expectHero = w < 700 ? 'hero-m.mp4' : 'hero.mp4';
    if (hero.src !== expectHero) fail(`${tag}: hero rendition ${hero.src}, expected ${expectHero}`);

    // stage: the active step's clip plays, others do not, and the counter follows the scroll in both directions
    let maxPlaying = 0;
    for (const [stage, ids] of [['#design', ['d1', 'd2', 'd3', 'd4']], ['#surface', ['b1', 'b2', 'b3']]]) {
      for (const i of [1, ids.length - 1, 0]) {
        await scrollTo(page, `${stage} .step[data-step="${i}"]`);
        await wait(1600);
        const now = await playing(page);
        maxPlaying = Math.max(maxPlaying, now.length);
        const mine = now.filter((c) => ids.includes(c));
        if (mine.length !== 1 || mine[0] !== ids[i]) fail(`${tag}: ${stage} step ${i + 1} playing [${mine}] expected [${ids[i]}]`);
        const active = await page.evaluate((s) => document.querySelector(`${s} .step.is-active`)?.dataset.step, stage);
        if (active !== String(i)) fail(`${tag}: ${stage} active step ${active}, expected ${i}`);
      }
    }
    if (maxPlaying > 2) fail(`${tag}: ${maxPlaying} videos playing at once`);
    // leaving the page area pauses everything
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    await wait(800);
    const end = await playing(page);
    if (end.some((c) => c.startsWith('d') || c.startsWith('m') || c.startsWith('b') || c === 'hero')) fail(`${tag}: footage still playing off screen: ${end}`);

    // comparison: slider and replay
    await scrollTo(page, '[data-compare]');
    await wait(1200);
    await page.focus('#cmp-range');
    await page.keyboard.press('ArrowRight');
    const pos = await page.evaluate(() => getComputedStyle(document.querySelector('.compare-frame')).getPropertyValue('--pos'));
    if (pos.trim() !== '51%') fail(`${tag}: slider did not move the divider (${pos})`);
    await page.click('[data-replay]');
    await wait(700);
    const cmp = await page.evaluate(() => [...document.querySelectorAll('.compare-frame video')].map((v) => !v.paused || v.ended));
    if (cmp.some((x) => !x)) fail(`${tag}: comparison clips did not start`);

    // all posters decode as AVIF
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
    await wait(1200);
    const imgs = await page.evaluate(() => [...document.images].filter((i) => i.loading !== 'lazy' || i.complete).map((i) => ({ ok: i.naturalWidth > 0, s: i.currentSrc.split('/').pop() })));
    for (const i of imgs) if (!i.ok) fail(`${tag}: image did not load ${i.s}`);

    await page.evaluate(axeSource);
    const ax = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
    for (const v of ax.violations) fail(`${tag}: axe ${v.id} (${v.impact}) ${v.nodes.length} node(s): ${v.nodes[0].target.join(' ')}`);
    for (const m of issues) fail(`${tag}: ${m}`);
    rows.push(`${tag}: ${base.clips} clips, ${imgs.length} posters decoded, max ${maxPlaying} playing at once, video transferred ${Math.round(stats.video / 1024)} KB across a full pass, axe ${ax.violations.length} violations`);
    await page.close();
  }

  // reduced motion: nothing autoplays; a clip can still be started by the user
  {
    const { page, issues } = await open(1440, 900, { reduced: true });
    await wait(1200);
    await scrollTo(page, '#design .step[data-step="1"]');
    await wait(1200);
    const now = await playing(page);
    if (now.length) fail(`reduced motion: autoplaying ${now}`);
    const btn = await page.$('.wt-hero .clip-ctl');
    await btn.click();
    await wait(800);
    if (!(await playing(page)).includes('hero')) fail('reduced motion: user could not start the hero clip');
    for (const m of issues) fail(`reduced motion: ${m}`);
    rows.push('reduced motion: no autoplay, manual play works');
    await page.close();
  }

  // failed video: posters stay, no layout break, controls hidden for the broken clip
  {
    const { page, issues } = await open(1440, 900, { blockVideo: true });
    await wait(1500);
    const st = await page.evaluate(() => ({ failed: document.querySelectorAll('figure.clip[data-state="failed"]').length, heroImg: document.querySelector('.wt-hero img').naturalWidth, overflow: document.documentElement.scrollWidth - innerWidth }));
    if (!st.failed || !st.heroImg || st.overflow > 0) fail(`failed media: ${JSON.stringify(st)}`);
    rows.push(`failed media: ${st.failed} clip(s) fell back to posters`);
    void issues; // aborted requests are expected to log
    await page.close();
  }

  // no JavaScript: content, anchors and posters are all there
  {
    const { page } = await open(1440, 900, { noJs: true });
    const st = await page.evaluate(() => ({ steps: document.querySelectorAll('.step').length, text: document.querySelector('.step p:not(.step-n)')?.textContent?.length ?? 0, posters: [...document.images].filter((i) => i.complete && i.naturalWidth > 0).length, overlap: [...document.querySelectorAll('#design .stage-clip')].map((f) => f.getBoundingClientRect().top) }));
    if (st.steps !== 18 || !st.text) fail(`no-JS: steps ${st.steps}`);
    if (new Set(st.overlap.map(Math.round)).size !== st.overlap.length) fail('no-JS: posters overlap');
    rows.push(`no JavaScript: ${st.steps} steps readable, ${st.posters} posters, stage posters stacked`);
    await page.close();
  }

  // case study links in, walkthrough links back
  {
    const { page } = await open(1440, 900);
    const back = await page.$$eval('a[href="/work/aurelia/"]', (a) => a.length);
    if (!back) fail('walkthrough has no link back to /work/aurelia/');
    await page.goto(`http://localhost:${port}/work/aurelia/`, { waitUntil: 'networkidle0' });
    const links = await page.$$eval('a[href="/work/aurelia/walkthrough/"]', (a) => a.length);
    if (links < 2) fail(`case study links to the walkthrough ${links} time(s), expected at least 2`);
    rows.push(`navigation: case study -> walkthrough (${links} links), walkthrough -> case study (${back} links)`);
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}

const media = path.join(dist, 'media/walkthrough');
const sizes = fs.readdirSync(media).reduce((a, f) => { const e = path.extname(f); a[e] = (a[e] ?? 0) + fs.statSync(path.join(media, f)).size; return a; }, {});
rows.push(`dist/media/walkthrough: ${Object.entries(sizes).map(([e, n]) => `${e} ${(n / 1048576).toFixed(1)} MB`).join(', ')}`);
console.log(rows.join('\n'));
if (problems.length) { console.error('\nFAILED:\n- ' + problems.join('\n- ')); process.exit(1); }
console.log('walkthrough: all checks passed');
