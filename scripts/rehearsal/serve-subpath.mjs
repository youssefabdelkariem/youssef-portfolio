// Local emulator of a GitHub Pages project site: serves <dir> under /<repo>/ with gzip, directory indexes, 301 for the
// missing trailing slash, a real 404 using <dir>/404.html for every unknown path under the prefix, and max-age=600.
// Usage: node scripts/rehearsal/serve-subpath.mjs <dir> /repo [port]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const [dir, base, portArg] = process.argv.slice(2);
const root = path.resolve(dir); const port = +(portArg ?? 4700);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2', '.avif': 'image/avif', '.jpg': 'image/jpeg' };
const gz = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt']);
const send = (req, res, status, file, extra = {}) => {
  const ext = path.extname(file); let body = fs.readFileSync(file);
  const h = { 'content-type': types[ext] ?? 'application/octet-stream', 'cache-control': 'max-age=600', ...extra };
  if (gz.has(ext) && /gzip/.test(req.headers['accept-encoding'] ?? '')) { body = zlib.gzipSync(body); h['content-encoding'] = 'gzip'; }
  res.writeHead(status, h); res.end(req.method === 'HEAD' ? undefined : body);
};
http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === base) { res.writeHead(301, { location: base + '/' }); return res.end(); }
  if (!url.startsWith(base + '/')) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('not found'); }
  let file = path.join(root, url.slice(base.length));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    if (!url.endsWith('/')) { res.writeHead(301, { location: url + '/' }); return res.end(); }
    file = path.join(file, 'index.html');
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return send(req, res, 200, file);
  send(req, res, 404, path.join(root, '404.html'));
}).listen(port, () => console.log(`serving ${root} at http://localhost:${port}${base}/`));
