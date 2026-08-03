/**
 * Round 2 image optimization — Lighthouse still flagged these as oversized
 * for their actual rendered dimensions plus using too-high a WebP quality.
 * Run once: node scripts/compress-images-round2.mjs
 */
import sharp from "sharp";
import { statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

// [file, maxWidth (null = keep current width), webp quality]
const jobs = [
  ["logo-footer.webp", 380, 68],
  ["partners/sars.webp", 300, 68],
  ["partners/saipa.webp", 300, 68],
  ["partners/ibasa.webp", 300, 68],
  ["partners/cipc.webp", 290, 68],
  ["hero/slide-1.webp", null, 72],
  ["hero/slide-2.webp", null, 72],
  ["hero/slide-3.webp", null, 72],
];

const { writeFileSync, renameSync, unlinkSync } = await import("fs");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function renameWithRetry(from, to, attempts = 10) {
  for (let i = 0; i < attempts; i++) {
    try {
      renameSync(from, to);
      return;
    } catch (e) {
      if (i === attempts - 1) throw e;
      await sleep(1000); // real async delay -- Windows Defender needs the event loop free to finish its scan
    }
  }
}

for (const [file, maxWidth, quality] of jobs) {
  const src = join(publicDir, file);
  const before = statSync(src).size;

  let pipeline = sharp(src);
  if (maxWidth) {
    const meta = await sharp(src).metadata();
    if (meta.width > maxWidth) pipeline = pipeline.resize({ width: maxWidth });
  }
  const buffer = await pipeline.webp({ quality, effort: 6 }).toBuffer();

  writeFileSync(src + ".tmp", buffer);
  await renameWithRetry(src + ".tmp", src);

  const after = statSync(src).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  console.log(`${file}: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB  (${saved}% smaller)`);
}

// draftworx.png -> draftworx.webp (format conversion, needs a code reference update)
{
  const src = join(publicDir, "partners/draftworx.png");
  const dest = join(publicDir, "partners/draftworx.webp");
  const before = statSync(src).size;
  const buffer = await sharp(src).webp({ quality: 68, effort: 6 }).toBuffer();
  writeFileSync(dest, buffer);
  const after = statSync(dest).size;
  unlinkSync(src);
  console.log(`partners/draftworx.png -> draftworx.webp: ${(before / 1024).toFixed(1)} KB -> ${(after / 1024).toFixed(1)} KB`);
}

console.log("\nDone. No .bak backups this round -- source files are already committed to git, revert via git if needed.");
