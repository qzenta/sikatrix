import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp, Rocket, Stethoscope, Scale, Home, Heart, GraduationCap, Compass, ArrowRight
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { INDUSTRIES } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Industries We Serve | Sikatrix Business Accountants" },
  description:
    "From medical practices to NGOs, property investors to startups — Sikatrix provides sector-specific accounting and tax services across South Africa.",
  alternates: { canonical: "https://www.sikatrix.com/industries" },
};

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Rocket, Stethoscope, Scale, Home, Heart, GraduationCap, Compass,
};

const INDUSTRY_DETAIL: Record<string, { services: string[]; highlight: string }> = {
  "SMEs & Growing Businesses": {
    services: ["Bookkeeping", "VAT returns", "Payroll", "Annual Financial Statements", "Tax planning"],
    highlight: "We grow with you — from a sole proprietor startup to a 50-person team.",
  },
  "Startups & New Companies": {
    services: ["Company registration (CIPC)", "Cloud accounting setup", "SARS registration", "First-year compliance"],
    highlight: "Get your compliance right from day one. We've helped 40+ startups launch cleanly.",
  },
  "Medical & Healthcare": {
    services: ["Practice revenue reconciliation", "Staff payroll", "SARS submissions", "HPCSA compliance support"],
    highlight: "We understand the unique billing and compliance environment of private healthcare.",
  },
  "Legal Professionals": {
    services: ["Trust account reconciliations", "LSSA compliance support", "Practice bookkeeping", "Tax returns"],
    highlight: "Trust account accuracy is non-negotiable. We handle it with precision.",
  },
  "Property Investors": {
    services: ["Rental income tax", "Provisional tax", "Capital Gains Tax", "Property entity structuring"],
    highlight: "Property tax is complex. We ensure you claim every deduction you're entitled to.",
  },
  "NGOs & Nonprofits": {
    services: ["SARS PBO application", "Donor-ready AFS", "CIPC NPC registration", "Grant reporting"],
    highlight: "We've secured PBO status for multiple NPOs — unlocking tax exemptions and donor confidence.",
  },
  "Private Schools": {
    services: ["School fee income accounting", "Payroll for teaching staff", "SARS compliance", "AFS preparation"],
    highlight: "Education entities have unique accounting needs. We understand the sector.",
  },
  "Architecture & Engineering": {
    services: ["Project-based bookkeeping", "WIP accounting", "Payroll", "Provisional tax"],
    highlight: "We track project profitability and keep your practice financially healthy.",
  },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        label="Industries"
        title="Sector-Specific Expertise. Real-World Results."
        subtitle="We don't just know accounting — we know your industry. From healthcare to nonprofits, we tailor our services to your specific compliance environment."
        crumbs={[{ label: "Industries" }]}
        bgImage="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Grid */}
      <section className="py-16 md:py-20 bg-brand-dark">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">Sectors We Serve</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">Accounting built around your industry</h2>
            <p className="text-sm text-brand-100 mt-3 max-w-xl mx-auto">Every sector has its own compliance landscape. We know yours.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {INDUSTRIES.map((industry) => {
              const Icon = ICON_MAP[industry.icon] ?? TrendingUp;
              const detail = INDUSTRY_DETAIL[industry.name];
              return (
                <Link key={industry.slug} href={`/industries/${industry.slug}`} className="card p-7 group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors">
                      <Icon size={19} className="text-brand group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-brand transition-colors">{industry.name}</h2>
                      <p className="text-xs text-neutral-500">{industry.desc}</p>
                    </div>
                  </div>
                  {detail && (
                    <>
                      <p className="text-xs text-brand font-medium mb-3 italic">"{detail.highlight}"</p>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {detail.services.map((s) => (
                          <span
                            key={s}
                            className="text-2xs font-medium px-2 py-0.5 rounded bg-brand-50 text-brand"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                    View details <ArrowRight size={11} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Not listed? */}
      <section className="py-10 bg-neutral-900">
        <div className="container-page text-center">
          <h3 className="text-base font-semibold text-white mb-2">Don't see your industry?</h3>
          <p className="text-sm text-white/60 mb-4">
            We work with businesses across many sectors. If you're not sure whether we're the right fit,
            ask us — the consultation is free.
          </p>
          <Link href="/contact" className="btn-primary text-sm">
            Ask us about your industry
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
