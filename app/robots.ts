import { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/privacy-policy", "/terms", "/cookie-policy", "/popia"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
