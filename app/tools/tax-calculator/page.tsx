import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import TaxCalculator from "@/components/tools/TaxCalculator";
import CTABlock from "@/components/shared/CTABlock";

export const metadata: Metadata = {
  title: { absolute: "SARS Income Tax Calculator 2026/27 | Free Tool | Sikatrix" },
  description:
    "Free South African income tax calculator for the 2026/27 tax year. Instantly calculate your PAYE, effective tax rate, medical credits, and net take-home pay. Based on official SARS tax tables.",
  alternates: { canonical: "https://sikatrix.com/tools/tax-calculator" },
  openGraph: {
    title: "SARS Income Tax Calculator 2026/27 | Sikatrix",
    description:
      "Calculate your South African income tax instantly — 2026/27 SARS brackets, rebates, medical credits, and take-home pay.",
    type: "website",
    url: "https://sikatrix.com/tools/tax-calculator",
  },
};

const BRACKETS_2027 = [
  { income: "R0 – R245,100",           rate: "18%",  tax: "18% of taxable income" },
  { income: "R245,101 – R383,100",     rate: "26%",  tax: "R44,118 + 26% above R245,100" },
  { income: "R383,101 – R530,200",     rate: "31%",  tax: "R79,998 + 31% above R383,100" },
  { income: "R530,201 – R695,800",     rate: "36%",  tax: "R125,599 + 36% above R530,200" },
  { income: "R695,801 – R887,000",     rate: "39%",  tax: "R185,215 + 39% above R695,800" },
  { income: "R887,001 – R1,878,600",   rate: "41%",  tax: "R259,783 + 41% above R887,000" },
  { income: "R1,878,601+",             rate: "45%",  tax: "R666,339 + 45% above R1,878,600" },
];

const calculatorSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "SARS Income Tax Calculator 2026/27",
  description: "Free South African income tax calculator for individuals — 2026/27 tax year.",
  url: "https://sikatrix.com/tools/tax-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR" },
  provider: {
    "@type": "AccountingService",
    name: "Sikatrix Business Accountants",
    url: "https://sikatrix.com",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the income tax threshold for 2026/27 in South Africa?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For the 2026/27 tax year (1 March 2026 – 28 February 2027), the tax threshold is R99,000 for taxpayers under 65, R153,250 for taxpayers aged 65–74, and R171,300 for taxpayers aged 75 and older. If your taxable income is below these amounts, no income tax is payable.",
      },
    },
    {
      "@type": "Question",
      name: "What is the primary rebate for 2026/27?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The primary rebate for the 2026/27 tax year is R17,820. A secondary rebate of R9,765 applies to taxpayers aged 65 and over, and a tertiary rebate of R3,249 applies to taxpayers aged 75 and over.",
      },
    },
    {
      "@type": "Question",
      name: "How does the medical scheme fees tax credit work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The medical scheme fees tax credit (MTC) reduces your tax liability directly. For 2025/26, the credit is R364 per month for the main member, R364 for the first additional dependant, and R246 per month for each subsequent dependant. The MTC is applied after rebates and directly reduces the tax you owe.",
      },
    },
    {
      "@type": "Question",
      name: "What is the top marginal tax rate in South Africa for 2026/27?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The top marginal income tax rate for the 2026/27 tax year is 45%, applicable to taxable income above R1,878,600.",
      },
    },
  ],
};

