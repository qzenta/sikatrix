"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { SITE, SERVICES, LOCATIONS } from "@/lib/site";

type NavChild = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  panelLabel?: string;
  panelDesc?: string;
  footerLabel?: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  {
    label: "Services",
    href: "/services",
    panelLabel: "Services",
    panelDesc: "Fixed-fee accounting and tax services for South African businesses.",
    footerLabel: "View all services →",
    children: SERVICES.slice(0, 6).map((s) => ({
      label: s.shortTitle,
      href: `/services/${s.slug}`,
    })),
  },
  { label: "Industries", href: "/industries" },
  {
    label: "Locations",
    href: "/locations",
    panelLabel: "Service Areas",
    panelDesc: "Serving clients across Gauteng and beyond.",
    footerLabel: "View all service areas →",
    children: LOCATIONS.map((l) => ({
      label: l.isHQ ? `${l.name} (HQ)` : l.name,
      href: `/locations/${l.slug}`,
    })),
  },
  {
    label: "Resources",
    href: "/resources",
    panelLabel: "Knowledge Hub",
    panelDesc: "Free articles, tools, and guides for South African business owners.",
    footerLabel: "View all resources →",
    children: [
      { label: "All Articles", href: "/resources" },
      { label: "Tax", href: "/resources/category/tax" },
      { label: "SARS Compliance", href: "/resources/category/sars" },
      { label: "Bookkeeping", href: "/resources/category/bookkeeping" },
      { label: "Business Growth", href: "/resources/category/business-growth" },
      { label: "⚡ Tax Calculator 2026/27", href: "/tools/tax-calculator" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const img = document.getElementById("site-logo") as HTMLImageElement | null;
    if (img && img.complete && img.naturalHeight > 0) {
      img.style.display = "block";
      const fb = document.getElementById("logo-fallback") as HTMLElement | null;
      if (fb) fb.style.display = "none";
    }
  }, []);

  const openDropdown = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };
  const closeDropdown = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-brand-dark text-white text-xs py-1.5">
        <div className="container-page flex justify-between items-center">
          <span className="text-brand-100 flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-light animate-pulse" />
            <span>Fixed-fee quote within one business day — no surprises, no hourly billing.</span>
            <span className="opacity-40">·</span>
            <Link href="/contact" className="underline underline-offset-2 hover:text-accent-light transition-colors">
              Book free consultation →
            </Link>
          </span>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="flex items-center gap-1 hover:text-accent-light transition-colors"
            >
              <Phone size={11} />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hover:text-accent-light transition-colors">
              {SITE.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? "shadow-nav" : "border-b border-neutral-100"
        }`}
      >
        <div className="container-page flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Sikatrix Business Accountants"
              id="site-logo"
              style={{ height: "36px", width: "auto", maxWidth: "180px", objectFit: "contain", display: "none" }}
              onLoad={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "block";
                const fallback = document.getElementById("logo-fallback");
                if (fallback) (fallback as HTMLElement).style.display = "none";
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <span id="logo-fallback" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                S
              </div>
              <span className="font-semibold text-neutral-900 text-[0.95rem]">
                Sikatrix
                <span className="text-brand text-[0.8rem] font-normal ml-0.5 hidden sm:inline">
                  {" "}Business Accountants
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => openDropdown(item.label)}
                  onMouseLeave={closeDropdown}
                >
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-md hover:bg-neutral-50 transition-colors inline-block"
                  >
                    {item.label}
                  </Link>
                  {activeDropdown === item.label && (
                    <div
                      className="absolute top-full left-0 mt-1 min-w-[190px] bg-white rounded-xl shadow-lg border border-neutral-100 py-1.5 z-50"
                      onMouseEnter={cancelClose}
                      onMouseLeave={closeDropdown}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2 text-sm text-neutral-700 hover:text-brand hover:bg-neutral-50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                      {item.footerLabel && (
                        <div className="border-t border-neutral-100 mt-1 pt-1">
                          <Link
                            href={item.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-4 py-2 text-xs font-semibold text-brand hover:bg-neutral-50 transition-colors"
                          >
                            {item.footerLabel}
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-brand rounded-md hover:bg-neutral-50 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline-flex btn-primary text-xs px-4 py-2">
              Book Consultation
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden p-2 rounded-md text-neutral-600 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t border-neutral-100 bg-white">
            <nav className="container-page py-4 flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-brand hover:bg-neutral-50 rounded-md transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <div className="ml-4 mb-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="block px-3 py-2 text-xs text-neutral-500 hover:text-brand hover:bg-neutral-50 rounded-md transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-3 pt-3 border-t border-neutral-100">
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full text-center text-sm"
                >
                  Book Consultation
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
