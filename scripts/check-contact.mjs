// Contact form checks (M3 gate). 1) While dormant, dist/ has no contact route, Hire me link or sitemap entry.
// 2) A fixture build (YS_CONTACT_FIXTURE=1, synthetic endpoint, output dist-contact/) exercises the form in a browser:
//    nothing is sent before submit, validation messages, success and failure paths, honeypot, axe, keyboard order and links.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const require = createRequire(import.meta.url);
const axeSource = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const problems = [];
const fail = (m) => problems.push(m);
const rows = [];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const cfg = JSON.parse(fs.readFileSync('src/data/contact.json', 'utf8'));
const live = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(cfg.endpoint ?? '');
const files = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).map((e) => path.join(e.parentPath ?? e.path, e.name));

// 1. production build consistency
if (!fs.existsSync('dist')) { console.error('dist/ missing: run npm run build'); process.exit(1); }
if (!live) {
  if (fs.existsSync('dist/contact')) fail('dist/ has a contact route although no endpoint is configured');
  for (const f of files('dist').filter((x) => x.endsWith('.html') || /sitemap.*\.xml$/.test(x))) {
    const t = fs.readFileSync(f, 'utf8');
    if (/Hire me|href="\/contact\/"|\/contact\//.test(t)) fail(`${path.relative('dist', f)} mentions the dormant contact form`);
  }
  rows.push('dormant: no contact route, link or sitemap entry in dist/');
} else {
  if (!fs.existsSync('dist/contact/index.html')) fail('endpoint configured but dist/contact/index.html missing');
  else if (!fs.readFileSync('dist/contact/index.html', 'utf8').includes(cfg.endpoint)) fail('contact page does not post to the configured endpoint');
  rows.push('enabled: contact page present and posts to the configured endpoint');
}

// 2. fixture build and behaviour
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const b = spawnSync(npx, ['astro', 'build', '--outDir', 'dist-contact'], { stdio: 'ignore', shell: process.platform === 'win32', env: { ...process.env, YS_CONTACT_FIXTURE: '1' } });
if (b.status !== 0) { fail('the fixture build failed'); } else {
  const { server, port } = await serve(path.resolve('dist-contact'));
  const browser = await launchBrowser();
  const endpoint = 'https://formspree.io/f/fixture0001';
  try {
    // header link, CTAs, sitemap
    const home = fs.readFileSync('dist-contact/index.html', 'utf8');
    if (!/href="\/contact\/"/.test(home)) fail('fixture: no Hire me link on the home page');
    if (!fs.readFileSync(fs.existsSync('dist-contact/sitemap-0.xml') ? 'dist-contact/sitemap-0.xml' : 'dist-contact/sitemap-index.xml', 'utf8').includes('/contact/')) fail('fixture: contact missing from the sitemap');

    for (const [w, h] of [[1440, 900], [390, 844]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      const posts = [];
      let mode = 'ok';
      const issues = [];
      page.on('console', (m) => { if (['error', 'warning'].includes(m.type()) && !/Failed to load resource/.test(m.text())) issues.push(m.text()); });
      page.on('pageerror', (e) => issues.push(String(e)));
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        if (r.url().startsWith('https://formspree.io/')) {
          posts.push({ method: r.method(), url: r.url(), hasBody: Boolean(r.postData()), accept: r.headers().accept, body: r.postData() ?? '' });
          if (r.method() === 'OPTIONS') return r.respond({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': 'POST' } });
          return r.respond({ status: mode === 'ok' ? 200 : 500, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify({ ok: mode === 'ok' }) });
        }
        return r.continue();
      });
      await page.goto(`http://localhost:${port}/contact/`, { waitUntil: 'networkidle0' });
      const tag = `@${w}`;
      if (posts.length) fail(`${tag}: a request left the page before submit: ${JSON.stringify(posts)}`);
      const info = await page.evaluate(() => ({ h1: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth - innerWidth, action: document.querySelector('#brief').action, req: [...document.querySelectorAll('#brief [required]')].map((e) => e.name), hp: getComputedStyle(document.querySelector('.hp')).position, unlabeled: [...document.querySelectorAll('#brief input:not([type=hidden]), #brief select, #brief textarea')].filter((e) => !e.labels?.length).map((e) => e.name) }));
      if (info.action !== endpoint) fail(`${tag}: form action ${info.action}`);
      if (info.h1 !== 1 || info.overflow > 0) fail(`${tag}: h1 ${info.h1}, overflow ${info.overflow}`);
      if (info.unlabeled.length) fail(`${tag}: fields without a label: ${info.unlabeled}`);
      for (const n of ['name', 'email', 'service', 'message', 'consent']) if (!info.req.includes(n)) fail(`${tag}: ${n} is not required`);
      await page.evaluate(axeSource);
      const ax = await page.evaluate(() => axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] } }));
      for (const v of ax.violations) fail(`${tag}: axe ${v.id} (${v.impact}): ${v.nodes[0].target.join(' ')}`);

      // empty submit shows errors, focuses the first, sends nothing
      await page.click('button[type="submit"]');
      await wait(300);
      const bad = await page.evaluate(() => ({ errs: document.querySelectorAll('.err').length, focus: document.activeElement?.id, status: document.querySelector('#brief-status').textContent }));
      if (bad.errs < 5 || bad.focus !== 'f-name' || !bad.status) fail(`${tag}: validation ${JSON.stringify(bad)}`);
      if (posts.length) fail(`${tag}: an invalid form was sent`);

      // invalid email
      await page.type('#f-name', 'Test Person');
      await page.type('#f-email', 'not-an-email');
      await page.select('#f-service', 'VFX and compositing');
      await page.type('#f-message', 'A short film needing five CGI shots, delivery next month.');
      await page.click('#f-consent');
      await page.click('button[type="submit"]');
      await wait(300);
      if (!(await page.$eval('#f-email-err', (e) => e.textContent).catch(() => ''))) fail(`${tag}: no error for an invalid email`);

      // link must be a real link; custom budget reveals a required number field
      if (await page.$eval('#amount-group', (e) => !e.hidden)) fail(`${tag}: the amount field is visible before Custom amount is chosen`);
      await page.type('#f-links', 'just some words');
      await page.select('#f-budget', 'Custom amount');
      if (await page.$eval('#amount-group', (e) => e.hidden)) fail(`${tag}: choosing Custom amount did not reveal the number field`);
      await page.click('button[type="submit"]');
      await wait(300);
      if (!(await page.$eval('#f-links-err', (e) => e.textContent).catch(() => ''))) fail(`${tag}: plain text was accepted as a link`);
      if (!(await page.$eval('#f-amount-err', (e) => e.textContent).catch(() => ''))) fail(`${tag}: an empty custom amount was accepted (errors: ${await page.$$eval('.err', (e) => e.map((x) => x.id))}; focus ${await page.evaluate(() => document.activeElement?.id)})`);
      await page.$eval('#f-links', (e) => { e.value = ''; });
      await page.type('#f-links', 'https://example.com/brief');
      await page.type('#f-amount', '1500');
      await page.select('#f-currency', 'EUR');

      // failure path keeps the form and the data
      await page.$eval('#f-email', (e) => { e.value = ''; });
      await page.type('#f-email', 'person@example.com');
      mode = 'fail';
      await page.click('button[type="submit"]');
      await wait(600);
      const failed = await page.evaluate(() => ({ status: document.querySelector('#brief-status').textContent, formHidden: document.querySelector('#brief').hidden, name: document.querySelector('#f-name').value, disabled: document.querySelector('button[type=submit]').disabled }));
      if (!/could not be sent/.test(failed.status) || failed.formHidden || failed.name !== 'Test Person' || failed.disabled) fail(`${tag}: failure path ${JSON.stringify(failed)}`);

      // success path
      mode = 'ok';
      await page.click('button[type="submit"]');
      await wait(600);
      const ok = await page.evaluate(() => ({ formHidden: document.querySelector('#brief').hidden, doneVisible: !document.querySelector('#brief-done').hidden, focus: document.activeElement?.id }));
      if (!ok.formHidden || !ok.doneVisible || ok.focus !== 'brief-done') fail(`${tag}: success path ${JSON.stringify(ok)}`);
      const sent = posts.filter((p) => p.method === 'POST');
      const body = sent.at(-1)?.body ?? '';
      if (!/budget_amount/.test(body) || !/1500/.test(body) || !/EUR/.test(body) || !/example\.com\/brief/.test(body)) fail(`${tag}: the submitted body lacks the link or the custom budget`);
      if (sent.length !== 2 || sent.some((p) => p.url !== endpoint || !p.hasBody || !/json/.test(p.accept ?? ''))) fail(`${tag}: unexpected requests ${JSON.stringify(sent)}`);
      for (const m of issues) fail(`${tag}: ${m}`);
      rows.push(`fixture ${tag}: validation, failure and success paths, axe ${ax.violations.length} violations, ${sent.length} POSTs`);
      await page.close();
    }
    // no-JS: a plain form that posts to the endpoint
    const nojs = await browser.newPage();
    await nojs.setJavaScriptEnabled(false);
    await nojs.goto(`http://localhost:${port}/contact/`, { waitUntil: 'load' });
    const plain = await nojs.evaluate(() => ({ method: document.querySelector('#brief').method, hidden: document.querySelector('#brief').hidden, done: document.querySelector('#brief-done').hidden }));
    if (plain.method !== 'post' || plain.hidden || !plain.done) fail(`no-JS: ${JSON.stringify(plain)}`);
    rows.push('no JavaScript: plain POST form is visible');
  } finally {
    await browser.close();
    server.close();
    fs.rmSync('dist-contact', { recursive: true, force: true });
  }
}
console.log(rows.join('\n'));
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log(`check-contact: OK (form ${live ? 'enabled' : 'dormant in dist, fixture verified'})`);
