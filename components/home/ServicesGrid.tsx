import Link from "next/link";
import {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe, ArrowRight
} from "lucide-react";
import { SERVICES } from "@/lib/site";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe,
};

export default function ServicesGrid() {
  return (
    <section className="py-12 md:py-16 bg-neutral-100">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mt-2">
            Full-spectrum accounting & compliance services
          </h2>
          <p className="section-subtitle mt-3 mx-auto">
            SAIPA-registered accountants handling tax, bookkeeping, payroll, and company compliance
            — so you stay legal, minimise your tax burden, and get back to running your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? FileText;
            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="card p-5 group"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center mb-4 group-hover:bg-brand group-hover:text-white transition-colors">
                  <Icon size={18} className="text-brand group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-1.5 group-hover:text-brand transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{service.summary}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight size={11} />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link href="/services" className="btn-outline text-sm">
            View all services
          </Link>
        </div>
      </div>
    </section>
  );
}
