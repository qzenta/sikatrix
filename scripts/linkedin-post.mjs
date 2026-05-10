/**
 * linkedin-post.mjs
 *
 * Posts an article directly to the Sikatrix LinkedIn company page using
 * the LinkedIn API v2. No Make/Buffer needed.
 *
 * Usage:
 *   node scripts/linkedin-post.mjs <article-slug>
 *   node scripts/linkedin-post.mjs sars-provisional-tax-guide-2025
 *
 * Required env vars in .env.local:
 *   LINKEDIN_ACCESS_TOKEN   — 60-day OAuth token (see LINKEDIN_SETUP.md)
 *   LINKEDIN_AUTHOR_URN     — urn:li:organization:XXXXXXXX  (company page)
 *                              OR urn:li:person:XXXXXXXX     (personal profile)
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = "https://www.sikatrix.com";

// ── Load .env.local ───────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key?.trim() && rest.length) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // .env.local not present — rely on shell env
}

// ── Validate env ──────────────────────────────────────────────────────────────
const token = process.env.LINKEDIN_ACCESS_TOKEN;
const authorUrn = process.env.LINKEDIN_AUTHOR_URN;

if (!token) {
  console.error("❌  LINKEDIN_ACCESS_TOKEN is not set.");
  console.error("    Run: node scripts/linkedin-auth.mjs   (then follow the prompts)");
  process.exit(1);
}
if (!authorUrn) {
  console.error("❌  LINKEDIN_AUTHOR_URN is not set.");
  console.error("    Add it to .env.local — see docs/LINKEDIN_SETUP.md");
  process.exit(1);
}

// ── Args ──────────────────────────────────────────────────────────────────────
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/linkedin-post.mjs <article-slug>");
  process.exit(1);
}

// ── Read article frontmatter ──────────────────────────────────────────────────
const filePath = resolve(ROOT, "content", "posts", `${slug}.md`);
let raw;
try {
  raw = readFileSync(filePath, "utf8");
} catch {
  console.error(`❌  Cannot find content/posts/${slug}.md`);
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

const tags = (fm.tags ?? "")
  .replace(/[\[\]]/g, "")
  .split(",")
  .map((t) => `#${t.trim().replace(/-/g, "")}`)
  .filter(Boolean)
  .slice(0, 4)
  .join(" ");

const commentary = [
  fm.title ?? slug,
  "",
  fm.description ?? "",
  "",
  "Read the full guide on our website:",
  `→ ${articleUrl}`,
  "",
  `${tags} #SouthAfrica #Accounting #SME #SARS #TaxTips`,
].join("\n");

// ── Build LinkedIn post payload ───────────────────────────────────────────────
const payload = {
  author: authorUrn,
  commentary,
  visibility: "PUBLIC",
  distribution: {
    feedDistribution: "MAIN_FEED",
    targetEntities: [],
    thirdPartyDistributionChannels: [],
  },
  content: {
    article: {
      source: articleUrl,
      title: fm.title ?? slug,
      description: (fm.description ?? "").slice(0, 250),
    },
  },
  lifecycleState: "PUBLISHED",
  isReshareDisabledByAuthor: false,
};

// ── Post to LinkedIn ──────────────────────────────────────────────────────────
console.log(`\n📤  Posting to LinkedIn: "${fm.title ?? slug}"`);
console.log(`    Article URL : ${articleUrl}`);
console.log(`    Author URN  : ${authorUrn}\n`);

const res = await fetch("https://api.linkedin.com/rest/posts", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "LinkedIn-Version": "202501",
    "X-Restli-Protocol-Version": "2.0.0",
  },
  body: JSON.stringify(payload),
});

if (res.ok || res.status === 201) {
  const location = res.headers.get("x-restli-id") || res.headers.get("location") || "(check LinkedIn)";
  console.log("✅  Posted successfully!");
  console.log(`    LinkedIn post ID: ${location}`);
  console.log("\n── Post copy preview ────────────────────────────────");
  console.log(commentary);
} else {
  const body = await res.text();
  console.error(`❌  LinkedIn API error ${res.status}:`);
  console.error(body);
  if (res.status === 401) {
    console.error("\n💡  Token expired? Re-run: node scripts/linkedin-auth.mjs");
  }
  process.exit(1);
}
