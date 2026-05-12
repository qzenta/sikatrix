/**
 * publish-post.mjs
 *
 * Run after adding a new article to fire the Make webhook,
 * which routes the post to Buffer → LinkedIn, Facebook, X.
 *
 * Usage:
 *   node scripts/publish-post.mjs sars-provisional-tax-guide-2025
 *
 * Requires MAKE_WEBHOOK_URL in your environment or .env.local
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = "https://sikatrix.com";

// ── Load .env.local if present ───────────────────────────────────────────────
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
  }
} catch {
  // .env.local not present — rely on shell env vars
}

// ── Args ─────────────────────────────────────────────────────────────────────
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/publish-post.mjs <article-slug>");
  process.exit(1);
}

const webhookUrl = process.env.MAKE_WEBHOOK_URL;
if (!webhookUrl) {
  console.error("Error: MAKE_WEBHOOK_URL not set in .env.local or environment.");
  process.exit(1);
}

// ── Read article frontmatter ─────────────────────────────────────────────────
const filePath = resolve(ROOT, "content", "posts", `${slug}.md`);
let raw;
try {
  raw = readFileSync(filePath, "utf8");
} catch {
  console.error(`Error: Cannot find content/posts/${slug}.md`);
  process.exit(1);
}

function parseFrontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) fm[key] = val;
  }
  return fm;
}

const fm = parseFrontmatter(raw);
const articleUrl = `${SITE_URL}/resources/${slug}`;

// ── Build snippets ────────────────────────────────────────────────────────────
const tags = (fm.tags ?? "")
  .replace(/[\[\]]/g, "")
  .split(",")
  .map((t) => `#${t.trim().replace(/-/g, "")}`)
  .slice(0, 4)
  .join(" ");

const linkedinSnippet = [
  fm.title ?? slug,
  "",
  fm.description ?? "",
  "",
  "Full guide here:",
  `→ ${articleUrl}`,
  "",
  `${tags} #SouthAfrica #Accounting #SME #SARS`,
].join("\n");

const desc = fm.description ?? "";
const xSnippet = `${desc.length > 200 ? desc.slice(0, 199) + "…" : desc}\n\n${articleUrl}`;

const facebookSnippet = [
  fm.title ?? slug,
  "",
  fm.description ?? "",
  "",
  `Read the full guide: ${articleUrl}`,
].join("\n");

// ── Payload ───────────────────────────────────────────────────────────────────
const payload = {
  slug,
  url: articleUrl,
  title: fm.title ?? slug,
  description: fm.description ?? "",
  category: fm.category ?? "",
  topicCluster: fm.topicCluster ?? "",
  platforms: ["linkedin", "facebook", "x"],
  linkedinSnippet,
  xSnippet,
  facebookSnippet,
};

// ── Fire webhook ──────────────────────────────────────────────────────────────
console.log(`\nFiring Make webhook for: ${slug}`);
console.log(`URL: ${articleUrl}\n`);

const res = await fetch(webhookUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

if (res.ok) {
  console.log("✓ Make webhook called successfully.");
  console.log("\n── LinkedIn copy ──────────────────────────────────");
  console.log(linkedinSnippet);
  console.log("\n── X copy ─────────────────────────────────────────");
  console.log(xSnippet);
  console.log("\n── Facebook copy ───────────────────────────────────");
  console.log(facebookSnippet);
} else {
  console.error("✗ Webhook call failed:", res.status, await res.text());
  process.exit(1);
}
