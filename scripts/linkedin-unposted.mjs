/**
 * linkedin-unposted.mjs
 *
 * Diffs content/posts against data/linkedin-posted.json and prints what
 * hasn't been shared to LinkedIn yet, oldest article first.
 *
 * Usage:
 *   node scripts/linkedin-unposted.mjs
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const POSTS_DIR = resolve(ROOT, "content", "posts");
const POSTED_LOG_PATH = resolve(ROOT, "data", "linkedin-posted.json");

function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s/.test(line)) continue; // skip nested/indented YAML keys (e.g. author.title)
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) fm[key] = val;
  }
  return fm;
}

const slugs = readdirSync(POSTS_DIR)
  .filter((f) => f.endsWith(".md"))
  .map((f) => f.replace(/\.md$/, ""));

const articles = slugs
  .map((slug) => {
    const fm = parseFrontmatter(readFileSync(resolve(POSTS_DIR, `${slug}.md`), "utf8"));
    return { slug, title: fm.title ?? slug, publishDate: fm.publishDate ?? "", draft: fm.draft === "true" };
  })
  .filter((a) => !a.draft);

const posted = existsSync(POSTED_LOG_PATH) ? JSON.parse(readFileSync(POSTED_LOG_PATH, "utf8")) : [];
const postedSlugs = new Set(posted.map((p) => p.slug));

const unposted = articles
  .filter((a) => !postedSlugs.has(a.slug))
  .sort((a, b) => new Date(a.publishDate) - new Date(b.publishDate));

console.log(`\n📊  ${articles.length} live articles · ${postedSlugs.size} posted to LinkedIn · ${unposted.length} pending\n`);

if (unposted.length === 0) {
  console.log("✅  Nothing pending — all live articles have been posted.\n");
  process.exit(0);
}

console.log("── Unposted, oldest first ────────────────────────────────────────\n");
unposted.forEach((a, i) => {
  console.log(`${i + 1}. ${a.title}`);
  console.log(`   slug: ${a.slug}   published: ${a.publishDate || "unknown"}`);
});

console.log(`\nNext to run:\n  node scripts/linkedin-post.mjs ${unposted[0].slug}\n`);
