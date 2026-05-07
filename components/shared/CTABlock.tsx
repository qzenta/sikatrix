import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

interface CTABlockProps {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  primaryHref?: string;
  variant?: "brand" | "light" | "accent";
  showPhone?: boolean;
}

export default function CTABlock({
  title = "Ready to take control of your finances?",
  subtitle = "Book a free consultation with a SAIPA-registered accountant today.",
  primaryLabel = "Book Free Consultation",
  primaryHref = "/contact",
  variant = "brand",
  showPhone = true,
}: CTABlockProps) {
  const bg =
    variant === "accent"
      ? "bg-accent text-white"
      : variant === "light"
      ? "bg-neutral-50 border border-neutral-200"
      : "bg-brand text-white";

  const textColor =
    variant === "light" ? "text-neutral-900" : "text-white";
  const subtitleColor =
    variant === "light" ? "text-neutral-500" : "text-brand-100";

  return (
    <section className={`${bg} rounded-2xl p-8 md:p-12`}>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className={`text-xl md:text-2xl font-semibold mb-3 ${textColor}`}>
          {title}
        </h2>
        <p className={`text-sm leading-relaxed mb-7 ${subtitleColor}`}>{subtitle}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={primaryHref}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-accent text-white font-semibold text-sm hover:bg-accent-dark transition-colors shadow-sm"
          >
            {primaryLabel}
            <ArrowRight size={14} />
          </Link>
          {showPhone && (
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <Phone size={14} />
              {SITE.phone}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
