import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import NewsletterForm from "@/components/shared/NewsletterForm";
import BlogListing from "@/components/blog/BlogListing";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "Tax & Accounting Resources | Sikatrix Business Accountants" },
  description:
    "Free guides, articles, and practical advice on SARS compliance, bookkeeping, tax, and business finance — written for South African business owners.",
  alternates: { canonical: "https://sikatrix.com/resources" },
  openGraph: {
    title: "Tax & Accounting Resources | Sikatrix Business Accountants",
    description:
      "Free guides on SARS compliance, VAT, bookkeeping, and business finance — written by qualified accountants for South African SMEs.",
    type: "website",
    url: "https://sikatrix.com/resources",
  },
};

export default function ResourcesPage() {
  const posts = getAllPosts();

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
          <BlogListing posts={posts} />
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
            Practical compliance reminders, SARS deadline alerts, and business
            finance tips. No spam. Unsubscribe at any time.
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
