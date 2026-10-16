// Builds the design-exploration pages (plus the normal site) into dist-explore/ for local review only.
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fixtures } from './lib/fixtures.mjs';

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const r = spawnSync(npx, ['astro', 'build', '--outDir', 'dist-explore'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, YS_EXPLORE: '1' } });
if (r.status === 0) {
  fs.mkdirSync('dist-explore/explore-fixtures', { recursive: true });
  for (const [name, svg] of Object.entries(fixtures)) fs.writeFileSync(`dist-explore/explore-fixtures/${name}`, svg);
}
process.exit(r.status ?? 1);
