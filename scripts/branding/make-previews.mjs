// Generates a local comparison of three coordinated branding directions (favicon, touch icon, social card, wordmark) for owner review.
// Output goes to <workspace>/previews/m3-branding (not the repository): nothing here is committed or used by the site until the owner
// approves a direction and its final assets are made. Usage: node scripts/branding/make-previews.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const out = path.resolve(process.argv[2] ?? '../../previews/m3-branding');
fs.mkdirSync(out, { recursive: true });
const fonts = pathToFileURL(path.resolve('public/fonts')).href;

const C = { canvas: '#0b0a09', bone: '#ebe5da', brass: '#c9a96e', signal: '#ff5a36', muted: '#a39b8d' };
const marks = {
  A: { name: 'A. Brass Y and period', note: 'A geometric Y whose lower-right dot repeats the brass period of the wordmark. Calm, typographic, works at 16 px.',
    svg: (s = 64) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}"><rect width="64" height="64" rx="12" fill="${C.canvas}"/><path d="M17 15 L32 35 L47 15 M32 35 V50" fill="none" stroke="${C.brass}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="46" cy="49" r="3.6" fill="${C.bone}"/></svg>` },
  B: { name: 'B. Aperture', note: 'A lens ring with cardinal ticks: the camera of the CGI work and the reticle of the engineering work in one shape.',
    svg: (s = 64) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}"><rect width="64" height="64" rx="12" fill="${C.canvas}"/><circle cx="32" cy="32" r="18" fill="none" stroke="${C.brass}" stroke-width="3.5"/><circle cx="32" cy="32" r="7" fill="none" stroke="${C.bone}" stroke-width="2.5"/><path d="M32 6 V12 M32 52 V58 M6 32 H12 M52 32 H58" stroke="${C.brass}" stroke-width="3" stroke-linecap="round"/><circle cx="24.5" cy="24.5" r="2" fill="${C.bone}"/></svg>` },
  C: { name: 'C. Frame and axis', note: 'A 2.39:1 cinema frame crossed by a thin technical axis with one signal node. The most graphic; the signal colour is used once, as in the engineering pages.',
    svg: (s = 64) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${s}" height="${s}"><rect width="64" height="64" rx="12" fill="${C.canvas}"/><rect x="7" y="22" width="50" height="21" fill="none" stroke="${C.brass}" stroke-width="3.5"/><path d="M32 9 V55" stroke="${C.bone}" stroke-width="2.5" stroke-linecap="round"/><circle cx="32" cy="32.5" r="4.2" fill="${C.signal}"/></svg>` },
};
for (const [k, m] of Object.entries(marks)) fs.writeFileSync(path.join(out, `favicon-${k}.svg`), m.svg());

const wordmarks = {
  A: '<span class="wm wmA">YOUSSEF<i>.</i>STUDIO</span>',
  B: '<span class="wm wmB">YOUSSEF<i>.</i>STUDIO</span>',
  C: '<span class="wm wmC">Youssef <em>Studio</em></span>',
};
const card = (k) => `
<div class="og" id="og-${k}"><div class="og-in">
  <div class="og-mark">${marks[k].svg(k === 'B' ? 150 : 140)}</div>
  <div class="og-copy"><div class="og-wm">${wordmarks[k]}</div>
    <h2>Engineering precision.<br><em>Cinematic imagination.</em></h2>
    <p>CGI, 3D rendering, VFX and engineering</p></div>
</div></div>`;

