import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, ShieldCheck, Globe, ArrowRight
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Accounting & Tax Services | Sikatrix Business Accountants" },
  description:
    "Full-spectrum accounting services: annual financial statements, tax returns, bookkeeping, payroll, cloud accounting, company secretarial, and business rescue.",
  alternates: { canonical: "https://www.sikatrix.com/services" },
};

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud, Briefcase, ShieldCheck, Globe,
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        label="Our Services"
        title="Everything Your Business Needs — Under One Roof"
        subtitle="From annual financial statements to monthly payroll, we handle every financial obligation so you can focus on running your business."
        bgImage="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&auto=format&fit=crop&q=60"
        crumbs={[{ label: "Services" }]}
        cta={{ label: "Book Free Consultation", href: "/contact" }}
      />

      {/* Services grid */}
      <section className="py-16 md:py-20 bg-brand-dark">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">Fixed-fee services, no surprises</h2>
            <p className="text-sm text-brand-100 mt-3 max-w-xl mx-auto">Every engagement starts with a written quote. You know the cost before we touch a single transaction.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const Icon = ICON_MAP[service.icon] ?? FileText;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="card p-7 group"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-11 h-11 rounded-lg bg-brand-50 flex items-center justify-center flex-shrink-0 group-hover:bg-brand transition-colors">
                      <Icon size={19} className="text-brand group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-neutral-900 mb-1 group-hover:text-brand transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-xs text-neutral-500 leading-relaxed">{service.summary}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand">
                    Learn more <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries teaser */}
      <section className="py-12 bg-neutral-900">
        <div className="container-page text-center">
          <p className="text-sm text-white/70 mb-3">
            We serve clients across multiple industries — from medical practices to property investors.
          </p>
          <Link href="/industries" className="btn-outline text-sm border-white/30 text-white hover:bg-white/10">
            View industries we serve
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
