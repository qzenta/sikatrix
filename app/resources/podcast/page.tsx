import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Headphones, Clock } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import { getAllEpisodes, isEpisodePublished } from "@/lib/podcast";
import { SITE } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Sikatrix Resources Podcast | Sikatrix Business Accountants" },
  description:
    "Audio briefings on SARS compliance, tax, and bookkeeping for South African SMEs — expanding on Sikatrix's written Resources articles.",
  alternates: {
    canonical: `${SITE.url}/resources/podcast`,
    types: { "application/rss+xml": `${SITE.url}/resources/podcast/feed.xml` },
  },
};

export default function PodcastIndexPage() {
  const episodes = getAllEpisodes();
  const anyUnpublished = episodes.some((ep) => !isEpisodePublished(ep));
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Resources", url: `${SITE.url}/resources` },
    { name: "Podcast", url: `${SITE.url}/resources/podcast` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* MEDIA-001: banner derives from publishDate — see isEpisodePublished */}
      {anyUnpublished && (
        <div className="bg-amber-50 border-b border-amber-200 py-2">
          <div className="container-page text-center text-2xs font-semibold text-amber-800 uppercase tracking-wide">
            Internal preview — not published (MEDIA-001)
          </div>
        </div>
      )}

      <PageHero
        label="Podcast"
        title="Sikatrix Resources"
        subtitle="Short, practical audio briefings from Sikatrix Business Accountants on SARS compliance, tax, and bookkeeping for South African SMEs."
        crumbs={[{ label: "Resources", href: "/resources" }, { label: "Podcast" }]}
      />

      <section className="py-14">
        <div className="container-page max-w-3xl mx-auto">
          <div className="flex justify-end mb-4">
            <a
              href="/resources/podcast/feed.xml"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-brand transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19 7.38 20 6.18 20 5 20 4 19 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27zm0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93z" />
              </svg>
              Subscribe via RSS
            </a>
          </div>
          {episodes.length === 0 ? (
            <p className="text-sm text-neutral-500">No episodes yet.</p>
          ) : (
            <div className="space-y-5">
              {episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/resources/podcast/${ep.slug}`}
                  className="card p-5 flex gap-4 items-start hover:border-brand/30 transition-colors group"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 relative">
                    {ep.featuredImage && (
                      <Image
                        src={ep.featuredImage}
                        alt={ep.featuredImageAlt || ep.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent mb-1.5">
                      <Headphones size={9} /> Episode {ep.episodeNumber}
                    </span>
                    <h2 className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors leading-snug mb-1.5">
                      {ep.title}
                    </h2>
                    <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2 mb-2">
                      {ep.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-2xs text-neutral-400">
                      <Clock size={9} /> {ep.duration}
                    </span>
                  </div>
                  <ArrowRight
                    size={15}
                    className="text-brand mt-1 flex-shrink-0 ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
