#!/usr/bin/env node
/**
 * Renders the social share card (public/og-image.jpg, 1200×630) and the
 * Apple touch icon (public/apple-touch-icon.png, 180×180).
 *
 * The card is drawn as SVG and rasterised by sharp, so it stays in sync with
 * the site palette without a design tool. Text uses Impact / Arial Narrow —
 * the same stack `--font-display` falls back to when Anton is unavailable —
 * because sharp cannot load webfonts.
 *
 *   node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC = join(__dirname, '..', 'public');

const INK = '#050505';
const INK_2 = '#0e0e0e';
const PAPER = '#f2efe6';
const PAPER_2 = '#d9d6cc';
const MUTE = '#6b6b66';
const SIGNAL = '#e11515';

const W = 1200;
const H = 630;
const PAD = 72;

const DISPLAY = "Impact, 'Arial Narrow', 'Helvetica Neue', Helvetica, sans-serif";
const MONO = "'Courier New', Courier, monospace";

const TITLE_LINES = ['OFFICIAL.', 'UNOFFICIAL.', 'BELARUS.'];
const TITLE_SIZE = 116;
const TITLE_LEADING = 108;

/** Faint horizontal scanlines, matching the .scanlines treatment in the UI. */
const scanlines = () => {
  const lines = [];
  for (let y = 0; y < H; y += 4) {
    lines.push(`<rect x="0" y="${y}" width="${W}" height="1" fill="#000" opacity="0.22"/>`);
  }
  return lines.join('');
};

const card = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${INK_2}"/>
      <stop offset="100%" stop-color="${INK}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#wash)"/>
  ${scanlines()}
  <rect x="0" y="0" width="${W}" height="8" fill="${SIGNAL}"/>

  <g font-family="${MONO}" font-size="21" letter-spacing="4" fill="${PAPER_2}">
    <circle cx="${PAD + 8}" cy="${PAD + 4}" r="8" fill="${SIGNAL}"/>
    <text x="${PAD + 30}" y="${PAD + 12}">REC</text>
    <text x="${PAD + 108}" y="${PAD + 12}" fill="${MUTE}">CCTV · VENEZIA</text>
  </g>

  <g font-family="${DISPLAY}" font-size="${TITLE_SIZE}" fill="${PAPER}" letter-spacing="-2">
    ${TITLE_LINES.map(
      (line, i) =>
        `<text x="${PAD}" y="${232 + i * TITLE_LEADING}">${line}</text>`,
    ).join('\n    ')}
  </g>

  <rect x="${PAD}" y="${H - 148}" width="${W - PAD * 2}" height="1" fill="#2a2a28"/>

  <g font-family="${MONO}" font-size="23" letter-spacing="3">
    <text x="${PAD}" y="${H - 100}" fill="${PAPER}">BELARUS FREE THEATRE</text>
    <text x="${PAD}" y="${H - 62}" fill="${MUTE}">LA BIENNALE DI VENEZIA · 9 MAY – 22 NOV 2026</text>
  </g>
</svg>`;

const icon = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${INK}"/>
  <text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, serif" font-weight="600"
        font-size="280" fill="#fafaf7" letter-spacing="-12">B</text>
  <circle cx="370" cy="360" r="22" fill="#d11a1a"/>
</svg>`;

const ogPath = join(PUBLIC, 'og-image.jpg');
const iconPath = join(PUBLIC, 'apple-touch-icon.png');

const og = await sharp(Buffer.from(card()))
  .jpeg({ quality: 88, progressive: true, chromaSubsampling: '4:4:4' })
  .toBuffer();
await writeFile(ogPath, og);

const touch = await sharp(Buffer.from(icon())).png({ compressionLevel: 9 }).toBuffer();
await writeFile(iconPath, touch);

console.log(`og-image.jpg        ${W}×${H}  ${(og.length / 1024).toFixed(0)}KB`);
console.log(`apple-touch-icon.png 180×180  ${(touch.length / 1024).toFixed(0)}KB`);
