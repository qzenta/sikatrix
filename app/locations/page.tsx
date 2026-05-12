import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, ArrowRight, Phone, Mail } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { LOCATIONS, SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Locations | Accountants Across Gauteng | Sikatrix Business Accountants" },
  description:
    "Sikatrix Business Accountants serves Alberton (HQ), Johannesburg, Sandton, Randburg, and Vereeniging. Cloud-based delivery means we work with you anywhere.",
  alternates: { canonical: "https://www.sikatrix.com/locations" },
};

export default function LocationsPage() {
  return (
    <>
      <PageHero
        label="Locations"
        title="Local Expertise. Cloud Reach. Gauteng-Wide."
        subtitle="Headquartered in Alberton with clients across Greater Johannesburg and the Vaal Triangle. We're the accounting firm that's close to home — and even closer online."
        crumbs={[{ label: "Locations" }]}
        bgImage="https://images.pexels.com/photos/14660445/pexels-photo-14660445.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop"
      />

      {/* Locations grid */}
      <section className="py-16 md:py-20 bg-brand-dark border-t-[3px] border-white/20">
        <div className="container-page">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">Service Areas</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">Serving Gauteng — and beyond</h2>
            <p className="text-sm text-brand-100 mt-3 max-w-xl mx-auto">Cloud-based delivery means distance is never a barrier. Select your area to see what we do there.</p>
          </div>
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
      <section className="py-12 bg-neutral-900">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-10 items-center max-w-4xl mx-auto">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-3">Main Office</span>
              <h2 className="text-2xl font-bold text-white mb-5">Visit us in Alberton</h2>
              <div className="space-y-4 text-sm text-white/70">
                <div className="flex gap-2.5">
                  <MapPin size={15} className="text-accent-light mt-0.5 flex-shrink-0" />
                  <span>{SITE.address.full}</span>
                </div>
                <div className="flex gap-2.5">
                  <Phone size={15} className="text-accent-light mt-0.5 flex-shrink-0" />
                  <a href={`tel:${SITE.phoneRaw}`} className="hover:text-white transition-colors">
                    {SITE.phone}
                  </a>
                </div>
                <div className="flex gap-2.5">
                  <Mail size={15} className="text-accent-light mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${SITE.email}`} className="hover:text-white transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>
              <a
                href="https://maps.google.com/?q=42+Hennie+Alberts+Street+Brackenhurst+Alberton+1448"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-semibold transition-colors"
              >
                <MapPin size={14} />
                Get Directions on Google Maps
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden ring-1 ring-white/10 h-56 bg-white/5 flex items-center justify-center">
              <div className="text-center px-6">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-3">
                  <MapPin size={24} className="text-accent-light" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">42 Hennie Alberts Street</p>
                <p className="text-xs text-white/50">Brackenhurst, Alberton, 1448</p>
                <p className="text-xs text-white/40 mt-1">Mon – Fri 08:00–17:00 · Sat 08:00–13:00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
