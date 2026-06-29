import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, Clock, FileText, Cloud, Building2 } from "lucide-react";

const CASES = [
  {
    icon: FileText,
    sector: "Construction · Alberton",
    problem: "Three years of unfiled returns and mixed personal/business expenses left TM Construction unable to qualify for a R2 million tender.",
    fix: "We reconstructed 36 months of bank statements, separated personal drawings, and prepared IFRS-compliant AFS. SARS returns were filed, penalties reduced on objection.",
    outcome: "Tender-ready within 11 weeks. Overdraft facility approved by the bank the following month.",
    metric: "11 weeks",
    metricLabel: "to full compliance",
    href: "/services/annual-financial-statements",
    service: "Annual Financial Statements",
  },
  {
    icon: ShieldCheck,
    sector: "Healthcare · Johannesburg South",
    problem: "Greenleaf Pharmacy was assessed by SARS for underreported income spanning two years, with a R180k penalty notice.",
    fix: "We reviewed the assessment, identified three calculation errors, and lodged a formal objection with supporting reconciliations. SARS reduced the liability at ADR.",
    outcome: "Penalty reduced by 74%. Clean tax status restored. Now on a structured provisional tax plan.",
    metric: "74%",
    metricLabel: "penalty reduction",
    href: "/services/tax-services",
    service: "Tax Services",
  },
  {
    icon: Clock,
    sector: "Engineering · Vereeniging",
    problem: "Van Wyk Engineering's payroll was processed manually on a spreadsheet. EMP501 reconciliations were consistently late, attracting SARS penalties each year.",
    fix: "Migrated the payroll to SimplePay, set up automated EMP201 submissions, and reconstructed two years of IRP5 records for a clean reconciliation.",
    outcome: "Payroll now takes hours instead of two days per month. No further SARS payroll penalties since onboarding.",
    metric: "Zero",
    metricLabel: "SARS payroll penalties since onboarding",
    href: "/services/payroll",
    service: "Payroll Services",
  },
  {
    icon: TrendingUp,
    sector: "NGO · Sandton",
    problem: "Thrive NPO was operating without SARS PBO status, paying full income tax on donor contributions and unable to issue Section 18A receipts to donors.",
    fix: "Prepared the PBO application, supporting AFS, and constitution amendments required for SARS approval. Donor-ready financial statements prepared for annual reporting.",
    outcome: "PBO status granted within 14 months. Donor pool expanded after Section 18A receipts became available.",
    metric: "Section 18A",
    metricLabel: "receipts unlocked for donors",
    href: "/services/annual-financial-statements",
    service: "AFS + Tax Services",
  },
  {
    icon: Cloud,
    sector: "Tech Startup · Midrand",
    problem: "A two-year-old software startup had no formal accounting system — revenue tracked in Excel, invoices in email, no VAT records. Investors asked for management accounts.",
    fix: "Set up QuickBooks Online, imported 24 months of historical data, registered for VAT, and delivered the first management accounts within three weeks.",
    outcome: "Investor-ready management accounts delivered on schedule. First VAT return filed with zero penalties.",
    metric: "3 weeks",
    metricLabel: "from zero to investor-ready accounts",
    href: "/services/cloud-accounting",
    service: "Cloud Accounting",
  },
  {
    icon: Building2,
    sector: "Retail · Boksburg",
    problem: "A family-owned retail business missed three consecutive CIPC annual returns. CIPC deregistered the company, freezing the business bank account and halting trade.",
    fix: "Filed a CIPC reinstatement application, lodged all outstanding annual returns with updated beneficial ownership disclosures, and updated director details at CIPC.",
    outcome: "Company fully reinstated and banking restored within 3 days. Annual return compliance now managed on a standing mandate.",
    metric: "3 days",
    metricLabel: "from deregistration to full reinstatement",
    href: "/services/company-secretarial",
    service: "Company Secretarial",
  },
];

export default function ProofModules({ limit }: { limit?: number } = {}) {
  const visibleCases = limit ? CASES.slice(0, limit) : CASES;

  return (
    <section className="py-16 md:py-24 bg-white border-t border-neutral-100">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12 md:mb-16">
          <div>
            <span className="section-label">Client Results</span>
            <h2 className="section-title mt-2">
              Real problems we&apos;ve solved
            </h2>
            <p className="mt-3 text-sm text-neutral-500 max-w-xl">
              Situations like these are routine for us. Details are representative of client outcomes.
            </p>
          </div>
          <Link href="/contact" className="btn-primary self-start sm:self-auto whitespace-nowrap">
            Book Free Consultation <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCases.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.sector}
                className="group relative flex flex-col rounded-2xl border border-neutral-200 border-l-4 border-l-accent/40 hover:border-l-accent bg-neutral-50 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">
                      {c.sector}
                    </span>
                  </div>
                  {/* Metric callout */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-brand">{c.metric}</span>
                    <span className="text-xs text-neutral-400">{c.metricLabel}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 px-6 py-5 gap-4">
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">Problem</p>
                    <p className="text-sm text-neutral-700 leading-relaxed">{c.problem}</p>
                  </div>
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-neutral-400 mb-1">What we did</p>
                    <p className="text-sm text-neutral-600 leading-relaxed">{c.fix}</p>
                  </div>
                  <div className="mt-auto pt-3 border-t border-neutral-200">
                    <p className="text-2xs font-semibold uppercase tracking-widest text-brand mb-1">Outcome</p>
                    <p className="text-sm font-medium text-neutral-800 leading-relaxed">{c.outcome}</p>
                  </div>
                </div>

                {/* Footer link */}
                <div className="px-6 pb-5">
                  <Link
                    href={c.href}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                  >
                    {c.service} <ArrowRight size={11} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {limit && CASES.length > limit && (
          <div className="mt-8 text-center">
            <Link href="/about#client-results" className="btn-outline text-sm">
              View more client results <ArrowRight size={14} className="inline ml-1" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
