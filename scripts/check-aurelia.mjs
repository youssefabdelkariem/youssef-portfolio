// Media-aware checks for the VFX portfolio and Aurelia pages (run on dist/ after npm run build).
// With derivatives present: every visible image decodes as AVIF, the render-pass viewer works from the keyboard,
// and image transfer per page is reported. Without derivatives: pages must render labelled placeholders only.
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const dist = path.resolve('dist');
const manifestFile = path.resolve('public/media/aurelia/manifest.json'); // build input; pruned from dist
const hasMedia = fs.existsSync(manifestFile) && fs.existsSync(path.join(dist, 'media/aurelia'));
const problems = [];
const rows = [];
const { server, port } = await serve(dist);
const browser = await launchBrowser();

const settle = (page) => page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
  const visible = [...document.images].filter((i) => i.offsetParent !== null);
  await Promise.race([Promise.all(visible.map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; })))), new Promise((r) => setTimeout(r, 8000))]);
});

try {
  const manifest = hasMedia ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : null;
  if (manifest) {
    const big = manifest.outputs.flatMap((o) => o.variants).filter((v) => v.bytes > 250 * 1024);
    rows.push(`derivatives: ${manifest.outputs.length} sets, ${manifest.outputs.flatMap((o) => o.variants).length} files, largest ${Math.round(Math.max(...manifest.outputs.flatMap((o) => o.variants).map((v) => v.bytes)) / 1024)} KB, over 250 KB: ${big.length}`);
  }
  for (const route of ['/', '/work/', '/work/aurelia/']) {
    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      const issues = [];
      let imgBytes = 0;
      let initialBytes = 0;
      let loaded = false;
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) issues.push(m.text()); });
      page.on('pageerror', (e) => issues.push(String(e)));
      page.on('response', async (res) => {
        const t = res.request().resourceType();
        if (t === 'image') { try { const n = (await res.buffer()).length; imgBytes += n; if (!loaded) initialBytes += n; } catch {} }
        if (res.status() >= 400) issues.push(`${res.status()} ${res.url()}`);
      });
      await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
      loaded = true;
      const initial = initialBytes;
      await settle(page);
      const info = await page.evaluate(() => ({
        plates: document.querySelectorAll('.plate').length,
        imgs: [...document.querySelectorAll('.plate img')].filter((i) => i.offsetParent !== null).map((i) => ({ ok: i.complete && i.naturalWidth > 0, src: i.currentSrc.split('/').pop(), nw: i.naturalWidth, alt: i.alt })),
        placeholders: [...document.querySelectorAll('.plate:not(.has-src)')].length,
        failed: document.querySelectorAll('.plate[data-state="failed"]').length,
        overflow: document.documentElement.scrollWidth - innerWidth,
      }));
      rows.push(`${route} @${w}: ${info.imgs.length} images, ${info.placeholders} placeholder plates, hero/initial image bytes ${Math.round(initial / 1024)} KB, all images after scroll ${Math.round(imgBytes / 1024)} KB`);
      if (hasMedia) {
        for (const i of info.imgs) {
          if (!i.ok) problems.push(`${route} @${w}: image did not load (${i.src})`);
          if (!i.src.endsWith('.avif')) problems.push(`${route} @${w}: expected AVIF but got ${i.src}`);
          if (!i.alt) problems.push(`${route} @${w}: image without alt (${i.src})`);
        }
        if (info.failed) problems.push(`${route} @${w}: ${info.failed} plate(s) fell back to placeholder`);
        if (route !== '/' && info.imgs.length === 0) problems.push(`${route} @${w}: no images rendered with media present`);
      } else {
        if (info.imgs.length) problems.push(`${route} @${w}: images present without derivatives`);
        if (!info.placeholders) problems.push(`${route} @${w}: no labelled placeholders`);
      }
      if (info.overflow > 0) problems.push(`${route} @${w}: horizontal overflow ${info.overflow}px`);
      for (const m of issues) problems.push(`${route} @${w}: ${m}`);
      await page.close();
    }
  }

  // responsive hero selection at the art-direction breakpoint (560 px): phones get the 4:5 crop, wider screens the wide crop
  if (hasMedia) {
    const expect = [
      ['/', 390, 'hero-home-m-'], ['/', 560, 'hero-home-m-'], ['/', 561, 'hero-'], ['/', 1440, 'hero-'],
      ['/work/aurelia/', 390, 'hero-m-'], ['/work/aurelia/', 560, 'hero-m-'], ['/work/aurelia/', 561, 'hero-'], ['/work/aurelia/', 1440, 'hero-'],
    ];
    for (const [route, w, prefix] of expect) {
      const pg = await browser.newPage();
      await pg.setViewport({ width: w, height: 900 });
      await pg.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
      await pg.waitForFunction(() => { const i = document.querySelector('.hero .plate img'); return i && i.complete && i.naturalWidth > 0; }, { timeout: 8000 }).catch(() => {});
      await new Promise((r) => setTimeout(r, 300));
      const got = await pg.evaluate(() => { const i = document.querySelector('.hero .plate img'); return { src: i.currentSrc.split('/').pop(), ok: i.complete && i.naturalWidth > 0, ratio: getComputedStyle(document.querySelector('.hero .plate')).aspectRatio }; });
      const exact = prefix === 'hero-' ? /^hero-\d+\.avif$/.test(got.src) : got.src.startsWith(prefix) && got.src.endsWith('.avif');
      rows.push(`hero source ${route} @${w}: ${got.src} (${got.ratio})`);
      if (!got.ok || !exact) problems.push(`hero source ${route} @${w}: expected ${prefix}*.avif, got ${got.src}`);
      await pg.close();
    }
  }

  // render-pass viewer: keyboard operation, panel switching and image loading
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(`http://localhost:${port}/work/aurelia/`, { waitUntil: 'networkidle0' });
  const stages = await page.$$eval('.vw-radio', (r) => r.map((x) => x.id));
  rows.push(`viewer stages: ${stages.map((s) => s.replace('vw-passes-', '')).join(', ')}`);
  if (stages.length !== 5) problems.push(`viewer has ${stages.length} stages, expected 5`);
  await page.focus('.vw-radio');
  for (let i = 1; i < stages.length; i++) {
    await page.keyboard.press('ArrowRight');
    const state = await page.evaluate(() => {
      const checked = document.querySelector('.vw-radio:checked').id;
      const shown = [...document.querySelectorAll('.vw-panel')].filter((p) => getComputedStyle(p).display !== 'none').map((p) => p.dataset.stage);
      return { checked, shown };
    });
    if (state.shown.length !== 1 || !state.checked.endsWith('-' + state.shown[0])) problems.push(`viewer: checked ${state.checked} but shown ${state.shown.join(',')}`);
    if (hasMedia) {
      await page.waitForFunction(() => { const p = [...document.querySelectorAll('.vw-panel')].find((x) => getComputedStyle(x).display !== 'none'); const i = p?.querySelector('img'); return i && i.complete && i.naturalWidth > 0; }, { timeout: 6000 }).catch(() => problems.push(`viewer: image for ${state.checked} did not load`));
    }
  }
  const rowsCount = await page.$$eval('.viewer + .table-wrap tbody tr', (r) => r.length);
  if (rowsCount !== stages.length) problems.push(`viewer table lists ${rowsCount} stages, expected ${stages.length}`);
  await page.close();
} finally {
  await browser.close();
  server.close();
}
console.log(`media present: ${hasMedia}`);
console.log(rows.join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-aurelia: OK');
