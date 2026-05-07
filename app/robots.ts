import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/privacy-policy",
        "/terms",
        "/cookie-policy",
        "/popia",
        // Legacy WordPress paths — should never be indexed
        "/wp-admin/",
        "/wp-content/",
        "/wp-includes/",
        "/wp-login.php",
        "/wp-register.php",
        "/xmlrpc.php",
        "/feed",
        "/?p=",
        "/?page_id=",
        "/?cat=",
        "/?tag=",
        "/?s=",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
