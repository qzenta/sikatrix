import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Headphones, Clock, Tag, ArrowLeft, ArrowRight } from "lucide-react";
import CTABlock from "@/components/shared/CTABlock";
import ArticleContent from "@/components/blog/ArticleContent";
import SocialShare from "@/components/blog/SocialShare";
import PodcastPlayer from "@/components/podcast/PodcastPlayer";
import { getAllEpisodes, getEpisodeBySlug, isEpisodePublished } from "@/lib/podcast";
import { getPostBySlug } from "@/lib/blog";
import { SERVICES, SITE } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/metadata";

export async function generateStaticParams() {
  return getAllEpisodes().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) return {};

  const ogTitle = episode.social?.ogTitle ?? episode.title;
  const ogDescription = episode.social?.ogDescription ?? episode.description;
  const canonicalUrl = `${SITE.url}/resources/podcast/${slug}`;
  const published = isEpisodePublished(episode);

  return {
    title: { absolute: `${episode.title} | Sikatrix` },
    description: episode.description,
    // Derived from publishDate — the single source of truth for whether
    // this episode is public. See lib/podcast.ts's isEpisodePublished.
    ...(published ? {} : { robots: { index: false, follow: false } }),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      url: canonicalUrl,
      authors: [episode.author.name],
      images: episode.featuredImage
        ? [{ url: episode.featuredImage, width: 800, height: 800, alt: episode.featuredImageAlt || episode.title }]
        : undefined,
    },
    twitter: {
      card: episode.social?.twitterCard ?? "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: episode.featuredImage ? [episode.featuredImage] : undefined,
    },
  };
}

