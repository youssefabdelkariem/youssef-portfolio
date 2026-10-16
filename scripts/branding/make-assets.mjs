// Regenerates the approved Direction A launch assets from the master icon public/favicon.svg:
//   icon-192.png, icon-512.png (rounded square, transparent corners), apple-touch-icon.png (180 x 180, full-bleed square: iOS applies
//   its own corner mask), favicon.ico (16, 32 and 48 px PNG entries) and og-image.png (1200 x 630 social card).
// The master SVG is the single source of the mark; nothing is redrawn. Run from the repository root: node scripts/branding/make-assets.mjs
// Provenance and approval: docs/DESIGN_SYSTEM.md (Direction A approved by the owner on 2026-10-17).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const pub = path.resolve('public');
const master = fs.readFileSync(path.join(pub, 'favicon.svg'), 'utf8');
if (!master.includes('viewBox="0 0 64 64"') || !master.includes('#c9a96e') || !master.includes('#ebe5da') || !master.includes('#0b0a09')) throw new Error('public/favicon.svg is not the approved Direction A master');
const sized = (svg, s) => svg.replace('<svg ', `<svg width="${s}" height="${s}" `);
const bleed = master.replace(/rx="12"/, 'rx="0"');

const browser = await launchBrowser();
const png = async (svg, s, file) => {
  const page = await browser.newPage();
  await page.setViewport({ width: s, height: s, deviceScaleFactor: 1 });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block}</style>${sized(svg, s)}`);
  const buf = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: s, height: s }, type: 'png' });
  await page.close();
  if (file) fs.writeFileSync(path.join(pub, file), buf);
  return buf;
};
try {
  await png(master, 192, 'icon-192.png');
  await png(master, 512, 'icon-512.png');
  await png(bleed, 180, 'apple-touch-icon.png');

  // favicon.ico: PNG-compressed entries for 16, 32 and 48 px
  const sizes = [16, 32, 48];
  const imgs = [];
  for (const s of sizes) imgs.push(await png(master, s));
  const head = Buffer.alloc(6); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
  let offset = 6 + 16 * sizes.length; const entries = [];
  sizes.forEach((s, i) => { const e = Buffer.alloc(16); e[0] = s; e[1] = s; e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(imgs[i].length, 8); e.writeUInt32LE(offset, 12); offset += imgs[i].length; entries.push(e); });
  fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([head, ...entries, ...imgs]));

  // og-image.png: the Direction A card (same composition as the approved preview)
  const fonts = pathToFileURL(path.join(pub, 'fonts')).href;
  const tmp = path.join(pub, '.og-card.html');
  fs.writeFileSync(tmp, `<meta charset="utf-8"><style>
@font-face{font-family:'Instrument Serif';src:url('${fonts}/InstrumentSerif-Regular.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url('${fonts}/InstrumentSerif-Italic.woff2') format('woff2')}
body{margin:0;background:#0b0a09}.og{width:1200px;height:630px;background:#0b0a09;position:relative;overflow:hidden}
.og::before{content:'';position:absolute;inset:0;background:radial-gradient(60% 90% at 78% 40%,rgb(201 169 110/.16),transparent),repeating-linear-gradient(90deg,transparent 0 79px,rgb(122 110 94/.10) 79px 80px)}
.in{position:relative;height:100%;padding:70px 80px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px}
.copy{display:grid;gap:26px}.wm{font:400 22px 'Instrument Serif',serif;letter-spacing:.34em;color:#ebe5da;white-space:nowrap}.wm i{font-style:normal;color:#c9a96e}
h2{font:400 84px/0.98 'Instrument Serif',serif;margin:0;color:#ebe5da;letter-spacing:-.005em}h2 em{color:#c9a96e}
p{margin:0;color:#a39b8d;font:500 20px system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}
.mark{order:2}.mark svg{width:240px;height:240px;display:block}</style>
<div class="og"><div class="in"><div class="mark">${master}</div><div class="copy"><div class="wm">YOUSSEF<i>.</i>STUDIO</div><h2>Engineering precision.<br><em>Cinematic imagination.</em></h2><p>CGI, 3D rendering, VFX and engineering</p></div></div></div>`);
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await (await page.$('.og')).screenshot({ path: path.join(pub, 'og-image.png'), type: 'png' });
  fs.rmSync(tmp);
} finally { await browser.close(); }
for (const f of ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.ico', 'og-image.png']) console.log(f, fs.statSync(path.join(pub, f)).size, 'bytes');
