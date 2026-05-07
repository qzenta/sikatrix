import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, Award, Users, Clock, Shield } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import TrustBar from "@/components/home/TrustBar";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Sikatrix Business Accountants | SAIPA-Registered, Alberton",
  description:
    "Learn about Sikatrix Business Accountants — SAIPA-registered professionals with 10+ years serving SMEs, startups, and NGOs across Gauteng.",
};

const VALUES = [
  {
    icon: Shield,
    title: "Professional Integrity",
    desc: "SAIPA-registered and SARS-compliant. We hold ourselves to the highest professional standards.",
  },
  {
    icon: Clock,
    title: "Responsive Service",
    desc: "Real accountants who answer their phones. No call centres, no runarounds.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    desc: "We build long-term partnerships, not transactional relationships. Your success is our success.",
  },
  {
    icon: Award,
    title: "Continuous Development",
    desc: "We stay current with SARS changes, IFRS updates, and cloud technology so you don't have to.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Us"
        title="Qualified Accountants Who Actually Know Your Business"
        subtitle="Founded on the belief that small and medium businesses deserve the same quality of financial advice as large corporations — without the large price tag."
        bgImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&auto=format&fit=crop&q=60"
        crumbs={[{ label: "About" }]}
      />

      {/* Story */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="section-title mt-2 mb-5">
                A decade of serving South African businesses
              </h2>
              <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
                <p>
                  Sikatrix Business Accountants was established with a clear purpose: to give South
                  African entrepreneurs access to professional, affordable, and genuinely useful
                  accounting services.
                </p>
                <p>
                  Based in Brackenhurst, Alberton, we've spent over ten years working with sole
                  proprietors, SMEs, NGOs, professional practices, and property investors — helping
                  them stay SARS-compliant, manage their cash flow, and grow with confidence.
                </p>
                <p>
                  As a SAIPA-registered Professional Accountant (SA) and SARS-registered Tax
                  Practitioner, our work is governed by professional standards that protect both you
                  and us. We take that responsibility seriously.
                </p>
                <p>
                  We've built our practice on cloud-first principles, partnering with QuickBooks,
                  Xero, Sage, and Syft so our clients get real-time financial visibility — not
                  quarterly surprises.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { value: "148+", label: "Clients Served", sub: "Across Gauteng & beyond" },
                { value: "10+", label: "Years Experience", sub: "In public practice" },
                { value: "8", label: "Core Services", sub: "Under one roof" },
                { value: "6", label: "Cloud Platforms", sub: "QuickBooks, Xero, Sage & more" },
              ].map((stat) => (
                <div key={stat.label} className="card p-6">
                  <div className="text-2xl font-bold text-brand mb-1">{stat.value}</div>
                  <div className="text-sm font-semibold text-neutral-900">{stat.label}</div>
                  <div className="text-xs text-neutral-400 mt-0.5">{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-14 bg-neutral-50">
        <div className="container-page">
          <div className="text-center mb-10">
            <span className="section-label">Credentials & Partners</span>
            <h2 className="section-title mt-2">Qualified, registered, and recognised</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {[
              {
                badge: "SAIPA",
                title: "Professional Accountant (SA)",
                desc: "Registered member of the South African Institute of Professional Accountants — your assurance of professional and ethical practice.",
              },
              {
                badge: "SARS",
                title: "Registered Tax Practitioner",
                desc: "Officially registered with the South African Revenue Service to act as your tax practitioner and submit on your behalf.",
              },
              {
                badge: "Cloud",
                title: "Cloud Accounting Specialist",
                desc: "Certified on QuickBooks, Xero, and Sage — bringing you real-time financial management without the spreadsheet chaos.",
              },
            ].map((c) => (
              <div key={c.badge} className="card p-6">
                <div className="inline-block px-2.5 py-1 rounded bg-brand text-white text-xs font-bold mb-3">
                  {c.badge}
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{c.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="section-label">Our Values</span>
            <h2 className="section-title mt-2">How we work with every client</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-brand" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />

      {/* CTA */}
      <section className="py-12">
        <div className="container-page">
          <CTABlock
            title="Want to know if we're the right fit?"
            subtitle="Book a free 30-minute consultation. We'll answer your questions and explain exactly how we can help — no obligation."
          />
        </div>
      </section>
    </>
  );
}