const html = `<!doctype html><meta charset="utf-8"><title>Branding directions</title>
<style>
@font-face{font-family:'Instrument Serif';src:url('${fonts}/InstrumentSerif-Regular.woff2') format('woff2')}
@font-face{font-family:'Instrument Serif';font-style:italic;src:url('${fonts}/InstrumentSerif-Italic.woff2') format('woff2')}
:root{color-scheme:dark}body{margin:0;background:#141210;color:${C.bone};font:15px/1.5 system-ui,sans-serif;padding:32px}
h1{font:400 2rem 'Instrument Serif',serif;margin:0 0 8px}h3{margin:0 0 4px;font-size:1rem}p.n{color:${C.muted};max-width:60ch;margin:0 0 16px}
.dir{border-top:1px solid #2e2924;padding:28px 0;display:grid;gap:18px}
.row{display:flex;flex-wrap:wrap;gap:24px;align-items:flex-end}
.tile{background:#1b1713;border:1px solid #2e2924;padding:14px;display:grid;gap:8px;justify-items:center}.tile small{color:${C.muted};font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.tab{display:flex;gap:10px;align-items:center;background:#25201b;border-radius:8px 8px 0 0;padding:8px 14px;color:${C.bone};font-size:13px}
.wm{font:400 15px 'Instrument Serif',serif;letter-spacing:.34em;color:${C.bone};white-space:nowrap}.wm i{font-style:normal;color:${C.brass}}
.wmB{letter-spacing:.42em;font-size:14px}.wmC{letter-spacing:.02em;font-size:26px}.wmC em{color:${C.brass}}
.og{width:1200px;height:630px;background:${C.canvas};position:relative;overflow:hidden;border:1px solid #2e2924}
.og::before{content:'';position:absolute;inset:0;background:radial-gradient(60% 90% at 78% 40%,rgb(201 169 110/.16),transparent),repeating-linear-gradient(90deg,transparent 0 79px,rgb(122 110 94/.10) 79px 80px)}
.og-in{position:relative;height:100%;padding:70px 80px;display:grid;grid-template-columns:1fr auto;align-items:center;gap:40px}
.og-copy{display:grid;gap:26px}.og-wm .wm{font-size:22px}.og-wm .wmC{font-size:34px}
.og h2{font:400 84px/0.98 'Instrument Serif',serif;margin:0;letter-spacing:-.005em}.og h2 em{color:${C.brass}}
.og p{margin:0;color:${C.muted};font:500 20px system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}
.og-mark{order:2;opacity:.95}.og-mark svg{width:240px;height:240px;border-radius:36px}
.scale{transform:scale(.5);transform-origin:top left;width:1200px;height:630px}.scalebox{width:600px;height:315px}
.apple{border-radius:40px;overflow:hidden}
</style>
<h1>Branding directions for Youssef Studio</h1>
<p class="n">Three coordinated directions on the existing identity (warm black, ivory, brass, Instrument Serif; the vermilion signal colour stays an engineering accent). Preview only: nothing is committed or used by the site until one is approved and its final assets are made.</p>
${Object.entries(marks).map(([k, m]) => `
<section class="dir" id="dir-${k}"><div><h3>${m.name}</h3><p class="n">${m.note}</p></div>
  <div class="row">
    <div class="tile"><div class="tab"><span id="fav-${k}-16" style="display:inline-block;width:16px;height:16px">${m.svg(16)}</span> Youssef Studio</div><small>Browser tab, 16 px</small></div>
    <div class="tile">${m.svg(32)}<small>32 px</small></div>
    <div class="tile">${m.svg(64)}<small>64 px</small></div>
    <div class="tile"><div class="apple" id="apple-${k}">${m.svg(180)}</div><small>Touch icon 180 px</small></div>
    <div class="tile">${wordmarks[k]}<small>Wordmark</small></div>
  </div>
  <div class="scalebox"><div class="scale">${card(k)}</div></div>
</section>`).join('')}`;
fs.writeFileSync(path.join(out, 'index.html'), html);

const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000 });
  await page.goto(pathToFileURL(path.join(out, 'index.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: path.join(out, 'comparison.png'), fullPage: true });
  for (const k of Object.keys(marks)) {
    // the social cards are rendered at full size on a clean page so the PNG is exactly 1200 x 630
    const p2 = await browser.newPage(); await p2.setViewport({ width: 1200, height: 630 });
    // a file page (not setContent) so the local fonts load
    const f = path.join(out, `og-${k}.html`);
    fs.writeFileSync(f, `<meta charset="utf-8"><style>${html.match(/<style>([\s\S]*?)<\/style>/)[1]}body{padding:0;background:#0b0a09}</style>${card(k)}`);
    await p2.goto(pathToFileURL(f).href, { waitUntil: 'networkidle0' });
    await p2.evaluate(() => document.fonts.ready);
    const el = await p2.$('.og'); await el.screenshot({ path: path.join(out, `og-${k}.png`) });
    await p2.close();
  }
} finally { await browser.close(); }
console.log('previews written to', out);
