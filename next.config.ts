import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.google-analytics.com https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com https://*.google-analytics.com https://*.googletagmanager.com https://*.clarity.ms",
      "font-src 'self'",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://region1.google-analytics.com https://hook.eu2.make.com https://va.vercel-analytics.com https://vitals.vercel-insights.com https://*.clarity.ms",
      "frame-src https://maps.google.com https://www.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",       value: "nosniff" },
          { key: "X-Frame-Options",               value: "SAMEORIGIN" },
          { key: "X-XSS-Protection",              value: "1; mode=block" },
          { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",            value: "camera=(), microphone=(), geolocation=(self), payment=()" },
          { key: "Strict-Transport-Security",     value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Content-Security-Policy",       value: csp },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // ── Bare domain → www (308 permanent, runs before middleware) ─────
      {
        source: "/:path*",
        has: [{ type: "host", value: "sikatrix.com" }],
        destination: "https://www.sikatrix.com/:path*",
        permanent: true,
      },

      // ── Legacy WordPress /?p= query URLs ─────────────────────────────
      {
        source: "/",
        has: [{ type: "query", key: "p" }],
        destination: "/",
        permanent: true,
      },

      // ── Legacy WordPress / cPanel page slugs ──────────────────────────
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/our-services", destination: "/services", permanent: true },
      { source: "/our-services/:slug*", destination: "/services", permanent: true },
      { source: "/blog", destination: "/resources", permanent: true },
      { source: "/blog/:slug*", destination: "/resources", permanent: true },
      { source: "/news", destination: "/resources", permanent: true },
      { source: "/news/:slug*", destination: "/resources", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },

      // ── .html / .php suffixed pages ───────────────────────────────────
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/about.html", destination: "/about", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/faq.html", destination: "/faq", permanent: true },

      // /feed → resources (middleware handles wp-admin/login/xmlrpc/etc with 410)
      { source: "/feed", destination: "/resources", permanent: true },
      { source: "/feed/:path*", destination: "/resources", permanent: true },

      // ── Legacy WordPress slug variants (with trailing slash) ──────────
      { source: "/about-us/",         destination: "/about",    permanent: true },
      { source: "/contact-us/",       destination: "/contact",  permanent: true },
      { source: "/our-services/",     destination: "/services", permanent: true },
      { source: "/blog/",             destination: "/resources", permanent: true },

      // ── Old service slugs that are still indexed ──────────────────────
      { source: "/faqs",              destination: "/faq",                       permanent: true },
      { source: "/faqs/",             destination: "/faq",                       permanent: true },
      { source: "/faqs/:path*",       destination: "/faq",                       permanent: true },
      { source: "/tax-services",      destination: "/services/tax-services",     permanent: true },
      { source: "/tax-services/",     destination: "/services/tax-services",     permanent: true },
      { source: "/cloud-accounting",  destination: "/services/cloud-accounting", permanent: true },
      { source: "/cloud-accounting/", destination: "/services/cloud-accounting", permanent: true },

      // ── GSC 404 recovery — old Axxess/WordPress service slugs ───────
      { source: "/annual-financial-statements",   destination: "/services/annual-financial-statements", permanent: true },
      { source: "/annual-financial-statements/",  destination: "/services/annual-financial-statements", permanent: true },
      { source: "/annual-financials",             destination: "/services/annual-financial-statements", permanent: true },
      { source: "/annual-financials/",            destination: "/services/annual-financial-statements", permanent: true },
      { source: "/import-export-codes",           destination: "/services/import-export-license",       permanent: true },
      { source: "/import-export-codes/",          destination: "/services/import-export-license",       permanent: true },
      { source: "/bookkeeping-services",          destination: "/services/bookkeeping",                 permanent: true },
      { source: "/bookkeeping-services/",         destination: "/services/bookkeeping",                 permanent: true },
      { source: "/business-permit-support",       destination: "/services/business-permit-support",     permanent: true },
      { source: "/business-permit-support/",      destination: "/services/business-permit-support",     permanent: true },
      { source: "/business-rescue",               destination: "/services",                             permanent: true },
      { source: "/business-rescue/",              destination: "/services",                             permanent: true },

      // ── GSC 404 recovery — old WordPress blog post ──────────────────
      {
        source: "/what-every-startup-in-johannesburg-needs-to-know-about-tax-registration",
        destination: "/resources/registering-a-company-cipc-guide",
        permanent: true,
      },
      {
        source: "/what-every-startup-in-johannesburg-needs-to-know-about-tax-registration/",
        destination: "/resources/registering-a-company-cipc-guide",
        permanent: true,
      },

      // ── GSC 404 recovery — privacy-policy nested path ───────────────
      { source: "/privacy-policy/terms-of-use",  destination: "/privacy-policy", permanent: true },
      { source: "/privacy-policy/terms-of-use/", destination: "/privacy-policy", permanent: true },

      // ── GSC 404 recovery — old location slugs (accountant-in-*) ─────
      { source: "/locations/accountant-in-randburg",     destination: "/locations/randburg",    permanent: true },
      { source: "/locations/accountant-in-randburg/",    destination: "/locations/randburg",    permanent: true },
      { source: "/locations/accountant-in-vereeniging",  destination: "/locations/vereeniging", permanent: true },
      { source: "/locations/accountant-in-vereeniging/", destination: "/locations/vereeniging", permanent: true },
      { source: "/locations/accountant-in-sandton",      destination: "/locations/sandton",     permanent: true },
      { source: "/locations/accountant-in-sandton/",     destination: "/locations/sandton",     permanent: true },
      { source: "/locations/accountant-in-pretoria",     destination: "/locations",             permanent: true },
      { source: "/locations/accountant-in-pretoria/",    destination: "/locations",             permanent: true },

      // ── Doubled privacy-policy path ───────────────────────────────────
      { source: "/privacy-policy/privacy-policy", destination: "/privacy-policy", permanent: true },
      { source: "/privacy-policy/privacy-policy/", destination: "/privacy-policy", permanent: true },

      // ── Old static HTML pages still indexed under www ─────────────────
      { source: "/services3.html",    destination: "/services", permanent: true },
      { source: "/services4.html",    destination: "/services", permanent: true },
      { source: "/services5.html",    destination: "/services", permanent: true },
      { source: "/services6.html",    destination: "/services", permanent: true },
      { source: "/careers.html",      destination: "/contact",  permanent: true },
    ];
  },
};

export default nextConfig;
