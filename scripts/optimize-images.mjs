#!/usr/bin/env node
/**
 * Converts every JPG/PNG under /public/images/<set>/ into WebP:
 *   <name>.webp       — full-width WebP  (hero slider, popup, portrait card)
 *   <name>-thumb.webp — thumb WebP       (grid tiles; set thumbWidth=0 to skip)
 *
 * Sets are configured below. Skips files that already have an up-to-date
 * WebP; pass --force to re-process. Originals stay in place.
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const IMAGES_ROOT = join(__dirname, '..', 'public', 'images');

const SETS = [
  { dir: 'artworks',     fullWidth: 1600, fullQuality: 78, thumbWidth: 400, thumbQuality: 75 },
  // Participants: shown only at full size; no thumb consumer in the UI.
  { dir: 'participants', fullWidth: 1200, fullQuality: 82, thumbWidth: 0,   thumbQuality: 0  },
  // Works: catalogue tiles in the Works section; rendered up to ~500px wide.
  { dir: 'works',        fullWidth: 1000, fullQuality: 80, thumbWidth: 0,   thumbQuality: 0  },
];

const force = process.argv.includes('--force');
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;
const mb = (n) => `${(n / 1024 / 1024).toFixed(1)}MB`;

let grandIn = 0;
let grandOut = 0;

for (const set of SETS) {
  const srcDir = join(IMAGES_ROOT, set.dir);
  if (!existsSync(srcDir)) {
    console.warn(`Skipping ${set.dir} — directory not found.`);
    continue;
  }

  const files = (await readdir(srcDir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  console.log(`\n[${set.dir}] Found ${files.length} source image(s) in ${srcDir}`);

  let processed = 0;
  let skipped = 0;
  let totalIn = 0;
  let totalOut = 0;

  const wantThumb = set.thumbWidth > 0;

  for (const file of files) {
    const { name } = parse(file);
    const safeName = name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const srcPath = join(srcDir, file);
    const fullOut = join(srcDir, `${safeName}.webp`);
    const thumbOut = join(srcDir, `${safeName}-thumb.webp`);

    const srcStat = await stat(srcPath);
    totalIn += srcStat.size;

    const upToDate = existsSync(fullOut) && (!wantThumb || existsSync(thumbOut));
    if (!force && upToDate) {
      totalOut += (await stat(fullOut)).size;
      if (wantThumb) totalOut += (await stat(thumbOut)).size;
      skipped++;
      continue;
    }

    await sharp(srcPath)
      .rotate()
      .resize({ width: set.fullWidth, withoutEnlargement: true })
      .webp({ quality: set.fullQuality, effort: 5 })
      .toFile(fullOut);

    let thumbSize = 0;
    if (wantThumb) {
      await sharp(srcPath)
        .rotate()
        .resize({ width: set.thumbWidth, withoutEnlargement: true })
        .webp({ quality: set.thumbQuality, effort: 5 })
        .toFile(thumbOut);
      thumbSize = (await stat(thumbOut)).size;
    }

    const fullSize = (await stat(fullOut)).size;
    totalOut += fullSize + thumbSize;
    processed++;

    console.log(
      wantThumb
        ? `  ${file}  →  ${safeName}.webp (${kb(fullSize)}) + ${safeName}-thumb.webp (${kb(thumbSize)})`
        : `  ${file}  →  ${safeName}.webp (${kb(fullSize)})`,
    );
  }

  console.log(
    `[${set.dir}] Processed ${processed}, skipped ${skipped}. ${mb(totalIn)} → ${mb(totalOut)}`,
  );
  grandIn += totalIn;
  grandOut += totalOut;
}

console.log(
  `\nTotal: ${mb(grandIn)} → ${mb(grandOut)} (${((grandOut / grandIn) * 100).toFixed(1)}%)`,
);
