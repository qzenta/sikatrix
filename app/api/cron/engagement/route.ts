import { NextRequest, NextResponse } from "next/server";
import { getClientsForEngagement, markEngagementSent } from "@/lib/notion";
import { sendEmail } from "@/lib/brevo";
import type { NotionClient } from "@/lib/notion";

export const runtime = "nodejs";
export const maxDuration = 60;

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function today() {
  return new Date().toLocaleDateString("en-ZA", {
    day: "numeric", month: "long", year: "numeric",
  });
}

// ── Entity helpers ────────────────────────────────────────────────────────────

function entityDescription(client: NotionClient): string {
  const n = esc(client.name);
  const t = (client.entityType ?? "").toLowerCase();
  if (t.includes("pty") || t.includes("private company")) return `${n} (Pty) Ltd`;
  if (t.includes("close") || t.includes("cc"))             return `${n} CC`;
  if (t.includes("trust"))                                  return `${n} Trust`;
  if (t.includes("sole"))                                   return `${n}`;
  if (t.includes("npo") || t.includes("npc"))               return `${n}`;
  return n;
}

function clientReference(client: NotionClient): string {
  const parts: string[] = [];
  if (client.regNo)  parts.push(`Reg No. ${esc(client.regNo)}`);
  if (client.vatNo)  parts.push(`VAT No. ${esc(client.vatNo)}`);
  return parts.length ? `<span style="color:#64748b;font-size:12px;">(${parts.join(" · ")})</span>` : "";
}

// ── Service labels ────────────────────────────────────────────────────────────

const SERVICE_LABELS: Record<string, string> = {
  "Bookkeeping":         "Monthly Bookkeeping & Accounting",
  "EMP201":              "PAYE / UIF / SDL Administration (EMP201)",
  "VAT Return":          "VAT Return Preparation & Submission",
  "Provisional Tax":     "Provisional Tax Preparation & Submission (IRP6)",
  "Income Tax Return":   "Annual Income Tax Return (ITR14)",
  "AFS / Financials":    "Annual Financial Statements Compilation",
  "CIPC AR":             "CIPC Annual Return Filing",
  "Payroll Run":         "Payroll Processing & Administration",
};

function serviceLabel(s: string): string {
  return SERVICE_LABELS[s] ?? s;
}

// ── Document checklist per service ───────────────────────────────────────────

const CHECKLIST: Record<string, string[]> = {
  "Bookkeeping": [
    "Monthly bank statements (all accounts)",
    "Supplier invoices and receipts",
    "Customer invoices issued",
    "Petty cash records (where applicable)",
  ],
  "EMP201": [
    "Monthly payroll inputs (salaries, allowances, deductions)",
    "New employee contracts and SARS declarations (IRP5)",
    "Records of leavers and final pay calculations",
    "Leave schedule and overtime authorisations",
  ],
  "VAT Return": [
    "Tax invoices for all purchases (input VAT)",
    "Tax invoices for all sales (output VAT)",
    "Bank statements for the VAT period",
    "Import / export documents (if applicable)",
  ],
  "Provisional Tax": [
    "Prior year income tax assessment (ITA34)",
    "Estimated taxable income for the current year",
    "Details of capital gains, rental income, or other income streams",
  ],
  "Income Tax Return": [
    "Annual Financial Statements or trial balance",
    "Bank statements (all accounts, full year)",
    "Investment income certificates (IT3b / IT3c)",
    "Medical aid tax certificate",
    "Retirement annuity certificate (RA)",
    "Any loan or interest statements",
  ],
  "AFS / Financials": [
    "Full-year bank statements (all accounts)",
    "Aged debtors list",
    "Aged creditors list",
    "Fixed asset register with additions and disposals",
    "Loan account statements",
    "Lease agreements (if applicable)",
  ],
  "CIPC AR": [
    "Confirmed registered address",
    "Director / member ID documents",
    "Confirmation of primary business activity",
  ],
  "Payroll Run": [
    "Monthly payroll inputs (salary changes, new starters, leavers)",
    "Leave records for the period",
    "Overtime authorisations",
  ],
};

function buildChecklist(services: string[]): string {
  const sections = services
    .filter(s => CHECKLIST[s])
    .map(s => {
      const items = CHECKLIST[s]
        .map(item => `<li style="margin-bottom:4px;font-size:13px;color:#334155;">${esc(item)}</li>`)
        .join("");
      return `
        <tr>
          <td style="padding:12px 0 4px;">
            <p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#0f2347;
                      text-transform:uppercase;letter-spacing:0.05em;">${esc(serviceLabel(s))}</p>
            <ul style="margin:0;padding-left:18px;">${items}</ul>
          </td>
        </tr>`;
    });

  if (!sections.length) return "";
  return `
    <!-- Checklist -->
    <tr>
      <td style="padding:0 28px 4px;">
        <table width="100%" cellpadding="0" cellspacing="0"
               style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:16px 20px;">
          <tr>
            <td style="padding-bottom:8px;">
              <p style="margin:0;font-size:14px;font-weight:700;color:#0f2347;">
                Document Checklist
              </p>
              <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
                Please have the following ready before we begin each service.
              </p>
            </td>
          </tr>
          ${sections.join("")}
        </table>
      </td>
    </tr>`;
}

