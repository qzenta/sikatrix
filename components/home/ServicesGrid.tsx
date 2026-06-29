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

export default function ServicesGrid({ limit }: { limit?: number } = {}) {
  const visibleServices = limit ? SERVICES.slice(0, limit) : SERVICES;

  return (
    <section className="py-12 md:py-18 bg-neutral-100">
      <div className="container-page">
        <AnimateIn className="text-center mb-10 md:mb-12">
          <span className="section-label">What We Do</span>
          <h2 className="section-title mt-2">
            Accounting & tax services for South African SMEs
          </h2>
          <p className="section-subtitle mt-2 mx-auto">
            Fixed-fee. SAIPA-registered. No hourly billing.
          </p>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleServices.map((service, i) => {
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

        <AnimateIn className="text-center mt-7" delay={200}>
          <Link href="/services" className="btn-outline text-sm">
            View all services
          </Link>
        </AnimateIn>
      </div>
    </section>
  );
}
