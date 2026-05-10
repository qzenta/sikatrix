import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { getAllPosts, getPostsByTopicCluster, TOPIC_CLUSTERS } from "@/lib/blog";
import { SITE } from "@/lib/site";

export async function generateStaticParams() {
  return Object.keys(TOPIC_CLUSTERS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cluster = TOPIC_CLUSTERS[slug];
  if (!cluster) return {};

  const title = `${cluster.label} Articles | Sikatrix Business Accountants`;
  const description = `${cluster.description} Free guides and practical advice for South African business owners.`;
  const canonicalUrl = `${SITE.url}/resources/category/${slug}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cluster = TOPIC_CLUSTERS[slug];
  if (!cluster) notFound();

  const posts = getPostsByTopicCluster(slug);
  const allPosts = getAllPosts();

  return (
    <>
      <PageHero
        label={cluster.label}
        title={`${cluster.label} Resources for South African Businesses`}
        subtitle={cluster.description}
        crumbs={[
          { label: "Resources", href: "/resources" },
          { label: cluster.label },
        ]}
        bgImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&auto=format&fit=crop&q=60"
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          {/* Topic nav */}
          <div className="flex flex-wrap gap-2 mb-10">
            {Object.entries(TOPIC_CLUSTERS).map(([clusterSlug, c]) => (
              <Link
                key={clusterSlug}
                href={`/resources/category/${clusterSlug}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  clusterSlug === slug
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {posts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/resources/${post.slug}`}
                  className="card overflow-hidden group"
                >
                  <div className="relative h-44 bg-brand-50 overflow-hidden">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.featuredImageAlt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand to-brand/70" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent">
                        <Tag size={9} /> {post.category}
                      </span>
                      <span className="text-neutral-200">·</span>
                      <span className="text-2xs text-neutral-400 flex items-center gap-1">
                        <Clock size={9} /> {post.readTime}
                      </span>
                    </div>
                    <h2 className="text-sm font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xs text-neutral-400 flex items-center gap-1">
                        <Calendar size={9} />
                        {new Date(post.publishDate).toLocaleDateString("en-ZA", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <span className="text-xs text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-sm text-neutral-500">
                No articles in this topic yet.{" "}
                <Link href="/resources" className="text-brand hover:underline">
                  Browse all resources →
                </Link>
              </p>
            </div>
          )}

          {/* Other topics */}
          <div className="mt-16 pt-10 border-t border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-5">
              Other topics
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(TOPIC_CLUSTERS)
                .filter(([s]) => s !== slug)
                .slice(0, 4)
                .map(([clusterSlug, c]) => {
                  const count = allPosts.filter(
                    (p) => p.topicCluster === clusterSlug
                  ).length;
                  return (
                    <Link
                      key={clusterSlug}
                      href={`/resources/category/${clusterSlug}`}
                      className="card p-5 group"
                    >
                      <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors mb-1">
                        {c.label}
                      </h3>
                      <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                        {c.description}
                      </p>
                      <span className="inline-flex items-center gap-1 text-2xs text-brand font-medium">
                        {count} {count === 1 ? "article" : "articles"}{" "}
                        <ArrowRight size={10} />
                      </span>
                    </Link>
                  );
                })}
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
