// Generates every raster brand asset from the geometry below, so the icons in
// the extension and the ones in the store listing can never drift apart.
// Run with `pnpm run brand`. Output is committed.
import { mkdir, writeFile } from 'node:fs/promises';
import { createCanvas, encodePng } from './raster.mjs';

export const BRAND = {
  name: 'Plainly',
  tagline: 'Copy and paste without the mess',
  ink: '#16161A',
  accent: '#4F46E5',
  light: '#FFFFFFED'
};

/**
 * Three lines of text, shortest one accented: the universal "plain text" mark,
 * with the accent standing in for the caret you are pasting into. Deliberately
 * the same tile-plus-one-highlight construction as its sibling extension.
 */
function drawMark(canvas) {
  const s = canvas.size;
  canvas.roundRect(0, 0, s, s, s * 0.2232, BRAND.ink);
  const h = s * 0.094;
  const x = s * 0.203;
  const rows = [
    [s * 0.297, s * 0.594, BRAND.light],
    [s * 0.453, s * 0.469, BRAND.light],
    [s * 0.609, s * 0.297, BRAND.accent]
  ];
  for (const [y, width, color] of rows) canvas.roundRect(x, y, width, h, h / 2, color);
  return canvas;
}

export function icon(size) {
  const canvas = createCanvas(size);
  drawMark(canvas);
  return encodePng(canvas.toRGBA(), size);
}

export const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128" role="img" aria-label="${BRAND.name}">
  <rect width="128" height="128" rx="28.57" fill="${BRAND.ink}"/>
  <rect x="26" y="38" width="76" height="12" rx="6" fill="#ffffff" fill-opacity="0.93"/>
  <rect x="26" y="58" width="60" height="12" rx="6" fill="#ffffff" fill-opacity="0.93"/>
  <rect x="26" y="78" width="38" height="12" rx="6" fill="${BRAND.accent}"/>
</svg>
`;

const SIZES = [16, 32, 48, 128];

await mkdir('public', { recursive: true });
await mkdir('brand', { recursive: true });
for (const size of SIZES) await writeFile(`public/icon-${size}.png`, icon(size));
await writeFile('brand/logo.svg', LOGO_SVG);
console.log(`Brand assets: ${SIZES.map(s => `icon-${s}.png`).join(', ')} + brand/logo.svg`);
