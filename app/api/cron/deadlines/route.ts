import { NextRequest, NextResponse } from "next/server";
import { getUpcomingDeadlines } from "@/lib/notion";
import { sendEmail, sendCronAlert } from "@/lib/brevo";
import type { NotionDeadline } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 60;

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(iso + "T00:00:00");
  return Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function dueBadge(days: number): string {
  if (days < 0) return `<span style="background:#fee2e2;color:#dc2626;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">OVERDUE</span>`;
  if (days === 0) return `<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">TODAY</span>`;
  if (days === 1) return `<span style="background:#fef3c7;color:#b45309;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">TOMORROW</span>`;
  return `<span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;">IN ${days} DAYS</span>`;
}

function taskRow(d: NotionDeadline): string {
  const days = daysUntil(d.dueDate);
  const rowBg = days < 0 ? "#fff5f5" : "transparent";
  return `
    <tr style="border-bottom:1px solid #e2e8f0;background:${rowBg};">
      <td style="padding:12px 10px 12px 0;font-size:13px;color:#0f172a;font-weight:600;vertical-align:top;">
        ${esc(d.taskName)}
        ${d.taskType ? `<br><span style="font-size:11px;color:#94a3b8;font-weight:400;">${esc(d.taskType)}</span>` : ""}
      </td>
      <td style="padding:12px 10px;font-size:13px;color:#334155;vertical-align:top;">${esc(d.clientName)}</td>
      <td style="padding:12px 10px;font-size:13px;color:#334155;vertical-align:top;white-space:nowrap;">${formatDate(d.dueDate)}</td>
      <td style="padding:12px 0;vertical-align:top;">${dueBadge(days)}</td>
    </tr>`;
}

function buildEmailHtml(deadlines: NotionDeadline[], todayStr: string): string {
  const overdue = deadlines.filter((d) => daysUntil(d.dueDate) < 0);
  const upcoming = deadlines.filter((d) => daysUntil(d.dueDate) >= 0);

  const overdueBanner = overdue.length > 0
    ? `<tr>
         <td style="padding:14px 28px;background:#fee2e2;border-bottom:2px solid #fca5a5;">
           <p style="margin:0;font-size:13px;font-weight:700;color:#dc2626;">
             ⚠ ${overdue.length} overdue task${overdue.length > 1 ? "s" : ""} — action required
           </p>
         </td>
       </tr>`
    : "";

  const rows = deadlines.map(taskRow).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="620" cellpadding="0" cellspacing="0"
             style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;max-width:620px;">

        <!-- Header -->
        <tr>
          <td style="background:#0f2347;padding:22px 28px;">
            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:700;">Sikatrix — Weekly Deadline Briefing</p>
            <p style="margin:4px 0 0;color:#d4920a;font-size:12px;letter-spacing:0.05em;text-transform:uppercase;">
              ${esc(todayStr)}
            </p>
          </td>
        </tr>

        ${overdueBanner}

        <!-- Summary row -->
        <tr>
          <td style="padding:20px 28px 12px;">
            <p style="margin:0;font-size:14px;color:#334155;">
              You have <strong>${deadlines.length} task${deadlines.length > 1 ? "s" : ""}</strong>
              due within the next 3 days${overdue.length > 0 ? `, including <strong style="color:#dc2626;">${overdue.length} overdue</strong>` : ""}.
            </p>
          </td>
        </tr>

        <!-- Task table -->
        <tr>
          <td style="padding:0 28px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <thead>
                <tr>
                  <th style="padding:0 10px 10px 0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;text-align:left;">Task</th>
                  <th style="padding:0 10px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;text-align:left;">Client</th>
                  <th style="padding:0 10px 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;text-align:left;white-space:nowrap;">Due Date</th>
                  <th style="padding:0 0 10px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:#94a3b8;text-align:left;">Status</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:0 28px 24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#0f2347;border-radius:6px;">
                  <a href="https://www.notion.so/25a14ed22b2044a6921282ada8705a8e"
                     style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">
                    Open Deadlines in Notion →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              Sikatrix Business Accountants · Automated daily briefing ·
              <a href="https://www.sikatrix.com" style="color:#94a3b8;">sikatrix.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let deadlines;
  try {
    deadlines = await getUpcomingDeadlines();
  } catch (err) {
    console.error("[cron/deadlines] Notion query failed:", err);
    await sendCronAlert("cron/deadlines", err);
    return NextResponse.json({ error: "Notion query failed" }, { status: 500 });
  }

  if (deadlines.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No upcoming deadlines" });
  }

  const todayStr = new Date().toLocaleDateString("en-ZA", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const overdue = deadlines.filter((d) => daysUntil(d.dueDate) < 0).length;
  const subject = overdue > 0
    ? `⚠ ${overdue} overdue + ${deadlines.length - overdue} upcoming — Sikatrix Deadlines`
    : `📋 ${deadlines.length} deadline${deadlines.length > 1 ? "s" : ""} due soon — Sikatrix`;

  try {
    await sendEmail({
      to: { email: "info@sikatrix.com", name: "Sikatrix" },
      subject,
      html: buildEmailHtml(deadlines, todayStr),
    });
  } catch (err) {
    console.error("[cron/deadlines] Email send failed:", err);
    return NextResponse.json({ error: "Email send failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, sent: 1, tasks: deadlines.length, overdue });
}
