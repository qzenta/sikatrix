import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/site";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  label?: string;
  title: string;
  subtitle?: string;
  crumbs?: Crumb[];
  cta?: { label: string; href: string };
  size?: "sm" | "md" | "lg";
  bgImage?: string;
  goldLabel?: boolean;
}

export default function PageHero({
  label,
  title,
  subtitle,
  crumbs,
  cta,
  size = "md",
  bgImage,
  goldLabel = false,
}: PageHeroProps) {
  const padding =
    size === "sm" ? "py-10 md:py-14" : size === "lg" ? "py-20 md:py-28" : "py-14 md:py-20";

  return (
    <section className={`relative bg-brand-dark text-white overflow-hidden ${padding}`}>
      {/* Optional background photo */}
      {bgImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
          {/* Base dark layer */}
          <div className="absolute inset-0 bg-brand-dark/70" />
          {/* Stronger gradient anchored at bottom-left where text lives */}
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/80 via-brand-dark/40 to-transparent" />
        </>
      )}
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-[0.045] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]" />
      {/* Accent glow — top right */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl pointer-events-none" />
      {/* Subtle bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      <div className="container-page relative">
        {/* Breadcrumb */}
        {crumbs && crumbs.length > 0 && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BreadcrumbList",
                  itemListElement: [
                    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                    ...crumbs.map((c, i) => ({
                      "@type": "ListItem",
                      position: i + 2,
                      name: c.label,
                      ...(c.href ? { item: `${SITE.url}${c.href}` } : {}),
                    })),
                  ],
                }),
              }}
            />
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 mb-4 text-xs text-brand-100">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight size={11} className="opacity-60" />
                {c.href ? (
                  <Link href={c.href} className="hover:text-white transition-colors">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-white">{c.label}</span>
                )}
              </span>
            ))}
          </nav>
          </>
        )}

        <div className="max-w-2xl">
          {label && (
            <span className={`inline-block text-xs font-semibold uppercase tracking-widest mb-3 ${goldLabel ? "text-accent-light" : "text-white/80"}`}>
              {label}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug mb-4 text-balance">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base text-brand-100 leading-relaxed max-w-xl">{subtitle}</p>
          )}
          {cta && (
            <Link href={cta.href} className="btn-primary mt-6 inline-flex">
              {cta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
