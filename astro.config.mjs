import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';

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
      injectRoute({ pattern: '/explore/hero-fixture', entrypoint: './src/explore/hero-fixture.astro' });
    },
  },
};

// The Aurelia walkthrough is an internal draft. Its route exists only when the owner has approved publication
// (src/data/walkthrough-publication.json) or in a local preview build (YS_PREVIEW_WALKTHROUGH=1, npm run build:preview).
// It is never listed in the sitemap unless published.
const pub = JSON.parse(fs.readFileSync(new URL('./src/data/walkthrough-publication.json', import.meta.url), 'utf8'));
const walkthroughPublished = pub.published === true && !!pub.approvedBy && !!pub.approvedOn;
const walkthroughRoute = {
  name: 'ys-walkthrough-route',
  hooks: { 'astro:config:setup': ({ injectRoute }) => injectRoute({ pattern: '/work/aurelia/walkthrough', entrypoint: './src/walkthrough/index.astro' }) },
};

// The contact form is dormant until the owner supplies a Formspree endpoint (src/data/contact.json). While dormant there is no
// /contact/ route, no sitemap entry and no "Hire me" link. YS_CONTACT_FIXTURE=1 builds it with a synthetic endpoint for tests.
const contactCfg = JSON.parse(fs.readFileSync(new URL('./src/data/contact.json', import.meta.url), 'utf8'));
const contactEnabled = process.env.YS_CONTACT_FIXTURE === '1' || (/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(contactCfg.endpoint ?? '') && !!contactCfg.approvedBy && !!contactCfg.approvedOn);
const contactRoute = {
  name: 'ys-contact-route',
  hooks: { 'astro:config:setup': ({ injectRoute }) => injectRoute({ pattern: '/contact', entrypoint: './src/contact/index.astro' }) },
};

// Provisional stack (ADR 0002 Proposed). Static output, one index.html per route.
// `site` is the recorded production origin; canonical/sitemap URLs derive from it.
export default defineConfig({
  site: 'https://youssef.studio',
  base: '/',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') && !page.includes('/explore/') && (walkthroughPublished || !page.includes('/walkthrough/')) && (contactEnabled || !page.includes('/contact/')) }), ...(explore ? [exploreRoutes] : []), ...(walkthroughPublished || process.env.YS_PREVIEW_WALKTHROUGH === '1' ? [walkthroughRoute] : []), ...(contactEnabled ? [contactRoute] : [])],
});
