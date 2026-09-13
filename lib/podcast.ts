import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PodcastRelatedTool {
  slug: string;
  label: string;
}

export interface PodcastSocialMeta {
  ogTitle?: string;
  ogDescription?: string;
  twitterCard?: "summary" | "summary_large_image";
}

export interface PodcastEpisode {
  slug: string;
  title: string;
  description: string;
  episodeNumber: number;
  duration: string;
  audioFile: string;
  audioFileSize: number;
  audioFileType: string;
  guid: string;
  featuredImage: string;
  featuredImageAlt: string;
  author: { name: string; title: string };
  publishDate: string | null;
  rssGeneratedDate: string | null;
  sourceArticles: string[];
  relatedServices: string[];
  relatedTools: PodcastRelatedTool[];
  social: PodcastSocialMeta;
  content: string;
}

const PODCAST_DIR = path.join(process.cwd(), "content", "podcast");

function getSlugsFromDir(): string[] {
  if (!fs.existsSync(PODCAST_DIR)) return [];
  return fs
    .readdirSync(PODCAST_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function parseEpisode(slug: string): PodcastEpisode | null {
  const filePath = path.join(PODCAST_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title ?? "",
    description: data.description ?? "",
    episodeNumber: data.episodeNumber ?? 1,
    duration: data.duration ?? "",
    audioFile: data.audioFile ?? "",
    audioFileSize: data.audioFileSize ?? 0,
    audioFileType: data.audioFileType ?? "audio/mp4",
    guid: data.guid ?? slug,
    featuredImage: data.featuredImage ?? "",
    featuredImageAlt: data.featuredImageAlt ?? "",
    author: data.author ?? {
      name: "Sikatrix Business Accountants",
      title: "SAIPA Professional Accountant (SA)",
    },
    publishDate: data.publishDate ?? null,
    rssGeneratedDate: data.rssGeneratedDate ?? null,
    sourceArticles: data.sourceArticles ?? [],
    relatedServices: data.relatedServices ?? [],
    relatedTools: data.relatedTools ?? [],
    social: data.social ?? {},
    content: content.trim(),
  };
}

// getAllEpisodes returns every episode regardless of publish state — the
// index page decides what to show/hide using isEpisodePublished below.
export function getAllEpisodes(): PodcastEpisode[] {
  return getSlugsFromDir()
    .map((slug) => parseEpisode(slug))
    .filter((e): e is PodcastEpisode => e !== null)
    .sort((a, b) => a.episodeNumber - b.episodeNumber);
}

export function getEpisodeBySlug(slug: string): PodcastEpisode | null {
  return parseEpisode(slug);
}

// publishDate is the single source of truth for an episode's published
// state — present and not in the future means published. There is
// deliberately no separate status/draft flag: a second field here could
// drift out of sync with publishDate the same way social.ogTitle once
// drifted out of sync with the real title.
export function isEpisodePublished(episode: PodcastEpisode): boolean {
  if (!episode.publishDate) return false;
  return new Date(`${episode.publishDate}T00:00:00Z`).getTime() <= Date.now();
}
