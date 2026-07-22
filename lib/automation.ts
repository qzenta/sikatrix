// ─── Automation integration layer (Phase 7) ──────────────────────────────────
//
// This file documents and scaffolds all future automation connection points.
// Nothing is live yet — replace the placeholder bodies with real API calls
// when you connect ConvertKit or Mailchimp.
//
// Pattern:
//   1. Add env vars in Vercel dashboard (CONVERTKIT_API_KEY, etc.)
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
