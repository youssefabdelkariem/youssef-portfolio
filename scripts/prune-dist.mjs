// Removes build-only files from dist/ so the published artifact holds site files only.
// public/media/aurelia/manifest.json lists master file names and hashes; media.ts reads it at build time from public/.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
for (const rel of ['media/aurelia/manifest.json', 'media/walkthrough/manifest.json']) {
  const f = path.join(dist, rel);
  if (fs.existsSync(f)) { fs.rmSync(f); console.log('pruned', rel); }
}
