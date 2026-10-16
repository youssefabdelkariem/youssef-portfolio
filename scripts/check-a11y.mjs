// Keyboard and structure audit of the built site (QA-01, QA-03). Complements axe in check-browser:
// every Tab stop shows a visible focus indicator and is on screen, the skip link comes first, the mobile menu opens and
// closes from the keyboard, landmarks and heading order are sound, scrollable regions are focusable and named.
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const routes = ['/', '/work/', '/work/aurelia/', '/engineering/', '/engineering/ibm-ai-racing/', '/about/', '/does-not-exist/'];
const problems = [];
const fail = (m) => problems.push(m);
const { server, port } = await serve(path.resolve('dist'));
const base = `http://localhost:${port}`;
const browser = await launchBrowser();
const summary = [];
try {
  for (const r of routes) {
    for (const w of [390, 1440]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: 900 });
      await page.goto(base + r, { waitUntil: 'networkidle0' });
      const tag = `${r} @${w}`;

      // landmarks and headings
      const s = await page.evaluate(() => {
        const count = (sel) => document.querySelectorAll(sel).length;
        const navs = [...document.querySelectorAll('nav')].map((n) => n.getAttribute('aria-label') || '');
        const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
        let jump = 0; heads.forEach((h, i) => { if (i && h > heads[i - 1] + 1) jump++; });
        const regions = [...document.querySelectorAll('[role=region]')].map((e) => ({ tab: e.tabIndex, name: !!(e.getAttribute('aria-label') || e.getAttribute('aria-labelledby')) }));
        const imgs = [...document.images].filter((i) => !i.hasAttribute('alt')).length;
        return { main: count('main'), banner: count('body > header, header.site-header'), footer: count('footer'), h1: count('h1'), navs, jump, regions, imgs, lang: document.documentElement.lang };
      });
      if (s.main !== 1) fail(`${tag}: ${s.main} main landmarks`);
      if (s.banner !== 1) fail(`${tag}: ${s.banner} banner landmarks`);
      if (s.footer !== 1) fail(`${tag}: ${s.footer} footer landmarks`);
      if (s.h1 !== 1) fail(`${tag}: ${s.h1} h1`);
      if (s.jump) fail(`${tag}: heading level skipped ${s.jump} time(s)`);
      if (new Set(s.navs).size !== s.navs.length || s.navs.some((n) => !n)) fail(`${tag}: navigation landmarks need unique names: ${JSON.stringify(s.navs)}`);
      for (const g of s.regions) if (g.tab !== 0 || !g.name) fail(`${tag}: scrollable region not focusable or unnamed`);
      if (s.imgs) fail(`${tag}: ${s.imgs} image(s) without alt attribute`);
      if (s.lang !== 'en') fail(`${tag}: lang ${s.lang}`);

      // keyboard sweep
      let stops = 0, firstOk = false;
            for (let i = 0; i < 160; i++) {
        await page.keyboard.press('Tab');
        const info = await page.evaluate(() => {
          const e = document.activeElement;
          if (!e || e === document.body) return null;
          window.__seen = window.__seen || new Set();
          if (window.__seen.has(e)) return { wrapped: true };
          window.__seen.add(e);
          const cs = getComputedStyle(e); const rect = e.getBoundingClientRect();
          const radio = e.matches('.vw-radio');
          let ring = parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none';
          if (!ring && cs.boxShadow && cs.boxShadow !== 'none') ring = true;
          if (radio) { const lab = e.parentElement.querySelector('.vw-tabs label'); const lc = lab && getComputedStyle(lab); ring = !!lc && parseFloat(lc.outlineWidth) > 0; }
          const r = radio ? e.parentElement.querySelector('.vw-tabs').getBoundingClientRect() : rect;
          return { id: e.tagName + (e.className ? '.' + String(e.className).split(' ')[0] : '') + ':' + (e.getAttribute('href') || e.id || e.textContent.trim().slice(0, 20)), ring, onScreen: r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight, small: !radio && (rect.width < 24 || rect.height < 24) && e.tagName !== 'A', cls: e.className };
        });
        if (!info || info.wrapped) break;
        stops++;
        if (stops === 1) firstOk = /skip/.test(info.cls);
        if (!info.ring) fail(`${tag}: no visible focus indicator on ${info.id}`);
        if (!info.onScreen) fail(`${tag}: focused element off screen: ${info.id}`);
        if (info.small) fail(`${tag}: target under 24 px: ${info.id}`);
      }
      if (!firstOk) fail(`${tag}: first Tab stop is not the skip link`);
      summary.push(`${tag}: ${stops} tab stops`);

      // mobile menu from the keyboard
      if (w === 390 && r !== '/does-not-exist/') {
        await page.evaluate(() => { window.scrollTo(0, 0); document.activeElement?.blur(); });
        await page.focus('.nav-menu summary');
        await page.keyboard.press('Enter');
        let open = await page.evaluate(() => document.querySelector('.nav-menu').open);
        if (!open) fail(`${tag}: menu did not open with Enter`);
        await page.keyboard.press('Tab');
        const inMenu = await page.evaluate(() => !!document.activeElement?.closest('.nav-menu'));
        if (!inMenu) fail(`${tag}: Tab left the open menu immediately`);
        await page.keyboard.press('Escape');
        const closed = await page.evaluate(() => ({ open: document.querySelector('.nav-menu').open, onSummary: document.activeElement?.tagName === 'SUMMARY' }));
        if (closed.open || !closed.onSummary) fail(`${tag}: Escape should close the menu and return focus to its button (${JSON.stringify(closed)})`);
      }
      await page.close();
    }
  }
} finally { await browser.close(); server.close(); }
console.log(summary.join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-a11y: OK');
