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
    <section className="py-14 bg-white border-y border-neutral-100">
      <div className="container-page">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="section-label">Pricing</span>
            <h2 className="section-title mt-2">Simple, fixed-fee accounting</h2>
            <p className="text-sm text-neutral-500 mt-2 max-w-lg">
              No hourly billing. No surprises. Every client receives a written fixed-fee quote before work begins.
            </p>
          </div>
          <Link href="/pricing" className="hidden sm:inline-flex btn-ghost text-sm text-brand flex-shrink-0">
            Full pricing guide →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TEASERS.map((t) => (
            <div key={t.service} className="rounded-xl border border-neutral-100 bg-slate-50 p-5">
              <p className="text-xs text-neutral-500 mb-3 leading-snug">{t.service}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xs text-neutral-400">from</span>
                <span className="text-lg font-bold text-brand">{t.from}</span>
              </div>
              <p className="text-2xs text-neutral-400 mt-0.5">{t.period}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
          <Link href="/contact" className="btn-primary text-sm">
            Get a custom quote — it's free
          </Link>
          <Link href="/pricing" className="sm:hidden btn-ghost text-sm text-brand">
            Full pricing guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
