// Reads the finished film read-only in a browser and writes sample frames (1920 px JPEG) to an output directory outside the
// repository. Used to choose the poster frame and to write an accurate text description. The film itself is never copied.
// Usage: node scripts/aurelia/film-frames.mjs <film.mp4> <outDir> [count]
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const [film, out, countArg] = process.argv.slice(2);
if (!film || !out) { console.error('usage: film-frames.mjs <film.mp4> <outDir> [count]'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const count = Number(countArg ?? 12);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  const html = path.join(out, 'frames.html');
  fs.writeFileSync(html, `<meta charset="utf-8"><body style="margin:0;background:#000"><video id="v" style="width:100vw;height:100vh;object-fit:contain;display:block" src="${pathToFileURL(film).href}" muted preload="auto"></video>`);
  await page.goto(pathToFileURL(html).href);
  const meta = await page.evaluate(() => new Promise((res, rej) => { const v = document.getElementById('v'); const done = () => res({ w: v.videoWidth, h: v.videoHeight, d: v.duration }); if (v.readyState >= 1) done(); else v.onloadedmetadata = done; v.onerror = () => rej(new Error('cannot decode: ' + (v.error && v.error.message))); }));
  console.log(JSON.stringify(meta));
  for (let i = 0; i < count; i++) {
    const t = Math.min(meta.d - 0.1, (meta.d * (i + 0.5)) / count);
    await page.evaluate((t) => new Promise((res) => { const v = document.getElementById('v'); v.addEventListener('seeked', () => setTimeout(res, 400), { once: true }); setTimeout(res, 20000); v.currentTime = t; }), t);
    await page.screenshot({ path: path.join(out, `frame-${String(i).padStart(2, '0')}-${t.toFixed(1)}s.jpg`), type: 'jpeg', quality: 92 });
  }
} finally { await browser.close(); }
console.log('frames written to', out);
