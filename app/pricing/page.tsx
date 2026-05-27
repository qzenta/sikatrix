import type { Metadata } from "next";
import Link from "next/link";
import { Check, Phone } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Transparent Accounting & Tax Pricing | Sikatrix Business Accountants" },
  description:
    "Simple, fixed-fee pricing for bookkeeping, payroll, annual financial statements, and tax services. No surprises — get a custom quote tailored to your business.",
  alternates: { canonical: "https://www.sikatrix.com/pricing" },
};

const SERVICES = [
  {
    name: "Annual Financial Statements",
    from: "R 2 500",
    period: "per set",
    desc: "Compiled or reviewed financial statements prepared in accordance with IFRS for SMEs.",
    includes: [
      "Income statement & balance sheet",
      "Notes to the financial statements",
      "Director / member sign-off pack",
      "Submission-ready AFS for CIPC or lenders",
    ],
    note: "Price varies by entity type (sole prop / CC / Pty Ltd) and transaction volume.",
  },
  {
    name: "Monthly Bookkeeping",
    from: "R 1 800",
    period: "/ month",
    desc: "Ongoing cloud bookkeeping — your books are up to date, every month, without the overhead of an in-house bookkeeper.",
    includes: [
      "Bank reconciliation & transaction coding",
      "Accounts payable & receivable tracking",
      "Monthly management report",
      "VAT return preparation & submission",
    ],
    note: "Based on up to 100 transactions/month. Multi-entity and high-volume rates available.",
  },
  {
    name: "Payroll Administration",
    from: "R 85",
    period: "/ employee / month",
    desc: "Fully managed payroll — we handle the calculations, submissions, and compliance so your team gets paid accurately and on time.",
    includes: [
      "Monthly payslips (SimplePay / Sage)",
      "PAYE, UIF & SDL calculations",
      "EMP201 submission to SARS",
      "IRP5 / IT3(a) certificates at year-end",
    ],
    note: "Minimum monthly fee applies. Annual EMP501 reconciliation billed separately.",
  },
  {
    name: "Tax Returns",
    from: "R 850",
    period: "per return",
    desc: "Accurate, on-time SARS submissions — personal tax, company tax, and provisional tax.",
    includes: [
      "ITR12 (individual / sole proprietor)",
      "ITR14 (company)",
      "IRP6 provisional tax (2× per year)",
      "SARS correspondence handled on your behalf",
    ],
    note: "Pricing per return. Bundled annual packages available for ongoing clients.",
  },
  {
    name: "Company Secretarial",
    from: "R 1 200",
    period: "/ year",
    desc: "Keep your CIPC records current and your company compliant — without the admin headache.",
    includes: [
      "Annual return submission (CIPC)",
      "Director changes & share transfer resolutions",
      "MOI amendments",
      "New company registration (CIPC)",
    ],
    note: "Annual return fee covers standard Pty Ltd and CC. Complex structures quoted separately.",
  },
  {
    name: "Cloud Accounting Setup",
    from: "R 3 500",
    period: "once-off",
    desc: "Get set up on QuickBooks Online, Xero, or Sage Business Cloud — properly configured from day one.",
    includes: [
      "Platform selection & licence setup",
      "Chart of accounts configuration",
      "Bank feed integration",
      "Staff training (up to 2 users)",
    ],
    note: "Migration from spreadsheets or a legacy system included. Opening balance import billed at cost.",
  },
];

const FAQS = [
  {
    q: "Do you charge by the hour?",
    a: "No. We use fixed monthly retainers for ongoing work and fixed project quotes for once-off engagements. You know the cost upfront — no surprise invoices at month-end.",
  },
  {
    q: "Can I bundle services for a better rate?",
    a: "Yes. Most clients combine bookkeeping, payroll, and tax under a single monthly retainer. Bundled packages are always cheaper than individual service rates — ask us for a tailored quote.",
  },
  {
    q: "What if my transaction volume is higher than your base tier?",
    a: "We tier pricing by transaction volume and entity complexity. The rates above are starting points. Book a free consultation and we'll quote accurately for your specific business.",
  },
];

export default function PricingPage() {
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Accounting & Tax Service Pricing — Sikatrix Business Accountants",
    itemListElement: SERVICES.map((svc, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      item: {
        "@type": "Service",
        name: svc.name,
        description: svc.desc,
        provider: { "@type": "AccountingService", name: "Sikatrix Business Accountants", url: "https://www.sikatrix.com" },
        offers: {
          "@type": "Offer",
          priceCurrency: "ZAR",
          price: svc.from.replace(/[^0-9]/g, ""),
          priceSpecification: { "@type": "PriceSpecification", description: `From ${svc.from} ${svc.period}` },
          url: "https://www.sikatrix.com/pricing",
          availability: "https://schema.org/InStock",
          areaServed: { "@type": "State", name: "Gauteng" },
        },
      },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <PageHero
        label="Pricing"
        title="Simple, Transparent Fees"
        subtitle="Fixed-fee accounting — you know what you're paying before we start. No hourly billing, no hidden extras."
        crumbs={[{ label: "Pricing" }]}
        size="sm"
        bgImage="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Intro note */}
      <section className="py-10 bg-neutral-50 border-t-[3px] border-neutral-200 border-b border-neutral-200">
        <div className="container-page max-w-2xl text-center">
          <p className="text-sm text-neutral-600 leading-relaxed">
            The prices below are <strong className="text-neutral-800">starting-from guides</strong> — your actual fee depends on
            transaction volume, entity type, and the services you need. Every new client receives a{" "}
            <strong className="text-neutral-800">free 30-minute consultation</strong> and a written fixed-fee quote before any
            work begins.
          </p>
        </div>
      </section>

      {/* Service pricing cards */}
      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <div key={svc.name} className="card p-7 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-neutral-900 mb-1">{svc.name}</h2>
                  <p className="text-xs text-neutral-500 leading-relaxed">{svc.desc}</p>
                </div>

                <div className="mb-5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs text-neutral-400 font-medium">from</span>
                    <span className="text-2xl font-bold text-brand">{svc.from}</span>
                    <span className="text-xs text-neutral-400">{svc.period}</span>
                  </div>
                </div>

                <ul className="space-y-2 mb-5 flex-1">
                  {svc.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-xs text-neutral-600">
                      <Check size={12} className="text-brand mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {svc.note && (
                  <p className="text-2xs text-neutral-400 leading-relaxed border-t border-neutral-100 pt-4 mt-auto">
                    {svc.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Quote CTA */}
          <div className="mt-12 rounded-xl bg-brand/5 border border-brand/10 p-8 text-center">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Need an exact quote for your business?
            </h3>
            <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
              Book a free consultation — we'll assess your needs and give you a written, fixed-fee quote
              within one business day.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                Book Free Consultation
              </Link>
              <a href={`tel:${SITE.phoneRaw}`} className="btn-outline text-sm flex items-center gap-2">
                <Phone size={13} />
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing FAQs */}
      <section className="py-14 bg-neutral-50">
        <div className="container-page max-w-2xl">
          <span className="section-label">Common questions</span>
          <h2 className="section-title mt-2 mb-8">About our fees</h2>
          <div className="divide-y divide-neutral-100">
            {FAQS.map((faq) => (
              <div key={faq.q} className="py-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
