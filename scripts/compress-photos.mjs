/**
 * Compress photos in public/photos/ to web-appropriate sizes.
 * Run once after dropping raw photos into the folder:
 *   node scripts/compress-photos.mjs
 */

import sharp from "sharp";
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = join(__dirname, "..", "public", "photos");

const DIRS = [
  { dir: join(ROOT, "services"),   width: 1600, height: 900  },
  { dir: join(ROOT, "industries"), width: 1600, height: 900  },
];

const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function compress(filePath, width, height) {
  const before = (await stat(filePath)).size;

  await sharp(filePath)
    .resize(width, height, { fit: "cover", position: "attention" })
    .jpeg({ quality: 78, progressive: true, mozjpeg: true })
    .toFile(filePath + ".tmp");

  // Replace original with compressed version
  const { rename } = await import("fs/promises");
  await rename(filePath + ".tmp", filePath);

  const after = (await stat(filePath)).size;
  const pct = Math.round((1 - after / before) * 100);
  console.log(`  ✓ ${basename(filePath)}: ${kb(before)} → ${kb(after)} (-${pct}%)`);
}

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

let total = 0;
for (const { dir, width, height } of DIRS) {
  let files;
  try { files = await readdir(dir); } catch { continue; }

  const images = files.filter((f) => IMAGE_EXTS.has(extname(f).toLowerCase()) && !f.startsWith("."));
  if (!images.length) continue;

  console.log(`\n${dir.replace(ROOT, "photos")}/`);
  for (const file of images) {
    await compress(join(dir, file), width, height);
    total++;
  }
}

console.log(`\nDone — ${total} photo(s) compressed.`);
