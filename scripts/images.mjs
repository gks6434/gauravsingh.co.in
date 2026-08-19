#!/usr/bin/env node
/**
 * Turns the large source photos into responsive WebP variants.
 * Sources live in src/assets/img/photos/source-*.png and are never shipped.
 * Run after adding or replacing a photo:  npm run images
 */
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src/assets/img/photos');
const OUT = path.join(ROOT, 'src/assets/img/photos');

// name -> { widths, crop } ; portraits are squared, the working shot stays 4:3
const JOBS = {
  'source-portrait-open':   { out: 'portrait',        widths: [480, 720, 1080], fit: 'cover', ratio: 1 },
  'source-portrait-formal': { out: 'portrait-formal', widths: [480, 720],       fit: 'cover', ratio: 1 },
  'source-working':         { out: 'working',         widths: [640, 960, 1400], fit: 'cover', ratio: 4 / 3 }
};

await mkdir(OUT, { recursive: true });
const files = await readdir(SRC);
console.log('Generating responsive images:');

for (const [base, cfg] of Object.entries(JOBS)) {
  const src = files.find(f => f.startsWith(base) && /\.(png|jpe?g|webp)$/i.test(f));
  if (!src) { console.log(`  (skipped ${base} — no source file)`); continue; }

  for (const w of cfg.widths) {
    const h = Math.round(w / cfg.ratio);
    const file = `${cfg.out}-${w}.webp`;
    const info = await sharp(path.join(SRC, src))
      .resize(w, h, { fit: cfg.fit, position: 'top' })
      .webp({ quality: 82, effort: 6 })
      .toFile(path.join(OUT, file));
    console.log(`  ${file}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}
