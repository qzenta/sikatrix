import type { Metadata } from "next";
import Link from "next/link";
import ComplianceCalendar from "@/components/tools/ComplianceCalendar";
import CTABlock from "@/components/shared/CTABlock";
import { buildFAQSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "SARS Compliance Calendar 2026/27 | Sikatrix" },
  description:
    "Every recurring SARS deadline for South African SMEs in one interactive calendar — EMP201, VAT201, provisional tax, EMP501, and COIDA, for the 2026/27 tax year.",
  alternates: { canonical: "https://www.sikatrix.com/tools/sars-compliance-calendar" },
  openGraph: {
    title: "SARS Compliance Calendar 2026/27 | Sikatrix",
    description: "An interactive timeline of every recurring SARS deadline for South African SMEs — filterable by PAYE, VAT, provisional tax, income tax, CIPC, and COIDA.",
    type: "website",
    url: "https://www.sikatrix.com/tools/sars-compliance-calendar",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SARS Compliance Calendar 2026/27",
  description: "An interactive annual timeline of SARS compliance deadlines for South African SMEs.",
  url: "https://www.sikatrix.com/tools/sars-compliance-calendar",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR" },
  provider: { "@type": "AccountingService", name: "Sikatrix Business Accountants", url: "https://www.sikatrix.com" },
};

const FAQS = [
  {
    question: "What deadlines does this calendar cover?",
    answer: "EMP201 (PAYE/UIF/SDL, due the 7th of every month), VAT201 (due the 25th of the month following each VAT period), IRP6 provisional tax (1st, 2nd, and voluntary 3rd period), EMP501 interim and annual reconciliations, individual income tax filing season deadlines, and the annual COIDA Return of Earnings.",
  },
  {
    question: "Why isn't my CIPC Annual Return deadline on this calendar?",
    answer: "CIPC Annual Returns fall due 30 business days after your specific company's registration anniversary, which is different for every company — there's no single date that applies to all businesses. We track this individually for our clients rather than showing a generic date that could mislead you.",
  },
  {
    question: "What happens if a deadline falls on a weekend or public holiday?",
    answer: "SARS moves the deadline to the preceding business day, not the following one. This calendar shows the standard calendar date — always confirm the exact date on eFiling closer to the time, especially around public holidays.",
  },
  {
    question: "Does my VAT201 really fall due every month?",
    answer: "It depends on your VAT category. Most vendors (Category A or B) file bi-monthly, so only 6 of the 12 monthly VAT201 dates shown will apply to you. Vendors on Category C file monthly. Check your specific VAT registration category on eFiling if you're not sure.",
  },
  {
    question: "Is this calendar specific to my business, or generic?",
    answer: "It's a generic calendar covering the deadlines that apply to most SME taxpayers. Your actual obligations depend on your entity type, VAT category, financial year-end, and CIPC registration date. We build a client-specific compliance calendar as part of our ongoing engagements.",
  },
];

const faqSchema = buildFAQSchema(FAQS);

export default function SarsComplianceCalendarPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-brand-dark py-12 md:py-16">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-white">Tools</Link>
            <span>/</span>
            <span className="text-white">SARS Compliance Calendar</span>
          </nav>
          <span className="section-label text-accent-light mb-3 block">Free Tool</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
            SARS Compliance Calendar
            <span className="block text-lg font-normal text-brand-100 mt-1">2026/27 Tax Year · PAYE, VAT, Provisional Tax &amp; More</span>
          </h1>
          <p className="text-sm text-brand-100 max-w-2xl">
            Every recurring SARS deadline for the 2026/27 tax year in one interactive timeline —
            filter by category and see exactly what's due next.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2">
              <ComplianceCalendar />
            </div>

            <div className="space-y-5">
              {/* Category legend / quick facts */}
              <div className="rounded-xl bg-brand-dark text-white p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent-light mb-4">Quick Reference</p>
                <ul className="space-y-3">
                  {[
                    { label: "EMP201", sub: "Due the 7th of every month" },
                    { label: "VAT201", sub: "Due the 25th of the month after each period" },
                    { label: "IRP6 (Provisional Tax)", sub: "31 Aug and 28 Feb, plus optional 30 Sep top-up" },
                    { label: "COIDA Return of Earnings", sub: "31 May annually" },
                  ].map((item) => (
                    <li key={item.label} className="flex gap-3 items-start pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div>
                        <div className="text-xs font-medium text-white">{item.label}</div>
                        <div className="text-2xs text-brand-100 mt-0.5">{item.sub}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related tools */}
              <div className="card p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-3">Related Tools</p>
                <ul className="space-y-2">
                  <li><Link href="/tools/tax-calculator" className="text-sm text-brand hover:underline">Income Tax Calculator →</Link></li>
                  <li><Link href="/tools/vat-calculator" className="text-sm text-brand hover:underline">VAT Calculator →</Link></li>
                  <li><Link href="/tools/provisional-tax-estimator" className="text-sm text-brand hover:underline">Provisional Tax Estimator →</Link></li>
                </ul>
              </div>

              <div className="rounded-xl bg-accent p-5 text-white">
                <p className="text-sm font-semibold mb-1">Never miss a deadline again</p>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  We build a client-specific compliance calendar — including your exact CIPC and
                  VAT category dates — and handle every submission on time.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-accent text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
                  Book free consultation →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 bg-neutral-100 border-t border-neutral-200">
        <div className="container-page max-w-3xl">
          <h2 className="text-xl font-semibold text-neutral-900 mb-8">Frequently asked questions about the compliance calendar</h2>
          <div className="space-y-6">
            {FAQS.map((item) => (
              <div key={item.question} className="border-b border-neutral-200 pb-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.question}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-neutral-50 border-t border-neutral-200">
        <div className="container-page"><CTABlock /></div>
      </section>
    </>
  );
}
