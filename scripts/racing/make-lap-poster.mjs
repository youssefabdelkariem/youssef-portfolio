// Creates the poster set for the final-lap video from a frame of the owner's recording and writes it to public/media/racing as
// lap-poster-960/1280 in AVIF and JPEG. The video itself is read only and never copied into the repository.
// Usage: node scripts/racing/make-lap-poster.mjs <video.mp4> <seconds into the video> [base name, default lap-poster]
// (the video is 1920 x 1080; pick a mid-lap frame or the results screen, and never alter the footage).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const [video, secondsArg, base = 'lap-poster'] = process.argv.slice(2);
if (!video || !secondsArg) { console.error('usage: make-lap-poster.mjs <video.mp4> <seconds> [base]'); process.exit(2); }
const out = path.resolve('public/media/racing');
fs.mkdirSync(out, { recursive: true });
const tmp = path.join(out, `.${base}-source.html`);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  fs.writeFileSync(tmp, `<meta charset="utf-8"><body style="margin:0;background:#000"><video id="v" style="width:100vw;height:100vh;object-fit:contain;display:block" src="${pathToFileURL(video).href}" muted preload="auto"></video>`);
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate((t) => new Promise((res) => { const v = document.getElementById('v'); const go = () => { v.addEventListener('seeked', () => setTimeout(res, 500), { once: true }); v.currentTime = t; }; if (v.readyState >= 1) go(); else v.onloadedmetadata = go; setTimeout(res, 30000); }), Number(secondsArg));
  const frame = await page.screenshot({ type: 'png' });
  for (const w of [960, 1280]) {
    const img = sharp(frame).resize({ width: w });
    fs.writeFileSync(path.join(out, `${base}-${w}.avif`), await img.clone().avif({ quality: 70, effort: 6 }).toBuffer());
    fs.writeFileSync(path.join(out, `${base}-${w}.jpg`), await img.clone().jpeg({ quality: 86, mozjpeg: true }).toBuffer());
  }
} finally { await browser.close(); fs.rmSync(tmp, { force: true }); }
for (const f of fs.readdirSync(out).filter((f) => f.startsWith(base))) console.log(f, fs.statSync(path.join(out, f)).size, 'B');
