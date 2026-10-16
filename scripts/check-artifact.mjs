// Inspects the complete publish artifact (dist/) against an allowlist (ADR 0006): site files only, no source, docs,
// instruction files, evidence, maps, manifests or secrets; required hosting files present. Fails closed.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const problems = [];
const fail = (m) => problems.push(m);
if (!fs.existsSync(dist)) { console.error('dist/ missing: run npm run build'); process.exit(1); }

const files = fs.readdirSync(dist, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).map((e) => path.relative(dist, path.join(e.parentPath ?? e.path, e.name)).replace(/\\/g, '/'));
const allowed = [
  /^(index|404)\.html$/, /^[a-z0-9-]+(\/[a-z0-9-]+)*\/index\.html$/,
  /^_astro\/[\w.-]+\.(css|js)$/, /^fonts\/[\w.-]+\.(woff2|txt)$/, /^media\/(aurelia|racing)\/[\w.-]+\.(avif|jpg)$/,
  /^favicon\.svg$/, /^robots\.txt$/, /^sitemap(-index|-\d+)?\.xml$/, /^CNAME$/,
];
for (const f of files) if (!allowed.some((re) => re.test(f))) fail(`not on the allowlist: ${f}`);
for (const f of files) if (/\.(md|map|json|py|mjs|ts|exr|blend|nk|psd|zip|env)$/i.test(f) || /(^|\/)(\.git|node_modules|docs|src|scripts|AGENTS|CLAUDE|README)/i.test(f)) fail(`forbidden path in artifact: ${f}`);
for (const need of ['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap-index.xml', 'sitemap-0.xml', 'favicon.svg', 'work/index.html', 'work/aurelia/index.html', 'engineering/index.html', 'engineering/ibm-ai-racing/index.html', 'about/index.html']) if (!files.includes(need)) fail(`required file missing: ${need}`);
if (fs.existsSync(path.join(dist, 'CNAME')) && fs.readFileSync(path.join(dist, 'CNAME'), 'utf8').trim() !== 'youssef.studio') fail('CNAME content is not youssef.studio');
if (fs.existsSync(path.join(dist, 'contact'))) fail('contact route present although it was removed');
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
