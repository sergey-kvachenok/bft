/**
 * Generate a print-ready QR code pointing at a URL.
 *
 * Usage:
 *   node scripts/generate-qr.mjs https://your-deployed-url.example.com
 *
 * Outputs to ./qr/ :
 *   - qr.svg  (vector with center logo from public/icon.svg — recommended for print)
 *   - qr.png  (2048×2048, logo-free — export the SVG to PNG if you need a logo'd raster)
 *   - qr.txt  (the source URL, for the record)
 *
 * Error correction "H" (~30%) means the code stays scannable even if up to
 * a third of it is smudged or obscured — which is also what makes the
 * center logo overlay safe.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
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
const logoPath = new URL('../public/icon.svg', import.meta.url);
await mkdir(outDir, { recursive: true });

const DARK = '#0a0a0a';
const LIGHT = '#ffffff';
const MARGIN = 2; // quiet zone in modules
const LOGO_FRACTION = 0.2; // logo width as fraction of code width — 20% sits inside the ~30% H-level budget
const KNOCKOUT_PAD = 1; // white padding (in modules) around the logo

// 1. Logo-free PNG via the qrcode library (unchanged behavior).
await QRCode.toFile(new URL('qr.png', outDir).pathname, url, {
  errorCorrectionLevel: 'H',
  margin: MARGIN,
  width: 2048,
  type: 'png',
  color: { dark: DARK, light: LIGHT },
});

// 2. Build SVG manually so we can overlay the logo.
const qr = QRCode.create(url, { errorCorrectionLevel: 'H' });
const moduleCount = qr.modules.size;
const data = qr.modules.data; // Uint8Array, 1 = dark
const totalSize = moduleCount + MARGIN * 2;

let modules = '';
for (let y = 0; y < moduleCount; y++) {
  for (let x = 0; x < moduleCount; x++) {
    if (data[y * moduleCount + x]) {
      modules += `<rect x="${x + MARGIN}" y="${y + MARGIN}" width="1" height="1"/>`;
    }
  }
}

// Center the logo on an integer module boundary so edges stay crisp.
let logoSize = Math.round(moduleCount * LOGO_FRACTION);
if ((moduleCount - logoSize) % 2 !== 0) logoSize += 1; // match parity so center is exact
const logoStart = MARGIN + (moduleCount - logoSize) / 2;
const knockoutStart = logoStart - KNOCKOUT_PAD;
const knockoutSize = logoSize + KNOCKOUT_PAD * 2;

const logoRaw = await readFile(logoPath, 'utf8');
const logoMatch = logoRaw.match(/<svg([^>]*)>([\s\S]*)<\/svg>/);
if (!logoMatch) {
  throw new Error(`Could not parse logo at ${logoPath.pathname}`);
}
const viewBoxMatch = logoMatch[1].match(/viewBox="([^"]+)"/);
const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 512 512';
const logoInner = logoMatch[2];

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges">
  <rect width="${totalSize}" height="${totalSize}" fill="${LIGHT}"/>
  <g fill="${DARK}">${modules}</g>
  <rect x="${knockoutStart}" y="${knockoutStart}" width="${knockoutSize}" height="${knockoutSize}" fill="${LIGHT}"/>
  <svg x="${logoStart}" y="${logoStart}" width="${logoSize}" height="${logoSize}" viewBox="${logoViewBox}" preserveAspectRatio="xMidYMid meet">${logoInner}</svg>
</svg>
`;

await writeFile(new URL('qr.svg', outDir), svg, 'utf8');
await writeFile(new URL('qr.txt', outDir), `${url}\n`, 'utf8');

console.log(`✓ Generated qr.svg (vector, with logo), qr.png (2048×2048, no logo), qr.txt`);
console.log(`  → ${outDir.pathname}`);
console.log(`  Target: ${url}`);
console.log(`  Logo:   ${logoPath.pathname} (${Math.round(LOGO_FRACTION * 100)}% of code width)`);
