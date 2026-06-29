import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, Percent, CalendarClock, FileCheck } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";

export const metadata: Metadata = {
  title: { absolute: "Free Accounting & Tax Tools | Sikatrix Business Accountants" },
  description:
    "Free South African tax and accounting calculators — income tax, VAT, payroll, and compliance tools for SMEs and business owners.",
  alternates: { canonical: "https://www.sikatrix.com/tools" },
};

const TOOLS = [
  {
    href: "/tools/tax-calculator",
    icon: Calculator,
    title: "Income Tax Calculator",
    description: "Calculate PAYE, effective tax rate, rebates, medical credits, and take-home pay for the 2026/27 tax year.",
    badge: "Live",
    badgeColor: "bg-green-500",
  },
  {
    href: "/tools/vat-calculator",
    icon: Percent,
    title: "VAT Calculator",
    description: "Add VAT, remove VAT, or split a VAT-inclusive amount at the current 15% SARS rate. Instant results.",
    badge: "Live",
    badgeColor: "bg-green-500",
  },
  {
    href: "#",
    icon: CalendarClock,
    title: "SARS Compliance Calendar",
    description: "An interactive annual timeline of every SARS deadline — PAYE, VAT, provisional tax, AFS, CIPC, and more.",
    badge: "Coming soon",
    badgeColor: "bg-neutral-400",
  },
  {
    href: "#",
    icon: FileCheck,
    title: "Business Startup Checklist",
    description: "Step-by-step compliance checklist for new businesses — CIPC, SARS, UIF, and banking requirements.",
    badge: "Coming soon",
    badgeColor: "bg-neutral-400",
  },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero
        label="Free Tools"
        title="Tax & Accounting Calculators"
        subtitle="Practical tools to help South African business owners understand their tax obligations, estimate costs, and plan ahead."
        crumbs={[{ label: "Tools" }]}
      />

      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isLive = tool.badge === "Live";
              const Wrapper = isLive ? Link : "div";
              return (
                <Wrapper
                  key={tool.title}
                  href={isLive ? tool.href : "#"}
                  className={`card p-6 flex flex-col gap-4 group ${isLive ? "hover:shadow-md transition-shadow" : "opacity-75 cursor-default"}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-brand" />
                    </div>
                    <span className={`text-2xs font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded ${tool.badgeColor}`}>
                      {tool.badge}
                    </span>
                  </div>
                  <div>
                    <h2 className={`text-base font-semibold text-neutral-900 mb-1.5 ${isLive ? "group-hover:text-brand transition-colors" : ""}`}>
                      {tool.title}
                    </h2>
                    <p className="text-sm text-neutral-500 leading-relaxed">{tool.description}</p>
                  </div>
                  {isLive && (
                    <span className="text-xs text-brand font-medium mt-auto">Open calculator →</span>
                  )}
                </Wrapper>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-neutral-500 mb-4">
              Need a calculation we don&apos;t cover yet?{" "}
              <Link href="/contact" className="text-brand hover:underline font-medium">
                Ask us directly
              </Link>{" "}
              — our tax practitioners handle complex scenarios every day.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-neutral-100 border-t border-neutral-200">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
