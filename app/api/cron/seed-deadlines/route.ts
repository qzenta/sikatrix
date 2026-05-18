import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const NOTION_API       = "https://api.notion.com/v1";
const NOTION_VER       = "2022-06-28";
const CLIENT_DB        = "32d8e3e04cde8093afbee879f5a7ce2b";
const DEADLINES_DB     = "25a14ed22b2044a6921282ada8705a8e";
const SARS_CALENDAR_DB = "3358e3e04cde81a4b27fce5b66dc48d9";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ── Notion helpers ────────────────────────────────────────────────────────────
function notionHeaders() {
  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) throw new Error("NOTION_TOKEN not set");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Notion-Version": NOTION_VER };
}

async function notionQuery(dbId: string, body: Record<string, unknown> = {}) {
  const results: Record<string, unknown>[] = [];
  let cursor: string | null = null;
  do {
    const response: Response = await fetch(`${NOTION_API}/databases/${dbId}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({ ...body, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!response.ok) throw new Error(`Notion query ${response.status}: ${await response.text()}`);
    const data: { results: Record<string, unknown>[]; has_more: boolean; next_cursor: string } = await response.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return results;
}

async function notionCreate(properties: Record<string, unknown>) {
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({ parent: { database_id: DEADLINES_DB }, properties }),
  });
  if (!res.ok) throw new Error(`Notion create ${res.status}: ${await res.text()}`);
}

// ── SARS Calendar helpers ─────────────────────────────────────────────────────

async function fetchSarsCalendar(): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  let cursor: string | null = null;
  do {
    const res: Response = await fetch(`${NOTION_API}/databases/${SARS_CALENDAR_DB}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({ page_size: 100, ...(cursor ? { start_cursor: cursor } : {}) }),
    });
    if (!res.ok) throw new Error(`SARS Calendar query ${res.status}: ${await res.text()}`);
    const data: { results: Record<string, unknown>[]; has_more: boolean; next_cursor: string } = await res.json();
    for (const p of data.results) {
      const props = (p as { properties: Record<string, { select?: { name: string }; date?: { start: string } }> }).properties;
      const type    = props["Obligation Type"]?.select?.name ?? "";
      const dueDate = props["Due Date"]?.date?.start ?? "";
      if (type && dueDate) map.set(`${type}|${dueDate}`, p.id as string);
    }
    cursor = data.has_more ? data.next_cursor : null;
  } while (cursor);
  return map;
}

async function getOrCreateSarsEntry(
  sarsMap: Map<string, string>,
  type: string,
  dueDate: string,
  name: string,
): Promise<string | null> {
  const key = `${type}|${dueDate}`;
  if (sarsMap.has(key)) return sarsMap.get(key)!;
  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: SARS_CALENDAR_DB },
      properties: {
        "Deadline Name":   { title: [{ text: { content: name } }] },
        "Due Date":        { date: { start: dueDate } },
        "Obligation Type": { select: { name: type } },
      },
    }),
  });
  if (!res.ok) throw new Error(`SARS Calendar create ${res.status}: ${await res.text()}`);
  const page: { id: string } = await res.json();
  sarsMap.set(key, page.id);
  return page.id;
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function lastDay(year: number, month0: number) {
  return new Date(year, month0 + 1, 0).getDate();
}
function isoDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function upcomingYearEndDates(targetMonth0: number, today: Date, count = 2) {
  const results: Date[] = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 3; y++) {
    const d = new Date(y, targetMonth0, lastDay(y, targetMonth0));
    if (d >= today) { results.push(d); if (results.length === count) break; }
  }
  return results;
}
function upcomingOffsetDates(fye0: number, offsetMonths: number, today: Date, count = 1) {
  const results: Date[] = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 3; y++) {
    const fyeDate = new Date(y, fye0, lastDay(y, fye0));
    const target = new Date(fyeDate);
    target.setMonth(target.getMonth() + offsetMonths);
    const snapped = new Date(target.getFullYear(), target.getMonth() + 1, 0);
    if (snapped >= today) { results.push(snapped); if (results.length === count) break; }
  }
  return results;
}

// Rolling window: 3 months of EMP201 dates (7th of month following payroll month)
function emp201Dates(today: Date, count = 3) {
  const dates: Date[] = [];
  let m = today.getMonth(), y = today.getFullYear();
  for (let i = 0; i < count; i++) {
    m++; if (m > 11) { m = 0; y++; }
    dates.push(new Date(y, m, 7));
  }
  return dates;
}

