import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "SARS Deadline Countdown — Privacy Policy | Sikatrix Business Accountants",
  description: "Privacy policy for the SARS Deadline Countdown Chrome extension by Sikatrix Business Accountants.",
  robots: { index: false, follow: false },
};

export default function ExtensionPrivacyPolicyPage() {
  return (
    <>
      <PageHero
        label="Legal"
        title="SARS Deadline Countdown — Privacy Policy"
        subtitle="Chrome Extension"
        crumbs={[{ label: "Extensions", href: "/extensions" }, { label: "Privacy Policy" }]}
        size="sm"
      />

      <section className="py-14">
        <div className="container-page max-w-3xl">
          <div className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand">
            <p><strong>Last updated:</strong> July 2026</p>

            <p>
              The SARS Deadline Countdown extension ("the Extension") is provided by Sikatrix Business Accountants ("we", "us").
            </p>

            <h2>What We Collect</h2>
            <p>
              Nothing. The Extension does not collect, transmit, or store any personal information, browsing data, or usage analytics.
            </p>

            <h2>How It Works</h2>
            <p>
              All deadline calculations happen locally in your browser using fixed, publicly available SARS filing cycle rules. No data is sent to any server operated by us or any third party.
            </p>

            <h2>Third-Party Links</h2>
            <p>
              The Extension includes links to external sites (SARS eFiling, our Calendly booking page, our website). Visiting these links is subject to those sites&apos; own privacy policies, which we do not control.
            </p>

            <h2>No Tracking, No Analytics</h2>
            <p>
              The Extension contains no analytics scripts, tracking pixels, or telemetry of any kind.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              If this policy changes, the updated version will be posted at this same URL with a revised &quot;Last updated&quot; date.
            </p>

            <h2>Contact</h2>
            <p>
              Questions about this policy: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