export default function TaxCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-brand-dark py-12 md:py-16">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white">Resources</Link>
            <span>/</span>
            <span className="text-white">Tax Calculator</span>
          </nav>
          <span className="section-label text-accent-light mb-3 block">Free Tool</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
            South Africa Income Tax Calculator
            <span className="block text-lg font-normal text-brand-100 mt-1">2026/27 Tax Year — 1 March 2026 to 28 February 2027</span>
          </h1>
          <p className="text-sm text-brand-100 max-w-2xl">
            Calculate your PAYE, effective tax rate, and monthly take-home pay instantly.
            Based on official SARS brackets, rebates, and medical scheme credits.
          </p>
        </div>
      </section>

      {/* Calculator + Right Rail */}
      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Left: Calculator (2/3) */}
            <div className="lg:col-span-2">
              <TaxCalculator />
            </div>

            {/* Right: Reference rail (1/3) */}
            <div className="space-y-5">

              {/* Key numbers */}
              <div className="rounded-xl bg-brand-dark text-white p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent-light mb-4">
                  2026/27 Key Numbers
                </p>
                <ul className="space-y-3">
                  {[
                    { label: "Tax-free threshold", value: "R99,000", sub: "under age 65" },
                    { label: "Primary rebate", value: "R17,820", sub: "all taxpayers" },
                    { label: "Top marginal rate", value: "45%", sub: "above R1,878,600" },
                    { label: "UIF rate", value: "1%", sub: "capped at R177/month" },
                    { label: "RA deduction cap", value: "R350,000", sub: "or 27.5% of income" },
                    { label: "Company tax rate", value: "27%", sub: "flat — corporates only" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between items-start gap-3 pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div>
                        <div className="text-xs font-medium text-white">{item.label}</div>
                        <div className="text-2xs text-brand-100">{item.sub}</div>
                      </div>
                      <span className="text-sm font-bold text-accent-light flex-shrink-0">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SARS key dates */}
              <div className="card p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-4">
                  SARS Deadlines 2026
                </p>
                <ul className="space-y-3">
                  {[
                    { date: "31 May 2026", event: "EMP501 annual reconciliation" },
                    { date: "25 Jun 2026", event: "VAT201 (Apr–May vendors)" },
                    { date: "1 Jul 2026", event: "Tax season opens" },
                    { date: "31 Aug 2026", event: "Provisional tax — 1st period" },
                    { date: "20 Oct 2026", event: "Tax season closes (non-provisional)" },
                    { date: "28 Feb 2027", event: "Provisional tax — 2nd period" },
                  ].map((item) => (
                    <li key={item.date} className="flex gap-3 items-start pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
                      <span className="text-2xs font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">{item.date}</span>
                      <span className="text-xs text-neutral-600">{item.event}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Consultation CTA */}
              <div className="rounded-xl bg-accent p-5 text-white">
                <p className="text-sm font-semibold mb-1">Not sure what applies to you?</p>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  Our tax practitioners handle everything — returns, provisional tax, objections, and more.
                </p>
                <a href="/contact" className="inline-flex items-center gap-2 bg-white text-accent text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors">
                  Book free consultation →
                </a>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── TAX TABLES ── */}
      <section className="py-14 bg-neutral-100 border-t border-neutral-200">
        <div className="container-page max-w-4xl">
          <div className="text-center mb-10">
            <span className="section-label">Reference</span>
            <h2 className="section-title mt-2">2026/27 SARS Tax Tables</h2>
            <p className="text-sm text-neutral-500 mt-2">
              Tax year: 1 March 2026 – 28 February 2027 ·{" "}
              <a
                href="https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline inline-flex items-center gap-1"
              >
                Source: SARS.gov.za <ExternalLink size={10} />
              </a>
            </p>
          </div>

          {/* Brackets */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Income Tax Brackets — Individuals</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand text-white text-xs">
                    <th className="text-left px-4 py-3 rounded-tl-lg font-semibold">Taxable income</th>
                    <th className="text-center px-4 py-3 font-semibold">Marginal rate</th>
                    <th className="text-left px-4 py-3 rounded-tr-lg font-semibold">Tax payable</th>
                  </tr>
                </thead>
                <tbody>
                  {BRACKETS_2027.map((row, i) => (
                    <tr
                      key={row.income}
                      className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                    >
                      <td className="px-4 py-3 font-medium text-neutral-800">{row.income}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-block bg-brand/10 text-brand font-semibold px-2 py-0.5 rounded text-xs">
                          {row.rate}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 text-xs">{row.tax}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rebates + Thresholds side by side */}
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {/* Rebates */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Tax Rebates</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-white text-xs">
                    <th className="text-left px-4 py-2.5 rounded-tl-lg">Rebate</th>
                    <th className="text-right px-4 py-2.5 rounded-tr-lg">Annual amount</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Primary (all taxpayers)", amount: "R17,820" },
                    { label: "Secondary (age 65–74)", amount: "R9,765" },
                    { label: "Tertiary (age 75+)", amount: "R3,249" },
                  ].map((r, i) => (
                    <tr key={r.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                      <td className="px-4 py-2.5 text-neutral-700">{r.label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-neutral-900">{r.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Thresholds */}
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-4">Tax Thresholds</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-neutral-800 text-white text-xs">
                    <th className="text-left px-4 py-2.5 rounded-tl-lg">Age group</th>
                    <th className="text-right px-4 py-2.5 rounded-tr-lg">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Under 65", amount: "R99,000" },
                    { label: "Age 65 – 74", amount: "R153,250" },
                    { label: "Age 75 and older", amount: "R171,300" },
                  ].map((r, i) => (
                    <tr key={r.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                      <td className="px-4 py-2.5 text-neutral-700">{r.label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-neutral-900">{r.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Medical credits */}
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-neutral-900 mb-4">Medical Scheme Fees Tax Credit (per month)</h3>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-neutral-800 text-white text-xs">
                  <th className="text-left px-4 py-2.5 rounded-tl-lg">Beneficiary</th>
                  <th className="text-right px-4 py-2.5">Monthly credit</th>
                  <th className="text-right px-4 py-2.5 rounded-tr-lg">Annual credit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "Main member (taxpayer)", monthly: "R364", annual: "R4,368" },
                  { label: "First additional dependant", monthly: "R364", annual: "R4,368" },
                  { label: "Each further dependant", monthly: "R246", annual: "R2,952" },
                ].map((r, i) => (
                  <tr key={r.label} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                    <td className="px-4 py-2.5 text-neutral-700">{r.label}</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-neutral-900">{r.monthly}</td>
                    <td className="px-4 py-2.5 text-right text-neutral-500">{r.annual}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-neutral-400 mt-2">
              * Medical credit figures are based on 2025/26 SARS rates. 2026/27 figures will be published by SARS closer to 1 March 2026.
            </p>
          </div>

          {/* FAQ section */}
          <div className="pt-8 border-t border-neutral-100">
            <h2 className="text-lg font-semibold text-neutral-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "Who must pay income tax in South Africa?",
                  a: "Any South African resident whose taxable income exceeds the applicable tax threshold must register and pay income tax. For 2026/27, this is R99,000 for taxpayers under 65. Non-residents earning South African sourced income are also liable.",
                },
                {
                  q: "What is the difference between marginal rate and effective tax rate?",
                  a: "The marginal rate is the percentage applied to the last rand of your income. The effective (average) rate is your total tax divided by your total income. Because South Africa uses progressive tax brackets, most taxpayers pay a much lower effective rate than their marginal rate.",
                },
                {
                  q: "How does a retirement annuity (RA) reduce my tax?",
                  a: "Contributions to an approved RA or pension fund are deducted from your taxable income before tax is calculated. The deduction is limited to 27.5% of the greater of your remuneration or taxable income, capped at R350,000 per year. This means every rand you contribute to your RA could save you up to 45 cents in tax (at the top marginal rate).",
                },
                {
                  q: "What is UIF and how is it calculated?",
                  a: "The Unemployment Insurance Fund (UIF) contribution is 1% of your gross monthly salary, matched by your employer (1%). The employee contribution is capped at a monthly remuneration of R17,712, meaning the maximum employee UIF per month is R177.12.",
                },
                {
                  q: "Does this calculator apply to companies?",
                  a: "No. This calculator is for individual taxpayers (employees and sole proprietors). Companies and close corporations pay Corporate Income Tax (CIT) at a flat rate of 27%. Contact Sikatrix for assistance with company tax returns.",
                },
              ].map((item) => (
                <div key={item.q} className="border-b border-neutral-100 pb-6">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.q}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Source note */}
          <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
            <p className="text-xs text-neutral-500 leading-relaxed">
              <strong className="text-neutral-700">Data sources:</strong>{" "}
              All tax brackets, rebates, thresholds, and medical credits are sourced from the{" "}
              <a href="https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                South African Revenue Service (SARS)
              </a>
              . This calculator is updated for the 2026/27 tax year (1 March 2026 – 28 February 2027).
              Figures are for estimation purposes only. Tax law is complex — consult a{" "}
              <Link href="/contact" className="text-brand hover:underline">registered tax practitioner</Link> for advice specific to your circumstances.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-neutral-50 border-t border-neutral-200">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
