// Copies finished derivatives into public/media/aurelia/ (git-ignored). Usage: node scripts/aurelia/sync-media.mjs <derivatives dir>
import fs from 'node:fs';
import path from 'node:path';

const src = process.argv[2];
if (!src || !fs.existsSync(path.join(src, 'manifest.json'))) { console.error('usage: sync-media.mjs <dir containing manifest.json>'); process.exit(2); }
const dest = path.resolve('public/media/aurelia');
fs.mkdirSync(dest, { recursive: true });
let n = 0;
for (const f of fs.readdirSync(src)) {
  if (/\.(avif|jpg|json)$/.test(f)) { fs.copyFileSync(path.join(src, f), path.join(dest, f)); n++; }
}
console.log(`copied ${n} files to ${dest}`);
