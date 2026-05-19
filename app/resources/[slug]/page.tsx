import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import CTABlock from "@/components/shared/CTABlock";
import ArticleContent from "@/components/blog/ArticleContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import SocialShare from "@/components/blog/SocialShare";
import TableOfContents, { type TocHeading } from "@/components/blog/TableOfContents";
import {
  getAllPosts,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { SERVICES, LOCATIONS, SITE } from "@/lib/site";

// Deliberate internal backlinking: each article links to its most relevant services
const ARTICLE_SERVICE_MAP: Record<string, string[]> = {
  "sars-provisional-tax-guide-2025":                    ["tax-services", "bookkeeping", "cloud-accounting"],
  "small-business-bookkeeping-mistakes":                ["bookkeeping", "cloud-accounting", "tax-services"],
  "cloud-accounting-vs-desktop":                        ["cloud-accounting", "bookkeeping", "annual-financial-statements"],
  "registering-a-company-cipc-guide":                   ["company-secretarial", "tax-services", "bookkeeping"],
  "paye-uif-sdl-explained":                             ["payroll", "tax-services", "bookkeeping"],
  "vat-registration-when-and-how":                      ["tax-services", "bookkeeping", "annual-financial-statements"],
  "sars-efiling-business-registration":                 ["tax-services", "company-secretarial", "bookkeeping"],
  "how-to-submit-company-tax-return-itr14":             ["tax-services", "annual-financial-statements", "bookkeeping"],
  "coida-return-of-earnings-guide-south-africa":        ["payroll", "tax-services", "annual-financial-statements"],
  "workmens-compensation-south-africa":                 ["payroll", "tax-services", "bookkeeping"],
  "sme-tax-compliance-calendar-2025-2026":              ["tax-services", "bookkeeping", "payroll"],
  "mothers-day-gifts-sars-donations-tax":               ["tax-services", "bookkeeping"],
  "tax-clearance-certificate-south-africa":             ["tax-services", "company-secretarial", "bookkeeping"],
  "sars-penalties-objections-appeals":                  ["tax-services", "bookkeeping"],
  "home-office-tax-deduction-south-africa":             ["tax-services", "bookkeeping", "cloud-accounting"],
};

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const ogTitle = post.social?.ogTitle ?? post.title;
  const ogDescription = post.social?.ogDescription ?? post.description;
  const canonicalUrl = `${SITE.url}/resources/${slug}`;

  return {
    title: { absolute: `${post.title} | Sikatrix Resources` },
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "article",
      url: canonicalUrl,
      publishedTime: post.publishDate,
      modifiedTime: post.updatedDate ?? post.publishDate,
      authors: [post.author.name],
      tags: post.tags,
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              width: 1200,
              height: 630,
              alt: post.featuredImageAlt || post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: post.social?.twitterCard ?? "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: post.featuredImage ? [post.featuredImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const relatedServiceSlugs =
    ARTICLE_SERVICE_MAP[slug] ?? SERVICES.slice(0, 3).map((s) => s.slug);
  const relatedServices = relatedServiceSlugs
    .map((s) => SERVICES.find((sv) => sv.slug === s))
    .filter(Boolean);

  const relatedArticles = getRelatedPosts(post);
  const articleUrl = `${SITE.url}/resources/${slug}`;

  const tocHeadings: TocHeading[] = post.content
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter((b) => b.startsWith("## ") || b.startsWith("### "))
    .map((b) => {
      const level = b.startsWith("### ") ? 3 : 2;
      const text = b.replace(/^#{2,3} /, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      return { level, text, id } as TocHeading;
    });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishDate,
    dateModified: post.updatedDate ?? post.publishDate,
    image: post.featuredImage || undefined,
    keywords: post.tags.join(", "),
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.title,
      worksFor: {
        "@type": "AccountingService",
        name: SITE.name,
        url: SITE.url,
      },
    },
    publisher: {
      "@type": "AccountingService",
      name: SITE.name,
      url: SITE.url,
    },
    url: articleUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Hero */}
      <section className="relative bg-brand-dark py-12 md:py-16 overflow-hidden">
        {post.featuredImage && (
          <>
            <div className="absolute inset-0">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-brand-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/90 via-brand-dark/60 to-transparent" />
          </>
        )}
        <div className="container-page relative">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white">Resources</Link>
            <span>/</span>
            <span className="text-white">{post.category}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent-light">
              <Tag size={9} /> {post.category}
            </span>
            <span className="text-brand-100 text-2xs">·</span>
            <span className="text-2xs text-brand-100 flex items-center gap-1">
              <Clock size={9} /> {post.readTime}
            </span>
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-2xs text-brand-100/70 bg-white/10 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug mb-4 max-w-3xl text-balance">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-brand-100 flex-wrap">
            <Calendar size={11} />
            Published{" "}
            {new Date(post.publishDate).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {post.updatedDate && (
              <>
                <span className="opacity-40">·</span>
                <span>
                  Updated{" "}
                  {new Date(post.updatedDate).toLocaleDateString("en-ZA", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
            <span className="opacity-40">·</span>
            <span>
              By {post.author.name}, {post.author.title}
            </span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main column */}
            <div className="lg:col-span-2">
              {/* Excerpt card */}
              <div className="card p-5 mb-8 border-l-4 border-brand bg-brand-50">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  {post.description}
                </p>
              </div>

              {/* Social share — top */}
              <div className="mb-6">
                <SocialShare articleUrl={articleUrl} title={post.title} />
              </div>

              {/* Article body */}
              <ArticleContent content={post.content} />

              {/* CTA inline */}
              <div className="mt-10 p-6 rounded-xl bg-brand text-white">
                <h3 className="font-semibold mb-2">Need help with this?</h3>
                <p className="text-sm text-brand-100 mb-4">
                  Sikatrix Business Accountants handles{" "}
                  {post.category.toLowerCase()} matters for 148+ South African
                  businesses. Book a free consultation.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-accent-dark transition-colors"
                >
                  Book Free Consultation <ArrowRight size={13} />
                </Link>
              </div>

              {/* Author bio */}
              <div className="mt-8 p-5 rounded-xl bg-neutral-50 border border-neutral-200 flex gap-4 items-start">
                <div className="flex-shrink-0">
                  <Image
                    src="/about/daniel-amoah.jpg"
                    alt="Daniel Amoah — SAIPA Professional Accountant"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 mb-0.5">Daniel Amoah</p>
                  <p className="text-xs text-brand font-medium mb-2">SAIPA Professional Accountant (SA) · SARS Tax Practitioner · IBASA Member</p>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Daniel founded Sikatrix Business Accountants to give Gauteng&apos;s growing businesses access to SAIPA-registered accounting. With over 10 years in practice, he specialises in tax compliance, annual financial statements, and cloud accounting for SMEs across Alberton and Johannesburg.
                  </p>
                  <Link href="/about" className="inline-flex items-center gap-1 text-xs text-brand hover:underline mt-2 font-medium">
                    About the author <ArrowRight size={10} />
                  </Link>
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social share — bottom */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <SocialShare articleUrl={articleUrl} title={post.title} />
              </div>

              {/* Related services */}
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

              {/* Location links */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">
                  We serve clients near you
                </h3>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/locations/${l.slug}`}
                      className="text-xs text-brand hover:underline"
                    >
                      Accountants in {l.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related articles */}
              {relatedArticles.length > 0 && (
                <RelatedPosts posts={relatedArticles} />
              )}

              {/* Prev / Next navigation */}
              {(prevPost || nextPost) && (
                <div className="mt-10 pt-8 border-t border-neutral-200 grid sm:grid-cols-2 gap-3">
                  {prevPost ? (
                    <Link
                      href={`/resources/${prevPost.slug}`}
                      className="card p-4 group flex items-start gap-3 hover:border-brand/30 transition-colors"
                    >
                      <ArrowLeft
                        size={15}
                        className="text-brand mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <span className="text-2xs text-neutral-400 block mb-1">
                          ← Previous
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {prevPost.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {nextPost ? (
                    <Link
                      href={`/resources/${nextPost.slug}`}
                      className="card p-4 group flex items-start gap-3 text-right justify-end hover:border-brand/30 transition-colors"
                    >
                      <div>
                        <span className="text-2xs text-neutral-400 block mb-1">
                          Next →
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {nextPost.title}
                        </span>
                      </div>
                      <ArrowRight
                        size={15}
                        className="text-brand mt-0.5 flex-shrink-0"
                      />
                    </Link>
                  ) : (
                    <div />
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
              {/* Table of Contents */}
              {tocHeadings.length > 0 && (
                <TableOfContents headings={tocHeadings} />
              )}

              {/* Consultation CTA */}
              <div className="card p-5 bg-brand-50 border-brand/20">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                  Talk to an accountant
                </h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Questions about {post.category.toLowerCase()}? Book a free
                  30-minute consultation.
                </p>
                <Link
                  href="/contact"
                  className="btn-primary w-full justify-center text-xs"
                >
                  Book Consultation
                </Link>
              </div>

              {/* All articles by category */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">
                  All Articles
                </h3>
                <div className="space-y-5">
                  {(["Tax", "SARS Compliance", "Bookkeeping", "Business Growth"] as const).map(
                    (cat) => {
                      const catPosts = getAllPosts().filter(
                        (p) => p.category === cat
                      );
                      if (catPosts.length === 0) return null;
                      return (
                        <div key={cat}>
                          <span className="text-2xs font-semibold uppercase tracking-widest text-accent block mb-2">
                            {cat}
                          </span>
                          <ul className="space-y-3">
                            {catPosts.map((p) => (
                              <li key={p.slug}>
                                <Link
                                  href={`/resources/${p.slug}`}
                                  className={`group flex gap-2.5 items-start ${
                                    p.slug === slug
                                      ? "pointer-events-none"
                                      : ""
                                  }`}
                                >
                                  <div className="w-14 h-11 rounded-md overflow-hidden flex-shrink-0 bg-neutral-100 relative">
                                    {p.featuredImage && (
                                      <Image
                                        src={p.featuredImage}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="56px"
                                      />
                                    )}
                                  </div>
                                  <span
                                    className={`text-xs leading-snug mt-0.5 transition-colors ${
                                      p.slug === slug
                                        ? "font-semibold text-brand"
                                        : "text-neutral-600 group-hover:text-brand font-medium"
                                    }`}
                                  >
                                    {p.title}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page pb-4">
        <Link
          href="/resources"
          className="inline-flex items-center gap-2 text-sm text-brand hover:underline"
        >
          <ArrowLeft size={13} /> Back to Resources
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
