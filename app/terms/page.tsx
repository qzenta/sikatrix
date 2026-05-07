import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sikatrix Business Accountants",
  description: "Terms and conditions governing the use of Sikatrix Business Accountants services and website.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="Terms & Conditions"
        subtitle="Last updated: January 2025"
        crumbs={[{ label: "Terms & Conditions" }]}
        size="sm"
      />

      <section className="py-14">
        <div className="container-page max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By engaging Sikatrix Business Accountants ("the Firm") for professional services or using our website (sikatrix.com), you agree to these Terms and Conditions. If you do not agree, please discontinue use of our services and website.
            </p>

            <h2>2. Our Services</h2>
            <p>
              The Firm provides accounting, bookkeeping, tax, payroll, cloud accounting, and related professional services. The specific scope of services for each client is defined in an engagement letter or service agreement signed prior to commencement.
            </p>
            <p>
              Services are provided by or under the supervision of a SAIPA-registered Professional Accountant (SA) and/or a SARS-registered Tax Practitioner. Our services do not constitute legal advice.
            </p>

            <h2>3. Client Obligations</h2>
            <p>To enable the Firm to deliver services effectively, clients must:</p>
            <ul>
              <li>Provide accurate, complete, and timely information and documentation</li>
              <li>Inform the Firm of any changes to their business that may affect the services</li>
              <li>Pay invoices within agreed payment terms</li>
              <li>Not withhold information material to the preparation of financial statements or tax returns</li>
            </ul>
            <p>The Firm accepts no liability for errors arising from incomplete or inaccurate information provided by the client.</p>

            <h2>4. Fees and Payment</h2>
            <p>
              Fees are as agreed in the engagement letter or as quoted in writing. Unless otherwise stated, invoices are due within 30 days of the invoice date. Overdue amounts attract interest at the prime lending rate plus 2% per annum.
            </p>
            <p>
              The Firm reserves the right to suspend services pending payment of overdue invoices, without liability for any resulting penalties or loss.
            </p>

            <h2>5. Confidentiality</h2>
            <p>
              The Firm maintains strict confidentiality of all client information in accordance with SAIPA professional standards and POPIA. Information is not disclosed to third parties except as required by law, regulatory obligation, or with the client's written consent.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              The Firm's liability for any claim arising from the provision of services is limited to the fees paid by the client for the specific service giving rise to the claim in the 12 months preceding the claim.
            </p>
            <p>
              The Firm is not liable for any indirect, consequential, or special damages, including loss of profit, arising from the provision of or failure to provide services.
            </p>
            <p>
              The Firm is not responsible for SARS or CIPC processing delays, system outages, or regulatory changes beyond our control.
            </p>

            <h2>7. SARS Submissions and Deadlines</h2>
            <p>
              The Firm will submit returns and declarations on behalf of clients who have provided complete, accurate information and settled relevant invoices in advance. The Firm is not responsible for penalties or interest resulting from late provision of information by the client.
            </p>

            <h2>8. Termination</h2>
            <p>
              Either party may terminate the engagement with 30 days' written notice. The Firm reserves the right to terminate immediately in cases of non-payment, fraud, or breach of these terms.
            </p>
            <p>
              Upon termination, all fees for services rendered to date are immediately payable. The Firm will provide the client's records and working papers in a format agreed in the engagement letter.
            </p>

            <h2>9. Website Usage</h2>
            <p>
              Content on sikatrix.com is for general information only. It does not constitute professional advice. While we strive for accuracy, the Firm does not warrant that website content is current or error-free.
            </p>
            <p>
              Do not rely on website content as a substitute for professional advice specific to your circumstances. Contact us for a consultation.
            </p>

            <h2>10. Intellectual Property</h2>
            <p>
              All content on our website — including text, graphics, and branding — is owned by Sikatrix Business Accountants and may not be reproduced without written permission.
            </p>

            <h2>11. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the Republic of South Africa. Disputes shall be subject to the jurisdiction of the South Gauteng High Court.
            </p>

            <h2>12. Contact</h2>
            <p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a> | {SITE.phone} | {SITE.address.full}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
