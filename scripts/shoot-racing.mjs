// Screenshots of selected sections of the built racing case study at desktop, tablet and phone widths (reads dist/).
// Usage: node scripts/shoot-racing.mjs <outDir>
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const out = process.argv[2];
if (!out) { console.error('usage: shoot-racing.mjs <outDir>'); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const { server, port } = await serve(path.resolve('dist'));
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  for (const [name, w] of [['desktop', 1440], ['tablet', 820], ['phone', 390]]) {
    await page.setViewport({ width: w, height: 900 });
    await page.goto(`http://localhost:${port}/engineering/ibm-ai-racing/`, { waitUntil: 'networkidle0' });
    await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important}.chart .trace{stroke-dashoffset:0!important}' });
    await page.screenshot({ path: path.join(out, `hero-${name}.jpg`), type: 'jpeg', quality: 82 });
    for (const sel of ['#perf', '#test', '#demo', '#source']) {
      const el = await page.$(`section[aria-labelledby="${sel.slice(1)}"]`);
      if (el) await el.screenshot({ path: path.join(out, `${sel.slice(1)}-${name}.jpg`), type: 'jpeg', quality: 82 });
    }
  }
} finally { await browser.close(); server.close(); }
console.log('written to', out);
