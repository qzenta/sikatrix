import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async redirects() {
    return [
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

      // ── WordPress admin / system paths (redirect to home, not 404) ────
      { source: "/wp-admin", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: true },
      { source: "/wp-login.php", destination: "/", permanent: true },
      { source: "/wp-register.php", destination: "/", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-includes/:path*", destination: "/", permanent: true },
      { source: "/feed", destination: "/resources", permanent: true },
      { source: "/feed/:path*", destination: "/resources", permanent: true },
      { source: "/xmlrpc.php", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
