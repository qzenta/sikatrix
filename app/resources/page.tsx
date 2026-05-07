import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import NewsletterForm from "@/components/shared/NewsletterForm";
import { BLOG_POSTS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tax & Accounting Resources | Sikatrix Business Accountants",
  description:
    "Free guides, articles, and practical advice on SARS compliance, bookkeeping, tax, and business finance — written for South African business owners.",
  alternates: { canonical: "https://sikatrix.com/resources" },
};

const CATEGORIES = ["All", "Tax", "SARS Compliance", "Bookkeeping", "Business Growth"];

export default function ResourcesPage() {
  return (
    <>
      <PageHero
        label="Resources"
        title="Tax & Accounting Insights for South African Businesses"
        subtitle="Free, practical articles written by qualified accountants. No jargon, no filler. Just guidance you can act on."
        crumbs={[{ label: "Resources" }]}
        bgImage="https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=1600&auto=format&fit=crop&q=60"
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="container-page">
          {/* Category filter — static for now */}
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  cat === "All"
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Featured article */}
          {BLOG_POSTS.filter((p) => p.featured).map((post) => (
            <Link
              key={post.slug}
              href={`/resources/${post.slug}`}
              className="card p-7 mb-8 flex flex-col sm:flex-row gap-6 group"
            >
              <div className="sm:w-2/3">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent">
                    <Tag size={9} /> {post.category}
                  </span>
                  <span className="text-neutral-200">·</span>
                  <span className="text-2xs text-neutral-400 flex items-center gap-1">
                    <Clock size={9} /> {post.readTime}
                  </span>
                  <span className="text-2xs font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded">
                    Featured
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 leading-snug mb-3 group-hover:text-brand transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-brand">
                  Read article <ArrowRight size={13} />
                </span>
              </div>
              <div className="sm:w-1/3 rounded-lg overflow-hidden min-h-32 bg-brand-50">
                {post.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover min-h-32"
                  />
                ) : (
                  <div className="w-full min-h-32 h-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center">
                    <span className="text-4xl opacity-60">📊</span>
                  </div>
                )}
              </div>
            </Link>
          ))}

          {/* Article grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BLOG_POSTS.filter((p) => !p.featured).map((post) => (
              <Link key={post.slug} href={`/resources/${post.slug}`} className="card p-6 group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xs font-semibold uppercase tracking-widest text-accent">
                    {post.category}
                  </span>
                  <span className="text-neutral-200">·</span>
                  <span className="text-2xs text-neutral-400">{post.readTime}</span>
                </div>
                <h2 className="text-sm font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                  {post.title}
                </h2>
                <p className="text-xs text-neutral-500 leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xs text-neutral-400 flex items-center gap-1">
                    <Calendar size={9} />
                    {new Date(post.date).toLocaleDateString("en-ZA", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Read <ArrowRight size={10} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-14 bg-brand-dark">
        <div className="container-page max-w-2xl text-center">
          <span className="section-label text-accent-light">Newsletter</span>
          <h2 className="text-xl font-semibold text-white mt-2 mb-3">
            Monthly tax tips — straight to your inbox
          </h2>
          <p className="text-sm text-brand-100 mb-6">
            Practical compliance reminders, SARS deadline alerts, and business finance tips.
            No spam. Unsubscribe at any time.
          </p>
          <NewsletterForm />
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
