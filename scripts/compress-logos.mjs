/**
 * Run once: node scripts/compress-logos.mjs
 * Requires sharp (already a Next.js dependency).
 * Backs up originals as logo.png.bak / logo-footer.png.bak before overwriting.
 */
import sharp from "sharp";
import { copyFileSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const logos = ["logo.png", "logo-footer.png"];

for (const file of logos) {
  const src = join(publicDir, file);
  const bak = src + ".bak";

  const before = statSync(src).size;
  copyFileSync(src, bak);

  await sharp(src)
    .png({ compressionLevel: 9, effort: 10, palette: true })
    .toFile(src + ".tmp");

  // Rename .tmp → original
  const { renameSync } = await import("fs");
  renameSync(src + ".tmp", src);

  const after = statSync(src).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file}: ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB  (${saved}% smaller)`);
}

console.log("\nOriginals backed up as *.bak — delete once you've verified.");
