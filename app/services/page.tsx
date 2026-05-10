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
        bgImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&auto=format&fit=crop&q=60"
        crumbs={[{ label: "Services" }]}
        cta={{ label: "Book Free Consultation", href: "/contact" }}
      />

      {/* Services grid */}
      <section className="py-16 md:py-20 bg-slate-50">
        <div className="container-page">
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
      <section className="py-12 bg-neutral-50 border-y border-neutral-200">
        <div className="container-page text-center">
          <p className="text-sm text-neutral-600 mb-3">
            We serve clients across multiple industries — from medical practices to property investors.
          </p>
          <Link href="/industries" className="btn-outline text-sm">
            View industries we serve
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
