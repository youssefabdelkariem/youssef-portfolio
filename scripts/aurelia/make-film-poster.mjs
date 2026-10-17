// Creates the film poster derivative (id "film-poster") from an approved frame of the finished film and registers it in
// public/media/aurelia/manifest.json. The frame (a 1920 px JPEG grabbed by film-frames.mjs) stays outside the repository.
// Usage: node scripts/aurelia/make-film-poster.mjs <frame.jpg> <poster frame label, for the manifest>
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const [frame, label] = process.argv.slice(2);
if (!frame || !label) { console.error('usage: make-film-poster.mjs <frame.jpg> <label>'); process.exit(2); }
const dir = path.resolve('public/media/aurelia');
const manifestFile = path.join(dir, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const src = fs.readFileSync(frame);
const meta = await sharp(src).metadata();
const variants = [];
const write = async (name, format, width, opts) => {
  const out = await sharp(src).resize({ width: Math.min(width, meta.width) })[format](opts).toBuffer({ resolveWithObject: true });
  fs.writeFileSync(path.join(dir, name), out.data);
  variants.push({ file: name, format: format === 'jpeg' ? 'jpg' : format, width: out.info.width, height: out.info.height, bytes: out.data.length, quality: opts.quality });
};
for (const w of [960, 1440, 1920]) await write(`film-poster-${w}.avif`, 'avif', w, { quality: 70, effort: 6 });
for (const w of [960, 1440]) await write(`film-poster-${w}.jpg`, 'jpeg', w, { quality: 88, mozjpeg: true });
manifest.outputs = manifest.outputs.filter((o) => o.id !== 'film-poster');
manifest.outputs.push({ id: 'film-poster', master: label, master_sha256: crypto.createHash('sha256').update(src).digest('hex'), crop: null, variants });
fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 1) + '\n');
for (const v of variants) console.log(v.file, v.width + 'x' + v.height, v.bytes, 'B');
