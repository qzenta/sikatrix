/**
 * Creates the 🧠 Daniel's Brain database inside Sikatrix HQ and seeds 8 starter entries.
 * Run once: node scripts/setup-brain.mjs
 * Requires NOTION_TOKEN in .env.local (same token you added to Vercel).
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv dependency needed)
const envPath = resolve(__dirname, "../.env.local");
const envLines = readFileSync(envPath, "utf8").split("\n");
for (const line of envLines) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length && !process.env[key.trim()]) {
    process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
}

const TOKEN = process.env.NOTION_TOKEN?.trim();
if (!TOKEN) {
  console.error("❌ NOTION_TOKEN not found in .env.local");
  process.exit(1);
}

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const CLIENT_REGISTER_DB = "32d8e3e04cde8093afbee879f5a7ce2b";

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": NOTION_VERSION,
};

// ── Step 1: Find parent page by inspecting an existing database ───────────────

async function getParentPageId() {
  const res = await fetch(`${NOTION_API}/databases/${CLIENT_REGISTER_DB}`, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to retrieve Client Register DB (${res.status}): ${text}`);
  }
  const data = await res.json();
  const parent = data.parent;
  if (parent?.type === "page_id") return parent.page_id;
  if (parent?.type === "workspace") {
    // DB is at workspace root — create Brain there too
    return null;
  }
  throw new Error(`Unexpected parent type: ${parent?.type}`);
}

// ── Step 2: Create the Brain database ────────────────────────────────────────

async function createBrainDatabase(parentPageId) {
  const parentObj = parentPageId
    ? { type: "page_id", page_id: parentPageId }
    : { type: "workspace" };

  const body = {
    parent: parentObj,
    icon: { type: "emoji", emoji: "🧠" },
    title: [{ type: "text", text: { content: "🧠 Daniel's Brain" } }],
    properties: {
      Title: { title: {} },
      Project: {
        select: {
          options: [
            { name: "Sikatrix",  color: "blue"   },
            { name: "TiqBooks", color: "green"  },
            { name: "GDSA",     color: "red"    },
            { name: "Erga",     color: "yellow" },
            { name: "Content",  color: "purple" },
            { name: "IBASA",    color: "orange" },
            { name: "Personal", color: "gray"   },
          ],
        },
      },
      "Entry Type": {
        select: {
          options: [
            { name: "Decision",    color: "red"    },
            { name: "Context",     color: "blue"   },
            { name: "Idea",        color: "yellow" },
            { name: "Handoff",     color: "orange" },
            { name: "Outstanding", color: "pink"   },
            { name: "Strategy",    color: "green"  },
            { name: "Reference",   color: "gray"   },
          ],
        },
      },
      Environment: {
        select: {
          options: [
            { name: "Claude.ai", color: "purple" },
            { name: "CC",        color: "blue"   },
            { name: "Both",      color: "green"  },
          ],
        },
      },
      Status: {
        select: {
          options: [
            { name: "Active",      color: "green"  },
            { name: "Archived",    color: "gray"   },
            { name: "Superseded",  color: "red"    },
          ],
        },
      },
      Summary:       { rich_text: {} },
      "Next Action": { rich_text: {} },
      Files:         { rich_text: {} },
      Date:          { date: {} },
      Tags:          { multi_select: { options: [] } },
      "Linked Project DB": { url: {} },
    },
  };

  const res = await fetch(`${NOTION_API}/databases`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create Brain database (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.id;
}

// ── Step 3: Seed entries ──────────────────────────────────────────────────────

function richText(content) {
  // Notion rich_text max 2000 chars per block
  const chunks = [];
  for (let i = 0; i < content.length; i += 1900) {
    chunks.push({ type: "text", text: { content: content.slice(i, i + 1900) } });
  }
  return chunks;
}

function entryProps({ title, project, entryType, environment, status, summary, nextAction, files, date, tags, linkedProjectDb }) {
  const props = {
    Title:          { title: [{ type: "text", text: { content: title } }] },
    Project:        { select: { name: project } },
    "Entry Type":   { select: { name: entryType } },
    Environment:    { select: { name: environment } },
    Status:         { select: { name: status } },
    Summary:        { rich_text: richText(summary) },
  };
  if (nextAction) props["Next Action"] = { rich_text: richText(nextAction) };
  if (files)      props["Files"]       = { rich_text: richText(files) };
  if (date)       props["Date"]        = { date: { start: date } };
  if (tags?.length) props["Tags"]      = { multi_select: tags.map(t => ({ name: t })) };
  if (linkedProjectDb) props["Linked Project DB"] = { url: linkedProjectDb };
  return props;
}

const SEED_ENTRIES = [
  {
    title: "Infrastructure Policy — All Projects",
    project: "Sikatrix",
    entryType: "Strategy",
    environment: "Both",
    status: "Active",
    summary:
      "All projects use: GitHub (source) + Vercel (hosting, auto-deploy from master) + Cloudflare (DNS/CDN, proxied for web, DNS-only for mail) + Brevo HTTP API (transactional email + lightweight CRM via Contacts). " +
      "No external databases — Brevo Contacts serves as the CRM. No Supabase, Firebase, PlanetScale, or similar. " +
      "Stack is fixed across Sikatrix, TiqBooks, GDSA, and Erga. Deviations require explicit instruction. " +
      "Note: Sikatrix still uses Resend (predates policy) — all new projects use Brevo only.",
    tags: ["infrastructure", "policy", "all-projects"],
    date: "2026-05-19",
  },
  {
    title: "Make Automation — Retired, Replaced by Vercel Crons",
    project: "Sikatrix",
    entryType: "Decision",
    environment: "Both",
    status: "Active",
    summary:
      "Make-based automation for Sikatrix client management was abandoned. Replaced with 7 Vercel Cron Jobs living inside the sikatrix Next.js repo (C:\\Users\\Daniel\\Documents\\sikatrix). " +
      "All cron logic is in /api/cron/*.ts, secured with CRON_SECRET bearer token. " +
      "A Make webhook URL still exists (used by publish-post.mjs for blog social posting) but has no active scenario connected to it — social posting is handled by direct API scripts instead.",
    nextAction:
      "Remove Make webhook call from scripts/publish-post.mjs once Facebook + LinkedIn social posting is confirmed stable.",
    files: "vercel.json, /api/cron/*, lib/notion.ts, lib/brevo.ts",
    tags: ["automation", "make", "crons", "sikatrix"],
    date: "2026-05-18",
  },
  {
    title: "Sikatrix Cron Architecture — 7 Live Jobs",
    project: "Sikatrix",
    entryType: "Context",
    environment: "Both",
    status: "Active",
    summary:
      "7 Vercel crons, all live as of 2026-05-18:\n\n" +
      "DAILY (SAST times):\n" +
      "• 5 AM — /api/cron/update-statuses: auto-marks past-due tasks 🔴 Overdue, ≤7 days 🟠 Due Soon\n" +
      "• 7 AM — /api/cron/deadlines: internal digest to daniel@sikatrix.com (overdue + upcoming)\n" +
      "• 8 AM — /api/cron/welcome: welcome email to new Active clients (Welcome Sent=false)\n" +
      "• 9 AM — /api/cron/client-reminders: 7-day deadline reminder to clients (Client Reminders=true)\n" +
      "• 10 AM — /api/cron/engagement: engagement letter + doc checklist (Welcome Sent=true, Engagement Sent=false)\n\n" +
      "MONTHLY (1st of month):\n" +
      "• 6 AM — /api/cron/seed-deadlines: seeds 3-month rolling EMP201 + VAT tasks per client (idempotent)\n" +
      "• 7 AM — /api/cron/monthly-summary: practice digest to daniel@sikatrix.com\n\n" +
      "Client-facing emails BCC daniel@sikatrix.com. Fatal errors trigger sendCronAlert() instantly.",
    files: "vercel.json, api/cron/update-statuses.ts, api/cron/deadlines.ts, api/cron/welcome.ts, api/cron/client-reminders.ts, api/cron/engagement.ts, api/cron/seed-deadlines.ts, api/cron/monthly-summary.ts",
    tags: ["crons", "notion", "automation", "sikatrix", "brevo"],
    date: "2026-05-18",
  },
  {
    title: "Notion Database IDs — Sikatrix HQ",
    project: "Sikatrix",
    entryType: "Reference",
    environment: "Both",
    status: "Active",
    summary:
      "Client Register:           32d8e3e04cde8093afbee879f5a7ce2b\n" +
      "Deadlines & Tasks:         25a14ed22b2044a6921282ada8705a8e\n" +
      "Engagements Log:           32f8e3e04cde80ef814fe20b74d9a12e\n" +
      "SARS Compliance Calendar:  3358e3e04cde81a4b27fce5b66dc48d9\n" +
      "🧠 Daniel's Brain:         (stored in NOTION_BRAIN_DB_ID env var after setup)\n\n" +
      "Notion token env var: NOTION_TOKEN (Sikatrix Make Integration token)\n" +
      "Token is set in Vercel production + .env.local.\n" +
      "Important: Never use emoji strings in Notion API filter bodies — use JS unicode escapes (e.g. \\u{1F7E2}) instead.",
    tags: ["notion", "reference", "database-ids", "sikatrix"],
    date: "2026-05-19",
  },
  {
    title: "TiqBooks — Site Live, Brevo Activation Pending",
    project: "TiqBooks",
    entryType: "Outstanding",
    environment: "CC",
    status: "Active",
    summary:
      "Site live at tiqbooks.vercel.app. Custom domain www.tiqbooks.com DNS configured in Cloudflare (2026-05-16) — may still be propagating. " +
      "Repo: github.com/onukpad/tiqbooks. Folder: C:\\Users\\Daniel\\Documents\\tiqbooks.\n\n" +
      "All Brevo email + CRM code is written and deployed but BREVO_API_KEY is NOT set in Vercel — every form submission fails silently right now. " +
      "Brevo contact lists also need creating: Newsletter, Quote Requests, Contact Forms, Lead Magnets. " +
      "List ID env vars are set to 0 as placeholders.",
    nextAction:
      "1. Get BREVO_API_KEY from app.brevo.com → SMTP & API → API Keys\n" +
      "2. Set in Vercel + .env.local\n" +
      "3. Authenticate tiqbooks.com domain in Brevo (Senders & IPs → Domains)\n" +
      "4. Create 4 Brevo contact lists, note numeric IDs\n" +
      "5. Update BREVO_LIST_* env vars on Vercel (replace 0 placeholders)\n" +
      "6. git commit --allow-empty -m 'activate Brevo' && git push",
    tags: ["tiqbooks", "brevo", "outstanding", "infrastructure"],
    date: "2026-05-19",
  },
  {
    title: "Erga Properties — Next Session Checklist",
    project: "Erga",
    entryType: "Handoff",
    environment: "CC",
    status: "Active",
    summary:
      "Site live on Vercel (erga-properties project). erga.co.za added to Vercel project. " +
      "Axxess → Cloudflare NS change requested 2026-05-16 — may still be propagating. " +
      "Contact form uses Formspree (https://formspree.io/f/mwvaqwvk) — temporary, needs Brevo migration. " +
      "No Brevo setup done yet. No env vars set. TenantRegistrationForm has no backend.\n\n" +
      "Repo: github.com/onukpad/erga-properties. Folder: C:\\Users\\Daniel\\Documents\\erga.\n" +
      "Brand: Navy #1B2A4A, Gold #9A7B2F. Stack: Next.js 16, Tailwind v4, DM Sans + Cormorant Garamond.",
    nextAction:
      "1. Confirm Cloudflare NS propagated for erga.co.za\n" +
      "2. Set DNS in Cloudflare: A @ → 76.76.21.21 (proxied), A www (proxied), A mail DNS-only, MX, Brevo DKIM/DMARC\n" +
      "3. Authenticate info@erga.co.za in Brevo, get BREVO_API_KEY\n" +
      "4. Add lib/email.ts (Brevo pattern — copy from tiqbooks)\n" +
      "5. Replace ContactForm Formspree → Brevo server action\n" +
      "6. Wire TenantRegistrationForm to email backend",
    tags: ["erga", "infrastructure", "outstanding", "handoff", "brevo"],
    date: "2026-05-19",
  },
  {
    title: "Content Monetisation — Faceless YouTube + X Strategy",
    project: "Content",
    entryType: "Strategy",
    environment: "Claude.ai",
    status: "Active",
    summary:
      "Separate media property from Sikatrix. Faceless YouTube channel (name TBD — shortlist generated, not yet finalised) + X (Twitter) as content feeder.\n\n" +
      "Content angle: Finance + humor — 'Financially Literate Comedy'.\n\n" +
      "Planned automation stack:\n" +
      "• Claude — script writing\n" +
      "• ElevenLabs — voice (Daniel — clean, balanced, clear)\n" +
      "• InVideo or Pictory — video production\n" +
      "• Buffer — scheduling (API key: 4UO1F5APEMrf9q91IkBS1YAqZbNFd-Yxe9wdnHsUTbV)\n\n" +
      "Keep this channel identity completely separate from Sikatrix brand. No face on camera — faceless content only.",
    nextAction:
      "1. Select final channel name\n" +
      "2. Create YouTube Brand Account (separate from personal Google)\n" +
      "3. Write and produce first video script with Claude\n" +
      "4. Set up ElevenLabs voice clone",
    tags: ["content", "youtube", "x", "monetisation", "strategy", "faceless"],
    date: "2026-05-19",
  },
  {
    title: "Brain Layer Design — Phase 1 & 2 Plan",
    project: "Personal",
    entryType: "Decision",
    environment: "Both",
    status: "Active",
    summary:
      "Building a second brain layer across all projects to replace ad-hoc context sharing between Claude.ai and CC sessions.\n\n" +
      "Phase 1 (current): Brain database lives inside Sikatrix HQ in Notion. createBrainEntry() helper in lib/notion.ts. NOTION_BRAIN_DB_ID env var. Accessed via sikatrix repo infrastructure.\n\n" +
      "Phase 2 (future): Extract to standalone private repo 'daniel-brain' under onukpad on GitHub. Deploy as separate Vercel project (e.g. brain.sikatrix.com or brain.tiqbooks.com). " +
      "Endpoints: POST /brain/entry, GET /brain/query?q=, GET /brain/context?project=. " +
      "Secured with its own BRAIN_SECRET key. Queryable from any Claude session via fetch.",
    nextAction:
      "Phase 1: Complete (this session — setup-brain.mjs run, helper added, 8 entries seeded).\n" +
      "Phase 2: Schedule when brain has 20+ entries and the query/context pattern is clear. " +
      "Create repo daniel-brain under onukpad, scaffold Next.js 15 app, wire to same NOTION_TOKEN.",
    tags: ["brain-layer", "architecture", "personal", "strategy", "notion"],
    date: "2026-05-19",
  },
];

async function createEntry(dbId, entry) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: entryProps(entry),
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create entry "${entry.title}" (${res.status}): ${text}`);
  }
  return await res.json();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🧠 Setting up Daniel's Brain database...\n");

  console.log("1/3  Finding Sikatrix HQ parent page...");
  const parentPageId = await getParentPageId();
  console.log(`     Parent: ${parentPageId ?? "workspace root"}`);

  console.log("2/3  Creating Brain database...");
  const brainDbId = await createBrainDatabase(parentPageId);
  console.log(`     ✅ Brain DB created: ${brainDbId}\n`);

  console.log("3/3  Seeding entries...");
  for (const entry of SEED_ENTRIES) {
    await createEntry(brainDbId, entry);
    console.log(`     ✅ ${entry.title}`);
  }

  console.log("\n─────────────────────────────────────────────────");
  console.log("✅  Brain database is live!\n");
  console.log("Next steps:");
  console.log(`  1. Add to .env.local:`);
  console.log(`     NOTION_BRAIN_DB_ID=${brainDbId}`);
  console.log(`  2. Add to Vercel env vars:`);
  console.log(`     vercel env add NOTION_BRAIN_DB_ID production`);
  console.log(`     (paste: ${brainDbId})`);
  console.log(`  3. git push to deploy the updated lib/notion.ts`);
  console.log("─────────────────────────────────────────────────\n");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
