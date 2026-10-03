import type { Metadata } from "next";
import Link from "next/link";
import ComplianceCalendar from "@/components/tools/ComplianceCalendar";
import CTABlock from "@/components/shared/CTABlock";
import { buildFAQSchema } from "@/lib/metadata";
import { DEPENDS_ON_YOU, REVIEWED_ON, VAT_CATEGORIES, VAT_METHODS } from "@/lib/rules/compliance-calendar";
import { HOLIDAYS_SOURCE, PUBLIC_HOLIDAYS } from "@/lib/rules/public-holidays";

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
    answer: "EMP201 (PAYE/UIF/SDL, due the 7th of the month after the payroll month), VAT201 (by VAT category and filing method), IRP6 provisional tax (1st, 2nd, and voluntary 3rd period), EMP501 interim and annual reconciliations, individual income tax filing season deadlines, and the annual COIDA Return of Earnings.",
  },
  {
    question: "Why isn't my CIPC Annual Return deadline on this calendar?",
    answer: "CIPC Annual Returns fall due 30 business days after your specific company's registration anniversary, which is different for every company — there's no single date that applies to all businesses. We track this individually for our clients rather than showing a generic date that could mislead you.",
  },
  {
    question: "What happens if a deadline falls on a weekend or public holiday?",
    answer: "For EMP201, VAT201 and provisional tax, SARS moves the deadline to the last business day before the weekend or public holiday, not the following one. This calendar applies that rule and shows the adjusted date, with the original date noted. SARS-published filing-season windows (such as 23 October 2026) are shown as published. Always confirm the exact date on eFiling.",
  },
  {
    question: "Does my VAT201 really fall due every month?",
    answer: "It depends on your VAT category. Category A and B vendors file every two months, Category C monthly, Category D every six months, and registered micro businesses can elect four-monthly periods. Manual filers pay by the 25th; eFiling vendors by the last business day of the month. Choose your category and method above. Check your category on eFiling if you are not sure.",
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
                    { label: "EMP201", sub: "Due the 7th of the month after the payroll month, or the business day before" },
                    { label: "VAT201", sub: "Manual: 25th. eFiling: last business day of the month after the period" },
                    { label: "IRP6 (Provisional Tax)", sub: "31 Aug and 28 Feb (26 Feb 2027, as 28 Feb is a Sunday), plus optional 30 Sep top-up" },
                    { label: "COIDA Return of Earnings", sub: "30 June (gazetted window)" },
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


      {/* Server-rendered reference: visible without JavaScript */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="container-page max-w-4xl space-y-10">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">How the dates are worked out</h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-4">
              Dates are generated from rules, each tied to a SARS source and reviewed on {REVIEWED_ON}.
              Where a due date falls on a weekend or public holiday, SARS moves EMP201, VAT201 and
              provisional tax to the last business day before it. SARS-published filing-season windows
              are shown as published.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-white text-xs">
                    <th className="text-left px-4 py-2.5">VAT category</th>
                    <th className="text-left px-4 py-2.5">Tax period</th>
                  </tr>
                </thead>
                <tbody>
                  {VAT_CATEGORIES.map((c, i) => (
                    <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                      <td className="px-4 py-2.5 font-medium text-neutral-800">{c.name}</td>
                      <td className="px-4 py-2.5 text-neutral-600">{c.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-3 text-xs text-neutral-500 space-y-1">
              {VAT_METHODS.map((m) => (
                <li key={m.id}><strong>{m.name}:</strong> {m.dueRule}.</li>
              ))}
              <li>Category F (four-monthly) was removed in 2015; those vendors moved to Category B.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Dates that depend on you</h2>
            <ul className="space-y-3">
              {DEPENDS_ON_YOU.map((d) => (
                <li key={d.id} className="text-sm text-neutral-600 leading-relaxed">
                  <strong className="text-neutral-800">{d.title}.</strong> {d.text}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Public holidays used for adjustments</h2>
            <p className="text-xs text-neutral-500 mb-3">
              Source:{" "}
              <a href={HOLIDAYS_SOURCE.url} className="underline" rel="noopener noreferrer">{HOLIDAYS_SOURCE.title}</a>
              ; 4 November 2026 per Proclamation Notice 346 of 2026, Government Gazette 55352. A holiday on a Sunday moves to the Monday (Public Holidays Act).
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-xs text-neutral-600">
              {PUBLIC_HOLIDAYS.map((h) => (
                <li key={h.date + h.name}>
                  {h.date}: {h.name}{h.status === "unconfirmed" ? " (derived from the Act, not yet confirmed on the official list)" : ""}
                </li>
              ))}
            </ul>
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
