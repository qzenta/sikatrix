import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import PricingTeaser from "@/components/home/PricingTeaser";
import LeadMagnet from "@/components/home/LeadMagnet";
import TestimonialsGrid from "@/components/shared/TestimonialsGrid";
import ProofModules from "@/components/home/ProofModules";
import { getLatestPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Calculator, Percent, ClipboardList } from "lucide-react";
import { buildWebSiteSchema, buildOrganizationSchema, buildLocalBusinessSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Accountants in Alberton | Sikatrix Business Accountants" },
  description:
    "SAIPA-registered accountants and SARS Tax Practitioners serving SMEs, startups and NGOs across Alberton, Johannesburg and Gauteng. Cloud accounting, tax, payroll and compliance.",
  alternates: { canonical: "https://www.sikatrix.com" },
};

export default function HomePage() {
  const latestPosts = getLatestPosts(2);
  const webSiteSchema = buildWebSiteSchema();
  const orgSchema = buildOrganizationSchema();
  const localBizSchema = buildLocalBusinessSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBizSchema) }} />
      <Hero />
      <ServicesGrid limit={4} />
      <PricingTeaser />
      <ProofModules limit={3} variant="strip" />
      <TestimonialsGrid />
      <TrustBar />
      <LeadMagnet />

      {/* Resources & Tools */}
      <section className="py-12 md:py-18 bg-neutral-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="section-label">Knowledge Centre</span>
              <h2 className="section-title mt-2">Insights & free tools</h2>
            </div>
            <Link href="/resources" className="hidden sm:inline-flex btn-ghost text-sm text-brand">
              All articles →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 mb-8">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/resources/${post.slug}`} className="card overflow-hidden group">
                {post.featuredImage && (
                  <div className="relative h-36 bg-brand-50 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <span className="inline-block text-2xs font-semibold uppercase tracking-widest text-accent mb-2">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1.5 text-2xs text-neutral-400">
                      <Calendar size={10} />
                      {new Date(post.publishDate).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <span className="text-xs text-brand flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight size={10} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Tools teaser */}
          <div className="rounded-xl border border-brand/15 bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-1.5">Free Tax Tools</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { href: "/tools/tax-calculator", label: "Income Tax Calculator", Icon: Calculator },
                  { href: "/tools/vat-calculator", label: "VAT Calculator", Icon: Percent },
                  { href: "/tools/provisional-tax-estimator", label: "Provisional Tax", Icon: ClipboardList },
                ].map(({ href, label, Icon }) => (
                  <Link key={href} href={href} className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-brand hover:text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Icon size={11} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/tools" className="btn-outline text-xs whitespace-nowrap self-start sm:self-auto">
              Explore all tools →
            </Link>
          </div>

          <div className="mt-5 text-center sm:hidden">
            <Link href="/resources" className="btn-ghost text-sm text-brand">All articles →</Link>
          </div>
        </div>
      </section>

    </>
  );
}
