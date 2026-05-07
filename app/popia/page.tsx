import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "POPIA Compliance Notice | Sikatrix Business Accountants",
  description: "POPIA Compliance Notice for Sikatrix Business Accountants — information on our obligations as a Responsible Party under the Protection of Personal Information Act.",
  robots: { index: false, follow: false },
};

export default function PopiaPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="POPIA Compliance Notice"
        subtitle="Protection of Personal Information Act 4 of 2013 — Notice to Data Subjects"
        crumbs={[{ label: "POPIA Notice" }]}
        size="sm"
      />

      <section className="py-14">
        <div className="container-page max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
            <div className="not-prose mb-8 p-5 rounded-xl bg-brand-50 border border-brand/20">
              <p className="text-sm text-neutral-700 leading-relaxed">
                This notice is issued pursuant to Section 18 of the Protection of Personal Information Act 4 of 2013 (POPIA) and informs you of your rights as a data subject, the identity of our Information Officer, and the purpose for which we process your personal information.
              </p>
            </div>

            <h2>1. Responsible Party</h2>
            <p>
              <strong>Name:</strong> Sikatrix Business Accountants<br />
              <strong>Address:</strong> {SITE.address.full}<br />
              <strong>Email:</strong> <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
              <strong>Phone:</strong> {SITE.phone}
            </p>

            <h2>2. Information Officer</h2>
            <p>
              Our Information Officer is responsible for ensuring compliance with POPIA. Enquiries or requests relating to personal information must be directed to the Information Officer at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
            </p>
            <p>
              Our Information Officer is registered with the South African Information Regulator as required by POPIA.
            </p>

            <h2>3. Purpose of Processing</h2>
            <p>We collect and process personal information for the following purposes:</p>
            <ul>
              <li>To provide accounting, bookkeeping, payroll, and tax services</li>
              <li>To submit returns to SARS and documents to CIPC on your behalf</li>
              <li>To meet our professional obligations as SAIPA members and SARS Tax Practitioners</li>
              <li>To communicate service-related information, deadline reminders, and compliance alerts</li>
              <li>To comply with anti-money laundering (FICA) obligations where applicable</li>
              <li>To send marketing communications (with your consent)</li>
            </ul>

            <h2>4. Categories of Personal Information Processed</h2>
            <ul>
              <li>Personal identifiers (name, ID number, tax reference number)</li>
              <li>Contact details (email, phone, address)</li>
              <li>Financial information (income, expenses, bank details)</li>
              <li>Employee information (for payroll clients)</li>
              <li>Company information (registration numbers, directorship details)</li>
            </ul>

            <h2>5. Lawful Basis for Processing</h2>
            <p>We process personal information on the following grounds (Section 11 of POPIA):</p>
            <ul>
              <li><strong>Contractual necessity:</strong> Processing required to fulfil our service agreement with you</li>
              <li><strong>Legal obligation:</strong> Required by SARS, CIPC, SAIPA, and other statutory authorities</li>
              <li><strong>Legitimate interests:</strong> Operational communications and service delivery</li>
              <li><strong>Consent:</strong> Marketing communications and newsletter subscriptions</li>
            </ul>

            <h2>6. Recipients of Personal Information</h2>
            <p>Personal information may be disclosed to:</p>
            <ul>
              <li>SARS (tax submissions, PAYE, VAT returns)</li>
              <li>CIPC (company registrations and annual returns)</li>
              <li>Cloud accounting platforms (QuickBooks, Xero, Sage, Draftworx, SimplePay, Syft) — under data processing agreements</li>
              <li>Email and communication service providers — under data processing agreements</li>
            </ul>
            <p>We do not sell, rent, or trade personal information to third parties.</p>

            <h2>7. Cross-Border Transfers</h2>
            <p>
              Some cloud platforms we use may store data on servers outside South Africa. Where this occurs, we ensure that the recipient country or organisation provides an adequate level of protection for personal information as required by Section 72 of POPIA.
            </p>

            <h2>8. Retention Period</h2>
            <p>
              In accordance with the Tax Administration Act (Act 28 of 2011) and SAIPA standards, client records are retained for a minimum of <strong>5 years</strong> from the date of the last relevant submission or transaction. Certain records may be retained for up to 15 years in cases of ongoing disputes.
            </p>

            <h2>9. Your Rights as a Data Subject</h2>
            <p>Under POPIA, you have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a record of the personal information we hold about you (Section 23)</li>
              <li><strong>Correction or deletion:</strong> Request that inaccurate, irrelevant, or out-of-date information be corrected or deleted (Section 24)</li>
              <li><strong>Objection:</strong> Object to the processing of your personal information (Section 11(3))</li>
              <li><strong>Withdraw consent:</strong> Withdraw consent for marketing communications at any time</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Information Regulator of South Africa</li>
            </ul>

            <h2>10. Complaints to the Information Regulator</h2>
            <p>
              If you believe we have violated your rights under POPIA, you may lodge a complaint with the Information Regulator of South Africa:
            </p>
            <ul>
              <li><strong>Website:</strong> www.inforegulator.org.za</li>
              <li><strong>Email:</strong> inforeg@justice.gov.za</li>
              <li><strong>Phone:</strong> +27 10 023 5207</li>
            </ul>

            <h2>11. Security Measures</h2>
            <p>
              We implement appropriate technical and organisational measures to safeguard personal information against unauthorised access, loss, destruction, or alteration. These include encrypted storage, role-based access controls, secure password management, and regular staff training on data protection.
            </p>

            <h2>12. Data Breach Notification</h2>
            <p>
              In the event of a data breach involving your personal information, we will notify you and the Information Regulator as required by Section 22 of POPIA.
            </p>

            <h2>13. How to Exercise Your Rights</h2>
            <p>
              To exercise any of the rights listed above, contact our Information Officer in writing:
            </p>
            <p>
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a><br />
              {SITE.phone}<br />
              {SITE.address.full}
            </p>
            <p>
              We will respond to all valid requests within 30 days, or advise you of any extension of this period.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