export default async function PodcastEpisodePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episode = getEpisodeBySlug(slug);
  if (!episode) notFound();

  const episodeUrl = `${SITE.url}/resources/podcast/${slug}`;
  const published = isEpisodePublished(episode);

  const sourceArticles = episode.sourceArticles
    .map((s) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  const relatedServices = episode.relatedServices
    .map((s) => SERVICES.find((sv) => sv.slug === s))
    .filter(Boolean);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE.url },
    { name: "Resources", url: `${SITE.url}/resources` },
    { name: "Podcast", url: `${SITE.url}/resources/podcast` },
    { name: episode.title, url: episodeUrl },
  ]);

  // PodcastEpisode schema — https://schema.org/PodcastEpisode
  const podcastEpisodeSchema = {
    "@context": "https://schema.org",
    "@type": "PodcastEpisode",
    name: episode.title,
    description: episode.description,
    url: episodeUrl,
    episodeNumber: episode.episodeNumber,
    timeRequired: episode.duration,
    datePublished: published ? episode.publishDate : undefined,
    associatedMedia: episode.audioFile
      ? { "@type": "MediaObject", contentUrl: episode.audioFile }
      : undefined,
    partOfSeries: {
      "@type": "PodcastSeries",
      name: "Sikatrix Resources",
      url: `${SITE.url}/resources/podcast`,
    },
    author: {
      "@type": "Organization",
      name: episode.author.name,
    },
    publisher: {
      "@type": "AccountingService",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(podcastEpisodeSchema) }}
      />

      {/* MEDIA-001: banner derives from publishDate — see isEpisodePublished */}
      {!published && (
        <div className="bg-amber-50 border-b border-amber-200 py-2">
          <div className="container-page text-center text-2xs font-semibold text-amber-800 uppercase tracking-wide">
            Internal preview — not published (MEDIA-001)
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-brand-dark py-12 md:py-16 overflow-hidden">
        <div className="container-page relative">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white">Resources</Link>
            <span>/</span>
            <Link href="/resources/podcast" className="hover:text-white">Podcast</Link>
          </nav>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent-light">
              <Headphones size={9} /> Episode {episode.episodeNumber}
            </span>
            <span className="text-brand-100 text-2xs">·</span>
            <span className="text-2xs text-brand-100 flex items-center gap-1">
              <Clock size={9} /> {episode.duration}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug mb-4 max-w-3xl text-balance">
            {episode.title}
          </h1>
          <p className="text-sm text-brand-100 max-w-2xl leading-relaxed mb-4">
            {episode.description}
          </p>
          <div className="flex items-center gap-2 text-xs text-brand-100 flex-wrap">
            <span>
              By {episode.author.name}, {episode.author.title}
            </span>
            <span className="opacity-40">·</span>
            <span className="italic">
              {episode.publishDate
                ? new Date(episode.publishDate).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })
                : "Not yet published"}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Player */}
              <div className="mb-8">
                <PodcastPlayer
                  audioFile={episode.audioFile}
                  title={episode.title}
                  duration={episode.duration}
                />
              </div>

              {/* Listen on platforms */}
              <div className="mb-8">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-3">
                  Listen on
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { name: "Spotify", url: episode.platformLinks.spotify },
                      { name: "Apple Podcasts", url: episode.platformLinks.apple },
                      { name: "YouTube", url: episode.platformLinks.youtube },
                    ] as const
                  ).map((platform) =>
                    platform.url ? (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-brand bg-brand-50 hover:bg-brand hover:text-white transition-colors px-3 py-1.5 rounded-full"
                      >
                        {platform.name}
                      </a>
                    ) : (
                      <span
                        key={platform.name}
                        className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-full cursor-not-allowed"
                        title="Not yet submitted — MEDIA-001 distribution boundary not crossed"
                      >
                        {platform.name} (coming soon)
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Social share — top */}
              <div className="mb-6">
                <SocialShare articleUrl={episodeUrl} title={episode.title} />
              </div>

              {/* Episode body */}
              <ArticleContent content={episode.content} />

              {/* CTA inline */}
              <div className="mt-10 p-6 rounded-xl bg-brand text-white">
                <h3 className="font-semibold mb-2">Need help with this?</h3>
                <p className="text-sm text-brand-100 mb-4">
                  Sikatrix Business Accountants can review your turnover
                  against the new VAT thresholds. Book a free consultation.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-accent-dark transition-colors"
                >
                  Book Free Consultation <ArrowRight size={13} />
                </Link>
              </div>

              {/* Source articles */}
              {sourceArticles.length > 0 && (
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Source articles
                  </h3>
                  <div className="space-y-3">
                    {sourceArticles.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/resources/${post.slug}`}
                        className="card p-4 flex items-start gap-3 hover:border-brand/30 transition-colors group"
                      >
                        <Tag size={13} className="text-brand mt-0.5 flex-shrink-0" />
                        <span className="text-xs font-medium text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {post.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related tools */}
              {episode.relatedTools.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                    Related Sikatrix tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {episode.relatedTools.map((tool) => (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand hover:text-white transition-colors"
                      >
                        {tool.label} <ArrowRight size={10} />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related services */}
              {relatedServices.length > 0 && (
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                    Related services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedServices.map(
                      (s) =>
                        s && (
                          <Link
                            key={s.slug}
                            href={`/services/${s.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-brand px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand hover:text-white transition-colors"
                          >
                            {s.shortTitle} <ArrowRight size={10} />
                          </Link>
                        )
                    )}
                  </div>
                </div>
              )}

              {/* Social share — bottom */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <SocialShare articleUrl={episodeUrl} title={episode.title} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {episode.featuredImage && (
                  <div className="card p-5">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-100">
                      <Image
                        src={episode.featuredImage}
                        alt={episode.featuredImageAlt || episode.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 320px"
                      />
                    </div>
                  </div>
                )}
                <div className="card p-5 bg-brand-50 border-brand/20">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                    Talk to an accountant
                  </h3>
                  <p className="text-xs text-neutral-500 mb-4">
                    Questions about VAT registration? Book a free 30-minute
                    consultation.
                  </p>
                  <Link
                    href="/contact"
                    className="btn-primary w-full justify-center text-xs"
                  >
                    Book Consultation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page pb-4">
        <Link
          href="/resources/podcast"
          className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
        >
          <ArrowLeft size={13} /> Back to Podcast
        </Link>
      </div>

      <section className="py-14 bg-neutral-50 border-t border-neutral-200">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
