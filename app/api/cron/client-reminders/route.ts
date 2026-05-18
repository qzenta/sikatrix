import { NextRequest, NextResponse } from "next/server";
import { getClientsForReminders } from "@/lib/notion";
import { sendEmail, sendCronAlert } from "@/lib/brevo";
import type { NotionClient } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 60;

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VER = "2022-06-28";
const DEADLINES_DB = "25a14ed22b2044a6921282ada8705a8e";

// Task types that require client action — Bookkeeping is internal only
const CLIENT_FACING_TYPES = [
  "EMP201",
  "VAT Return",
  "Provisional Tax",
  "Income Tax Return",
  "AFS / Financials",
  "CIPC AR",
  "Payroll Run",
];

function notionHeaders() {
  const token = process.env.NOTION_TOKEN?.trim();
  if (!token) throw new Error("NOTION_TOKEN not set");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Notion-Version": NOTION_VER };
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
}

// What the client needs to do per task type
function clientAction(taskType: string, dueDate: string): string {
  const due = `<strong>${esc(formatDateShort(dueDate))}</strong>`;
  switch (taskType) {
    case "EMP201":
      return `Please submit your payroll inputs — headcount, salaries, any changes, new employees or leavers — by ${due} so we can process and submit your PAYE/UIF/SDL return on time.`;
    case "VAT Return":
      return `Please forward all supplier invoices (purchases) and customer invoices (sales) for the VAT period by ${due} so we can prepare and submit your VAT return.`;
    case "Provisional Tax":
      return `Please review your estimated taxable income for this period and revert with any updates or queries. We will prepare and submit your IRP6 provisional tax return ahead of the deadline.`;
    case "Income Tax Return":
      return `Please ensure all outstanding bookkeeping is up to date and your bank statements are fully reconciled. Revert if there are any transactions or adjustments to discuss before we file.`;
    case "AFS / Financials":
      return `Please provide your latest bank statements, any outstanding supplier or customer invoices, and confirm all transactions are captured. We need these to finalise your Annual Financial Statements.`;
    case "CIPC AR":
      return `Please confirm your company details are current — directors, registered address, and primary business activity — so we can submit your CIPC Annual Return on time.`;
    case "Payroll Run":
      return `Please submit your payroll inputs for this period — salary changes, new starters, leavers, or overtime — by ${due}.`;
    default:
      return `Please liaise with us to ensure all documents are submitted timeously ahead of this deadline.`;
  }
}

function taskTypeLabel(taskType: string): string {
  const labels: Record<string, string> = {
    "EMP201": "PAYE / UIF / SDL (EMP201)",
    "VAT Return": "VAT Return",
    "Provisional Tax": "Provisional Tax (IRP6)",
    "Income Tax Return": "Income Tax Return (ITR14)",
    "AFS / Financials": "Annual Financial Statements",
    "CIPC AR": "CIPC Annual Return",
    "Payroll Run": "Payroll Run",
  };
  return labels[taskType] ?? taskType;
}

interface TaskItem {
  name: string;
  type: string;
  due: string;
}

