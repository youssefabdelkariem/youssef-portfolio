// Compares the approved Direction A icon with a refined dot (slightly larger, nudged outward) at 16, 32, 64 and 180 px.
// The renders are real pixels from the browser, shown enlarged with pixelated scaling so legibility can be judged.
// Usage: node scripts/branding/compare-dot.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const out = path.resolve(process.argv[2] ?? '../../previews/m4-branding');
fs.mkdirSync(out, { recursive: true });
const master = fs.readFileSync('public/favicon.svg', 'utf8');
const dot = /<circle cx="46" cy="49" r="3\.6"/;
if (!dot.test(master)) { console.error('master favicon has no approved dot to compare'); process.exit(2); }
const variants = { original: master, refined: master.replace(dot, '<circle cx="46.6" cy="49.6" r="4.4"') };
const sizes = [16, 32, 64, 180];

const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  const shots = {};
  for (const [name, svg] of Object.entries(variants)) for (const s of sizes) {
    await page.setViewport({ width: s, height: s, deviceScaleFactor: 1 });
    await page.setContent(`<style>html,body{margin:0;background:#fff}</style>${svg.replace('<svg ', `<svg width="${s}" height="${s}" `)}`);
    const f = path.join(out, `${name}-${s}.png`);
    await page.screenshot({ path: f, omitBackground: false, clip: { x: 0, y: 0, width: s, height: s } });
    shots[`${name}-${s}`] = f;
  }
  const scale = { 16: 12, 32: 6, 64: 3, 180: 1 };
  const row = (name) => sizes.map((s) => `<figure><img style="image-rendering:pixelated;width:${s * scale[s]}px;height:${s * scale[s]}px" src="${pathToFileURL(shots[`${name}-${s}`]).href}"><figcaption>${name} ${s}px (shown ${scale[s]}x)</figcaption></figure>`).join('');
  await page.setViewport({ width: 1500, height: 900 });
  const html = path.join(out, 'dot-comparison.html');
  fs.writeFileSync(html, `<meta charset="utf-8"><style>body{margin:0;padding:24px;background:#26211c;color:#ebe5da;font:13px system-ui}figure{margin:0;display:inline-grid;gap:6px;margin-right:24px;vertical-align:top}.r{margin-bottom:28px}</style><div class="r"><b>Approved original</b><br>${row('original')}</div><div class="r"><b>Refined dot</b><br>${row('refined')}</div>`);
  await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
  await page.waitForNetworkIdle?.().catch(() => {});
  await page.screenshot({ path: path.join(out, 'dot-comparison.png'), fullPage: true });
} finally { await browser.close(); }
console.log('comparison written to', out);