// ── Email builder ─────────────────────────────────────────────────────────────

function buildEngagementEmail(client: NotionClient): string {
  const greeting   = client.contact ? `Dear ${esc(client.contact)},` : `Dear Valued Client,`;
  const entity     = entityDescription(client);
  const ref        = clientReference(client);
  const serviceList = client.services
    .map(s => `<li style="margin-bottom:6px;font-size:13px;color:#334155;">${esc(serviceLabel(s))}</li>`)
    .join("");
  const checklist  = buildChecklist(client.services);

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

  <!-- Subject line -->
  <tr>
    <td style="background:#eef3fb;padding:12px 28px;border-bottom:1px solid #bfdbfe;">
      <p style="margin:0;font-size:13px;font-weight:700;color:#1b3a6b;">
        Letter of Engagement
      </p>
      <p style="margin:2px 0 0;font-size:12px;color:#475569;">${today()}</p>
    </td>
  </tr>

  <!-- Body -->
  <tr>
    <td style="padding:24px 28px 16px;">
      <p style="margin:0 0 12px;font-size:14px;color:#0f172a;">${greeting}</p>

      <p style="margin:0 0 12px;font-size:13px;color:#334155;line-height:1.7;">
        We are pleased to confirm our engagement to provide professional accounting and tax services
        to <strong>${entity}</strong> ${ref} (hereinafter referred to as <em>"the Client"</em>),
        subject to the terms set out in this letter.
      </p>

      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f2347;">Scope of Services</p>
      <p style="margin:0 0 8px;font-size:13px;color:#475569;">
        We are engaged to provide the following services:
      </p>
      <ul style="margin:0 0 16px;padding-left:18px;">
        ${serviceList || `<li style="font-size:13px;color:#334155;">As agreed and confirmed separately</li>`}
      </ul>

      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f2347;">Our Responsibilities</p>
      <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.7;">
        We will perform the above services with professional care and diligence in accordance with
        the applicable standards of the South African Institute of Professional Accountants (SAIPA)
        and the requirements of the South African Revenue Service (SARS). Our work will be based on
        information and documents provided by you.
      </p>

      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f2347;">Your Responsibilities</p>
      <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.7;">
        You are responsible for the completeness and accuracy of all information, records, and
        documents provided to us. Please ensure that all supporting documents are submitted timeously
        to avoid penalties or delays in submission deadlines.
      </p>

      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f2347;">Confidentiality</p>
      <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.7;">
        All information shared with us will be treated as strictly confidential and will not be
        disclosed to third parties without your prior written consent, except as required by law
        or regulatory obligation.
      </p>

      <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#0f2347;">Fees</p>
      <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.7;">
        Our fees will be as agreed in our separate fee proposal or as communicated to you directly.
        Invoices are payable within 30 days of issue unless otherwise agreed in writing.
      </p>

      <p style="margin:0 0 16px;font-size:13px;color:#334155;line-height:1.7;">
        By continuing to engage our services, you confirm your acceptance of the terms set out in
        this letter. If you have any questions or wish to discuss the scope of our engagement,
        please do not hesitate to contact us.
      </p>

      <p style="margin:0 0 4px;font-size:13px;color:#0f172a;">Yours sincerely,</p>
      <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#0f2347;">Daniel Amoah</p>
      <p style="margin:0;font-size:12px;color:#64748b;">
        Sikatrix Business Accountants · SAIPA Registered Accountant · SARS Tax Practitioner
      </p>
    </td>
  </tr>

  <!-- Divider -->
  <tr>
    <td style="padding:0 28px;">
      <hr style="border:none;border-top:2px solid #e2e8f0;margin:0;">
    </td>
  </tr>

  ${checklist}

  <!-- CTA -->
  <tr>
    <td style="padding:20px 28px 24px;">
      <p style="margin:0 0 14px;font-size:13px;color:#475569;line-height:1.65;">
        If you have any questions about this engagement or the document checklist, please reach out.
      </p>
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding-right:10px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#d4920a;border-radius:6px;">
                  <a href="https://wa.me/27118672550"
                     style="display:inline-block;padding:10px 20px;font-size:13px;font-weight:700;
                            color:#ffffff;text-decoration:none;">WhatsApp Us →</a>
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
                            color:#1b3a6b;text-decoration:none;">Email Us</a>
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

  let clients;
  try {
    clients = await getClientsForEngagement();
  } catch (err) {
    console.error("[cron/engagement] Client fetch failed:", err);
    return NextResponse.json({ error: "Client fetch failed" }, { status: 500 });
  }

  if (clients.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No clients pending engagement letter" });
  }

  let sent = 0, failed = 0;

  for (const client of clients) {
    try {
      await sendEmail({
        to:      { email: client.email, name: client.contact || client.name },
        replyTo: { email: "info@sikatrix.com" },
        subject: `Letter of Engagement — Sikatrix Business Accountants`,
        html:    buildEngagementEmail(client),
      });
      await markEngagementSent(client.id);
      sent++;
    } catch (err) {
      console.error(`[cron/engagement] Failed for "${client.name}":`, err);
      failed++;
    }
  }

  return NextResponse.json({ ok: true, sent, failed });
}