// Rolling window: 3 months of last-day-of-month dates
function monthlyDates(today: Date, count = 3) {
  const dates: Date[] = [];
  let m = today.getMonth(), y = today.getFullYear();
  for (let i = 0; i < count; i++) {
    dates.push(new Date(y, m, lastDay(y, m)));
    m++; if (m > 11) { m = 0; y++; }
  }
  return dates;
}

// Next 2 bi-monthly VAT due dates
function vatDates(today: Date, count = 2) {
  const dueMonths = [2, 4, 6, 8, 10, 0]; // Mar, May, Jul, Sep, Nov, Jan
  const periodStart = [0, 2, 4, 6, 8, 10];
  const periodEnd   = [1, 3, 5, 7, 9, 11];
  const dates: { date: Date; ps: number; pe: number }[] = [];
  for (let y = today.getFullYear() - 1; y <= today.getFullYear() + 2; y++) {
    for (let i = 0; i < 6; i++) {
      const dueYear = dueMonths[i] === 0 ? y + 1 : y;
      const d = new Date(dueYear, dueMonths[i], 25);
      if (d >= today) {
        dates.push({ date: d, ps: periodStart[i], pe: periodEnd[i] });
        if (dates.length === count) return dates;
      }
    }
  }
  return dates;
}

// ── Task generation ───────────────────────────────────────────────────────────
interface ClientRecord {
  id: string; name: string; fye: string | null; services: string[]; hasVat: boolean;
}
interface TaskSpec {
  name: string; due: string; type: string; priority: string; clientId: string;
  sarsName?: string; sarsType?: string;
}

function generateTasks(client: ClientRecord, today: Date): TaskSpec[] {
  const { id, name, fye, services, hasVat } = client;
  const tasks: TaskSpec[] = [];
  const fye0 = fye ? MONTHS.indexOf(fye) : -1;

  const add = (spec: Omit<TaskSpec, "clientId">) => tasks.push({ ...spec, clientId: id });

  // AFS — 3 months after FYE
  if (services.includes("AFS") && fye0 >= 0) {
    for (const date of upcomingOffsetDates(fye0, 3, today, 2)) {
      const fyeYear = new Date(date.getFullYear(), fye0, lastDay(date.getFullYear(), fye0));
      add({ name: `AFS — FYE ${fye} ${fyeYear.getFullYear()}`, due: isoDate(date), type: "AFS / Financials", priority: "\u{1F7E1} Medium" });
    }
  }

  // Tax: IRP6 1st, IRP6 2nd, ITR14
  if (services.includes("Tax") && fye0 >= 0) {
    const irp6_1_m = (fye0 + 6) % 12;
    for (const date of upcomingYearEndDates(irp6_1_m, today, 2)) {
      const fyeYear = irp6_1_m > fye0 ? date.getFullYear() : date.getFullYear() + 1;
      add({ name: `Provisional Tax IRP6 — 1st Period (FYE ${fye} ${fyeYear})`, due: isoDate(date), type: "Provisional Tax", priority: "\u{1F534} High" });
    }
    for (const date of upcomingYearEndDates(fye0, today, 2)) {
      add({ name: `Provisional Tax IRP6 — 2nd Period (FYE ${fye} ${date.getFullYear()})`, due: isoDate(date), type: "Provisional Tax", priority: "\u{1F534} High" });
    }
    for (const date of upcomingOffsetDates(fye0, 12, today, 2)) {
      const fyeYear = date.getFullYear() - 1;
      add({ name: `Income Tax Return ITR14 — FYE ${fye} ${fyeYear}`, due: isoDate(date), type: "Income Tax Return", priority: "\u{1F534} High" });
    }
  }

  // VAT — bi-monthly, next 2 periods
  if (hasVat) {
    for (const { date, ps, pe } of vatDates(today, 2)) {
      const periodYear = pe < ps ? date.getFullYear() - 1 : date.getFullYear();
      const vatLabel = `VAT Return — ${MONTHS[ps]}–${MONTHS[pe]} ${periodYear}`;
      add({ name: vatLabel, due: isoDate(date), type: "VAT Return", priority: "\u{1F534} High", sarsName: vatLabel, sarsType: "VAT Return" });
    }
  }

  // CompSec: CIPC — 2 months after FYE
  if (services.includes("CompSec") && fye0 >= 0) {
    for (const date of upcomingOffsetDates(fye0, 2, today, 2)) {
      add({ name: `CIPC Annual Return — ${date.getFullYear()}`, due: isoDate(date), type: "CIPC AR", priority: "\u{1F7E1} Medium" });
    }
  }

  // Payroll: EMP201 next 3 months
  if (services.includes("Payroll")) {
    for (const date of emp201Dates(today, 3)) {
      const pm = date.getMonth() === 0 ? 11 : date.getMonth() - 1;
      const py = date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
      add({
        name: `EMP201 — ${MONTH_FULL[pm]} ${py}`, due: isoDate(date),
        type: "EMP201", priority: "\u{1F534} High",
        sarsName: `PAYE/UIF/SDL — ${MONTH_FULL[pm]} ${py}`, sarsType: "EMP201",
      });
    }
  }

  // Bookkeeping: last day of next 3 months
  if (services.includes("Bookkeeping")) {
    for (const date of monthlyDates(today, 3)) {
      add({ name: `Bookkeeping — ${MONTH_FULL[date.getMonth()]} ${date.getFullYear()}`, due: isoDate(date), type: "Bookkeeping", priority: "\u{1F7E2} Low" });
    }
  }

  return tasks;
}

