import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, CheckCircle, Star, ArrowRight, Phone } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import GoogleMap from "@/components/shared/GoogleMap";
import { LOCATION_DETAILS } from "@/lib/location-data";
import { LOCATIONS, SERVICES, SITE } from "@/lib/site";
import { getLatestPosts } from "@/lib/blog";
import { buildLocalBusinessSchema } from "@/lib/metadata";

export async function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const loc = LOCATION_DETAILS.find((l) => l.slug === slug);
  if (!loc) return {};
  return {
    title: { absolute: loc.metaTitle },
    description: loc.metaDescription,
    alternates: { canonical: `${SITE.url}/locations/${slug}` },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loc = LOCATION_DETAILS.find((l) => l.slug === slug);
  if (!loc) notFound();

  const nearby = LOCATION_DETAILS.filter((l) => loc.nearbyLocations.includes(l.slug));
  const schema = buildLocalBusinessSchema(loc.name);
  const latestArticles = getLatestPosts(3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        label={`${loc.name}, ${loc.province}`}
        title={loc.headline}
        subtitle={loc.intro}
        crumbs={[
          { label: "Locations", href: "/locations" },
          { label: loc.name },
        ]}
        cta={{ label: `Book a consultation in ${loc.name}`, href: "/contact" }}
        bgImage="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Main content */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Body */}
            <div className="lg:col-span-2 space-y-10">
              {/* Body paragraphs */}
              <div>
                <span className="section-label">Serving {loc.name}</span>
                <h2 className="section-title mt-2 mb-5">
                  Why Sikatrix is the right accounting partner in {loc.name}
                </h2>
                <div className="space-y-4">
                  {loc.bodyParagraphs.map((p, i) => (
                    <p key={i} className="text-sm text-neutral-600 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              </div>

              {/* Local context */}
              <div className="card p-6 bg-brand-50 border-brand/20">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  The {loc.name} business landscape
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{loc.localContext}</p>
              </div>

              {/* Services */}
              <div>
                <h2 className="text-base font-semibold text-neutral-900 mb-4">
                  Services we provide in {loc.name}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {loc.keyServices.map((s) => (
                    <li key={s} className="flex items-center gap-2.5 text-sm text-neutral-700">
                      <CheckCircle size={14} className="text-brand flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Link href="/services" className="btn-outline text-sm">
                    View all services <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Testimonial */}
              <div className="card p-7">
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={13} className="fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-sm text-neutral-700 leading-relaxed italic mb-4">
                  "{loc.testimonial.body}"
                </blockquote>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">{loc.testimonial.name}</div>
                  <div className="text-xs text-neutral-400">{loc.testimonial.role}</div>
                </div>
              </div>

              {/* Map */}
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  {loc.isHQ ? "Our office" : "Serving"} {loc.name}
                </h3>
                <GoogleMap
                  query={
                    loc.isHQ
                      ? `${SITE.address.full}, South Africa`
                      : `${loc.name}, Gauteng, South Africa`
                  }
                  zoom={loc.isHQ ? 16 : 13}
                  title={`${loc.isHQ ? "Sikatrix office" : "Sikatrix serving"} ${loc.name}`}
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-5">
              {/* Contact card */}
              <div className="card p-6 sticky top-20">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                  Get in touch — {loc.name}
                </h3>
                <div className="space-y-3 mb-5">
                  <div className="flex gap-2.5 text-sm text-neutral-600">
                    <MapPin size={14} className="text-brand mt-0.5 flex-shrink-0" />
                    {loc.isHQ
                      ? SITE.address.full
                      : `Serving ${loc.name} clients remotely`}
                  </div>
                  <div className="flex gap-2.5">
                    <Phone size={14} className="text-brand mt-0.5 flex-shrink-0" />
                    <a
                      href={`tel:${SITE.phoneRaw}`}
                      className="text-sm text-brand font-medium hover:underline"
                    >
                      {SITE.phone}
                    </a>
                  </div>
                </div>
                <Link href="/contact" className="btn-primary w-full justify-center text-sm">
                  Book Free Consultation
                </Link>
                <a
                  href={`https://wa.me/${SITE.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-neutral-200 text-sm text-neutral-700 font-medium hover:bg-neutral-50 transition-colors"
                >
                  <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg viewBox="0 0 32 32" className="w-3 h-3 fill-white">
                      <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.205 6.348L4.667 27 10.2 25.5A12.95 12.95 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.09 16.41c-.26.73-1.52 1.38-2.08 1.44-.56.07-1.08.28-3.63-.76-3.04-1.24-5-4.34-5.15-4.55-.15-.21-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.43-.07.67.51.26.61.87 2.11.95 2.26.08.15.13.33.03.53-.1.2-.15.32-.29.5-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.29 1.41.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.19-.28.38-.23.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.7-.19 1.43z" />
                    </svg>
                  </span>
                  Chat on WhatsApp
                </a>

                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-xs font-medium text-neutral-500 mb-3">Popular services</p>
                  <ul className="space-y-1.5">
                    {SERVICES.slice(0, 5).map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}`}
                          className="text-xs text-brand hover:underline"
                        >
                          → {s.shortTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related resources */}
      {latestArticles.length > 0 && (
        <section className="py-12 bg-white border-t border-neutral-100">
          <div className="container-page">
            <span className="section-label">Resources</span>
            <h2 className="text-sm font-semibold text-neutral-900 mt-2 mb-5">
              Tax &amp; accounting guides for {loc.name} businesses
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="card p-5 group"
                >
                  <span className="text-2xs font-semibold uppercase tracking-widest text-accent block mb-1">
                    {article.category}
                  </span>
                  <p className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug mb-2">
                    {article.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-2xs text-brand font-medium">
                    Read guide <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Nearby locations */}
      {nearby.length > 0 && (
        <section className="py-12 bg-neutral-50 border-y border-neutral-200">
          <div className="container-page">
            <h2 className="text-sm font-semibold text-neutral-900 mb-5">
              We also serve these nearby areas
            </h2>
            <div className="flex flex-wrap gap-4">
              {nearby.map((n) => (
                <Link
                  key={n.slug}
                  href={`/locations/${n.slug}`}
                  className="card px-5 py-3 inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-brand transition-colors"
                >
                  <MapPin size={13} className="text-brand" />
                  {n.name}
                  <ArrowRight size={11} className="opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container-page">
          <CTABlock
            title={`Ready to work with accountants who know ${loc.name}?`}
            subtitle="Book a free 30-minute consultation. We'll assess your needs and explain exactly how we can help."
          />
        </div>
      </section>
    </>
  );
}
