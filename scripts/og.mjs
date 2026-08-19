#!/usr/bin/env node
/**
 * Generates the social preview image (with portrait) and the apple touch icon.
 * Run after changing the tagline, palette or photo:  npm run og
 */
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'src/assets/img');
const PHOTOS = path.join(IMG, 'photos');

const INK = '#0B0A12', SOFT = '#454154', ACCENT = '#4F46E5', DEEP = '#3730A3';
const W = 1200, H = 630, AV = 300, AX = 800, AY = 165;

/* Backdrop: white with the same pastel aurora the site uses. */
const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="p1" cx="50%" cy="50%"><stop offset="0%" stop-color="#C7D2FE" stop-opacity="0.95"/><stop offset="100%" stop-color="#C7D2FE" stop-opacity="0"/></radialGradient>
    <radialGradient id="p2" cx="50%" cy="50%"><stop offset="0%" stop-color="#E9D5FF" stop-opacity="0.9"/><stop offset="100%" stop-color="#E9D5FF" stop-opacity="0"/></radialGradient>
    <radialGradient id="p3" cx="50%" cy="50%"><stop offset="0%" stop-color="#CCFBF1" stop-opacity="0.85"/><stop offset="100%" stop-color="#CCFBF1" stop-opacity="0"/></radialGradient>
    <radialGradient id="p4" cx="50%" cy="50%"><stop offset="0%" stop-color="#FCE7F3" stop-opacity="0.85"/><stop offset="100%" stop-color="#FCE7F3" stop-opacity="0"/></radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="${ACCENT}"/><stop offset="55%" stop-color="#9333EA"/><stop offset="100%" stop-color="#DB2777"/></linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  <ellipse cx="120" cy="70"   rx="430" ry="380" fill="url(#p1)"/>
  <ellipse cx="990" cy="120"  rx="400" ry="360" fill="url(#p2)"/>
  <ellipse cx="1130" cy="560" rx="380" ry="330" fill="url(#p3)"/>
  <ellipse cx="330" cy="620"  rx="400" ry="320" fill="url(#p4)"/>
  <rect width="${W}" height="7" fill="url(#bar)"/>
</svg>`;

/* Foreground text, drawn above the photo so nothing collides. */
const foreground = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <text x="80" y="188" font-family="Georgia, 'Times New Roman', serif" font-size="72" fill="${INK}">Gaurav Kumar <tspan fill="${DEEP}">Singh</tspan></text>
  <text x="80" y="242" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="${SOFT}">Digital Transformation &#183; MarTech &amp; Process Automation</text>
  <text x="80" y="278" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="${SOFT}">&#183; AI-Enabled Solutions</text>
  <line x1="80" y1="336" x2="660" y2="336" stroke="${INK}" stroke-opacity="0.12" stroke-width="2"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="${DEEP}">
    <text x="80"  y="410">400+ MINR</text>
    <text x="360" y="410">15&#215;</text>
    <text x="500" y="410">5K &#8594; 15K</text>
  </g>
  <g font-family="Helvetica, Arial, sans-serif" font-size="17" fill="${SOFT}">
    <text x="80"  y="443">digital pipeline</text>
    <text x="360" y="443">organic growth</text>
    <text x="500" y="443">monthly inspections</text>
  </g>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="${INK}">${site.domain}</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4F46E5"/><stop offset="1" stop-color="#7C3AED"/></linearGradient></defs>
  <rect width="180" height="180" rx="42" fill="url(#g)"/>
  <text x="90" y="122" font-family="Georgia, serif" font-size="96" fill="#fff" text-anchor="middle">G</text>
</svg>`;

const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();

await mkdir(IMG, { recursive: true });
console.log('Generating images:');

// Circular portrait, with a soft white ring so it reads on the pastel wash.
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${AV}" height="${AV}"><circle cx="${AV/2}" cy="${AV/2}" r="${AV/2}" fill="#fff"/></svg>`
);
const avatar = await sharp(path.join(PHOTOS, 'portrait-720.webp'))
  .resize(AV, AV, { fit: 'cover', position: 'top' })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer();

const ring = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${AV + 24}" height="${AV + 24}"><circle cx="${(AV+24)/2}" cy="${(AV+24)/2}" r="${AV/2 + 9}" fill="#FFFFFF" fill-opacity="0.72"/></svg>`
);

const og = await sharp(png(backdrop, W))
  .composite([
    { input: ring,   left: AX - 12, top: AY - 12 },
    { input: avatar, left: AX,      top: AY },
    { input: png(foreground, W), left: 0, top: 0 }
  ])
  .png({ compressionLevel: 9 })
  .toBuffer();

await writeFile(path.join(IMG, 'og.png'), og);
console.log(`  og.png  ${(og.length / 1024).toFixed(1)} KB`);

const icon = png(iconSvg, 180);
await writeFile(path.join(IMG, 'apple-touch-icon.png'), icon);
console.log(`  apple-touch-icon.png  ${(icon.length / 1024).toFixed(1)} KB`);
