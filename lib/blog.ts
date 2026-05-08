import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Post, PostMeta } from "./blog-config";

// Re-export everything from config so consumers only need to import from lib/blog
export type { Post, PostMeta, PostAuthor, PostSocialMeta, BlogCategory } from "./blog-config";
export { BLOG_CATEGORIES, TOPIC_CLUSTERS } from "./blog-config";

// ─── Filesystem helpers ───────────────────────────────────────────────────────

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function getSlugsFromDir(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function parsePost(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    featuredImage: data.featuredImage ?? "",
    featuredImageAlt: data.featuredImageAlt ?? "",
    author: data.author ?? {
      name: "Sikatrix Business Accountants",
      title: "SAIPA Professional Accountant (SA)",
    },
    publishDate: data.publishDate ?? "",
    updatedDate: data.updatedDate,
    readTime: data.readTime ?? "5 min read",
    featured: data.featured ?? false,
    topicCluster: data.topicCluster ?? "",
    relatedServices: data.relatedServices ?? [],
    relatedPosts: data.relatedPosts ?? [],
    social: data.social ?? {},
    newsletterSegment: data.newsletterSegment,
    content: content.trim(),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getAllPosts(): PostMeta[] {
  return getSlugsFromDir()
    .map((slug) => parsePost(slug))
    .filter((p): p is Post => p !== null)
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
}

export function getPostBySlug(slug: string): Post | null {
  return parsePost(slug);
}

export function getPostsByCategory(category: string): PostMeta[] {
  return getAllPosts().filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getPostsByTopicCluster(cluster: string): PostMeta[] {
  return getAllPosts().filter((p) => p.topicCluster === cluster);
}

export function getRelatedPosts(post: PostMeta): PostMeta[] {
  const all = getAllPosts();
  return post.relatedPosts
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is PostMeta => p !== undefined);
}

export function getFeaturedPost(): PostMeta | undefined {
  return getAllPosts().find((p) => p.featured);
}

export function getLatestPosts(count = 3): PostMeta[] {
  return getAllPosts().slice(0, count);
}

// Compatibility shim for pages that only need the original BLOG_POSTS shape.
export function getBlogPostsCompat() {
  return getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    category: p.category,
    excerpt: p.description,
    readTime: p.readTime,
    date: p.publishDate,
    featured: p.featured,
    image: p.featuredImage,
  }));
}
