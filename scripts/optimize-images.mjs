#!/usr/bin/env node
/**
 * Converts every JPG in /public/images/artworks/ to two WebP variants:
 *   <name>.webp       — 1600w, q78  (hero slider + CamPopup)
 *   <name>-thumb.webp — 400w,  q75  (CamGrid 100x100 tiles)
 *
 * Skips files that already have an up-to-date WebP. Run with --force to
 * re-process. JPG originals are left in place; delete separately.
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SRC_DIR = join(__dirname, '..', 'public', 'images', 'artworks');

const FULL_WIDTH = 1600;
const FULL_QUALITY = 78;
const THUMB_WIDTH = 400;
const THUMB_QUALITY = 75;

const force = process.argv.includes('--force');

const files = (await readdir(SRC_DIR))
  .filter((f) => /\.jpe?g$/i.test(f))
  .sort();

if (!existsSync(SRC_DIR)) {
  console.error(`Source dir not found: ${SRC_DIR}`);
  process.exit(1);
}

console.log(`Found ${files.length} JPG(s) in ${SRC_DIR}\n`);

let totalIn = 0;
let totalOut = 0;
let processed = 0;
let skipped = 0;

for (const file of files) {
  const { name } = parse(file);
  // sanitize: strip spaces/parens for cleaner URLs
  const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const srcPath = join(SRC_DIR, file);
  const fullOut = join(SRC_DIR, `${safeName}.webp`);
  const thumbOut = join(SRC_DIR, `${safeName}-thumb.webp`);

  const srcStat = await stat(srcPath);
  totalIn += srcStat.size;

  if (!force && existsSync(fullOut) && existsSync(thumbOut)) {
    const fullStat = await stat(fullOut);
    const thumbStat = await stat(thumbOut);
    totalOut += fullStat.size + thumbStat.size;
    skipped++;
    continue;
  }

  await sharp(srcPath)
    .rotate()
    .resize({ width: FULL_WIDTH, withoutEnlargement: true })
    .webp({ quality: FULL_QUALITY, effort: 5 })
    .toFile(fullOut);

  await sharp(srcPath)
    .rotate()
    .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
    .webp({ quality: THUMB_QUALITY, effort: 5 })
    .toFile(thumbOut);

  const fullStat = await stat(fullOut);
  const thumbStat = await stat(thumbOut);
  totalOut += fullStat.size + thumbStat.size;
  processed++;

  const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
  console.log(
    `  ${file}  →  ${safeName}.webp (${kb(fullStat.size)}) + ${safeName}-thumb.webp (${kb(thumbStat.size)})`,
  );
}

const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;
console.log(
  `\nDone. Processed ${processed}, skipped ${skipped}. Input ${mb(totalIn)} → Output ${mb(totalOut)} (${(
    (totalOut / totalIn) *
    100
  ).toFixed(1)}%)`,
);
