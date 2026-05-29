import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, ArrowRight, Download, FileText, BookOpen, ExternalLink } from "lucide-react";
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
        bgImage="https://images.pexels.com/photos/7821702/pexels-photo-7821702.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop"
      />

      {/* Tools pinned section — 2-column */}
      <section className="py-8 bg-neutral-50 border-t-[3px] border-neutral-200 border-b border-neutral-200">
        <div className="container-page">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_260px] gap-5 items-stretch">

            {/* Left — Tax Calculator card */}
            <div className="rounded-2xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark p-px">
              <div className="rounded-2xl bg-gradient-to-r from-[#0a1e3d] to-[#0f2347] px-7 py-6 h-full flex flex-col sm:flex-row sm:items-center gap-5">
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Calculator size={20} className="text-accent-light" />
                  </div>
                  <div className="sm:hidden">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-0.5">Free Tool</span>
                    <p className="text-sm font-semibold text-white leading-snug">SARS Tax Calculator 2026/27</p>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-accent hidden sm:block mb-1">Free Tool</span>
                  <h2 className="text-sm font-semibold text-white hidden sm:block mb-1">SARS Income Tax Calculator 2026/27</h2>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Calculate your PAYE, effective tax rate, medical credits, and monthly take-home instantly. Based on official SARS tables.
                  </p>
                  <div className="mt-4">
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

            {/* Right — Resource links */}
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
              <div className="px-5 py-3.5 border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center gap-2">
                  <BookOpen size={13} className="text-brand" />
                  <span className="text-xs font-bold uppercase tracking-widest text-brand">Resource Links</span>
                </div>
              </div>
              <ul className="divide-y divide-neutral-100">
                {[
                  {
                    icon: <FileText size={13} className="text-accent flex-shrink-0" />,
                    label: "SARS 2026/27 Tax Tables",
                    desc: "Official individual tax rate tables",
                    href: "https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/",
                    external: true,
                  },
                  {
                    icon: <Download size={13} className="text-accent flex-shrink-0" />,
                    label: "SARS eFiling Portal",
                    desc: "Submit returns & manage tax profile",
                    href: "https://www.sarsefiling.co.za",
                    external: true,
                  },
                  {
                    icon: <FileText size={13} className="text-accent flex-shrink-0" />,
                    label: "CIPC Company Registration",
                    desc: "Register or update your company",
                    href: "https://www.cipc.co.za",
                    external: true,
                  },
                  {
                    icon: <Download size={13} className="text-accent flex-shrink-0" />,
                    label: "SME Tax Compliance Calendar",
                    desc: "All key SARS deadlines for 2025/26",
                    href: "/resources/sme-tax-compliance-calendar-2025-2026",
                    external: false,
                  },
                  {
                    icon: <ExternalLink size={13} className="text-accent flex-shrink-0" />,
                    label: "BizPortal — Business Registration",
                    desc: "One-stop government business portal",
                    href: "https://bizportal.gov.za",
                    external: true,
                  },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors group"
                    >
                      {item.icon}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-neutral-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                      <ArrowRight size={11} className="ml-auto text-neutral-300 group-hover:text-brand flex-shrink-0 transition-colors" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-neutral-50">
        <div className="container-page">
          <div className="max-w-5xl mx-auto">
            <BlogListing posts={posts} />
          </div>
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
