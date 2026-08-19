#!/usr/bin/env node
/**
 * Post-build checks. Runs against /public, exits non-zero on any failure so CI
 * refuses to deploy a broken site.
 *
 * Covers: routes, required meta, JSON-LD validity, internal links, image assets
 * and alt text, and the privacy rules this site commits to (no plain-text email,
 * no phone number, no mailto: in the served HTML).
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public');

const problems = [];
const fail = m => problems.push(m);

let files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) await walk(f); else files.push(f);
  }
}

try {
  await stat(OUT);
} catch {
  console.error('public/ does not exist — run `npm run build` first.');
  process.exit(1);
}

await walk(OUT);
const rel = f => '/' + path.relative(OUT, f).replace(/\\/g, '/');
const allPaths = files.map(rel);
const htmls = files.filter(f => f.endsWith('.html'));
const routes = new Set(htmls.map(f => {
  const r = rel(f).replace(/index\.html$/, '');
  return r === '' ? '/' : r;
}));

/* --- Per-page structure -------------------------------------------------- */
for (const f of htmls) {
  const html = await readFile(f, 'utf8');
  const p = rel(f);

  const required = [
    ['<title>',          /<title>[^<]{10,}<\/title>/],
    ['meta description', /<meta name="description" content="[^"]{40,}"/],
    ['canonical',        /<link rel="canonical" href="https:\/\//],
    ['og:image',         /<meta property="og:image"/],
    ['<h1>',             /<h1[\s>]/],
    ['lang attribute',   /<html lang="en-IN">/],
    ['aurora layer',     /class="aurora"/]
  ];
  for (const [label, re] of required) if (!re.test(html)) fail(`${p}: missing ${label}`);

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s > 1) fail(`${p}: ${h1s} <h1> elements (expected 1)`);

  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { fail(`${p}: invalid JSON-LD — ${e.message}`); }
  }

  for (const m of html.matchAll(/<img\s([^>]*?)>/g)) {
    if (!/\balt=/.test(m[1])) fail(`${p}: <img> without alt text`);
    if (!/\bwidth=/.test(m[1]) || !/\bheight=/.test(m[1])) {
      fail(`${p}: <img> without width/height (causes layout shift)`);
    }
  }

  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (/\.\w{2,5}$/.test(href)) {
      if (!allPaths.includes(href)) fail(`${p}: missing asset ${href}`);
    } else if (!routes.has(href)) {
      fail(`${p}: dead internal link ${href}`);
    }
  }

  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !allPaths.includes(u)) fail(`${p}: missing srcset image ${u}`);
    }
  }
}

/* --- Privacy guarantees --------------------------------------------------- */
const htmlBlob = (await Promise.all(htmls.map(f => readFile(f, 'utf8')))).join('\n');
const privacy = [
  ['plain email address', /gks\.6434@gmail\.com/i],
  ['phone number',        /7004917881|\+91[-\s]?70049/],
  ['mailto: link',        /mailto:/i],
  ['tel: link',           /href="tel:/i]
];
for (const [label, re] of privacy) {
  if (re.test(htmlBlob)) fail(`PRIVACY: ${label} present in served HTML`);
}

/* --- Confidentiality guarantees ------------------------------------------- */
const confidential = [
  ['SEMICON',       /semicon\s*india/i],
  ['public site URL', /in\.horiba\.com/i],
  ['TripClap',      /tripclap/i]
];
for (const [label, re] of confidential) {
  if (re.test(htmlBlob)) fail(`CONFIDENTIALITY: ${label} appears in served HTML`);
}

/* The published CV is generated from src/cv-source.html. That file lives
   outside src/assets on purpose, so it is never copied into public/. PDF text
   is compressed and cannot be grepped, so assert against that committed source
   instead — it is the exact input the PDF was rendered from. */
try {
  const cvSource = await readFile(path.join(ROOT, 'src/cv-source.html'), 'utf8');
  if (/7004917881|\+91[-\s]?70049/.test(cvSource)) fail('PRIVACY: published CV source contains a phone number');
  if (/gks\.6434@gmail\.com/.test(cvSource))        fail('PRIVACY: published CV source contains a plain email address');
} catch {
  fail('Published CV source (src/cv-source.html) is missing — cannot verify the CV carries no personal contact details');
}

/* --- Build hygiene -------------------------------------------------------- */
const shippedSources = allPaths.filter(p => path.basename(p).startsWith('source-'));
if (shippedSources.length) fail(`Source photos shipped to public/: ${shippedSources.join(', ')}`);

/* No PDF ships unless it is deliberately allowlisted here. The CV carries a
   phone number and a plain email address, which this site does not publish;
   add a redacted file's path below when one exists. */
const ALLOWED_PDFS = ['/assets/files/Gaurav-Kumar-Singh-CV.pdf'];
for (const p of allPaths.filter(p => p.endsWith('.pdf'))) {
  if (!ALLOWED_PDFS.includes(p)) {
    fail(`PRIVACY: ${p} is shipped but not allowlisted — check it for phone/email before publishing`);
  }
}

for (const required of ['/sitemap.xml', '/robots.txt', '/.htaccess', '/404.html', '/favicon.svg']) {
  if (!allPaths.includes(required)) fail(`missing ${required}`);
}

/* --- Report --------------------------------------------------------------- */
const bytes = (await Promise.all(files.map(async f => (await stat(f)).size))).reduce((a, b) => a + b, 0);
console.log(`Validated ${htmls.length} pages, ${files.length} files, ${(bytes / 1024).toFixed(0)} KB total`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error('  ✗ ' + p);
  process.exit(1);
}
console.log('✓ All checks passed');
