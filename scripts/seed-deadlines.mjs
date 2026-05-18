/**
 * seed-deadlines.mjs
 *
 * Generates annual SARS/compliance deadlines in the Notion "Deadlines & Tasks"
 * database for every Active client in the Client Register, based on their FYE
 * and services. Idempotent — skips any task that already exists.
 *
 * Usage:
 *   node scripts/seed-deadlines.mjs           # dry run (preview only)
 *   node scripts/seed-deadlines.mjs --write   # create tasks in Notion
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DRY_RUN = !process.argv.includes("--write");

// ── Load .env.local ───────────────────────────────────────────────────────────
try {
  const env = readFileSync(resolve(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const [key, ...rest] = line.split("=");
    if (key && rest.length) {
      const val = rest.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[key.trim()] = val;
    }
  }
} catch { /* rely on shell env vars */ }

const NOTION_TOKEN = process.env.NOTION_TOKEN?.trim();
if (!NOTION_TOKEN) { console.error("NOTION_TOKEN not set"); process.exit(1); }

const NOTION_API   = "https://api.notion.com/v1";
const NOTION_VER   = "2022-06-28";
const CLIENT_DB    = "32d8e3e04cde8093afbee879f5a7ce2b";
const DEADLINES_DB = "25a14ed22b2044a6921282ada8705a8e";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function notionHeaders() {
  return { Authorization: `Bearer ${NOTION_TOKEN}`, "Content-Type": "application/json", "Notion-Version": NOTION_VER };
}

// ── Notion helpers ────────────────────────────────────────────────────────────
async function notionQuery(dbId, body = {}) {
  const results = [];
  let cursor;
  do {
    const res = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({ ...body, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new Error(`Notion query ${res.status}: ${await res.text()}`);
    const data = await res.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return results;
}

async function notionCreate(properties) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({ parent: { database_id: DEADLINES_DB }, properties }),
  });
  if (!res.ok) throw new Error(`Notion create ${res.status}: ${await res.text()}`);
  return res.json();
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function lastDay(year, month0) {
  return new Date(year, month0 + 1, 0).getDate();
}

function isoDate(date) {
  return date.toISOString().split("T")[0];
}

// Returns upcoming occurrences of "last day of targetMonth0" starting from today
function upcomingYearEndDates(targetMonth0, today, count = 2) {
  const results = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 3; y++) {
    const d = new Date(y, targetMonth0, lastDay(y, targetMonth0));
    if (d >= today) { results.push(d); if (results.length === count) break; }
  }
  return results;
}

// Returns upcoming "last day of (fyeMonth + offsetMonths)" dates
function upcomingOffsetDates(fyeMonth0, offsetMonths, today, count = 1) {
  const results = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 3; y++) {
    const fyeLastDay = new Date(y, fyeMonth0, lastDay(y, fyeMonth0));
    const target = new Date(fyeLastDay);
    target.setMonth(target.getMonth() + offsetMonths);
    // snap to last day of that resulting month
    const snapped = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    if (snapped >= today) { results.push(snapped); if (results.length === count) break; }
  }
  return results;
}

// Monthly dates: last day of each of the next N months
function monthlyDates(today, count = 3) {
  const dates = [];
  let m = today.getMonth(), y = today.getFullYear();
  // Start from current month if there's still time, else next month
  for (let i = 0; i < count; i++) {
    const d = new Date(y, m, lastDay(y, m));
    if (d >= today) dates.push(d);
    else { dates.push(d); } // include current month even if today is close to end
    m++; if (m > 11) { m = 0; y++; }
  }
  return dates;
}

// Monthly 7th dates (EMP201 due 7th of following month) for next N months
function emp201Dates(today, count = 3) {
  const dates = [];
  let m = today.getMonth(), y = today.getFullYear();
  for (let i = 0; i < count; i++) {
    m++; if (m > 11) { m = 0; y++; }
    const d = new Date(y, m, 7);
    dates.push(d);
  }
  return dates;
}

// Bi-monthly VAT dates: 25th of the month after each 2-month period
// SA standard periods: Jan-Feb→Mar25, Mar-Apr→May25, May-Jun→Jul25, Jul-Aug→Sep25, Sep-Oct→Nov25, Nov-Dec→Jan25
function vatDates(today, count = 2) {
  const periodEnds = [1, 3, 5, 7, 9, 11]; // Feb(1), Apr(3), Jun(5), Aug(7), Oct(9), Dec(11) — 0-indexed
  const dueMonths  = [2, 4, 6, 8, 10, 0];  // Mar, May, Jul, Sep, Nov, Jan
  const dates = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 2; y++) {
    for (let i = 0; i < 6; i++) {
      const dueYear = dueMonths[i] === 0 ? y + 1 : y;
      const d = new Date(dueYear, dueMonths[i], 25);
      if (d >= today) { dates.push(d); if (dates.length === count) return dates; }
    }
  }
  return dates;
}

