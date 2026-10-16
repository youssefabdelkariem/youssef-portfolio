// Builds a LOCAL PREVIEW of the unpublished Aurelia walkthrough into dist-preview/ (never dist/, never deployed).
import { spawnSync } from 'node:child_process';

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const r = spawnSync(npx, ['astro', 'build', '--outDir', 'dist-preview'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, YS_PREVIEW_WALKTHROUGH: '1' } });
process.exit(r.status ?? 1);