function buildReminderEmail(client: NotionClient, tasks: TaskItem[]): string {
  const greeting = client.contact ? `Hi ${esc(client.contact)},` : `Dear ${esc(client.name)},`;
  const plural = tasks.length > 1;

  const taskRows = tasks.map(task => `
    <tr>
      <td style="padding:16px 0 16px;border-bottom:1px solid #e2e8f0;vertical-align:top;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding-bottom:6px;">
              <span style="display:inline-block;background:#eef3fb;color:#1b3a6b;font-size:11px;
                           font-weight:700;padding:3px 10px;border-radius:4px;letter-spacing:0.04em;
                           text-transform:uppercase;">${esc(taskTypeLabel(task.type))}</span>
              <span style="margin-left:8px;font-size:12px;color:#94a3b8;">
                Due: ${esc(formatDateShort(task.due))}
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <p style="margin:0;font-size:13px;color:#334155;line-height:1.65;">
                ${clientAction(task.type, task.due)}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`).join("");

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
              SAIPA Registered · SARS Tax Practitioner
            </p>
          </td>
        </tr>

        <!-- Alert strip -->
        <tr>
          <td style="background:#fef3c7;padding:12px 28px;border-bottom:1px solid #fcd34d;">
            <p style="margin:0;font-size:13px;font-weight:700;color:#92400e;">
              ⏰ Action Required — ${tasks.length} deadline${plural ? "s" : ""} in 7 days
            </p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:24px 28px 8px;">
            <p style="margin:0 0 10px;font-size:14px;color:#0f172a;">${greeting}</p>
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">
              This is a courtesy reminder that ${plural ? "the following compliance deadlines are" : "a compliance deadline is"}
              coming up for <strong>${esc(client.name)}</strong>. Please review and action ${plural ? "each item" : "the item below"}
              before the due date${plural ? "s" : ""}.
            </p>
          </td>
        </tr>

        <!-- Tasks -->
        <tr>
          <td style="padding:8px 28px 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              ${taskRows}
            </table>
          </td>
        </tr>

        <!-- Contact CTA -->
        <tr>
          <td style="padding:20px 28px 24px;">
            <p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.65;">
              If you have any questions or have already submitted the required documents, please
              disregard this reminder or let us know and we will update our records.
            </p>
            <table cellpadding="0" cellspacing="0" style="border-spacing:0;">
              <tr>
                <td style="padding-right:10px;">
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#d4920a;border-radius:6px;">
                        <a href="https://wa.me/27118672550"
                           style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:700;
                                  color:#ffffff;text-decoration:none;">
                          WhatsApp Us →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
                <td>
                  <table cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:#eef3fb;border-radius:6px;border:1px solid #bfdbfe;">
                        <a href="mailto:info@sikatrix.com"
                           style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:700;
                                  color:#1b3a6b;text-decoration:none;">
                          Email Us
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;color:#94a3b8;">
              Sikatrix Business Accountants · 42 Hennie Alberts Street, Brackenhurst, Alberton, 1448
            </p>
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              (011) 867-2550 ·
              <a href="mailto:info@sikatrix.com" style="color:#94a3b8;">info@sikatrix.com</a> ·
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

// ── Cron handler ──────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Target: tasks due exactly 7 days from today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(today);
  target.setDate(today.getDate() + 7);
  const targetIso = target.toISOString().split("T")[0];

  // 1. Fetch clients eligible for reminders
  let clients: NotionClient[];
  try {
    clients = await getClientsForReminders();
  } catch (err) {
    console.error("[cron/client-reminders] Client fetch failed:", err);
    await sendCronAlert("cron/client-reminders", err);
    return NextResponse.json({ error: "Client fetch failed" }, { status: 500 });
  }

  if (clients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No clients with reminders enabled" });
  }

  // Build lookup map: clientId → client
  const clientMap = new Map<string, NotionClient>(clients.map(c => [c.id, c]));

  // 2. Query tasks due on target date
  let taskPages: Record<string, unknown>[];
  try {
    const res = await fetch(`${NOTION_API}/databases/${DEADLINES_DB}/query`, {
      method: "POST",
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Due Date", date: { equals: targetIso } },
          ],
        },
        sorts: [{ property: "Task Type", direction: "ascending" }],
      }),
    });
    if (!res.ok) throw new Error(`Notion ${res.status}: ${await res.text()}`);
    const data = await res.json();
    taskPages = data.results as Record<string, unknown>[];
  } catch (err) {
    console.error("[cron/client-reminders] Task fetch failed:", err);
    await sendCronAlert("cron/client-reminders", err);
    return NextResponse.json({ error: "Task fetch failed" }, { status: 500 });
  }

  // 3. Group tasks by client, filter to reminder-eligible clients and client-facing types
  const tasksByClient = new Map<string, TaskItem[]>();

  for (const page of taskPages) {
    const props = page.properties as Record<string, {
      title?: { plain_text: string }[];
      select?: { name: string };
      date?: { start: string };
      relation?: { id: string }[];
    }>;

    const taskName = props["Task Name"]?.title?.[0]?.plain_text ?? "";
    const taskType = props["Task Type"]?.select?.name ?? "";
    const dueDate  = props["Due Date"]?.date?.start ?? "";
    const status   = props["Status"]?.select?.name ?? "";
    const clientId = props["Client"]?.relation?.[0]?.id ?? "";

    // Skip: not client-facing, already completed, no client linked, or client not in reminders list
    if (!CLIENT_FACING_TYPES.includes(taskType)) continue;
    if (status === "\u{1F7E2} Completed") continue;
    if (!clientId || !clientMap.has(clientId)) continue;

    const existing = tasksByClient.get(clientId) ?? [];
    existing.push({ name: taskName, type: taskType, due: dueDate });
    tasksByClient.set(clientId, existing);
  }

  if (tasksByClient.size === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: `No client-facing tasks due on ${targetIso}` });
  }

  // 4. Send one email per client
  let sent = 0, failed = 0;

  for (const [clientId, tasks] of tasksByClient.entries()) {
    const client = clientMap.get(clientId)!;
    try {
      await sendEmail({
        to: { email: client.email, name: client.contact || client.name },
        replyTo: { email: "info@sikatrix.com" },
        subject: `Action Required — ${tasks.length} compliance deadline${tasks.length > 1 ? "s" : ""} in 7 days | Sikatrix`,
        html: buildReminderEmail(client, tasks),
        bcc: true,
      });
      sent++;
    } catch (err) {
      console.error(`[cron/client-reminders] Failed for "${client.name}":`, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed, date: targetIso, clients: tasksByClient.size });
}
