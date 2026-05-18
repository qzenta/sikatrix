import { NextRequest, NextResponse } from "next/server";
import {
  getTasksInDateRange,
  getOverdueTasksAll,
  getClientsCreatedSince,
  getUpcomingDeadlinesN,
  type NotionDeadline,
  type NotionClient,
} from "@/lib/notion";
import { sendEmail } from "@/lib/brevo";

export const runtime = "nodejs";
export const maxDuration = 60;

const DANIEL_EMAIL = "nerkke@gmail.com";
const COMPLETED    = "\u{1F7E2} Completed";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function daysOverdue(iso: string): number {
  const due   = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today.getTime() - due.getTime()) / 86_400_000);
}

// ── Email builder ─────────────────────────────────────────────────────────────

function buildSummaryEmail(
  monthLabel: string,
  newClients: NotionClient[],
  completed: NotionDeadline[],
  overdue: NotionDeadline[],
  upcoming: NotionDeadline[],
): string {
  const stat = (n: number, label: string, color: string) => `
    <td align="center" style="padding:0 12px;border-right:1px solid #e2e8f0;">
      <p style="margin:0;font-size:24px;font-weight:800;color:${color};">${n}</p>
      <p style="margin:4px 0 0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;">${label}</p>
    </td>`;

  const taskRow = (d: NotionDeadline, extra = "") => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;vertical-align:top;">
        <span style="font-weight:600;">${esc(d.clientName)}</span>
        <span style="color:#64748b;"> — ${esc(d.taskType || d.taskName)}</span>
        ${extra}
        <br><span style="font-size:11px;color:#94a3b8;">${fmtDate(d.dueDate)}</span>
      </td>
    </tr>`;

  const section = (title: string, color: string, rows: string, count: number) =>
    count === 0 ? "" : `
    <tr>
      <td style="padding:20px 28px 4px;">
        <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:${color};
                  text-transform:uppercase;letter-spacing:0.05em;">${title} (${count})</p>
        <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      </td>
    </tr>`;

  const clientRow = (c: NotionClient) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:13px;color:#0f172a;vertical-align:top;">
        <span style="font-weight:600;">${esc(c.name)}</span>
        <span style="color:#64748b;"> · ${esc(c.entityType)}</span>
        ${c.services.length ? `<br><span style="font-size:11px;color:#94a3b8;">${c.services.map(esc).join(", ")}</span>` : ""}
      </td>
    </tr>`;

  const newClientRows   = newClients.map(clientRow).join("");
  const completedRows   = completed.filter(d => d.status === COMPLETED).map(d => taskRow(d)).join("");
  const overdueRows     = overdue.map(d => taskRow(d,
    `<span style="font-size:11px;font-weight:700;color:#dc2626;margin-left:6px;">${daysOverdue(d.dueDate)}d overdue</span>`
  )).join("");
  const upcomingRows    = upcoming.map(d => taskRow(d)).join("");

  const completedCount  = completed.filter(d => d.status === COMPLETED).length;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0"
       style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;max-width:580px;">

  <!-- Header -->
  <tr>
    <td style="background:#0f2347;padding:22px 28px;">
      <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">Sikatrix Business Accountants</p>
      <p style="margin:4px 0 0;color:#d4920a;font-size:11px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;">
        Monthly Practice Summary — ${esc(monthLabel)}
      </p>
    </td>
  </tr>

  <!-- Stats bar -->
  <tr>
    <td style="padding:20px 28px;background:#f8fafc;border-bottom:1px solid #e2e8f0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          ${stat(newClients.length,   "New Clients",  "#0f2347")}
          ${stat(completedCount,      "Completed",    "#16a34a")}
          ${stat(overdue.length,      "Overdue",      "#dc2626")}
          ${stat(upcoming.length,     "Upcoming 30d", "#d97706")}
        </tr>
      </table>
    </td>
  </tr>

  ${section("New Clients This Month", "#0f2347", newClientRows, newClients.length)}
  ${section("Completed Last Month",   "#16a34a", completedRows, completedCount)}
  ${section("Currently Overdue",      "#dc2626", overdueRows,   overdue.length)}
  ${section("Upcoming — Next 30 Days","#d97706", upcomingRows,  upcoming.length)}

  ${(newClients.length + completedCount + overdue.length + upcoming.length) === 0 ? `
  <tr>
    <td style="padding:32px 28px;text-align:center;">
      <p style="margin:0;font-size:13px;color:#64748b;">All clear — no items to report this month.</p>
    </td>
  </tr>` : ""}

  <!-- Footer -->
  <tr>
    <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
      <p style="margin:0;font-size:11px;color:#94a3b8;">
        Sikatrix Business Accountants · Auto-generated on ${new Date().toLocaleDateString("en-ZA")}
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ── Cron handler ──────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Last month date range
  const now        = new Date();
  const firstOfMonth  = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfLast   = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastOfLast    = new Date(firstOfMonth.getTime() - 86_400_000); // day before this month

  const rangeStart = firstOfLast.toISOString().split("T")[0];
  const rangeEnd   = lastOfLast.toISOString().split("T")[0];
  const since      = firstOfLast.toISOString(); // full ISO for created_time filter

  const monthLabel = firstOfLast.toLocaleDateString("en-ZA", { month: "long", year: "numeric" });

  let newClients: NotionClient[]  = [];
  let completed:  NotionDeadline[] = [];
  let overdue:    NotionDeadline[] = [];
  let upcoming:   NotionDeadline[] = [];

  try {
    [newClients, completed, overdue, upcoming] = await Promise.all([
      getClientsCreatedSince(since),
      getTasksInDateRange(rangeStart, rangeEnd),
      getOverdueTasksAll(),
      getUpcomingDeadlinesN(30),
    ]);
  } catch (err) {
    console.error("[cron/monthly-summary] Data fetch failed:", err);
    return NextResponse.json({ error: "Data fetch failed" }, { status: 500 });
  }

  const html = buildSummaryEmail(monthLabel, newClients, completed, overdue, upcoming);
  const completedCount = completed.filter(d => d.status === COMPLETED).length;

  try {
    await sendEmail({
      to:      { email: DANIEL_EMAIL, name: "Daniel" },
      replyTo: { email: "info@sikatrix.com" },
      subject: `Sikatrix Practice Summary — ${monthLabel}`,
      html,
    });
  } catch (err) {
    console.error("[cron/monthly-summary] Email send failed:", err);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    month: monthLabel,
    newClients: newClients.length,
    completed: completedCount,
    overdue: overdue.length,
    upcoming: upcoming.length,
  });
}
