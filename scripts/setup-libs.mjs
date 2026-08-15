/**
 * setup-libs.mjs
 * One-time download of client-side libraries (marked, KaTeX) into lib/.
 * Already-existing files are skipped, so this is safe to run repeatedly.
 */
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const LIB = join(ROOT, 'lib');

const MARKED_VERSION = '12.0.0';
const KATEX_VERSION = '0.16.11';
const CDN = 'https://cdn.jsdelivr.net/npm';

const KATEX_FONTS = [
  'KaTeX_AMS-Regular.woff2',
  'KaTeX_Caligraphic-Bold.woff2',
  'KaTeX_Caligraphic-Regular.woff2',
  'KaTeX_Fraktur-Bold.woff2',
  'KaTeX_Fraktur-Regular.woff2',
  'KaTeX_Main-Bold.woff2',
  'KaTeX_Main-BoldItalic.woff2',
  'KaTeX_Main-Italic.woff2',
  'KaTeX_Main-Regular.woff2',
  'KaTeX_Math-BoldItalic.woff2',
  'KaTeX_Math-Italic.woff2',
  'KaTeX_Math-Regular.woff2',
  'KaTeX_SansSerif-Bold.woff2',
  'KaTeX_SansSerif-Italic.woff2',
  'KaTeX_SansSerif-Regular.woff2',
  'KaTeX_Script-Regular.woff2',
  'KaTeX_Size1-Regular.woff2',
  'KaTeX_Size2-Regular.woff2',
  'KaTeX_Size3-Regular.woff2',
  'KaTeX_Size4-Regular.woff2',
  'KaTeX_Typewriter-Regular.woff2'
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download(url, dest, label) {
  if (await exists(dest)) { console.log(`  skip (exists) ${label}`); return; }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status}: ${url}`);
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`  ✓ ${label}`);
}

async function main() {
  const markedDir = join(LIB, 'marked');
  const katexDir = join(LIB, 'katex');
  const katexFontsDir = join(katexDir, 'fonts');
  const katexContribDir = join(katexDir, 'contrib');

  await mkdir(markedDir, { recursive: true });
  await mkdir(katexFontsDir, { recursive: true });
  await mkdir(katexContribDir, { recursive: true });

  console.log('Downloading marked...');
  await download(
    `${CDN}/marked@${MARKED_VERSION}/marked.min.js`,
    join(markedDir, 'marked.min.js'),
    `marked@${MARKED_VERSION}`
  );

  console.log('Downloading KaTeX...');
  const katexBase = `${CDN}/katex@${KATEX_VERSION}/dist`;
  await download(`${katexBase}/katex.min.js`,  join(katexDir, 'katex.min.js'),  `katex@${KATEX_VERSION} JS`);
  await download(`${katexBase}/katex.min.css`, join(katexDir, 'katex.min.css'), `katex@${KATEX_VERSION} CSS`);
  await download(
    `${katexBase}/contrib/auto-render.min.js`,
    join(katexContribDir, 'auto-render.min.js'),
    'katex auto-render'
  );

  console.log('Downloading KaTeX fonts...');
  for (const font of KATEX_FONTS) {
    await download(`${katexBase}/fonts/${font}`, join(katexFontsDir, font), font);
  }

  console.log('Libraries ready.');
}

main().catch(err => { console.error(err); process.exitCode = 1; });
