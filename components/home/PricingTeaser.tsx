import Link from "next/link";
import { ArrowRight } from "lucide-react";

const TEASERS = [
  {
    service: "Annual Financial Statements",
    from: "R 2 500",
    period: "per set",
  },
  {
    service: "Monthly Bookkeeping",
    from: "R 1 800",
    period: "/ month",
  },
  {
    service: "Payroll Administration",
    from: "R 85",
    period: "/ employee / month",
  },
  {
    service: "Tax Returns",
    from: "R 850",
    period: "per return",
  },
];

export default function PricingTeaser() {
  return (
    <section className="py-16 md:py-24 bg-neutral-900">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light border-b-2 border-accent-light pb-0.5 block mb-2 w-fit">Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">Simple, fixed-fee accounting</h2>
            <p className="text-sm text-neutral-400 mt-2 max-w-lg">
              No hourly billing. No surprises. Every client receives a written fixed-fee quote before work begins.
            </p>
          </div>
          <Link href="/pricing" className="hidden sm:inline-flex text-sm font-medium text-accent-light hover:text-white transition-colors flex-shrink-0">
            Full pricing guide →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TEASERS.map((t) => (
            <div key={t.service} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-neutral-400 mb-3 leading-snug">{t.service}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xs text-neutral-500">from</span>
                <span className="text-lg font-bold text-accent-light">{t.from}</span>
              </div>
              <p className="text-2xs text-neutral-500 mt-0.5">{t.period}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/contact" className="btn-primary text-sm">
            Get a free, custom quote
          </Link>
          <Link href="/pricing" className="sm:hidden text-sm font-medium text-accent-light hover:text-white transition-colors">
            Full pricing guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
