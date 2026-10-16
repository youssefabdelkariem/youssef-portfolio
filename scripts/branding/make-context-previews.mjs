// Renders the final assets in context for review: browser tab strip (16/32 px favicon on light and dark chrome), a phone home-screen
// tile (apple-touch-icon with an iOS-style corner mask) and social-card crops (1.91:1 full, 1:1 centre, 16:9 crop).
// Usage: node scripts/branding/make-context-previews.mjs <outDir>   (reads public/, writes PNG and HTML to outDir; nothing is published)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchBrowser } from '../lib/browser.mjs';

const out = path.resolve(process.argv[2] ?? '../../previews/m4-branding');
fs.mkdirSync(out, { recursive: true });
const u = (f) => pathToFileURL(path.resolve('public', f)).href;
const html = path.join(out, 'in-context.html');
fs.writeFileSync(html, `<meta charset="utf-8"><style>
body{margin:0;padding:28px;background:#1b1815;color:#ebe5da;font:14px system-ui;display:grid;gap:28px;width:1100px}
.tabs{display:flex;gap:2px;padding:8px 8px 0;border-radius:10px 10px 0 0}.tabs.l{background:#dee1e6}.tabs.d{background:#202124}
.tab{display:flex;align-items:center;gap:8px;padding:8px 14px;width:220px;border-radius:8px 8px 0 0;font-size:12px}
.l .tab{background:#fff;color:#222}.d .tab{background:#35363a;color:#e8eaed}.tab img{width:16px;height:16px}
.row{display:flex;gap:28px;align-items:flex-end}.tile{width:180px;height:180px;border-radius:40px;overflow:hidden}.tile img{width:180px;height:180px;display:block}
.small .tile{width:60px;height:60px;border-radius:14px}.small .tile img{width:60px;height:60px}
.crop{overflow:hidden;background:#000}.crop img{display:block}
h4{margin:0 0 8px;font-weight:500;color:#a39b8d}</style>
<div><h4>Browser tabs (16 px rendering of favicon.ico entry and SVG)</h4>
<div class="tabs l"><div class="tab"><img src="${u('favicon.svg')}">Youssef Studio</div><div class="tab"><img src="${u('favicon.ico')}">favicon.ico</div></div>
<div class="tabs d"><div class="tab"><img src="${u('favicon.svg')}">Youssef Studio</div><div class="tab"><img src="${u('favicon.ico')}">favicon.ico</div></div></div>
<div><h4>Home-screen tile (180 px with iOS corner mask, then 60 px)</h4><div class="row"><div class="tile"><img src="${u('apple-touch-icon.png')}"></div><div class="small"><div class="tile"><img src="${u('apple-touch-icon.png')}"></div></div><div class="small"><div class="tile" style="border-radius:50%"><img src="${u('icon-192.png')}"></div></div></div></div>
<div><h4>Social card: full 1200x630, 1:1 centre crop, 16:9 crop</h4><div class="row">
<div class="crop" style="width:600px;height:315px"><img src="${u('og-image.png')}" width="600"></div>
<div class="crop" style="width:315px;height:315px"><img src="${u('og-image.png')}" width="600" style="margin-left:-142px"></div>
<div class="crop" style="width:560px;height:315px"><img src="${u('og-image.png')}" width="560" style="margin-top:-0px"></div></div></div>`);
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1160, height: 900 });
  await page.goto(pathToFileURL(html).href, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(out, 'in-context.png'), fullPage: true });
} finally { await browser.close(); }
console.log('written', path.join(out, 'in-context.png'));
