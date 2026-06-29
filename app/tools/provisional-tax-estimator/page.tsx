import type { Metadata } from "next";
import Link from "next/link";
import ProvisionalTaxCalculator from "@/components/tools/ProvisionalTaxCalculator";
import CTABlock from "@/components/shared/CTABlock";
import { buildFAQSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Provisional Tax Estimator South Africa 2026/27 | Sikatrix" },
  description:
    "Estimate your South African IRP6 provisional tax payment for 2026/27. Calculate 1st and 2nd period submissions based on your taxable income and PAYE.",
  alternates: { canonical: "https://www.sikatrix.com/tools/provisional-tax-estimator" },
  openGraph: {
    title: "Provisional Tax Estimator 2026/27 | Sikatrix",
    description: "Calculate your IRP6 provisional tax payment instantly — 2026/27 SARS brackets, rebates, and penalty thresholds.",
    type: "website",
    url: "https://www.sikatrix.com/tools/provisional-tax-estimator",
  },
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Provisional Tax Estimator 2026/27",
  description: "Estimate IRP6 provisional tax payments for the 2026/27 SARS tax year.",
  url: "https://www.sikatrix.com/tools/provisional-tax-estimator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR" },
  provider: { "@type": "AccountingService", name: "Sikatrix Business Accountants", url: "https://www.sikatrix.com" },
};

const FAQS = [
  {
    question: "Who must pay provisional tax in South Africa?",
    answer: "You must register as a provisional taxpayer if you receive income other than a salary — including business income, rental income, investment income, freelance income, or director fees. Employees whose only income is a salary with PAYE fully deducted are generally exempt.",
  },
  {
    question: "When are provisional tax payments due for 2026/27?",
    answer: "The first IRP6 provisional tax payment for the 2026/27 tax year is due by 31 August 2026. The second payment is due by 28 February 2027. A voluntary third payment can be made by 30 September 2027 to top up and avoid penalties.",
  },
  {
    question: "What happens if I underestimate my provisional tax?",
    answer: "If your estimate is less than 90% of your actual tax liability (or below the basic amount for lower incomes), SARS charges a 20% underestimation penalty plus interest (currently around 11.25% per annum) on the shortfall. Getting your estimate right is critical.",
  },
  {
    question: "What is the 'basic amount' for provisional tax?",
    answer: "The basic amount is the taxable income assessed in the most recent tax assessment raised by SARS. If you use the basic amount as your estimate and it is within the acceptable range, you are protected from underestimation penalties — even if your actual income turns out to be higher.",
  },
  {
    question: "Can I pay provisional tax if I am an employee?",
    answer: "Yes. If you have side income (rental, freelance work, investments) in addition to your salary, you must register as a provisional taxpayer. Your PAYE already deducted reduces the amount you owe via the IRP6 submission.",
  },
];

const faqSchema = buildFAQSchema(FAQS);

export default function ProvisionalTaxPage() {
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
            <span className="text-white">Provisional Tax Estimator</span>
          </nav>
          <span className="section-label text-accent-light mb-3 block">Free Tool</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
            Provisional Tax Estimator
            <span className="block text-lg font-normal text-brand-100 mt-1">2026/27 Tax Year · IRP6 1st & 2nd Period</span>
          </h1>
          <p className="text-sm text-brand-100 max-w-2xl">
            Estimate your IRP6 provisional tax payment based on your expected taxable income and PAYE already deducted.
            Avoid underestimation penalties with an accurate calculation.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            <div className="lg:col-span-2">
              <ProvisionalTaxCalculator />
            </div>

            <div className="space-y-5">
              {/* Key dates */}
              <div className="rounded-xl bg-brand-dark text-white p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent-light mb-4">IRP6 Key Dates</p>
                <ul className="space-y-3">
                  {[
                    { date: "31 Aug 2026", label: "1st period payment due", sub: "50% of estimated annual liability" },
                    { date: "28 Feb 2027", label: "2nd period payment due", sub: "balance of estimated liability" },
                    { date: "30 Sep 2027", label: "3rd period (voluntary)", sub: "top-up to avoid interest" },
                  ].map((item) => (
                    <li key={item.date} className="flex gap-3 items-start pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <span className="text-2xs font-semibold text-accent bg-accent/20 px-2 py-1 rounded flex-shrink-0 mt-0.5 whitespace-nowrap">{item.date}</span>
                      <div>
                        <div className="text-xs font-medium text-white">{item.label}</div>
                        <div className="text-2xs text-brand-100 mt-0.5">{item.sub}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Penalty info */}
              <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-red-600 mb-3">Penalty Thresholds</p>
                <ul className="space-y-2 text-xs text-red-800">
                  <li className="flex gap-2"><span className="text-red-500 font-bold">→</span> Must pay ≥90% of actual liability to avoid the 20% penalty</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold">→</span> Interest charged at ~11.25% p.a. on outstanding amounts</li>
                  <li className="flex gap-2"><span className="text-red-500 font-bold">→</span> Basic amount method protects against penalties if income is below R1M</li>
                </ul>
              </div>

              {/* Related tools */}
              <div className="card p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-3">Related Tools</p>
                <ul className="space-y-2">
                  <li><Link href="/tools/tax-calculator" className="text-sm text-brand hover:underline">Income Tax Calculator →</Link></li>
                  <li><Link href="/tools/vat-calculator" className="text-sm text-brand hover:underline">VAT Calculator →</Link></li>
                </ul>
              </div>

              <div className="rounded-xl bg-accent p-5 text-white">
                <p className="text-sm font-semibold mb-1">Need accurate provisional tax?</p>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  We calculate, file, and manage your IRP6 submissions — 1st and 2nd period, every year.
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-8">Frequently asked questions about provisional tax</h2>
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
