import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import NewsletterForm from "@/components/shared/NewsletterForm";
import BlogListing from "@/components/blog/BlogListing";
import AuthorityLinks from "@/components/shared/AuthorityLinks";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: { absolute: "Tax & Accounting Resources | Sikatrix Business Accountants" },
  description:
    "Free guides, articles, and practical advice on SARS compliance, bookkeeping, tax, and business finance — written for South African business owners.",
  alternates: { canonical: "https://www.sikatrix.com/resources" },
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
        bgImage="https://images.unsplash.com/photo-1573497161161-c3e73707e25c?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Tools pinned section */}
      <section className="py-8 bg-neutral-50 border-t-[3px] border-accent border-b border-neutral-200">
        <div className="container-page">
          <div className="rounded-2xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark p-px">
            <div className="rounded-2xl bg-gradient-to-r from-[#0a1e3d] to-[#0f2347] px-7 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Calculator size={22} className="text-accent-light" />
                  </div>
                  <div className="sm:hidden">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-0.5">Free Tool</span>
                    <p className="text-sm font-semibold text-white leading-snug">SARS Tax Calculator 2026/27</p>
                  </div>
                </div>
                <div className="sm:flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent hidden sm:block mb-1">Free Tool</span>
                  <h2 className="text-base font-semibold text-white hidden sm:block mb-1">SARS Income Tax Calculator 2026/27</h2>
                  <p className="text-sm text-white/60">
                    Calculate your PAYE, effective tax rate, medical credits, and monthly take-home instantly. Based on official SARS tables.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/tools/tax-calculator"
                    className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Open Calculator <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container-page">
          <BlogListing posts={posts} />
        </div>
      </section>

      <AuthorityLinks />

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

      <section className="py-16 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
