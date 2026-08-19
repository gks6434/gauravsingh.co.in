#!/usr/bin/env node
/**
 * Generates the social preview image and the apple touch icon.
 * Run after changing the tagline or role:  node scripts/og.mjs
 */
import { Resvg } from '@resvg/resvg-js';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from '../src/site.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(ROOT, 'src/assets/img');

const INK = '#191817', PAPER = '#FAF8F5', ACCENT = '#A8492A', SOFT = '#4A4744', RULE = '#E2DCD3';

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="1200" height="8" fill="${ACCENT}"/>
  <text x="80" y="196" font-family="Georgia, 'Times New Roman', serif" font-size="82" fill="${INK}">Gaurav Kumar <tspan fill="${ACCENT}">Singh</tspan></text>
  <text x="80" y="262" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="${SOFT}">Digital Transformation &#183; MarTech &amp; Process Automation &#183; AI-Enabled Solutions</text>
  <line x1="80" y1="322" x2="1120" y2="322" stroke="${RULE}" stroke-width="2"/>
  <g font-family="Georgia, 'Times New Roman', serif" font-size="52" fill="${ACCENT}">
    <text x="80"  y="418">400+ MINR</text>
    <text x="425" y="418">15&#215;</text>
    <text x="640" y="418">5K &#8594; 15K</text>
    <text x="960" y="418">600+</text>
  </g>
  <g font-family="Helvetica, Arial, sans-serif" font-size="19" fill="${SOFT}">
    <text x="80"  y="456">digital pipeline</text>
    <text x="425" y="456">organic growth</text>
    <text x="640" y="456">monthly inspections</text>
    <text x="960" y="456">employees reached</text>
  </g>
  <text x="80" y="562" font-family="Helvetica, Arial, sans-serif" font-size="23" fill="${INK}">${site.domain}</text>
</svg>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" rx="34" fill="${INK}"/>
  <text x="90" y="126" font-family="Georgia, 'Times New Roman', serif" font-size="108" fill="${ACCENT}" text-anchor="middle">G</text>
</svg>`;

async function render(svg, width, out) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
  await writeFile(path.join(IMG, out), png);
  console.log(`  ${out}  ${(png.length / 1024).toFixed(1)} KB`);
}

await mkdir(IMG, { recursive: true });
console.log('Generating images:');
await render(ogSvg, 1200, 'og.png');
await render(iconSvg, 180, 'apple-touch-icon.png');
