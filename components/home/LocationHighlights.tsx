import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { LOCATIONS } from "@/lib/site";

export default function LocationHighlights() {
  return (
    <section className="py-12 md:py-16 bg-white" style={{ background: "linear-gradient(135deg, #ffffff 0%, #eef2ff 100%)" }}>
      <div className="container-page">
        <div className="mb-12">
          <span className="section-label">Our Locations</span>
          <h2 className="section-title mt-2">
            Serving Gauteng businesses — in person and online
          </h2>
          <p className="section-subtitle mt-3">
            Headquartered in Alberton with clients across Greater Johannesburg. Cloud-based delivery
            means we serve you wherever you are.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className={`card p-6 group ${loc.isHQ ? "ring-2 ring-brand" : ""}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-brand flex-shrink-0" />
                  <span className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                    {loc.name}
                  </span>
                </div>
                {loc.isHQ && (
                  <span className="text-2xs font-semibold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                    HQ
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                {loc.intro.substring(0, 100)}…
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand group-hover:gap-2 transition-all">
                View services in {loc.name} <ArrowRight size={11} />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link href="/locations" className="btn-ghost text-sm text-brand">
            View all locations →
          </Link>
        </div>
      </div>
    </section>
  );
}
