// ─── Automation integration layer (Phase 7) ──────────────────────────────────
//
// This file documents and scaffolds all future automation connection points.
// Nothing is live yet — replace the placeholder bodies with real API calls
// when you connect ConvertKit, Mailchimp, Zapier, or Make.
//
// Pattern:
//   1. Add env vars in Vercel dashboard (CONVERTKIT_API_KEY, MAKE_WEBHOOK_URL, etc.)
//   2. Install SDK (npm install @convertkit/sdk or similar)
//   3. Replace the console.log stubs below with real calls
//

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsletterSubscription {
  email: string;
  name?: string;
  // Maps to 'newsletterSegment' in PostMeta — used to tag by topic interest
  segment?: string;
  // Where the signup came from: footer form, inline CTA, lead magnet, etc.
  source?: "newsletter-form" | "lead-magnet" | "inline-cta" | "contact-form";
}

export interface AutomationConfig {
  convertkitApiKey?: string;
  convertkitFormId?: string;
  mailchimpApiKey?: string;
  mailchimpListId?: string;
  zapierWebhookUrl?: string;
  makeWebhookUrl?: string;
  // Map segment names to platform tag IDs
  tagMap?: Record<string, string>;
}

// ─── Newsletter subscription ─────────────────────────────────────────────────
// Called from app/api/newsletter/route.ts — extend that handler to pass config.

export async function subscribeToNewsletter(
  subscription: NewsletterSubscription,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _config?: AutomationConfig
): Promise<{ success: boolean; message: string }> {
  // TODO: Replace with ConvertKit subscriber add call:
  //   await convertkit.addSubscriberToForm(formId, { email, first_name: name, tags: [segment] })
  //
  // TODO: Or Mailchimp:
  //   await mailchimp.lists.addListMember(listId, { email_address: email, tags: [segment] })

  console.log("[automation] Newsletter subscription queued:", subscription);
  return { success: true, message: "Subscription recorded" };
}

// ─── Social publishing notification ──────────────────────────────────────────
// Call this after publishing a new article to trigger a Zapier/Make workflow
// that schedules social posts for LinkedIn, X, and Facebook.

export async function notifySocialPublishing(
  postSlug: string,
  postUrl: string,
  platforms: ("linkedin" | "x" | "facebook")[],
  webhookUrl?: string
): Promise<void> {
  if (!webhookUrl) {
    console.log("[automation] Social publish notification (no webhook):", postSlug);
    return;
  }

  // TODO: POST to webhookUrl with post data for Zapier/Make automation:
  //   await fetch(webhookUrl, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ slug: postSlug, url: postUrl, platforms }),
  //   });

  console.log("[automation] Social publish notification:", { postSlug, postUrl, platforms });
}

// ─── ConvertKit segment tags ──────────────────────────────────────────────────
// Each topic cluster maps to a subscriber tag in ConvertKit/Mailchimp.
// Update IDs here once accounts are configured.

export const SEGMENT_TAG_MAP: Record<string, string> = {
  sars:             "SARS Compliance",
  vat:              "VAT",
  bookkeeping:      "Bookkeeping",
  payroll:          "Payroll",
  sme:              "SME Growth",
  "import-export":  "Import/Export",
  "business-permits": "Business Permits",
  compliance:       "Compliance",
};
