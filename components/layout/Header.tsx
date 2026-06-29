"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone, PhoneCall, Calculator } from "lucide-react";
import { SITE, SERVICES, LOCATIONS, INDUSTRIES } from "@/lib/site";

type NavChild = { label: string; href: string };
type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  panelLabel?: string;
  panelDesc?: string;
  footerLabel?: string;
  isContact?: boolean;
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
  {
    label: "Industries",
    href: "/industries",
    panelLabel: "Industries",
    panelDesc: "Sector-specific accounting and tax expertise for South African businesses.",
    footerLabel: "View all industries →",
    children: INDUSTRIES.map((i) => ({
      label: i.shortTitle,
      href: `/industries/${i.slug}`,
    })),
  },
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
      { label: "⚡ Income Tax Calculator", href: "/tools/tax-calculator" },
      { label: "🧮 VAT Calculator", href: "/tools/vat-calculator" },
      { label: "📋 Provisional Tax Estimator", href: "/tools/provisional-tax-estimator" },
      { label: "All Tools →", href: "/tools" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact", isContact: true },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<Set<string>>(new Set());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobile((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Sikatrix Business Accountants"
              width={180}
              height={36}
              priority
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.filter((item) => !item.isContact).map((item) =>
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

          {/* CTA cluster + mobile toggle */}
          <div className="flex items-center gap-2.5">
            {/* Tax Calculator icon */}
            <Link
              href="/tools/tax-calculator"
              className="group relative hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-brand text-white hover:bg-brand-dark shadow-sm shadow-brand/30 transition-all duration-150"
              aria-label="Tax Calculator"
              title="Tax Calculator"
            >
              <Calculator size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-brand-dark px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                Tax Calculator
              </span>
            </Link>

            {/* Phone / Contact icon */}
            <Link
              href="/contact"
              className="group relative hidden lg:flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-white hover:bg-accent/85 shadow-sm shadow-accent/30 transition-all duration-150"
              aria-label="Contact us"
              title="Contact us"
            >
              <PhoneCall size={16} strokeWidth={2} />
              <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-brand-dark px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                Contact us
              </span>
            </Link>

            {/* Book Consultation button */}
            <Link
              href="/contact"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-lg bg-accent text-white hover:bg-accent/85 shadow-md shadow-accent/25 transition-all duration-150 tracking-wide"
            >
              Book Consultation
            </Link>

            {/* Mobile hamburger */}
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
          <div className="lg:hidden border-t border-neutral-100 bg-white max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="container-page py-3 flex flex-col gap-0.5">
              {NAV_ITEMS.map((item) => {
                const isExpanded = expandedMobile.has(item.label);
                return (
                  <div key={item.label}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex-1 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-brand hover:bg-neutral-50 rounded-md transition-colors flex items-center gap-2"
                      >
                        {item.isContact && <PhoneCall size={15} strokeWidth={2} className="flex-shrink-0 text-brand" />}
                        {item.label}
                      </Link>
                      {item.children && (
                        <button
                          onClick={() => toggleMobileSubmenu(item.label)}
                          className="p-2.5 text-neutral-400 hover:text-brand hover:bg-neutral-50 rounded-md transition-colors"
                          aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>
                    {item.children && isExpanded && (
                      <div className="ml-3 mb-1 border-l-2 border-neutral-100 pl-3">
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
                        {item.footerLabel && (
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            className="block px-3 py-2 text-xs font-semibold text-brand hover:bg-neutral-50 rounded-md transition-colors"
                          >
                            {item.footerLabel}
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
