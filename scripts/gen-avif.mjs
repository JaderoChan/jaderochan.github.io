/**
 * gen-avif.mjs
 * Usage: node scripts/gen-avif.mjs <image-path> [<image-path> ...]
 * Generates 480/800/1200/1800px AVIF variants alongside each source image.
 */
import { access } from 'node:fs/promises';
import { dirname, basename, extname, join } from 'node:path';
import sharp from 'sharp';

const WIDTHS = [480, 800, 1200, 1800];

const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error('Usage: node scripts/gen-avif.mjs <image-path> [<image-path> ...]');
  process.exit(1);
}

async function genAvif(src) {
  try {
    await access(src);
  } catch {
    console.error(`  ✗ not found: ${src}`);
    return;
  }

  const dir = dirname(src);
  const stem = basename(src, extname(src));

  for (const w of WIDTHS) {
    const dest = join(dir, `${stem}-${w}.avif`);
    await sharp(src)
      .resize(w, null, { withoutEnlargement: true })
      .avif({ quality: 72 })
      .toFile(dest);
    console.log(`  ✓ ${dest}`);
  }
}

for (const src of inputs) {
  console.log(`Processing: ${src}`);
  await genAvif(src);
}
