import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { LOCATIONS } from "@/lib/site";

const LOCATION_IMAGES: Record<string, string> = {
  alberton:      "/photos/blog/provisional-tax-review.jpg",
  johannesburg:  "/photos/locations/johannesburg-highlight.jpg",
  sandton:       "/photos/blog/tax-compliance-calendar-review.jpg",
  randburg:      "/photos/locations/randburg-highlight.jpg",
  vereeniging:   "/photos/blog/hr-compliance-review.jpg",
  germiston:     "/photos/locations/germiston-highlight.jpg",
  boksburg:      "/photos/blog/bookkeeping-review-meeting.jpg",
  midrand:       "/photos/blog/sars-section-210-review.jpg",
};

export default function LocationHighlights() {
  return (
    <section className="py-16 md:py-24 bg-neutral-100">
      <div className="container-page">
        <div className="mb-12 md:mb-16">
          <span className="section-label">Our Locations</span>
          <h2 className="section-title mt-2">
            Serving Gauteng businesses, in person and online
          </h2>
          <p className="section-subtitle mt-3">
            Headquartered in Alberton with clients across Greater Johannesburg. Cloud-based delivery
            means we serve you wherever you are.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {LOCATIONS.map((loc) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className={`card overflow-hidden group ${loc.isHQ ? "ring-2 ring-brand" : ""}`}
            >
              {LOCATION_IMAGES[loc.slug] && (
                <div className="relative h-32 overflow-hidden bg-brand-50">
                  <Image
                    src={LOCATION_IMAGES[loc.slug]}
                    alt={`Professional accounting services in ${loc.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 to-transparent" />
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <MapPin size={13} className="text-white flex-shrink-0" />
                    <span className="text-sm font-semibold text-white">{loc.name}</span>
                    {loc.isHQ && (
                      <span className="text-2xs font-semibold uppercase tracking-wider text-accent bg-brand-dark/60 px-2 py-0.5 rounded">
                        HQ
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-neutral-500 leading-relaxed mb-3">
                  {loc.intro.substring(0, 100)}…
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-brand group-hover:gap-2 transition-all">
                  View services in {loc.name} <ArrowRight size={11} />
                </span>
              </div>
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
