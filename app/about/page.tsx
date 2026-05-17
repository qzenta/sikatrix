import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Award, Users, Clock, Shield, BadgeCheck } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import TrustBar from "@/components/home/TrustBar";
import CredentialsGrid from "@/components/about/CredentialsGrid";
import { SITE } from "@/lib/site";
import { buildPersonSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "About Sikatrix Business Accountants | SAIPA-Registered, Alberton" },
  description:
    "Learn about Sikatrix Business Accountants — SAIPA-registered professionals with 10+ years serving SMEs, startups, and NGOs across Gauteng.",
  alternates: { canonical: "https://www.sikatrix.com/about" },
};

const VALUES = [
  {
    icon: Shield,
    title: "Written quote before we start",
    desc: "Every engagement begins with a fixed-fee quote in writing. You know the exact cost before we touch a single transaction.",
  },
  {
    icon: Clock,
    title: "Same-day response, always",
    desc: "We respond to client queries the same business day. No queues, no call centres — a direct line to the accountant who knows your file.",
  },
  {
    icon: Users,
    title: "Reviewed before it leaves our desk",
    desc: "Every set of financial statements and every SARS submission is reviewed against a quality checklist before delivery. Confirmation sent to you every time.",
  },
  {
    icon: Award,
    title: "Current on every SARS change",
    desc: "We track SARS legislative updates, IFRS amendments, and cloud platform changes so your compliance never lags behind the law.",
  },
];

export default function AboutPage() {
  const personSchema = buildPersonSchema();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <PageHero
        label="About Us"
        title="Qualified. Local. Personally Accountable."
        subtitle="10+ years in practice, 148+ businesses served across Gauteng. One accountant who knows your file — not a rotating team."
        bgImage="https://images.pexels.com/photos/5466267/pexels-photo-5466267.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop"
        crumbs={[{ label: "About" }]}
        goldLabel
      />

      {/* Story */}
      <section className="py-12 md:py-16 bg-neutral-50 border-t-[3px] border-accent">
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

      {/* Meet the Accountant */}
      <section className="py-16 bg-brand-dark">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-14 items-center max-w-4xl mx-auto">
            {/* Headshot */}
            <div className="flex justify-center lg:justify-start">
              <div className="relative w-64 h-80 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/10">
                <Image
                  src="/about/daniel-amoah.jpg"
                  alt="Daniel Amoah — Founder, Sikatrix Business Accountants"
                  fill
                  className="object-cover object-top"
                  sizes="256px"
                  priority
                />
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-3">
                Who You&apos;re Working With
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-0 mb-4 leading-snug">
                Daniel Amoah
              </h2>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <BadgeCheck size={12} className="text-accent-light" /> SAIPA Professional Accountant (SA)
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 px-3 py-1.5 rounded-full">
                  <BadgeCheck size={12} className="text-accent-light" /> SARS Registered Tax Practitioner
                </span>
              </div>
              <div className="space-y-4 text-sm text-brand-100 leading-relaxed">
                <p>
                  With over 10 years in public practice, Daniel founded Sikatrix Business Accountants
                  on a straightforward belief: South African SMEs deserve qualified advice, delivered
                  directly — not filtered through juniors or outsourced offshore.
                </p>
                <p>
                  Every client engagement is personally overseen. When you work with Sikatrix, you
                  deal with the same accountant from onboarding through to year-end — someone who
                  knows your business, your industry, and your compliance history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-14 bg-neutral-800">
        <div className="container-page">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent block mb-2">Credentials &amp; Partners</span>
            <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-snug mt-0">Qualified, registered, and recognised</h2>
          </div>
          <CredentialsGrid />
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-16 bg-neutral-900">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">Our Values</span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug mt-0">How we work with every client</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-accent-light" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{desc}</p>
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
