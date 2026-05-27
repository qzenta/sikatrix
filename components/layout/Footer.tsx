import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Facebook, Linkedin, Twitter } from "lucide-react";
import { SITE, SERVICES, LOCATIONS } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main footer */}
      <div className="container-page py-16 md:py-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <img
              src="/logo-footer.png"
              alt="Sikatrix Business Accountants"
              style={{ height: "36px", width: "auto", maxWidth: "140px", objectFit: "contain" }}
            />
          </Link>
          <p className="text-sm leading-relaxed text-neutral-400 mb-5">
            SAIPA-registered accountants and SARS Tax Practitioners. Cloud-based accounting,
            tax, and compliance for South African businesses.
          </p>
          <div className="flex gap-3">
            <a
              href={SITE.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-brand hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <Facebook size={14} />
            </a>
            <a
              href={SITE.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-brand hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
            <a
              href={SITE.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-brand hover:text-white transition-colors"
              aria-label="X / Twitter"
            >
              <Twitter size={14} />
            </a>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Services</h4>
          <ul className="space-y-2">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
          <ul className="space-y-2">
            {[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
              { label: "Pricing", href: "/pricing" },
              { label: "Industries", href: "/industries" },
              { label: "Resources", href: "/resources" },
              { label: "FAQ", href: "/faq" },
              { label: "Contact", href: "/contact" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-neutral-300 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Locations</h4>
          <ul className="space-y-2">
            {LOCATIONS.map((l) => (
              <li key={l.slug}>
                <Link
                  href={`/locations/${l.slug}`}
                  className="text-sm text-neutral-300 hover:text-white transition-colors"
                >
                  {l.name} {l.isHQ && <span className="text-2xs text-accent ml-1">(HQ)</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Contact Us</h4>
          <ul className="space-y-3">
            <li className="flex gap-2.5 text-sm text-neutral-400">
              <MapPin size={14} className="mt-0.5 text-accent flex-shrink-0" />
              <span>{SITE.address.full}</span>
            </li>
            <li>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="flex gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <Phone size={14} className="mt-0.5 text-accent flex-shrink-0" />
                {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <Mail size={14} className="mt-0.5 text-accent flex-shrink-0" />
                {SITE.email}
              </a>
            </li>
            <li className="flex gap-2.5 text-sm text-neutral-400">
              <Clock size={14} className="mt-0.5 text-accent flex-shrink-0" />
              <div>
                <div>{SITE.hours.weekdays}</div>
                <div>{SITE.hours.saturday}</div>
                <div>{SITE.hours.sunday}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Professional memberships — actual logos, uniform 80 × 36 px boxes */}
      <div className="border-t border-neutral-800">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <span className="text-2xs font-semibold uppercase tracking-widest text-neutral-600 flex-shrink-0">
            Professional Memberships
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {[
              { name: "SAIPA — Registered Professional Accountant", logo: "/partners/saipa.png" },
              { name: "IBASA — Member",                             logo: "/partners/ibasa.png" },
              { name: "SARS — Registered Tax Practitioner",         logo: "/partners/sars.png"  },
            ].map((m) => (
              <div
                key={m.name}
                title={m.name}
                className="flex items-center justify-center bg-white rounded px-3 py-1.5"
                style={{ height: 44 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={m.logo}
                  alt={m.name}
                  style={{ height: 28, width: "auto", maxWidth: 100, objectFit: "contain" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-neutral-800">
        <div className="container-page py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-neutral-600">
          <span>© {year} Sikatrix. All rights reserved.</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="hover:text-neutral-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-400 transition-colors">
              Terms
            </Link>
            <Link href="/popia" className="hover:text-neutral-400 transition-colors">
              POPIA
            </Link>
            <Link href="/cookie-policy" className="hover:text-neutral-400 transition-colors">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
