/**
 * backfill-sars-links.mjs
 *
 * One-off script: links existing EMP201 and VAT Return tasks in the
 * Deadlines & Tasks DB to the matching SARS Compliance Calendar entry,
 * creating the calendar entry if it doesn't exist yet.
 *
 * Usage:
 *   node scripts/backfill-sars-links.mjs           # dry run
 *   node scripts/backfill-sars-links.mjs --write   # apply changes
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = resolve(__dirname, "..");
const DRY_RUN   = !process.argv.includes("--write");

try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
  }
} catch { /* rely on shell env */ }

const NOTION_TOKEN     = process.env.NOTION_TOKEN?.trim();
if (!NOTION_TOKEN) { console.error("NOTION_TOKEN not set"); process.exit(1); }

const NOTION_API       = "https://api.notion.com/v1";
const NOTION_VER       = "2022-06-28";
const DEADLINES_DB     = "25a14ed22b2044a6921282ada8705a8e";
const SARS_CALENDAR_DB = "3358e3e04cde81a4b27fce5b66dc48d9";

const LINK_TYPES = new Set(["EMP201", "VAT Return"]);

function headers() {
  return { Authorization: `Bearer ${NOTION_TOKEN}`, "Content-Type": "application/json", "Notion-Version": NOTION_VER };
}

async function queryAll(dbId, body = {}) {
  const results = [];
  let cursor;
  do {
    const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: "POST", headers: headers(),
      body: JSON.stringify({ page_size: 100, ...body, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new Error(`Query ${res.status}: ${await res.text()}`);
    const data = await res.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return results;
}

async function patchPage(pageId, properties) {
  const res = await fetch(`${NOTION_API}/pages/${pageId}`, {
    method: "PATCH", headers: headers(),
    body: JSON.stringify({ properties }),
  });
  if (!res.ok) throw new Error(`Patch ${res.status}: ${await res.text()}`);
}

async function main() {
  console.log(`\nSikatrix SARS Backfill ${DRY_RUN ? "(DRY RUN — pass --write to apply)" : "(WRITE MODE)"}\n`);

  // 1. Load existing SARS Calendar entries
  console.log("Loading SARS Calendar...");
  const sarsPages = await queryAll(SARS_CALENDAR_DB);
  const sarsMap = new Map(); // "type|date" → page_id
  for (const p of sarsPages) {
    const type    = p.properties["Obligation Type"]?.select?.name ?? "";
    const dueDate = p.properties["Due Date"]?.date?.start ?? "";
    if (type && dueDate) sarsMap.set(`${type}|${dueDate}`, p.id);
  }
  console.log(`  Found ${sarsMap.size} existing SARS entries.\n`);

  // 2. Load all Deadlines & Tasks
  console.log("Loading tasks...");
  const taskPages = await queryAll(DEADLINES_DB);
  console.log(`  Found ${taskPages.length} tasks total.\n`);

  // 3. Filter to EMP201 and VAT tasks that have no SARS Calendar link yet
  const targets = taskPages.filter(p => {
    const props    = p.properties;
    const taskType = props["Task Type"]?.select?.name ?? "";
    const linked   = (props["SARS Calendar"]?.relation ?? []).length > 0;
    return LINK_TYPES.has(taskType) && !linked;
  });

  console.log(`Tasks needing SARS Calendar link: ${targets.length}\n`);
  if (targets.length === 0) { console.log("Nothing to do.\n"); return; }

  let linked = 0, created = 0, failed = 0;

  for (const page of targets) {
    const props    = page.properties;
    const taskType = props["Task Type"]?.select?.name ?? "";
    const taskName = props["Task Name"]?.title?.[0]?.plain_text ?? "";
    const dueDate  = props["Due Date"]?.date?.start ?? "";

    if (!dueDate) { console.log(`  ⚠  Skipping "${taskName}" — no due date`); continue; }

    // Derive SARS Calendar entry name
    const sarsName = taskType === "EMP201"
      ? taskName.replace(/^EMP201/, "PAYE/UIF/SDL")
      : taskName; // VAT Return — same name

    const key = `${taskType}|${dueDate}`;

    console.log(`  ${taskType.padEnd(12)} ${dueDate}  →  "${sarsName}"`);

    if (DRY_RUN) { linked++; continue; }

    try {
      // Get or create the SARS Calendar entry
      let sarsId = sarsMap.get(key);
      if (!sarsId) {
        const res = await fetch(`${NOTION_API}/pages`, {
          method: "POST", headers: headers(),
          body: JSON.stringify({
            parent: { database_id: SARS_CALENDAR_DB },
            properties: {
              "Deadline Name":   { title: [{ text: { content: sarsName } }] },
              "Due Date":        { date: { start: dueDate } },
              "Obligation Type": { select: { name: taskType } },
            },
          }),
        });
        if (!res.ok) throw new Error(`Create ${res.status}: ${await res.text()}`);
        const newPage = await res.json();
        sarsId = newPage.id;
        sarsMap.set(key, sarsId);
        created++;
      }

      // Patch the task to add the relation
      await patchPage(page.id, {
        "SARS Calendar": { relation: [{ id: sarsId }] },
      });
      linked++;

      await new Promise(r => setTimeout(r, 350)); // Notion rate limit
    } catch (err) {
      console.error(`    ✗ Failed: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  if (DRY_RUN) {
    console.log(`DRY RUN: would link ${linked} tasks.`);
    console.log(`Run with --write to apply: node scripts/backfill-sars-links.mjs --write`);
  } else {
    console.log(`Done. Linked: ${linked}, SARS entries created: ${created}, failed: ${failed}`);
  }
  console.log();
}

main().catch(err => { console.error(err); process.exit(1); });
