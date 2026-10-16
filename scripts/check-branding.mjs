// Validates the approved Direction A branding in the built artifact (dist/): icon files decode with the right dimensions,
// every page head carries absolute https://youssef.studio icon and social tags that resolve to files in dist, and no branding
// source or review material leaks into the artifact. Run after the build: node scripts/check-branding.mjs
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve(process.env.DIST ?? 'dist');
const ORIGIN = 'https://youssef.studio';
const problems = [];
const fail = (m) => problems.push(m);
if (!fs.existsSync(dist)) { console.error('dist/ missing: run npm run build'); process.exit(1); }
const read = (f) => fs.readFileSync(path.join(dist, f));

const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const pngSize = (buf) => (buf.subarray(0, 8).equals(PNG_SIG) && buf.toString('ascii', 12, 16) === 'IHDR' ? { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } : null);
const expectPng = (f, w, h, maxBytes) => {
  if (!fs.existsSync(path.join(dist, f))) return fail(`${f} missing`);
  const b = read(f); const s = pngSize(b);
  if (!s) return fail(`${f} is not a PNG`);
  if (s.w !== w || s.h !== h) fail(`${f} is ${s.w}x${s.h}, expected ${w}x${h}`);
  if (maxBytes && b.length > maxBytes) fail(`${f} is ${b.length} B, over ${maxBytes} B`);
};

// master SVG
const svg = fs.existsSync(path.join(dist, 'favicon.svg')) ? read('favicon.svg').toString('utf8') : '';
for (const c of ['viewBox="0 0 64 64"', '#0b0a09', '#c9a96e', '#ebe5da']) if (!svg.includes(c)) fail(`favicon.svg lacks ${c}`);
if (/#ff5a36/i.test(svg)) fail('favicon.svg uses the Engineering vermilion');

// PNGs
expectPng('icon-192.png', 192, 192);
expectPng('icon-512.png', 512, 512);
expectPng('apple-touch-icon.png', 180, 180);
expectPng('og-image.png', 1200, 630, 300 * 1024);

// ICO: directory entries 16, 32, 48 with PNG payloads that decode
if (!fs.existsSync(path.join(dist, 'favicon.ico'))) fail('favicon.ico missing');
else {
  const b = read('favicon.ico');
  if (b.readUInt16LE(0) !== 0 || b.readUInt16LE(2) !== 1) fail('favicon.ico header invalid');
  const n = b.readUInt16LE(4); const seen = [];
  for (let i = 0; i < n; i++) {
    const o = 6 + i * 16; const w = b[o] || 256; const len = b.readUInt32LE(o + 8); const off = b.readUInt32LE(o + 12);
    const s = pngSize(b.subarray(off, off + len));
    if (!s || s.w !== w) fail(`favicon.ico entry ${i} does not decode as a ${w}px PNG`);
    seen.push(w);
  }
  for (const w of [16, 32, 48]) if (!seen.includes(w)) fail(`favicon.ico lacks the ${w}px entry`);
}

// manifest
try {
  const m = JSON.parse(read('site.webmanifest').toString('utf8'));
  if (!m.name || m.theme_color !== '#0b0a09') fail('site.webmanifest name or theme_color invalid');
  for (const i of m.icons ?? []) if (!fs.existsSync(path.join(dist, i.src.replace(/^\//, '')))) fail(`manifest icon missing: ${i.src}`);
  if (!(m.icons ?? []).length) fail('manifest lists no icons');
} catch (e) { fail(`site.webmanifest invalid: ${e.message}`); }

// page heads
const pages = fs.readdirSync(dist, { recursive: true }).map(String).filter((f) => f.replace(/\\/g, '/').match(/(^|\/)(index|404)\.html$/)).map((f) => f.replace(/\\/g, '/'));
const tag = (html, re) => (html.match(re) ?? [])[1];
const resolves = (url) => { if (!url.startsWith(ORIGIN + '/')) return false; return fs.existsSync(path.join(dist, decodeURIComponent(url.slice(ORIGIN.length + 1)))); };
for (const f of pages) {
  const html = read(f).toString('utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const need = [
    [/<link rel="icon" href="\/favicon\.svg" type="image\/svg\+xml"/, 'SVG favicon link'],
    [/<link rel="icon" href="\/favicon\.ico"/, 'ICO fallback link'],
    [/<link rel="apple-touch-icon" href="\/apple-touch-icon\.png"/, 'apple-touch-icon link'],
    [/<link rel="manifest" href="\/site\.webmanifest"/, 'manifest link'],
    [/<meta name="theme-color" content="#0b0a09"/, 'theme-color'],
    [/<meta name="twitter:card" content="summary_large_image"/, 'twitter:card'],
    [/<meta property="og:image:width" content="1200"/, 'og:image:width'],
    [/<meta property="og:image:height" content="630"/, 'og:image:height'],
    [/<meta property="og:image:alt" content="[^"]+"/, 'og:image:alt'],
    [/<meta name="twitter:image:alt" content="[^"]+"/, 'twitter:image:alt'],
    [/<meta name="description" content="[^"]+"/, 'description'],
    [/<title>[^<]+<\/title>/, 'title'],
  ];
  for (const [re, label] of need) if (!re.test(head)) fail(`${f}: missing ${label}`);
  for (const p of ['og:image', 'twitter:image']) {
    const url = tag(head, new RegExp(`<meta (?:property|name)="${p}" content="([^"]+)"`));
    if (!url) fail(`${f}: missing ${p}`); else if (url !== `${ORIGIN}/og-image.png` || !resolves(url)) fail(`${f}: ${p} is not the absolute resolving ${ORIGIN}/og-image.png (${url})`);
  }
  const canon = tag(head, /<link rel="canonical" href="([^"]+)"/);
  if (f === '404.html') { if (canon) fail('404.html must not carry a canonical'); }
  else if (!canon || !canon.startsWith(ORIGIN + '/') || !canon.endsWith('/') || !resolves(canon + 'index.html') && canon !== ORIGIN + '/') fail(`${f}: canonical missing or not absolute/resolving (${canon})`);
  if (!f.startsWith('engineering') && /<svg[^>]*>[^]*#ff5a36/i.test(html.slice(html.indexOf('<body')))) fail(`${f}: vermilion inside inline SVG outside Engineering`);
}

// no source or review material
for (const e of fs.readdirSync(dist, { recursive: true })) {
  const f = String(e).replace(/\\/g, '/');
  if (/(^|\/)\.og-card|(^|\/)(previews?|branding|reviews)(\/|$)|direction-[abc]|favicon-[abc]\.svg|og-[abc]\.png|dot-comparison/i.test(f)) fail(`branding source or review material in the artifact: ${f}`);
}

console.log(`branding: ${pages.length} pages checked`);
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-branding: OK');
