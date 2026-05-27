import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import ServicesGrid from "@/components/home/ServicesGrid";
import HowItWorks from "@/components/home/HowItWorks";
import PricingTeaser from "@/components/home/PricingTeaser";
import LocationHighlights from "@/components/home/LocationHighlights";
import LeadMagnet from "@/components/home/LeadMagnet";
import TestimonialsGrid from "@/components/shared/TestimonialsGrid";
import ProofModules from "@/components/home/ProofModules";
import CTABlock from "@/components/shared/CTABlock";
import { getLatestPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar } from "lucide-react";
import { buildWebSiteSchema, buildOrganizationSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "Accountants in Alberton | Sikatrix Business Accountants" },
  description:
    "SAIPA-registered accountants and SARS Tax Practitioners serving SMEs, startups and NGOs across Alberton, Johannesburg and Gauteng. Cloud accounting, tax, payroll and compliance.",
  alternates: { canonical: "https://www.sikatrix.com" },
};

export default function HomePage() {
  const latestPosts = getLatestPosts(3);
  const webSiteSchema = buildWebSiteSchema();
  const orgSchema = buildOrganizationSchema();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <Hero />
      <TrustBar />
      <ServicesGrid />
      <HowItWorks />
      <PricingTeaser />
      <LocationHighlights />
      <LeadMagnet />
      <TestimonialsGrid />
      <ProofModules />

      {/* Blog preview */}
      <section className="py-16 md:py-24 bg-neutral-100">
        <div className="container-page">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="section-label">Resources</span>
              <h2 className="section-title mt-2">Tax & accounting insights</h2>
            </div>
            <Link href="/resources" className="hidden sm:inline-flex btn-ghost text-sm text-brand">
              View all articles →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link key={post.slug} href={`/resources/${post.slug}`} className="card overflow-hidden group">
                {post.featuredImage && (
                  <div className="relative h-40 bg-brand-50 overflow-hidden">
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <span className="inline-block text-2xs font-semibold uppercase tracking-widest text-accent mb-3">
                    {post.category}
                  </span>
                  <h3 className="text-sm font-semibold text-neutral-900 leading-snug mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">{post.description}</p>
                  <div className="flex items-center justify-between">
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
          <div className="mt-6 text-center sm:hidden">
            <Link href="/resources" className="btn-ghost text-sm text-brand">
              View all articles →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-page">
          <CTABlock
            title="Ready to simplify your accounting?"
            subtitle="Book a free 30-minute consultation. No commitment, no jargon — just straight answers about your compliance needs."
          />
        </div>
      </section>
    </>
  );
}
