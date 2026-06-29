import type { Metadata } from "next";
import Link from "next/link";
import VatCalculator from "@/components/tools/VatCalculator";
import CTABlock from "@/components/shared/CTABlock";
import { buildFAQSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Free VAT Calculator South Africa 2026 | Sikatrix" },
  description:
    "Instant South African VAT calculator. Add VAT, remove VAT, or split a VAT-inclusive amount. Based on the current 15% SARS VAT rate.",
  alternates: { canonical: "https://www.sikatrix.com/tools/vat-calculator" },
  openGraph: {
    title: "Free VAT Calculator South Africa 2026 | Sikatrix",
    description: "Add, remove, or split VAT at 15% instantly. Free tool from Sikatrix Business Accountants.",
    type: "website",
    url: "https://www.sikatrix.com/tools/vat-calculator",
  },
};

const vatCalcSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "South Africa VAT Calculator",
  description: "Free South African VAT calculator — add VAT, remove VAT, or split VAT-inclusive amounts at 15%.",
  url: "https://www.sikatrix.com/tools/vat-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "ZAR" },
  provider: {
    "@type": "AccountingService",
    name: "Sikatrix Business Accountants",
    url: "https://www.sikatrix.com",
  },
};

const FAQS = [
  {
    question: "What is the current VAT rate in South Africa?",
    answer: "The standard VAT rate in South Africa is 15%, effective from 1 April 2018. It was increased from 14% when SARS adjusted the rate. Zero-rated supplies (such as basic food items and exports) attract 0% VAT. Exempt supplies (such as residential letting and certain financial services) do not attract VAT.",
  },
  {
    question: "How do I calculate VAT on a price in South Africa?",
    answer: "To add 15% VAT to a price: multiply the amount by 1.15. For example, R1,000 × 1.15 = R1,150. To remove VAT from a VAT-inclusive price: divide by 1.15. For example, R1,150 ÷ 1.15 = R1,000.",
  },
  {
    question: "When must a business register for VAT in South Africa?",
    answer: "You must register for VAT with SARS when your taxable supplies exceed R1,000,000 in any consecutive 12-month period. You may also voluntarily register if your supplies exceed R50,000 per year. Failure to register on time attracts penalties.",
  },
  {
    question: "What is zero-rated VAT vs exempt?",
    answer: "Zero-rated supplies attract 0% VAT but you can still claim input VAT credits. Examples include basic foodstuffs, exports, and certain agricultural supplies. Exempt supplies (residential rent, financial services, educational fees) do not attract VAT and you cannot claim input tax credits on related expenses.",
  },
  {
    question: "How often must I submit VAT returns (VAT201)?",
    answer: "VAT vendors with taxable turnover below R30 million may submit bi-monthly (every 2 months). Vendors above R30 million submit monthly. SARS assigns your tax period when you register. Returns are submitted via eFiling and payment is due on the 25th of the month following the tax period.",
  },
];

const faqSchema = buildFAQSchema(FAQS);

export default function VatCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vatCalcSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* Hero */}
      <section className="bg-brand-dark py-12 md:py-16">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/tools/tax-calculator" className="hover:text-white">Tools</Link>
            <span>/</span>
            <span className="text-white">VAT Calculator</span>
          </nav>
          <span className="section-label text-accent-light mb-3 block">Free Tool</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug">
            South Africa VAT Calculator
            <span className="block text-lg font-normal text-brand-100 mt-1">Add VAT · Remove VAT · Split VAT — at 15%</span>
          </h1>
          <p className="text-sm text-brand-100 max-w-2xl">
            Calculate VAT instantly based on the current 15% SARS standard rate. Suitable for invoices, quotes, expense claims, and reconciliations.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-neutral-50">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Calculator */}
            <div className="lg:col-span-2">
              <VatCalculator />
            </div>

            {/* Right rail */}
            <div className="space-y-5">

              {/* VAT quick facts */}
              <div className="rounded-xl bg-brand-dark text-white p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent-light mb-4">VAT Quick Facts</p>
                <ul className="space-y-3">
                  {[
                    { label: "Standard rate", value: "15%", sub: "since 1 April 2018" },
                    { label: "Zero rate", value: "0%", sub: "basic foods, exports" },
                    { label: "Mandatory threshold", value: "R1M", sub: "12-month taxable supplies" },
                    { label: "Voluntary threshold", value: "R50k", sub: "minimum for voluntary reg." },
                    { label: "Return frequency", value: "Monthly / Bi-monthly", sub: "assigned by SARS on registration" },
                    { label: "VAT201 due date", value: "25th of month", sub: "following the tax period" },
                  ].map((item) => (
                    <li key={item.label} className="flex justify-between items-start gap-3 pb-3 border-b border-white/10 last:border-0 last:pb-0">
                      <div>
                        <div className="text-xs font-medium text-white">{item.label}</div>
                        <div className="text-2xs text-brand-100">{item.sub}</div>
                      </div>
                      <span className="text-xs font-bold text-accent-light flex-shrink-0 text-right">{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related tools */}
              <div className="card p-5">
                <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-3">Related Tools</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/tools/tax-calculator" className="text-sm text-brand hover:underline">
                      Income Tax Calculator (PAYE) →
                    </Link>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <div className="rounded-xl bg-accent p-5 text-white">
                <p className="text-sm font-semibold mb-1">VAT compliance concerns?</p>
                <p className="text-xs text-white/80 mb-4 leading-relaxed">
                  We register businesses for VAT, file VAT201 returns, and handle SARS VAT audits.
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-8">Frequently asked questions about VAT</h2>
          <div className="space-y-6">
            {FAQS.map((item) => (
              <div key={item.question} className="border-b border-neutral-200 pb-6">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.question}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-white rounded-lg border border-neutral-200">
            <p className="text-xs text-neutral-500 leading-relaxed">
              <strong className="text-neutral-700">Source:</strong> All VAT rates and thresholds are sourced from the{" "}
              <a href="https://www.sars.gov.za/businesses-and-employers/vat/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                South African Revenue Service (SARS)
              </a>. For advice on your specific VAT situation,{" "}
              <Link href="/contact" className="text-brand hover:underline">contact a registered tax practitioner</Link>.
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
