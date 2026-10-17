// Inspects the complete publish artifact (dist/) against an allowlist (ADR 0006): site files only, no source, docs,
// instruction files, evidence, maps, manifests or secrets; required hosting files present. Fails closed.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.env.DIST ?? 'dist');
const rehearsal = process.env.REHEARSAL === '1'; // scratch deployments claim no domain: no CNAME or sitemap
const problems = [];
const pub = JSON.parse(fs.readFileSync('src/data/walkthrough-publication.json', 'utf8'));
const filmCfg = JSON.parse(fs.readFileSync('src/data/aurelia-film.json', 'utf8'));
const walkthroughPublished = pub.published === true && !!pub.approvedBy && !!pub.approvedOn;
const fail = (m) => problems.push(m);
if (!fs.existsSync(dist)) { console.error('dist/ missing: run npm run build'); process.exit(1); }

const all = fs.readdirSync(dist, { recursive: true, withFileTypes: true });
for (const e of all) if (e.isSymbolicLink()) fail(`symbolic link in artifact: ${e.name}`);
const files = all.filter((e) => e.isFile()).map((e) => path.relative(dist, path.join(e.parentPath ?? e.path, e.name)).replace(/\\/g, '/'));
const allowed = [
  /^(index|404)\.html$/, /^[a-z0-9-]+(\/[a-z0-9-]+)*\/index\.html$/,
  /^_astro\/[\w.-]+\.(css|js)$/, /^fonts\/[\w.-]+\.(woff2|txt)$/, /^media\/(aurelia|racing)\/[\w.-]+\.(avif|jpg)$/,
  /^favicon\.(svg|ico)$/, /^(og-image|apple-touch-icon|icon-\d+)\.png$/, /^site\.webmanifest$/, /^robots\.txt$/, /^sitemap(-index|-\d+)?\.xml$/, /^CNAME$/,
];
// Unfinished content: the walkthrough route and any film files are allowed only once the owner has approved them (M3 publication gates).
if (filmCfg.film) allowed.push(/^media\/aurelia\/film\/[\w.-]+\.(mp4|webm|vtt)$/);
allowed.push(/^media\/projects\/[a-z0-9-]+\/[\w.-]+\.(avif|jpg|mp4)$/);
if (walkthroughPublished) allowed.push(/^media\/walkthrough\/[\w.-]+\.(avif|mp4)$/);
for (const f of files) if (!walkthroughPublished && /walkthrough/i.test(f)) fail(`unpublished walkthrough in the artifact: ${f}`);
for (const f of files) if (!filmCfg.film && /(^|\/)film(\/|\.)/i.test(f)) fail(`film file in the artifact although no film is approved: ${f}`);
for (const f of files) if (!allowed.some((re) => re.test(f))) fail(`not on the allowlist: ${f}`);
for (const f of files) if (/\.(md|map|json|py|mjs|ts|exr|blend|nk|psd|zip|env)$/i.test(f) || /(^|\/)(\.git|node_modules|docs|src|scripts|AGENTS|CLAUDE|README)/i.test(f)) fail(`forbidden path in artifact: ${f}`);
for (const need of [...(rehearsal ? [] : ['CNAME', 'sitemap-index.xml', 'sitemap-0.xml']), 'index.html', '404.html', 'robots.txt', 'favicon.svg', 'favicon.ico', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'og-image.png', 'site.webmanifest', 'work/index.html', 'work/aurelia/index.html', 'engineering/index.html', 'engineering/ibm-ai-racing/index.html', 'about/index.html']) if (!files.includes(need)) fail(`required file missing: ${need}`);
if (rehearsal && files.includes('CNAME')) fail('a rehearsal artifact must not contain CNAME');
if (fs.existsSync(path.join(dist, 'CNAME')) && fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim() !== 'youssef.studio') fail('CNAME content is not youssef.studio');
const contactCfg = JSON.parse(fs.readFileSync('src/data/contact.json', 'utf8'));
const contactEnabled = /^https:\/\/formspree\.io\/f\/[A-Za-z0-9]{6,}$/.test(contactCfg.endpoint ?? '') && !!contactCfg.approvedBy && !!contactCfg.approvedOn;
if (!contactEnabled && fs.existsSync(path.join(dist, 'contact'))) fail('contact route present although the form is not enabled');
if (contactEnabled && !files.includes('contact/index.html')) fail('the contact form is enabled but contact/index.html is missing');
const bytes = files.reduce((n, f) => n + fs.statSync(path.join(dist, f)).size, 0);
if (bytes > 100 * 1024 * 1024) fail(`artifact ${bytes} B exceeds the 100 MB working limit`);
// secrets and private paths
for (const f of files.filter((x) => /\.(html|css|js|xml|txt|svg)$/.test(x))) {
  const t = fs.readFileSync(path.join(dist, f), 'utf8');
  if (/C:\\Users|\/Users\/|AKIA[0-9A-Z]{16}|BEGIN (RSA |OPENSSH )?PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|youssefhossamalt/i.test(t)) fail(`private path or secret pattern in ${f}`);
}
console.log(`artifact: ${files.length} files, ${(bytes / 1024 / 1024).toFixed(1)} MB`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-artifact: OK');
