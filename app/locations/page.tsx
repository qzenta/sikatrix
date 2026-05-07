import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Phone, Mail } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { LOCATIONS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Locations | Accountants Across Gauteng | Sikatrix",
  description:
    "Sikatrix Business Accountants serves Alberton (HQ), Johannesburg, Sandton, Randburg, and Vereeniging. Cloud-based delivery means we work with you anywhere.",
  alternates: { canonical: "https://sikatrix.com/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        label="Locations"
        title="Local Expertise. Cloud Reach. Gauteng-Wide."
        subtitle="Headquartered in Alberton with clients across Greater Johannesburg and the Vaal Triangle. We're the accounting firm that's close to home — and even closer online."
        crumbs={[{ label: "Locations" }]}
        bgImage="https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Locations grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {LOCATIONS.map((loc) => (
              <Link
                key={loc.slug}
                href={`/locations/${loc.slug}`}
                className={`card p-7 group ${loc.isHQ ? "ring-2 ring-brand col-span-full lg:col-span-1" : ""}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center group-hover:bg-brand transition-colors">
                      <MapPin size={15} className="text-brand group-hover:text-white transition-colors" />
                    </div>
                    <h2 className="text-base font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                      {loc.name}
                    </h2>
                  </div>
                  {loc.isHQ && (
                    <span className="text-2xs font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded">
                      Main Office
                    </span>
                  )}
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{loc.intro}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {loc.keywords.map((kw) => (
                    <span key={kw} className="text-2xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-500">
                      {kw}
                    </span>
                  ))}
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand group-hover:gap-2 transition-all">
                  View services in {loc.name} <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Office info */}
      <section className="py-12 bg-neutral-50 border-y border-neutral-200">
        <div className="container-page">
          <div className="max-w-xl">
            <span className="section-label">Main Office</span>
            <h2 className="section-title mt-2 mb-5">Visit us in Alberton</h2>
            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex gap-2.5">
                <MapPin size={15} className="text-brand mt-0.5 flex-shrink-0" />
                <span>{SITE.address.full}</span>
              </div>
              <div className="flex gap-2.5">
                <Phone size={15} className="text-brand mt-0.5 flex-shrink-0" />
                <a href={`tel:${SITE.phoneRaw}`} className="hover:text-brand transition-colors">
                  {SITE.phone}
                </a>
              </div>
              <div className="flex gap-2.5">
                <Mail size={15} className="text-brand mt-0.5 flex-shrink-0" />
                <a href={`mailto:${SITE.email}`} className="hover:text-brand transition-colors">
                  {SITE.email}
                </a>
              </div>
            </div>
            {/* Map placeholder */}
            <div className="mt-6 rounded-xl bg-neutral-200 h-48 flex items-center justify-center text-sm text-neutral-500">
              <div className="text-center">
                <MapPin size={24} className="mx-auto mb-2 text-neutral-400" />
                <p>Map — 42 Hennie Alberts Street, Brackenhurst, Alberton</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
