import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/brevo";

const NOTIFY_TO = "info@sikatrix.com";

// ── Spam detection ────────────────────────────────────────────────────────────
// Score the submission and silently swallow confirmed spam so senders cannot
// probe the filter. No auto-reply is sent (avoids burning Brevo quota and
// confirming our address to the spammer).
const SPAM_TERMS = [
  "cpa firm", "cpa firms", "accounting firm", "accounting firms",
  "decision-maker", "decision makers", "decision maker",
  "predictable pipeline", "sales pipeline", "build a pipeline",
  "qualified leads", "qualified opportunities", "qualified pipeline",
  "verified contacts", "verified contact",
  "targeted outreach", "meaningful conversations",
  "b2b", "lead generation", "lead gen",
  "data provider", "email list", "contact list", "contact database",
  "expand your client base", "grow your client base", "client acquisition",
  "high-intent", "custom-built dataset", "custom built dataset",
  "outreach campaign", "cold outreach",
  "network includes", "segmented by",
  "70,000", "11,000 cpa", "11000 cpa",
];

// Matches US-format phone numbers (submitted without + prefix, e.g. 16109987890)
const US_PHONE_RE = /^1\d{10}$/;

function detectSpam(message: string, phone: string, email: string): boolean {
  const haystack = `${message} ${email}`.toLowerCase();
  const hits = SPAM_TERMS.filter((t) => haystack.includes(t)).length;
  if (hits >= 2) return true;
  const digits = phone.replace(/[\s\-().+]/g, "");
  return US_PHONE_RE.test(digits);
}

// ── Rate limiting ──────────────────────────────────────────────────────────────
// In-memory; resets on cold start. Sufficient for a contact form.
const rateMap = new Map<string, { count: number; windowStart: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ── HTML escaping ──────────────────────────────────────────────────────────────
// Prevents user-supplied values from breaking or injecting into email HTML.
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Timestamp ─────────────────────────────────────────────────────────────────
function sast(): string {
  return new Date().toLocaleString("en-ZA", {
    timeZone: "Africa/Johannesburg",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }) + " SAST";
}

// ── Email templates ───────────────────────────────────────────────────────────

function notificationHtml(data: {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  timestamp: string;
}) {
  const row = (label: string, value: string) =>
    value
      ? `<tr style="border-top:1px solid #e2e8f0;">
           <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;vertical-align:top;white-space:nowrap;">${label}</td>
           <td style="padding:8px 14px;font-size:13px;color:#0f172a;vertical-align:top;">${value}</td>
         </tr>`
      : "";

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
            <p style="margin:4px 0 0;color:#d5e2f4;font-size:12px;">New Website Enquiry</p>
          </td>
        </tr>

        <tr>
          <td style="padding:24px 28px 16px;">
            <p style="margin:0;font-size:13px;color:#475569;">
              A new enquiry was submitted via <strong>sikatrix.com</strong>.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
              <tr>
                <td style="padding:8px 14px;font-size:12px;color:#64748b;width:120px;vertical-align:top;white-space:nowrap;">Name</td>
                <td style="padding:8px 14px;font-size:13px;color:#0f172a;vertical-align:top;">${esc(data.name)}</td>
              </tr>
              ${row("Email", `<a href="mailto:${esc(data.email)}" style="color:#1b3a6b;text-decoration:none;">${esc(data.email)}</a>`)}
              ${row("Phone", esc(data.phone))}
              ${row("Company", esc(data.company))}
              ${row("Service", esc(data.service))}
              ${row("Received", data.timestamp)}
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 28px 8px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#94a3b8;">Message</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:14px 16px;font-size:13px;color:#334155;line-height:1.65;">
              ${esc(data.message).replace(/\n/g, "<br>")}
            </div>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 28px 24px;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">
              Hit reply to respond directly to ${esc(data.name)} at ${esc(data.email)}.
            </p>
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

function autoReplyHtml(name: string, timestamp: string) {
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
          </td>
        </tr>

        <tr>
          <td style="padding:28px 28px 20px;">
            <p style="margin:0 0 14px;font-size:17px;font-weight:600;color:#0f172a;">Thank you, ${esc(name)}.</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.65;">
              We've received your enquiry and will get back to you within <strong>one business day</strong>.
            </p>
            <p style="margin:0;font-size:13px;color:#475569;line-height:1.65;">
              If your matter is urgent, you're welcome to reach us directly during office hours
              (Monday – Friday, 08:00–17:00).
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 28px 24px;">
            <table cellpadding="0" cellspacing="0" style="background:#eef3fb;border-radius:6px;padding:16px 20px;width:100%;">
              <tr>
                <td>
                  <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#1b3a6b;">Contact us directly</p>
                  <p style="margin:0 0 5px;font-size:13px;color:#334155;">
                    Phone: <a href="tel:+27118672550" style="color:#1b3a6b;text-decoration:none;">(011) 867-2550</a>
                  </p>
                  <p style="margin:0 0 5px;font-size:13px;color:#334155;">
                    Email: <a href="mailto:info@sikatrix.com" style="color:#1b3a6b;text-decoration:none;">info@sikatrix.com</a>
                  </p>
                  <p style="margin:0;font-size:13px;color:#334155;">
                    WhatsApp: <a href="https://wa.me/27118672550" style="color:#1b3a6b;text-decoration:none;">Message us</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;color:#94a3b8;">Sikatrix Business Accountants — SAIPA Registered · SARS Tax Practitioner</p>
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              Enquiry received: ${timestamp} ·
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

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {

  // Content-Type guard
  if (!req.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait 15 minutes before trying again." },
      { status: 429 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone = "", company = "", service = "", message, _trap } = body;

  // Honeypot — silent accept for bots so they don't retry
  if (_trap) {
    return NextResponse.json({ ok: true });
  }

  // Spam filter — silent accept so senders cannot probe the filter
  if (detectSpam(message ?? "", phone ?? "", email ?? "")) {
    return NextResponse.json({ ok: true });
  }

  // Server-side validation
  const nameClean = name?.trim() ?? "";
  const emailClean = email?.trim() ?? "";
  const messageClean = message?.trim() ?? "";

  if (!nameClean || !emailClean || !messageClean) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (messageClean.length < 10) {
    return NextResponse.json(
      { error: "Please add a bit more detail to your message." },
      { status: 400 }
    );
  }

  const timestamp = sast();

  try {
    await Promise.all([
      sendEmail({
        to: { email: NOTIFY_TO },
        replyTo: { email: emailClean },
        subject: `New enquiry from ${nameClean}${service ? ` — ${service}` : ""}`,
        html: notificationHtml({
          name: nameClean,
          email: emailClean,
          phone: phone.trim(),
          company: company.trim(),
          service: service.trim(),
          message: messageClean,
          timestamp,
        }),
      }),
      sendEmail({
        to: { email: emailClean, name: nameClean },
        subject: "We received your enquiry — Sikatrix Business Accountants",
        html: autoReplyHtml(nameClean, timestamp),
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact/route] Brevo error:", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again or call us on (011) 867-2550." },
      { status: 500 }
    );
  }
}
