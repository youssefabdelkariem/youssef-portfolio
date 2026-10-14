// Builds the design-exploration pages (plus the normal site) into dist-explore/ for local review only.
import { spawnSync } from 'node:child_process';

const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const r = spawnSync(npx, ['astro', 'build', '--outDir', 'dist-explore'], { stdio: 'inherit', shell: process.platform === 'win32', env: { ...process.env, YS_EXPLORE: '1' } });
process.exit(r.status ?? 1);
