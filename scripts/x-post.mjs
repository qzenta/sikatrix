/**
 * x-post.mjs
 *
 * Posts a Sikatrix article to X (@sikatrix) via the X API v2.
 * Uses OAuth 1.0a — requires user-level tokens (not just Bearer).
 *
 * Usage:
 *   node scripts/x-post.mjs <article-slug>
 *   node scripts/x-post.mjs sars-provisional-tax-guide-2025
 *
 * Required in .env.local:
 *   X_API_KEY          — Consumer Key (from developer.twitter.com)
 *   X_API_SECRET       — Consumer Secret
 *   X_ACCESS_TOKEN     — Access Token  (generated FOR @sikatrix account)
 *   X_ACCESS_TOKEN_SECRET — Access Token Secret
 */

import { createHmac, randomBytes } from "crypto";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const SITE_URL = "https://www.sikatrix.com";

// ── Load .env.local ──────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key) process.env[key] = val;
  }
} catch {
  // rely on shell env vars
}

// ── Validate credentials ─────────────────────────────────────────────────────
const API_KEY           = process.env.X_API_KEY;
const API_SECRET        = process.env.X_API_SECRET;
const ACCESS_TOKEN      = process.env.X_ACCESS_TOKEN;
const ACCESS_SECRET     = process.env.X_ACCESS_TOKEN_SECRET;

if (!API_KEY || !API_SECRET || !ACCESS_TOKEN || !ACCESS_SECRET) {
  console.error(`
❌  Missing X credentials. Add these to .env.local:

  X_API_KEY=<your Consumer Key>
  X_API_SECRET=<your Consumer Secret>
  X_ACCESS_TOKEN=<your Access Token>
  X_ACCESS_TOKEN_SECRET=<your Access Token Secret>

See docs/X_SETUP.md for step-by-step instructions.
`);
  process.exit(1);
}

// ── Read article slug ────────────────────────────────────────────────────────
const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/x-post.mjs <article-slug>");
  process.exit(1);
}

const filePath = resolve(ROOT, "content", "posts", `${slug}.md`);
let raw;
try {
  raw = readFileSync(filePath, "utf8");
} catch {
  console.error(`❌  Cannot find content/posts/${slug}.md`);
  process.exit(1);
}

// ── Parse frontmatter ────────────────────────────────────────────────────────
function parseFrontmatter(src) {
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
  let lastKey = null;

  for (const line of match[1].split("\n")) {
    // YAML list item (e.g. "  - provisional-tax") — append to the preceding key
    if (/^  - /.test(line) && lastKey) {
      const item = line.slice(4).trim();
      fm[lastKey] = fm[lastKey] ? `${fm[lastKey]},${item}` : item;
      continue;
    }
    // Skip all other indented lines (nested objects like author.title)
    if (/^[ \t]/.test(line)) continue;

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (key) {
      fm[key] = val;
      lastKey = val === "" ? key : null; // empty value = YAML list may follow
    }
  }
  return fm;
}

const fm = parseFrontmatter(raw);
const title = fm.title ?? slug;
const articleUrl = `${SITE_URL}/resources/${slug}`;

// Build hashtags from tags
const tags = (fm.tags ?? "")
  .replace(/[\[\]]/g, "")
  .split(",")
  .map((t) => `#${t.trim().replace(/-/g, "").replace(/[^a-zA-Z0-9]/g, "")}`)
  .filter(Boolean)
  .slice(0, 3)
  .join(" ");

// X has a 280-char limit. Build tweet with title + URL + tags.
// Title gets trimmed if needed to fit.
const suffix = `\n\n${articleUrl}\n\n${tags}`;
const maxTitle = 280 - suffix.length - 4; // 4 = safety margin
const trimmedTitle = title.length > maxTitle
  ? title.slice(0, maxTitle - 1) + "…"
  : title;

const tweetText = `${trimmedTitle}${suffix}`;

// ── OAuth 1.0a signing ───────────────────────────────────────────────────────
function percentEncode(str) {
  return encodeURIComponent(String(str))
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

function buildOAuthHeader(method, url, bodyParams = {}) {
  const oauthParams = {
    oauth_consumer_key:     API_KEY,
    oauth_nonce:            randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp:        Math.floor(Date.now() / 1000).toString(),
    oauth_token:            ACCESS_TOKEN,
    oauth_version:          "1.0",
  };

  // Combine oauth + body params, sort, build base string
  const allParams = { ...oauthParams, ...bodyParams };
  const paramString = Object.keys(allParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(allParams[k])}`)
    .join("&");

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(paramString),
  ].join("&");

  const signingKey = `${percentEncode(API_SECRET)}&${percentEncode(ACCESS_SECRET)}`;
  const signature = createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  oauthParams.oauth_signature = signature;

  const headerValue =
    "OAuth " +
    Object.keys(oauthParams)
      .sort()
      .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
      .join(", ");

  return headerValue;
}

// ── Post tweet ───────────────────────────────────────────────────────────────
const TWEET_URL = "https://api.x.com/2/tweets";

async function postTweet(text) {
  const body = JSON.stringify({ text });
  const authHeader = buildOAuthHeader("POST", TWEET_URL);

  const res = await fetch(TWEET_URL, {
    method: "POST",
    headers: {
      Authorization:  authHeader,
      "Content-Type": "application/json",
    },
    body,
  });

  const json = await res.json();

  if (!res.ok) {
    console.error("❌  X API error:", JSON.stringify(json, null, 2));
    process.exit(1);
  }

  return json;
}

// ── Run ──────────────────────────────────────────────────────────────────────
console.log(`\nPosting to X (@sikatrix):\n`);
console.log("─".repeat(60));
console.log(tweetText);
console.log("─".repeat(60));
console.log(`\nCharacter count: ${tweetText.length}/280`);

const result = await postTweet(tweetText);
const tweetId = result?.data?.id;
const tweetUrl = tweetId
  ? `https://x.com/sikatrix/status/${tweetId}`
  : null;

console.log(`\n✅  Posted successfully!`);
if (tweetUrl) console.log(`   ${tweetUrl}`);
