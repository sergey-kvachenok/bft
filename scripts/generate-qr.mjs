/**
 * Generate a print-ready QR code pointing at a URL.
 *
 * Usage:
 *   node scripts/generate-qr.mjs https://your-deployed-url.example.com
 *
 * Outputs to ./qr/ :
 *   - qr.png  (2048×2048, ink on paper, level-H error correction)
 *   - qr.svg  (vector — best for any print size)
 *   - qr.txt  (the source URL, for the record)
 *
 * Error correction "H" (~30%) means the code stays scannable even if up to
 * a third of it is smudged or obscured — recommended for posters.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import QRCode from 'qrcode';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/generate-qr.mjs <url>');
  console.error('Example: node scripts/generate-qr.mjs https://foo.vercel.app');
  process.exit(1);
}

try {
  new URL(url);
} catch {
  console.error(`Not a valid URL: ${url}`);
  process.exit(1);
}

const outDir = new URL('../qr/', import.meta.url);
await mkdir(outDir, { recursive: true });

const baseOpts = {
  errorCorrectionLevel: 'H',
  margin: 2,
  color: {
    dark: '#0a0a0a',
    light: '#ffffff',
  },
};

await QRCode.toFile(new URL('qr.png', outDir).pathname, url, {
  ...baseOpts,
  width: 2048,
  type: 'png',
});

const svg = await QRCode.toString(url, { ...baseOpts, type: 'svg' });
await writeFile(new URL('qr.svg', outDir), svg, 'utf8');

await writeFile(new URL('qr.txt', outDir), `${url}\n`, 'utf8');

console.log(`✓ Generated qr.png (2048×2048), qr.svg (vector), qr.txt`);
console.log(`  → ${outDir.pathname}`);
console.log(`  Target: ${url}`);
