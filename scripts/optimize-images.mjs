/**
 * One-off: node scripts/optimize-images.mjs
 * Converts hero slides + partner/footer logos to WebP, downscaled to a
 * sensible retina multiple of their actual display size (Lighthouse flagged
 * these as ~615KB of wasted bytes — oversized PNGs for the box they render in).
 * Requires sharp (already a Next.js dependency). Old PNGs are left in place;
 * remove them manually with `git rm` once the .webp versions are confirmed live.
 */
import sharp from "sharp";
import { statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// { file, targetHeight: null = keep original size, else cap height at this many px }
const jobs = [
  { file: "hero/slide-1.png", targetHeight: null, quality: 80 },
  { file: "hero/slide-2.png", targetHeight: null, quality: 80 },
  { file: "hero/slide-3.png", targetHeight: null, quality: 80 },
  { file: "logo-footer.png", targetHeight: 120, quality: 90 },
  { file: "partners/saipa.png", targetHeight: 90, quality: 90 },
  { file: "partners/ibasa.png", targetHeight: 90, quality: 90 },
  { file: "partners/sars.png", targetHeight: 90, quality: 90 },
  { file: "partners/quickbooks.png", targetHeight: 190, quality: 90 },
  { file: "partners/xero.png", targetHeight: 190, quality: 90 },
  { file: "partners/sage.png", targetHeight: 190, quality: 90 },
  { file: "partners/draftworx.png", targetHeight: 190, quality: 90 },
  { file: "partners/simplepay.png", targetHeight: 190, quality: 90 },
  { file: "partners/syft.png", targetHeight: 190, quality: 90 },
  { file: "partners/cipc.png", targetHeight: 190, quality: 90 },
];

let totalBefore = 0;
let totalAfter = 0;

for (const { file, targetHeight, quality } of jobs) {
  const src = join(publicDir, file);
  const dest = src.replace(/\.png$/, ".webp");
  const before = statSync(src).size;

  let pipeline = sharp(src);
  if (targetHeight) {
    const meta = await sharp(src).metadata();
    if (meta.height > targetHeight) {
      pipeline = pipeline.resize({ height: targetHeight });
    }
  }
  await pipeline.webp({ quality }).toFile(dest);

  const after = statSync(dest).size;
  totalBefore += before;
  totalAfter += after;
  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file} -> ${file.replace(/\.png$/, ".webp")}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB (${saved}% smaller)`);
}

console.log(`\nTotal: ${(totalBefore / 1024).toFixed(0)} KB -> ${(totalAfter / 1024).toFixed(0)} KB (${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}% smaller)`);
console.log("Old .png files left in place — remove with git rm once .webp versions are confirmed live.");
