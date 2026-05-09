import { MetadataRoute } from "next";
import { SITE, SERVICES, LOCATIONS } from "@/lib/site";
import { getAllPosts, TOPIC_CLUSTERS } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/industries`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/locations`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/tools/tax-calculator`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.9,
    },
    {
      url: `${base}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const locationPages: MetadataRoute.Sitemap = LOCATIONS.map((l) => ({
    url: `${base}/locations/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: l.isHQ ? 0.9 : 0.8,
  }));

  const posts = getAllPosts();

  const resourcePages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${base}/resources/${p.slug}`,
    lastModified: new Date(p.updatedDate ?? p.publishDate),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const categoryPages: MetadataRoute.Sitemap = Object.keys(TOPIC_CLUSTERS).map((slug) => ({
    url: `${base}/resources/category/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticPages, ...servicePages, ...locationPages, ...resourcePages, ...categoryPages];
}
