import Link from "next/link";
import {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe,
} from "lucide-react";
import { SERVICES } from "@/lib/site";
import { AnimateIn } from "@/components/ui/AnimateIn";
import { MotionServiceCard } from "@/components/home/MotionServiceCard";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, LifeBuoy, Globe,
};

export default function ServicesGrid() {
  return (
    <section className="py-16 md:py-24 bg-neutral-100">
      <div className="container-page">
        <AnimateIn className="text-center mb-12 md:mb-16">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mt-2">
            Full-spectrum accounting & compliance services
          </h2>
          <p className="section-subtitle mt-3 mx-auto">
            SAIPA-registered accountants handling tax, bookkeeping, payroll, and company compliance
            — so you stay legal, minimise your tax burden, and get back to running your business.
          </p>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((service, i) => {
            const Icon = ICON_MAP[service.icon] ?? FileText;
            return (
              <AnimateIn key={service.slug} delay={i * 80} className="h-full">
                <MotionServiceCard
                  href={`/services/${service.slug}`}
                  icon={<Icon size={18} className="text-brand group-hover:text-white transition-colors" />}
                  title={service.title}
                  summary={service.summary}
                />
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
