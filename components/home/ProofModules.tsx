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

export default function ProofModules({ limit, variant = "full" }: { limit?: number; variant?: "full" | "strip" } = {}) {
  const visibleCases = limit ? CASES.slice(0, limit) : CASES;

  // Compact homepage strip — metric + outcome only
  if (variant === "strip") {
    return (
      <section className="py-12 md:py-16 bg-brand-dark border-t border-white/10">
        <div className="container-page">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-light border-b-2 border-accent-light pb-0.5 inline-block mb-2">Client Results</span>
              <h2 className="text-2xl font-bold text-white">Real problems. Measurable outcomes.</h2>
            </div>
            <Link href="/about#client-results" className="text-sm font-medium text-accent-light hover:text-white transition-colors flex-shrink-0">
              View all results →
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 rounded-2xl border border-white/10 overflow-hidden">
            {CASES.slice(0, 3).map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.sector} className="px-7 py-7 bg-white/5 hover:bg-white/8 transition-colors">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className="text-accent-light" />
                    </div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-brand-100">{c.sector}</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-accent-light">{c.metric}</span>
                    <p className="text-xs text-brand-100 mt-0.5">{c.metricLabel}</p>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed mb-4">{c.outcome}</p>
                  <Link href={c.href} className="inline-flex items-center gap-1 text-xs font-medium text-accent-light hover:underline">
                    {c.service} <ArrowRight size={10} />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Link href="/contact" className="btn-primary text-sm">Book Free Consultation</Link>
            <Link href="/about#client-results" className="text-sm text-brand-100 hover:text-white transition-colors sm:hidden">
              View all client results →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Full narrative cards — used on /about and standalone pages
  return (
    <section className="py-14 md:py-20 bg-white border-t border-neutral-100">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 md:mb-14">
          <div>
            <span className="section-label">Client Results</span>
            <h2 className="section-title mt-2">Real problems we&apos;ve solved</h2>
            <p className="mt-2 text-sm text-neutral-500 max-w-xl">
              Details are representative of client outcomes.
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
                <div className="px-6 pt-6 pb-4 border-b border-neutral-200 bg-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-brand" />
                    </div>
                    <span className="text-2xs font-semibold uppercase tracking-widest text-neutral-400">{c.sector}</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-brand">{c.metric}</span>
                    <span className="text-xs text-neutral-400">{c.metricLabel}</span>
                  </div>
                </div>

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

                <div className="px-6 pb-5">
                  <Link href={c.href} className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline">
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
