import { NextRequest, NextResponse } from "next/server";
import { getNewClients, markWelcomeSent } from "@/lib/notion";
import { sendEmail } from "@/lib/brevo";
import type { NotionClient } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 60;

// ── HTML escape ───────────────────────────────────────────────────────────────
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

// ── Welcome email template ────────────────────────────────────────────────────
function welcomeEmailHtml(client: NotionClient): string {
  const greeting = client.contact
    ? `Hi ${esc(client.contact)},`
    : `Hi there,`;

  const entityLabel =
    client.entityType === "Sole Prop" || client.entityType === "Individual"
      ? "your business"
      : esc(client.name);

  const servicesList =
    client.services.length > 0
      ? `<p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.65;">
           Based on your onboarding, we will be assisting <strong>${entityLabel}</strong> with:
           <strong>${client.services.join(", ")}</strong>.
         </p>`
      : `<p style="margin:0 0 12px;font-size:13px;color:#475569;line-height:1.65;">
           We look forward to supporting <strong>${entityLabel}</strong> across your accounting
           and compliance needs.
         </p>`;

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
          <td style="background:#0f2347;padding:24px 28px;">
            <p style="margin:0;color:#ffffff;font-size:16px;font-weight:700;letter-spacing:0.01em;">
              Sikatrix Business Accountants
            </p>
            <p style="margin:5px 0 0;color:#d4920a;font-size:12px;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">
              SAIPA Registered · SARS Tax Practitioner
            </p>
          </td>
        </tr>

        <!-- Welcome headline -->
        <tr>
          <td style="padding:28px 28px 0;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0f172a;line-height:1.3;">
              Welcome to Sikatrix, ${esc(client.contact || client.name)}.
            </p>
            <p style="margin:0 0 16px;font-size:13px;color:#64748b;">
              We are pleased to confirm that <strong>${esc(client.name)}</strong> is now
              officially on board as a Sikatrix client.
            </p>
            ${servicesList}
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:4px 0;"></td></tr>

        <!-- What happens next -->
        <tr>
          <td style="padding:20px 28px 8px;">
            <p style="margin:0 0 14px;font-size:12px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.08em;color:#d4920a;">What happens next</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;padding:0 12px 14px 0;width:24px;">
                  <span style="display:inline-block;width:24px;height:24px;border-radius:50%;
                               background:#0f2347;color:#ffffff;font-size:11px;font-weight:700;
                               text-align:center;line-height:24px;">1</span>
                </td>
                <td style="vertical-align:top;padding-bottom:14px;">
                  <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#0f172a;">
                    Engagement letter
                  </p>
                  <p style="margin:0;font-size:12px;color:#64748b;line-height:1.55;">
                    You will receive our formal engagement letter at this address for your signature.
                    Please review it carefully and revert with any questions.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:top;padding:0 12px 14px 0;width:24px;">
                  <span style="display:inline-block;width:24px;height:24px;border-radius:50%;
                               background:#0f2347;color:#ffffff;font-size:11px;font-weight:700;
                               text-align:center;line-height:24px;">2</span>
                </td>
                <td style="vertical-align:top;padding-bottom:14px;">
                  <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#0f172a;">
                    Client information checklist
                  </p>
                  <p style="margin:0;font-size:12px;color:#64748b;line-height:1.55;">
                    We will share a short checklist of the documents and details we need to open
                    your file — registration numbers, tax reference, prior returns where applicable.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="vertical-align:top;padding:0 12px 0 0;width:24px;">
                  <span style="display:inline-block;width:24px;height:24px;border-radius:50%;
                               background:#0f2347;color:#ffffff;font-size:11px;font-weight:700;
                               text-align:center;line-height:24px;">3</span>
                </td>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 3px;font-size:13px;font-weight:600;color:#0f172a;">
                    Onboarding call
                  </p>
                  <p style="margin:0;font-size:12px;color:#64748b;line-height:1.55;">
                    Book a 15-minute call at your convenience to walk through your requirements,
                    current compliance position, and our workflow together.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- CTA -->
        <tr>
          <td style="padding:20px 28px 24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#d4920a;border-radius:6px;">
                  <a href="https://calendly.com/onukpa/15min"
                     style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:700;
                            color:#ffffff;text-decoration:none;letter-spacing:0.01em;">
                    Book Your Onboarding Call →
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Divider -->
        <tr><td style="padding:0 28px;"><hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"></td></tr>

        <!-- Contact block -->
        <tr>
          <td style="padding:20px 28px 24px;">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.08em;color:#94a3b8;">Reach us directly</p>
            <table cellpadding="0" cellspacing="0" style="background:#eef3fb;border-radius:6px;padding:16px 20px;width:100%;">
              <tr>
                <td>
                  <p style="margin:0 0 7px;font-size:13px;color:#334155;">
                    📞 <a href="tel:+27118672550" style="color:#1b3a6b;text-decoration:none;font-weight:600;">(011) 867-2550</a>
                    &nbsp;·&nbsp; Monday – Friday, 08:00 – 17:00
                  </p>
                  <p style="margin:0 0 7px;font-size:13px;color:#334155;">
                    ✉️ <a href="mailto:info@sikatrix.com" style="color:#1b3a6b;text-decoration:none;font-weight:600;">info@sikatrix.com</a>
                  </p>
                  <p style="margin:0;font-size:13px;color:#334155;">
                    💬 <a href="https://wa.me/27118672550" style="color:#1b3a6b;text-decoration:none;font-weight:600;">WhatsApp us</a>
                    &nbsp;— quickest for urgent queries
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Useful resources -->
        <tr>
          <td style="padding:0 28px 24px;">
            <p style="margin:0 0 10px;font-size:12px;font-weight:700;text-transform:uppercase;
                       letter-spacing:0.08em;color:#94a3b8;">Useful resources</p>
            <p style="margin:0 0 6px;font-size:13px;color:#475569;">
              <a href="https://www.sikatrix.com/resources" style="color:#1b3a6b;text-decoration:none;">
                → SARS guides, tax tips &amp; compliance articles
              </a>
            </p>
            <p style="margin:0;font-size:13px;color:#475569;">
              <a href="https://www.sikatrix.com/tools/tax-calculator" style="color:#1b3a6b;text-decoration:none;">
                → SARS Income Tax Calculator 2026/27
              </a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0 0 3px;font-size:11px;color:#94a3b8;">
              Sikatrix Business Accountants · 42 Hennie Alberts Street, Brackenhurst, Alberton, 1448
            </p>
            <p style="margin:0;font-size:11px;color:#94a3b8;">
              SAIPA Professional Accountant (SA) · IBASA Member · SARS Tax Practitioner ·
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
  // Vercel passes CRON_SECRET as Bearer token — reject all other callers
  const auth = req.headers.get("authorization");
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let clients;
  try {
    clients = await getNewClients();
  } catch (err) {
    console.error("[cron/welcome] Notion query failed:", err);
    return NextResponse.json({ error: "Notion query failed" }, { status: 500 });
  }

  if (clients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No new clients to welcome" });
  }

  const results = await Promise.allSettled(
    clients.map(async (client) => {
      await sendEmail({
        to: { email: client.email, name: client.contact || client.name },
        subject: `Welcome to Sikatrix Business Accountants — ${client.name}`,
        html: welcomeEmailHtml(client),
      });
      await markWelcomeSent(client.id);
    })
  );

  let sent = 0;
  let failed = 0;
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      sent++;
    } else {
      failed++;
      console.error(`[cron/welcome] Failed for "${clients[i].name}":`, result.reason);
    }
  });

  return NextResponse.json({ ok: true, sent, failed });
}
