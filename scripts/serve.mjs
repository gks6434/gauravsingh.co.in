#!/usr/bin/env node
// Tiny static server for local preview. Node only, no dependencies.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');
const PORT = process.env.PORT || 4321;

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(OUT, p);
  try {
    const s = await stat(file);
    if (s.isDirectory()) file = path.join(file, 'index.html');
  } catch {
    if (!path.extname(file)) file = path.join(OUT, p, 'index.html');
  }
  try {
    const buf = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  } catch {
    try {
      const buf = await readFile(path.join(OUT, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(buf);
    } catch { res.writeHead(404).end('Not found'); }
  }
}).listen(PORT, () => console.log(`Preview: http://localhost:${PORT}`));
