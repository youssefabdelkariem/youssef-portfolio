import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Design-exploration routes exist only when YS_EXPLORE=1 (npm run build:explore). The default build never emits them.
const explore = process.env.YS_EXPLORE === '1';
const exploreRoutes = {
  name: 'ys-explore-routes',
  hooks: {
    'astro:config:setup': ({ injectRoute }) => {
      injectRoute({ pattern: '/explore', entrypoint: './src/explore/index.astro' });
      injectRoute({ pattern: '/explore/a', entrypoint: './src/explore/a/index.astro' });
      injectRoute({ pattern: '/explore/b', entrypoint: './src/explore/b/index.astro' });
      injectRoute({ pattern: '/explore/media-fallback', entrypoint: './src/explore/media-fallback.astro' });
    },
  },
};

// Provisional stack (ADR 0002 Proposed). Static output, one index.html per route.
// `site` is the recorded production origin; canonical/sitemap URLs derive from it.
export default defineConfig({
  site: 'https://youssef.studio',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !page.includes('/explore/') }), ...(explore ? [exploreRoutes] : [])],
});