// ── Task generators per service ───────────────────────────────────────────────
function generateTasksForClient(client, today) {
  const { id, name, fye, services, hasVat } = client;
  const tasks = [];

  const fye0 = fye ? MONTHS.indexOf(fye) : -1; // 0-11 or -1

  // ─ AFS (3 months after FYE) ─────────────────────────────────────────────
  if (services.includes("AFS") && fye0 >= 0) {
    for (const date of upcomingOffsetDates(fye0, 3, today, 2)) {
      const fyeYear = new Date(date.getFullYear(), fye0, lastDay(date.getFullYear(), fye0));
      tasks.push({
        name: `AFS — FYE ${fye} ${fyeYear.getFullYear()}`,
        due: isoDate(date),
        type: "AFS / Financials",
        priority: "🟡 Medium",
      });
    }
  }

  // ─ Tax: Provisional Tax IRP6 ────────────────────────────────────────────
  if (services.includes("Tax") && fye0 >= 0) {
    // 1st period = last day of the 6th month of the tax year (start of tax year = fye0+1)
    const irp6_1_month0 = (fye0 + 1 + 5) % 12;
    for (const date of upcomingYearEndDates(irp6_1_month0, today, 2)) {
      // Figure out which FYE year this belongs to
      const fyeYear = irp6_1_month0 > fye0 ? date.getFullYear() : date.getFullYear() + 1;
      tasks.push({
        name: `Provisional Tax IRP6 — 1st Period (FYE ${fye} ${fyeYear})`,
        due: isoDate(date),
        type: "Provisional Tax",
        priority: "🔴 High",
      });
    }
    // 2nd period = last day of FYE month (= tax year end)
    for (const date of upcomingYearEndDates(fye0, today, 2)) {
      tasks.push({
        name: `Provisional Tax IRP6 — 2nd Period (FYE ${fye} ${date.getFullYear()})`,
        due: isoDate(date),
        type: "Provisional Tax",
        priority: "🔴 High",
      });
    }
    // ITR14 = 12 months after FYE (i.e., same date next year)
    for (const date of upcomingOffsetDates(fye0, 12, today, 2)) {
      const fyeYear = date.getFullYear() - 1;
      tasks.push({
        name: `Income Tax Return ITR14 — FYE ${fye} ${fyeYear}`,
        due: isoDate(date),
        type: "Income Tax Return",
        priority: "🔴 High",
      });
    }
  }

  // ─ VAT (bi-monthly, if VAT registered) ──────────────────────────────────
  if (hasVat) {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const periodStart = [0,2,4,6,8,10]; // Jan, Mar, May, Jul, Sep, Nov
    const periodEnd   = [1,3,5,7,9,11]; // Feb, Apr, Jun, Aug, Oct, Dec
    for (const [i, date] of vatDates(today, 2).entries()) {
      const ps = periodStart[i % 6], pe = periodEnd[i % 6];
      const periodYear = pe < ps ? date.getFullYear() - 1 : date.getFullYear();
      tasks.push({
        name: `VAT Return — ${months[ps]}–${months[pe]} ${periodYear}`,
        due: isoDate(date),
        type: "VAT Return",
        priority: "🔴 High",
      });
    }
  }

  // ─ CompSec: CIPC Annual Return (2 months after FYE) ─────────────────────
  if (services.includes("CompSec") && fye0 >= 0) {
    for (const date of upcomingOffsetDates(fye0, 2, today, 2)) {
      tasks.push({
        name: `CIPC Annual Return — ${date.getFullYear()}`,
        due: isoDate(date),
        type: "CIPC AR",
        priority: "🟡 Medium",
      });
    }
  }

  // ─ Payroll: EMP201 monthly ───────────────────────────────────────────────
  if (services.includes("Payroll")) {
    const mNames = MONTH_FULL;
    let baseM = today.getMonth(), baseY = today.getFullYear();
    for (const date of emp201Dates(today, 3)) {
      const payMonth = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
      const payYear  = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
      tasks.push({
        name: `EMP201 — ${mNames[payMonth]} ${payYear}`,
        due: isoDate(date),
        type: "EMP201",
        priority: "🔴 High",
      });
    }
  }

  // ─ Bookkeeping: monthly ──────────────────────────────────────────────────
  if (services.includes("Bookkeeping")) {
    const mNames = MONTH_FULL;
    for (const date of monthlyDates(today, 3)) {
      tasks.push({
        name: `Bookkeeping — ${mNames[date.getMonth()]} ${date.getFullYear()}`,
        due: isoDate(date),
        type: "Bookkeeping",
        priority: "🟢 Low",
      });
    }
  }

  return tasks.map(t => ({ ...t, clientId: id, clientName: name }));
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log(`\nSikatrix Deadline Seeder ${DRY_RUN ? "(DRY RUN — pass --write to create tasks)" : "(WRITE MODE)"}`);
  console.log(`Today: ${isoDate(today)}\n`);

  // 1. Fetch all active clients
  console.log("Fetching active clients...");
  const clientPages = await notionQuery(CLIENT_DB, {
    filter: { property: "Status", status: { equals: "Active" } },
  });

  const clients = clientPages.map(p => {
    const props = p.properties;
    const name     = props["Client Name"]?.title?.[0]?.plain_text ?? "";
    const fye      = props["FYE"]?.select?.name ?? null;
    const services = (props["Services"]?.multi_select ?? []).map(s => s.name);
    const vatNo    = props["VAT No"]?.rich_text?.[0]?.plain_text ?? "";
    return { id: p.id, name, fye, services, hasVat: vatNo.length > 0 };
  }).filter(c => c.name);

  console.log(`Found ${clients.length} active clients.\n`);

  // 2. Fetch ALL existing tasks for duplicate detection
  console.log("Fetching existing tasks...");
  const existingPages = await notionQuery(DEADLINES_DB);
  const existingKeys = new Set();
  for (const p of existingPages) {
    const props = p.properties;
    const type    = props["Task Type"]?.select?.name ?? "";
    const dueDate = props["Due Date"]?.date?.start ?? "";
    const rel     = props["Client"]?.relation ?? [];
    const cId     = rel[0]?.id ?? "";
    if (type && dueDate && cId) {
      existingKeys.add(`${cId}|${type}|${dueDate}`);
    }
  }
  console.log(`Found ${existingPages.length} existing tasks. ${existingKeys.size} keyed entries.\n`);

  // 3. Generate and create tasks
  let totalCreated = 0, totalSkipped = 0, totalFailed = 0;

  for (const client of clients) {
    const tasks = generateTasksForClient(client, today);

    if (tasks.length === 0) {
      const reason = !client.fye ? "no FYE" : "no applicable services";
      console.log(`  ⚠  ${client.name.padEnd(35)} — 0 tasks (${reason})`);
      continue;
    }

    let created = 0, skipped = 0, failed = 0;

    for (const task of tasks) {
      const key = `${client.id}|${task.type}|${task.due}`;
      if (existingKeys.has(key)) { skipped++; continue; }

      if (DRY_RUN) {
        created++;
        continue;
      }

      try {
        await notionCreate({
          "Task Name": { title: [{ text: { content: task.name } }] },
          "Due Date":  { date: { start: task.due } },
          "Task Type": { select: { name: task.type } },
          "Priority":  { select: { name: task.priority } },
          "Status":    { select: { name: "⚪ Not Started" } },
          "Client":    { relation: [{ id: client.id }] },
        });
        existingKeys.add(key); // prevent duplicates within same run
        created++;
      } catch (err) {
        console.error(`    ✗ Failed: ${task.name} — ${err.message}`);
        failed++;
      }

      // Rate-limit: Notion API allows ~3 req/s
      await new Promise(r => setTimeout(r, 350));
    }

    const icon = failed > 0 ? "✗" : "✓";
    console.log(
      `  ${icon}  ${client.name.padEnd(35)}` +
      `  FYE: ${(client.fye ?? "—").padEnd(3)}` +
      `  Services: ${client.services.join(", ").padEnd(30) || "—".padEnd(30)}` +
      `  → ${created} created, ${skipped} skipped${failed ? `, ${failed} failed` : ""}`
    );

    totalCreated += created;
    totalSkipped += skipped;
    totalFailed  += failed;
  }

  console.log(`\n${"─".repeat(80)}`);
  if (DRY_RUN) {
    console.log(`DRY RUN complete. Would create ${totalCreated} tasks (${totalSkipped} already exist).`);
    console.log(`Run with --write to create them: node scripts/seed-deadlines.mjs --write`);
  } else {
    console.log(`Done. Created ${totalCreated} tasks, ${totalSkipped} skipped, ${totalFailed} failed.`);
  }
  console.log();
}

main().catch(err => { console.error(err); process.exit(1); });
