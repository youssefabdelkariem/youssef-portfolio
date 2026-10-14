// Runs the browser checks (axe, reflow, reduced motion, no-JS, refresh, no external requests) on the exploration pages.
process.env.YS_DIST = 'dist-explore';
process.env.YS_ROUTES = '/explore/,/explore/a/,/explore/b/';
await import('./check-browser.mjs');
