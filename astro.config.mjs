import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Provisional stack (ADR 0002 Proposed). Static output, one index.html per route.
// `site` is the recorded production origin; canonical/sitemap URLs derive from it.
export default defineConfig({
  site: 'https://youssef.studio',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
});
