import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Percent, CalendarClock, FileCheck, ClipboardList, ArrowRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";

export const metadata: Metadata = {
  title: { absolute: "Free Accounting & Tax Tools | Sikatrix Business Accountants" },
  description:
    "Free South African tax and accounting calculators — income tax, VAT, provisional tax, and compliance tools for SMEs and business owners.",
  alternates: { canonical: "https://www.sikatrix.com/tools" },
};

const LIVE_TOOLS = [
  {
    href: "/tools/tax-calculator",
    icon: Calculator,
    title: "Income Tax Calculator",
    description: "Calculate PAYE, effective tax rate, rebates, medical credits, and take-home pay for the 2026/27 tax year.",
    stat: "2026/27",
    statLabel: "Tax Year",
    accent: "bg-brand",
  },
  {
    href: "/tools/vat-calculator",
    icon: Percent,
    title: "VAT Calculator",
    description: "Add VAT, remove VAT, or split a VAT-inclusive amount at the current 15% SARS rate. Instant results.",
    stat: "15%",
    statLabel: "VAT Rate",
    accent: "bg-accent",
  },
  {
    href: "/tools/provisional-tax-estimator",
    icon: ClipboardList,
    title: "Provisional Tax Estimator",
    description: "Estimate your IRP6 1st and 2nd period provisional tax payment — and calculate how much to pay to avoid underestimation penalties.",
    stat: "IRP6",
    statLabel: "Submission",
    accent: "bg-brand-dark",
  },
];

const COMING_SOON = [
  {
    icon: CalendarClock,
    title: "SARS Compliance Calendar",
    description: "An interactive annual timeline of every SARS deadline — PAYE, VAT, provisional tax, AFS, CIPC, and more.",
  },
  {
    icon: FileCheck,
    title: "Business Startup Checklist",
    description: "Step-by-step compliance checklist for new businesses — CIPC, SARS, UIF, and banking requirements.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        label="Free Tools"
        title="Tax & Accounting Calculators"
        subtitle="Practical tools to help South African business owners understand their tax obligations, estimate costs, and stay ahead of SARS deadlines."
        crumbs={[{ label: "Tools" }]}
        bgImage="https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1600&h=600&dpr=1"
        size="md"
      />

      {/* Live tools */}
      <section className="py-14 md:py-20 bg-neutral-100">
        <div className="container-page">
          <div className="mb-10">
            <span className="section-label">Available Now</span>
            <h2 className="section-title mt-2">Live calculators</h2>
            <p className="section-subtitle mt-2">Free, instant, and based on current SARS figures.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LIVE_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.title}
                  href={tool.href}
                  className="group relative card overflow-hidden flex flex-col hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                >
                  {/* Coloured top band */}
                  <div className={`${tool.accent} px-6 pt-5 pb-6`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                        <Icon size={20} className="text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">{tool.stat}</div>
                        <div className="text-2xs text-white/70">{tool.statLabel}</div>
                      </div>
                    </div>
                    <h2 className="text-base font-bold text-white leading-snug">{tool.title}</h2>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6 bg-white">
                    <p className="text-sm text-neutral-500 leading-relaxed flex-1">{tool.description}</p>
                    <div className="flex items-center gap-1.5 mt-5 text-sm font-semibold text-brand group-hover:gap-3 transition-all">
                      Open calculator <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-14 md:py-20 bg-brand-dark border-t border-white/10">
        <div className="container-page">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light border-b-2 border-accent-light pb-0.5 inline-block mb-2">In Development</span>
            <h2 className="text-2xl font-bold text-white mt-2">Coming soon</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
            {COMING_SOON.map((tool) => {
              const Icon = tool.icon;
              return (
                <div key={tool.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-brand-100" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{tool.title}</h3>
                  <p className="text-xs text-brand-100 leading-relaxed">{tool.description}</p>
                  <span className="inline-block mt-3 text-2xs font-bold uppercase tracking-wider text-accent-light border border-accent-light/30 bg-accent-light/10 px-2 py-0.5 rounded">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-8 text-sm text-brand-100">
            Need a calculation we don&apos;t cover yet?{" "}
            <Link href="/contact" className="text-accent-light hover:underline font-medium">
              Ask us directly
            </Link>{" "}
            — our tax practitioners handle complex scenarios every day.
          </p>
        </div>
      </section>

      <section className="py-14 bg-neutral-900 border-t border-white/10">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