// ── Cron handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    // Fetch active clients
    const clientPages = await notionQuery(CLIENT_DB, {
      filter: { property: "Status", status: { equals: "Active" } },
    });
    const clients: ClientRecord[] = clientPages.map((p: Record<string, unknown>) => {
      const props = p.properties as Record<string, { title?: { plain_text: string }[]; select?: { name: string }; multi_select?: { name: string }[]; rich_text?: { plain_text: string }[] }>;
      return {
        id: p.id as string,
        name: props["Client Name"]?.title?.[0]?.plain_text ?? "",
        fye: props["FYE"]?.select?.name ?? null,
        services: (props["Services"]?.multi_select ?? []).map(s => s.name),
        hasVat: (props["VAT No"]?.rich_text?.[0]?.plain_text ?? "").length > 0,
      };
    }).filter(c => c.name);

    // Fetch SARS Calendar for linking EMP201 and VAT tasks
    const sarsMap = await fetchSarsCalendar();

    // Build existing task lookup
    const existingPages = await notionQuery(DEADLINES_DB);
    const existingKeys = new Set<string>();
    for (const p of existingPages) {
      const props = (p as { properties: Record<string, { select?: { name: string }; date?: { start: string }; relation?: { id: string }[] }> }).properties;
      const type    = props["Task Type"]?.select?.name ?? "";
      const dueDate = props["Due Date"]?.date?.start ?? "";
      const cId     = props["Client"]?.relation?.[0]?.id ?? "";
      if (type && dueDate && cId) existingKeys.add(`${cId}|${type}|${dueDate}`);
    }

    // Generate and create missing tasks
    let created = 0, skipped = 0, failed = 0;
    for (const client of clients) {
      const tasks = generateTasks(client, today);
      for (const task of tasks) {
        const key = `${task.clientId}|${task.type}|${task.due}`;
        if (existingKeys.has(key)) { skipped++; continue; }
        try {
          // Link EMP201 and VAT tasks to SARS Compliance Calendar
          const sarsRelation: { id: string }[] = [];
          if (task.sarsType && task.sarsName) {
            const sarsId = await getOrCreateSarsEntry(sarsMap, task.sarsType, task.due, task.sarsName);
            if (sarsId) sarsRelation.push({ id: sarsId });
          }

          await notionCreate({
            "Task Name":  { title: [{ text: { content: task.name } }] },
            "Due Date":   { date: { start: task.due } },
            "Task Type":  { select: { name: task.type } },
            "Priority":   { select: { name: task.priority } },
            "Status":     { select: { name: "⚪ Not Started" } },
            "Client":     { relation: [{ id: task.clientId }] },
            ...(sarsRelation.length ? { "SARS Calendar": { relation: sarsRelation } } : {}),
          });
          existingKeys.add(key);
          created++;
          await new Promise(r => setTimeout(r, 350)); // respect Notion rate limit
        } catch (err) {
          console.error(`[cron/seed-deadlines] Failed: ${task.name}`, err);
          failed++;
        }
      }
    }

    return NextResponse.json({ ok: true, created, skipped, failed, clients: clients.length });
  } catch (err) {
    console.error("[cron/seed-deadlines] Error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
