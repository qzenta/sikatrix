import Link from "next/link";
import {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe, ArrowRight
} from "lucide-react";
import { SERVICES } from "@/lib/site";
import { AnimateIn } from "@/components/ui/AnimateIn";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe,
};

export default function ServicesGrid() {
  return (
    <section className="py-12 md:py-16 bg-neutral-100">
      <div className="container-page">
        <AnimateIn className="text-center mb-12">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mt-2">
            Full-spectrum accounting & compliance services
          </h2>
          <p className="section-subtitle mt-3 mx-auto">
            SAIPA-registered accountants handling tax, bookkeeping, payroll, and company compliance
            — so you stay legal, minimise your tax burden, and get back to running your business.
          </p>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? FileText;
            return (
              <AnimateIn key={service.slug} delay={i * 80} className="h-full">
                <Link
                  href={`/services/${service.slug}`}
                  className="card p-5 group block h-full"
                >
                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                    <Icon size={18} className="text-brand group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2 group-hover:text-brand transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{service.summary}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-brand mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              </AnimateIn>
            );
          })}
        </div>

        <AnimateIn className="text-center mt-8" delay={200}>
          <Link href="/services" className="btn-outline text-sm">
            View all services
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
