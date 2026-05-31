const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const DEFAULT_SENDER = {
  name: "Sikatrix Business Accountants",
  email: "info@sikatrix.com",
};

const DANIEL_EMAIL = "info@sikatrix.com";

interface SendEmailParams {
  to: { email: string; name?: string };
  replyTo?: { email: string };
  subject: string;
  html: string;
  sender?: { name: string; email: string };
  bcc?: boolean; // set true to BCC info@sikatrix.com
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not set");

  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: params.sender ?? DEFAULT_SENDER,
      to: [{ email: params.to.email, name: params.to.name ?? params.to.email }],
      ...(params.replyTo ? { replyTo: params.replyTo } : {}),
      ...(params.bcc ? { bcc: [{ email: DANIEL_EMAIL, name: "Sikatrix" }] } : {}),
      subject: params.subject,
      htmlContent: params.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo ${res.status}: ${text}`);
  }
}

export async function sendCronAlert(cronName: string, error: unknown): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;
  const message = error instanceof Error ? error.message : String(error);
  await fetch(BREVO_API_URL, {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: DEFAULT_SENDER,
      to: [{ email: DANIEL_EMAIL, name: "Daniel Amoah" }],
      subject: `⚠️ Cron failed: ${cronName}`,
      htmlContent: `<p style="font-family:sans-serif;font-size:14px;">
        The <strong>${cronName}</strong> cron job failed at ${new Date().toISOString()}.<br><br>
        <strong>Error:</strong> ${message}<br><br>
        Check Vercel logs for full details.
      </p>`,
    }),
  }).catch(() => { /* best-effort — don't throw inside error handler */ });
}
