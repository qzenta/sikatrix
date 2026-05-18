const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const DEFAULT_SENDER = {
  name: "Sikatrix Business Accountants",
  email: "info@sikatrix.com",
};

interface SendEmailParams {
  to: { email: string; name?: string };
  replyTo?: { email: string };
  subject: string;
  html: string;
  sender?: { name: string; email: string };
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
      subject: params.subject,
      htmlContent: params.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Brevo ${res.status}: ${text}`);
  }
}
