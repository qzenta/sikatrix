import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Sikatrix Business Accountants",
  description: "Sikatrix Business Accountants Privacy Policy — how we collect, use, and protect your personal information in accordance with POPIA.",
  robots: { index: false, follow: false },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="Privacy Policy"
        subtitle={`Last updated: January 2025`}
        crumbs={[{ label: "Privacy Policy" }]}
        size="sm"
      />

      <section className="py-14">
        <div className="container-page max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
            <h2>1. Who We Are</h2>
            <p>
              Sikatrix Business Accountants ("we", "our", "us") is a professional accounting firm registered in South Africa, operating from {SITE.address.full}. We are bound by the Protection of Personal Information Act 4 of 2013 (POPIA) as our Information Officer.
            </p>
            <p>Contact: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> | {SITE.phone}</p>

            <h2>2. What Personal Information We Collect</h2>
            <p>We may collect the following categories of personal information:</p>
            <ul>
              <li><strong>Identification information:</strong> Full name, identity number, company registration number</li>
              <li><strong>Contact information:</strong> Email address, phone number, physical and postal address</li>
              <li><strong>Financial information:</strong> Income, expenses, bank details, tax numbers (required to provide accounting services)</li>
              <li><strong>Employment information:</strong> Employee data provided for payroll processing</li>
              <li><strong>Website usage data:</strong> IP address, browser type, pages visited (via cookies)</li>
            </ul>

            <h2>3. How We Collect Your Information</h2>
            <p>We collect personal information through:</p>
            <ul>
              <li>Consultation bookings and contact forms on our website</li>
              <li>Email and telephone communications</li>
              <li>Documents provided for accounting and tax services</li>
              <li>SARS eFiling and CIPC portals where we act on your behalf</li>
              <li>Cloud accounting platforms (QuickBooks, Xero, Sage) used to provide services</li>
            </ul>

            <h2>4. Why We Process Your Information (Lawful Basis)</h2>
            <p>We process personal information on the following grounds:</p>
            <ul>
              <li><strong>Contract:</strong> To fulfil our accounting and tax service agreements with you</li>
              <li><strong>Legal obligation:</strong> To comply with SARS, CIPC, SAIPA, and other regulatory requirements</li>
              <li><strong>Legitimate interests:</strong> To communicate service updates, deadline reminders, and relevant compliance information</li>
              <li><strong>Consent:</strong> For marketing communications and newsletter subscriptions</li>
            </ul>

            <h2>5. How We Use Your Information</h2>
            <p>Your information is used to:</p>
            <ul>
              <li>Provide accounting, tax, bookkeeping, and payroll services</li>
              <li>File returns with SARS and CIPC on your behalf</li>
              <li>Communicate regarding your account and service delivery</li>
              <li>Send compliance reminders and deadline alerts</li>
              <li>Send newsletters and educational content (with your consent)</li>
              <li>Improve our website and service delivery</li>
            </ul>

            <h2>6. Who We Share Your Information With</h2>
            <p>We do not sell your personal information. We may share it with:</p>
            <ul>
              <li><strong>SARS:</strong> As required for tax submissions, PAYE, VAT, and related compliance</li>
              <li><strong>CIPC:</strong> For company registration and annual returns</li>
              <li><strong>Cloud software providers:</strong> QuickBooks, Xero, Sage, Draftworx, SimplePay, Syft — subject to their own privacy policies and data processing agreements</li>
              <li><strong>Email service providers:</strong> For client communications (subject to data processing agreements)</li>
            </ul>

            <h2>7. How Long We Keep Your Information</h2>
            <p>
              In accordance with the Tax Administration Act and SAIPA professional standards, we retain client financial records for a minimum of <strong>5 years</strong> from the date of the last relevant transaction. Certain records may be retained for longer if required by law.
            </p>
            <p>Marketing data is retained until you unsubscribe or request deletion.</p>

            <h2>8. Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal information, including encrypted file storage, access controls, and secure cloud platforms. However, no internet transmission is completely secure.
            </p>

            <h2>9. Your Rights Under POPIA</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Request access to personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information (subject to legal retention requirements)</li>
              <li>Object to the processing of your information</li>
              <li>Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>
            <p>
              To exercise these rights, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>

            <h2>10. Cookies</h2>
            <p>
              Our website uses cookies to improve user experience and analyse traffic. See our <a href="/cookie-policy">Cookie Policy</a> for details.
            </p>

            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Material changes will be communicated via email or a prominent notice on our website.
            </p>

            <h2>12. Contact</h2>
            <p>
              Questions or requests: <a href={`mailto:${SITE.email}`}>{SITE.email}</a> | {SITE.phone} | {SITE.address.full}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
