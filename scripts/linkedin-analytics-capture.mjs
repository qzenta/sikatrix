/**
 * linkedin-analytics-capture.mjs
 *
 * Scrapes per-post analytics from the Sikatrix LinkedIn company page
 * (impressions, members reached, website visits, in-network %) and writes
 * them to the "LinkedIn Post Analytics" Notion database, replacing the
 * previous manual hand-screenshotting workflow.
 *
 * Requires a saved login session - run scripts/linkedin-analytics-login.mjs
 * once first (and again whenever this script reports the session expired).
 *
 * Required env vars in .env.local:
 *   NOTION_TOKEN                 same Notion integration token the other
 *                                 sikatrix scripts already use
 *   LINKEDIN_COMPANY_PAGE_SLUG   optional, defaults to "sikatrix" (from
 *                                 lib/site.ts's linkedin URL) - only needed
 *                                 if the LinkedIn page slug ever changes
 *
 * Usage:
 *   node scripts/linkedin-analytics-capture.mjs
 *
 * IMPORTANT - first run needs supervision: this was built by reading
 * LinkedIn's known analytics-page structure, but it has never been run
 * against a live, logged-in session (no credentials were available to do
 * that). The first real run should be watched (headless: false, see
 * DEBUG_HEADFUL below) to confirm the selectors below still match what
 * LinkedIn actually renders - their DOM/class names change without notice
 * and are not a stable public API.
 */

import { chromium } from "playwright";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STATE_PATH = resolve(ROOT, ".playwright-linkedin-state.json");
const DEBUG_HEADFUL = process.env.LINKEDIN_ANALYTICS_HEADFUL === "1";

// ── Load .env.local ───────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split(/\r?\n/)) {
    const [key, ...rest] = line.split("=");
    if (key?.trim() && rest.length) {
      process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
} catch {
  // rely on shell env
}

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const COMPANY_SLUG = process.env.LINKEDIN_COMPANY_PAGE_SLUG || "sikatrix";
const NOTION_DB_ID = "234185f10e2f468dbc0d648e1acaaec3"; // LinkedIn Post Analytics

if (!existsSync(STATE_PATH)) {
  console.error("❌  No saved LinkedIn session found.");
  console.error("    Run: node scripts/linkedin-analytics-login.mjs");
  process.exit(1);
}
if (!NOTION_TOKEN) {
  console.error("❌  NOTION_TOKEN not set in .env.local");
  process.exit(1);
}

const ANALYTICS_URL = `https://www.linkedin.com/company/${COMPANY_SLUG}/admin/analytics/content/`;

async function scrapePostAnalytics(page) {
  console.log(`\n📊  Loading ${ANALYTICS_URL} ...`);
  await page.goto(ANALYTICS_URL, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(3000); // let the analytics widgets hydrate

  // Session-expiry check: LinkedIn redirects to /login or shows an auth wall.
  if (page.url().includes("/login") || page.url().includes("/authwall")) {
    throw new Error("SESSION_EXPIRED");
  }

  // LinkedIn's admin analytics page lists posts as cards. Selector strategy:
  // find elements that look like post-performance rows and pull the numbers
  // out of their visible text via regex rather than depending on exact class
  // names (those change often; the visible metric labels are more stable).
  const posts = await page.evaluate(() => {
    const results = [];
    // Candidate containers - LinkedIn commonly uses "update-highlight" or
    // "org-content-analytics" prefixed classes for these cards. Try a broad
    // selector and filter by whether it contains recognizable metric text.
    const candidates = document.querySelectorAll(
      '[class*="analytics"] article, [class*="analytics"] li, [class*="content-analytics"] > div'
    );
    for (const el of candidates) {
      const text = el.innerText || "";
      if (!/impression/i.test(text)) continue;

      const grab = (label) => {
        const m = text.match(new RegExp(label + "[\\s\\S]{0,20}?([\\d,]+)", "i"));
        return m ? parseInt(m[1].replace(/,/g, ""), 10) : null;
      };
      const grabPct = (label) => {
        const m = text.match(new RegExp(label + "[\\s\\S]{0,20}?([\\d.]+)\\s*%", "i"));
        return m ? parseFloat(m[1]) : null;
      };

      const titleEl = el.querySelector("a, h3, h4, strong");
      const title = titleEl ? titleEl.innerText.trim().slice(0, 200) : text.trim().slice(0, 100);
      const linkEl = el.querySelector('a[href*="/feed/update/"]');
      const url = linkEl ? linkEl.href : null;

      results.push({
        title,
        url,
        impressions: grab("impression"),
        membersReached: grab("(?:members reached|reach)"),
        websiteVisits: grab("(?:website visit|click)"),
        inNetworkPct: grabPct("in.?network"),
      });
    }
    return results;
  });

  return posts.filter((p) => p.impressions !== null);
}

async function writeToNotion(posts) {
  const today = new Date().toISOString().slice(0, 10);
  let written = 0;

  for (const post of posts) {
    const properties = {
      Post: { title: [{ text: { content: post.title || "(untitled)" } }] },
      "Date Captured": { date: { start: today } },
      Impressions: { number: post.impressions },
      "Members Reached": { number: post.membersReached },
      "Website Visits": { number: post.websiteVisits },
      "In-Network %": post.inNetworkPct != null ? { number: post.inNetworkPct / 100 } : undefined,
      "Post URL": post.url ? { url: post.url } : undefined,
    };
    Object.keys(properties).forEach((k) => properties[k] === undefined && delete properties[k]);

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { database_id: NOTION_DB_ID },
        properties,
      }),
    });

    if (res.ok) {
      written++;
      console.log(`   ✓ ${post.title.slice(0, 60)} — ${post.impressions} impressions`);
    } else {
      console.error(`   ✗ Failed to write "${post.title.slice(0, 60)}": ${res.status} ${await res.text()}`);
    }
  }
  return written;
}

const browser = await chromium.launch({ headless: !DEBUG_HEADFUL });
const context = await browser.newContext({ storageState: STATE_PATH });
const page = await context.newPage();

try {
  const posts = await scrapePostAnalytics(page);

  if (posts.length === 0) {
    console.log("\n⚠️  No posts with recognizable analytics found.");
    console.log("    This likely means LinkedIn changed their page structure since this");
    console.log("    script was written, or the analytics page layout differs from what");
    console.log("    was assumed. Re-run with LINKEDIN_ANALYTICS_HEADFUL=1 to watch it live");
    console.log("    and compare the page against the selectors in scrapePostAnalytics().");
    process.exit(1);
  }

  console.log(`\n📝  Found ${posts.length} post(s) with analytics. Writing to Notion...`);
  const written = await writeToNotion(posts);
  console.log(`\n✅  Wrote ${written}/${posts.length} posts to LinkedIn Post Analytics.`);
} catch (err) {
  if (err.message === "SESSION_EXPIRED") {
    console.error("\n❌  LinkedIn session expired.");
    console.error("    Run: node scripts/linkedin-analytics-login.mjs");
    process.exit(1);
  }
  console.error("\n❌  Capture failed:", err);
  process.exit(1);
} finally {
  await browser.close();
}
