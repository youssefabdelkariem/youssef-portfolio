import fs from 'node:fs';
// Post-deployment smoke test against a base URL (default https://youssef.studio). Read-only GET/HEAD requests only.
// Usage: node scripts/check-live.mjs [baseUrl] [--allow-no-gzip]
const base = (process.argv[2] && !process.argv[2].startsWith('--') ? process.argv[2] : 'https://youssef.studio').replace(/\/$/, '');
const allowNoGzip = process.argv.includes('--allow-no-gzip');
const problems = [];
const fail = (m) => problems.push(m);
const routes = [['/', 'Youssef Studio'], ['/work/', 'VFX Portfolio'], ['/work/aurelia/', 'Aurelia'], ['/engineering/', 'Engineering'], ['/engineering/ibm-ai-racing/', 'IBM AI Racing'], ['/about/', 'About']];
for (const [r, title] of routes) {
  const res = await fetch(base + r, { headers: { 'accept-encoding': 'gzip' } });
  const html = await res.text();
  if (res.status !== 200) fail(`${r}: status ${res.status}`);
  if (!/text\/html/.test(res.headers.get('content-type') ?? '')) fail(`${r}: content-type ${res.headers.get('content-type')}`);
  if (!html.includes(`<title>`) || !html.includes(title)) fail(`${r}: title does not mention "${title}"`);
  if (/Youssef Studio<\/h1>\s*<p>Coming|coming soon/i.test(html)) fail(`${r}: still serving the old placeholder`);
  if (!allowNoGzip && res.headers.get('content-encoding') !== 'gzip' && r === '/') fail('home is not served compressed');
}
const noSlash = await fetch(base + '/work', { redirect: 'manual' });
if (![301, 308].includes(noSlash.status)) fail(`/work should redirect to /work/, got ${noSlash.status}`);
const nf = await fetch(base + '/does-not-exist/');
if (nf.status !== 404) fail(`unknown route status ${nf.status}`); else if (!(await nf.text()).includes('Page not found')) fail('404 page content');
const robots = await fetch(base + '/robots.txt'); if (robots.status !== 200) fail('robots.txt');
const sm = await fetch(base + '/sitemap-0.xml'); const smText = await sm.text();
if (sm.status !== 200 || !smText.includes('https://youssef.studio/engineering/ibm-ai-racing/')) fail('sitemap');
if (smText.includes('/404')) fail('sitemap lists 404');
{ const f = JSON.parse(fs.readFileSync('src/data/aurelia-film.json', 'utf8')).film; const t = await (await fetch(base + '/work/aurelia/')).text(); if (f && (!t.includes('Watch the film') || !t.includes(f.externalUrl) || /<iframe|<video/.test(t))) fail('Aurelia film section missing or a player loads before play'); if (!f && /Watch the film/.test(t)) fail('film section present although no film is configured'); }
for (const a of ['/favicon.svg', '/favicon.ico', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/og-image.png', '/site.webmanifest']) { const r = await fetch(base + a); if (r.status !== 200) fail(`${a} status ${r.status}`); }
const contactLive = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(JSON.parse(fs.readFileSync('src/data/contact.json', 'utf8')).endpoint ?? '');
if (contactLive) { const c = await fetch(base + '/contact/'); const t = await c.text(); if (c.status !== 200 || !/<form id="brief"/.test(t) || !t.includes('formspree.io/f/')) fail(`/contact/ is not serving the form (status ${c.status})`); }
for (const gone of [...(contactLive ? [] : ['/contact/']), '/docs/', '/src/', '/README.md', '/AGENTS.md', '/CLAUDE.md', '/package.json', '/media/aurelia/manifest.json', '/media/walkthrough/manifest.json', '/media/projects/manifest.json']) { const g = await fetch(base + gone); if (g.status !== 404) fail(`${gone} should not be served (status ${g.status})`); }
if (base.startsWith('https://')) {
  const http = await fetch(base.replace('https://', 'http://') + '/', { redirect: 'manual' });
  if (![301, 308].includes(http.status) || !(http.headers.get('location') ?? '').startsWith('https://')) fail(`http does not redirect to https (${http.status})`);
}
console.log(`live check against ${base}`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-live: OK');
