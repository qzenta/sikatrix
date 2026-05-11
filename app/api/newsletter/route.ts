import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Initialised inside handler — build succeeds without RESEND_API_KEY present.
const NOTIFY_TO = "info@sikatrix.com";
const FROM = "Sikatrix Business Accountants <info@sikatrix.com>";

const rateMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const LIMIT = 5;
  const WINDOW = 60 * 60 * 1000; // 1 hour
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= LIMIT) return true;
  entry.count++;
  return false;
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function sast(): string {
  return (
    new Date().toLocaleString("en-ZA", {
      timeZone: "Africa/Johannesburg",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }) + " SAST"
  );
}

// ── Notification to Sikatrix ──────────────────────────────────────────────────

function notificationHtml(name: string, email: string, source: string, timestamp: string) {
  const label = source === "lead-magnet" ? "Checklist Download" : "Newsletter Signup";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;max-width:580px;">
        <tr>
          <td style="background:#0f2347;padding:20px 28px;">
            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">Sikatrix Business Accountants</p>
            <p style="margin:4px 0 0;color:#d5e2f4;font-size:12px;">New ${esc(label)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 28px 16px;">
            <p style="margin:0;font-size:13px;color:#475569;">A new subscriber joined via <strong>sikatrix.com</strong>.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 28px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;white-space:nowrap;">Name</td>
                <td style="padding:8px 14px;font-size:13px;color:#0f172a;">${esc(name) || "—"}</td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0;">
                <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;white-space:nowrap;">Email</td>
                <td style="padding:8px 14px;font-size:13px;color:#0f172a;">
                  <a href="mailto:${esc(email)}" style="color:#1b3a6b;text-decoration:none;">${esc(email)}</a>
                </td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0;">
                <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;white-space:nowrap;">Source</td>
                <td style="padding:8px 14px;font-size:13px;color:#0f172a;">${esc(label)}</td>
              </tr>
              <tr style="border-top:1px solid #e2e8f0;">
                <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;white-space:nowrap;">Received</td>
                <td style="padding:8px 14px;font-size:13px;color:#0f172a;">${timestamp}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;font-size:11px;color:#94a3b8;">Sikatrix Business Accountants · 42 Hennie Alberts Street, Brackenhurst, Alberton, 1448</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Welcome email — Checklist download ────────────────────────────────────────

const CHECKLIST_ITEMS = [
  "Income Tax Return (ITR12 / ITR14)",
  "Provisional Tax (IRP6) — 2 submissions per year",
  "VAT Returns (VAT201) — monthly or bi-monthly",
  "PAYE / EMP201 — monthly payroll taxes",
  "Annual Employer Reconciliation (EMP501)",
  "CIPC Annual Return",
  "UIF and SDL declarations",
  "Workmen's Compensation (COIDA) annual return",
];

function checklistHtml(name: string) {
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";
  const rows = CHECKLIST_ITEMS.map(
    (item) =>
      `<tr>
        <td style="padding:8px 14px;vertical-align:top;width:20px;">
          <span style="color:#d4920a;font-size:14px;font-weight:700;">✓</span>
        </td>
        <td style="padding:8px 14px 8px 0;font-size:13px;color:#334155;line-height:1.5;">${esc(item)}</td>
      </tr>`
  ).join('<tr><td colspan="2" style="border-top:1px solid #e2e8f0;padding:0;"></td></tr>');

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;max-width:580px;">

        <tr>
          <td style="background:#0f2347;padding:20px 28px;">
            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">Sikatrix Business Accountants</p>
            <p style="margin:4px 0 0;color:#d5e2f4;font-size:12px;">SAIPA Registered · SARS Tax Practitioner</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 28px 8px;">
            <p style="margin:0 0 12px;font-size:16px;font-weight:600;color:#0f172a;">${greeting}</p>
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">
              Here's your <strong>SARS Annual Compliance Checklist</strong> — every statutory
              submission a typical South African SME needs to stay on top of.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;background:#fafbfc;">
              ${rows}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:8px 28px 24px;">
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">
              Missing any of these could result in SARS penalties and interest. If you're unsure
              whether your business is fully compliant, we're happy to do a quick compliance review
              — no obligation.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#d4920a;border-radius:6px;">
                  <a href="https://sikatrix.com/contact" style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Book a Free Compliance Review →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;color:#94a3b8;">Sikatrix Business Accountants — 42 Hennie Alberts Street, Brackenhurst, Alberton, 1448</p>
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              <a href="tel:+27118672550" style="color:#94a3b8;">(011) 867-2550</a> ·
              <a href="mailto:info@sikatrix.com" style="color:#94a3b8;">info@sikatrix.com</a> ·
              <a href="https://sikatrix.com" style="color:#94a3b8;">sikatrix.com</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Welcome email — Newsletter signup ─────────────────────────────────────────

function newsletterWelcomeHtml(name: string) {
  const greeting = name ? `Hi ${esc(name)},` : "Hi there,";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;border:1px solid #e2e8f0;overflow:hidden;max-width:580px;">

        <tr>
          <td style="background:#0f2347;padding:20px 28px;">
            <p style="margin:0;color:#ffffff;font-size:15px;font-weight:600;">Sikatrix Business Accountants</p>
            <p style="margin:4px 0 0;color:#d5e2f4;font-size:12px;">Monthly Tax Tips</p>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 28px 20px;">
            <p style="margin:0 0 14px;font-size:16px;font-weight:600;color:#0f172a;">${greeting} You're subscribed.</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.65;">
              You'll receive our monthly newsletter with practical tax tips, SARS deadline reminders,
              and business finance insights — straight to your inbox.
            </p>
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">
              In the meantime, browse our resource library for guides on provisional tax,
              VAT registration, PAYE, and more.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#d4920a;border-radius:6px;">
                  <a href="https://sikatrix.com/resources" style="display:inline-block;padding:11px 22px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                    Browse Resources →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;color:#94a3b8;">Sikatrix Business Accountants — 42 Hennie Alberts Street, Brackenhurst, Alberton, 1448</p>
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              You're receiving this because you subscribed at sikatrix.com.
              To unsubscribe, reply with "unsubscribe" in the subject line.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── MailerLite — adds subscriber to list for campaign sending ─────────────────

async function addToMailerLite(email: string, name: string): Promise<void> {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey || !groupId) return; // silently skip if not configured

  const payload: Record<string, unknown> = {
    email,
    groups: [groupId],
  };
  if (name) payload.fields = { name };

  const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MailerLite ${res.status}: ${text}`);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name = "", email, source = "newsletter", _trap } = body;

  if (_trap) return NextResponse.json({ ok: true });

  const emailClean = email?.trim() ?? "";
  const nameClean = name?.trim() ?? "";

  if (!emailClean) {
    return NextResponse.json({ error: "Please enter your email address." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const timestamp = sast();
  const isChecklist = source === "lead-magnet";

  try {
    const [notifyResult, welcomeResult, mailerliteResult] = await Promise.allSettled([
      resend.emails.send({
        from: FROM,
        to: NOTIFY_TO,
        replyTo: emailClean,
        subject: isChecklist
          ? `New checklist download — ${emailClean}`
          : `New newsletter subscriber — ${emailClean}`,
        html: notificationHtml(nameClean, emailClean, source, timestamp),
      }),
      resend.emails.send({
        from: FROM,
        to: emailClean,
        subject: isChecklist
          ? "Your SARS Compliance Checklist — Sikatrix Business Accountants"
          : "You're subscribed — Sikatrix Monthly Tax Tips",
        html: isChecklist ? checklistHtml(nameClean) : newsletterWelcomeHtml(nameClean),
      }),
      addToMailerLite(emailClean, nameClean),
    ]);

    // MailerLite failure is non-fatal — log and continue
    if (mailerliteResult.status === "rejected") {
      console.error("[newsletter/route] MailerLite:", mailerliteResult.reason);
    }

    // Resend failures are fatal — the user needs their welcome email
    if (notifyResult.status === "rejected") throw notifyResult.reason;
    if (welcomeResult.status === "rejected") throw welcomeResult.reason;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[newsletter/route] Resend error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
