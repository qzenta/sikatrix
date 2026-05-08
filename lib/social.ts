import type { PostMeta } from "./blog-config";
import { SITE } from "./site";

// ─── Platform snippet generators ─────────────────────────────────────────────
// Each function returns plain text ready to paste into the relevant platform.
// Keeps snippets professional, authority-focused, and traffic-driving.

export function generateLinkedInSnippet(post: PostMeta): string {
  const url = `${SITE.url}/resources/${post.slug}`;
  const hashtags = post.tags
    .slice(0, 4)
    .map((t) => `#${t.replace(/-/g, "")}`)
    .join(" ");

  return [
    post.title,
    "",
    post.description,
    "",
    "Key takeaways in the full guide:",
    `→ ${url}`,
    "",
    hashtags,
    "#SouthAfrica #Accounting #SME #SARS",
  ].join("\n");
}

export function generateXSnippet(post: PostMeta): string {
  const url = `${SITE.url}/resources/${post.slug}`;
  // ~200 chars for text, ~23 for URL (Twitter wraps all URLs to t.co)
  const maxText = 200;
  const text =
    post.description.length > maxText
      ? post.description.substring(0, maxText - 1) + "…"
      : post.description;

  return `${text}\n\n${url}`;
}

export function generateFacebookSnippet(post: PostMeta): string {
  const url = `${SITE.url}/resources/${post.slug}`;

  return [
    post.title,
    "",
    post.description,
    "",
    `Read the full guide here: ${url}`,
  ].join("\n");
}

// ─── Convenience: all three at once ──────────────────────────────────────────

export function getAllSnippets(post: PostMeta) {
  return {
    linkedin: generateLinkedInSnippet(post),
    x: generateXSnippet(post),
    facebook: generateFacebookSnippet(post),
  };
}

// ─── Share URLs (for SocialShare buttons) ────────────────────────────────────

export function getShareUrls(post: PostMeta) {
  const articleUrl = `${SITE.url}/resources/${post.slug}`;
  const encoded = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedDesc = encodeURIComponent(post.description);

  return {
    articleUrl,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
    x: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}&via=sikatrix`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encoded}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encoded}`,
  };
}
