// Minimal static server that mimics GitHub Pages routing: directory index files,
// 301 to a trailing slash for directories, and a real 404 status serving 404.html.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain', '.avif': 'image/avif', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.json': 'application/json' };

export function serve(root, port = 0) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = decodeURIComponent(req.url.split('?')[0]);
      let file = path.join(root, url);
      if (!file.startsWith(root)) { res.writeHead(403); return res.end(); }
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        if (!url.endsWith('/')) { res.writeHead(301, { Location: url + '/' }); return res.end(); }
        file = path.join(file, 'index.html');
      }
      let status = 200;
      if (!fs.existsSync(file)) { file = path.join(root, '404.html'); status = 404; }
      const headers = { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'accept-ranges': 'bytes' };
      const data = fs.readFileSync(file);
      // byte ranges, as static hosts serve them, so video can seek
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
      if (range && status === 200) {
        const start = range[1] === '' ? Math.max(0, data.length - Number(range[2])) : Number(range[1]);
        const end = range[1] === '' || range[2] === '' ? data.length - 1 : Math.min(Number(range[2]), data.length - 1);
        if (start > end || start >= data.length) { res.writeHead(416, { 'content-range': `bytes */${data.length}` }); return res.end(); }
        res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${data.length}`, 'content-length': end - start + 1 });
        return res.end(data.subarray(start, end + 1));
      }
      res.writeHead(status, headers);
      res.end(data);
    });
    server.listen(port, () => resolve({ server, port: server.address().port }));
  });
}
