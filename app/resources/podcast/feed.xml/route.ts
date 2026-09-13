import { getAllEpisodes } from "@/lib/podcast";
import { SITE } from "@/lib/site";

// Podcast RSS 2.0 feed with the iTunes namespace, per CC handoff Section 14.
//
// NOTE ON DATES: `rssGeneratedDate` (used for <pubDate>) is intentionally
// separate from each episode's `publishDate` (used for the website's
// "Published"/"Not yet published" display). The feed being technically
// complete and valid is not the same event as authorizing public
// distribution — see docs/media-001/DECISIONS.md.
//
// NOTE ON STATUS: this feed includes every episode returned by
// getAllEpisodes() regardless of isEpisodePublished (lib/podcast.ts) —
// the website's noindex/banner gating and this feed's contents are two
// separate decisions. Revisit if the feed itself should only list
// published episodes once more than one exists.

export const dynamic = "force-static";

// Scoped to this feed only — deliberately not SITE.email, which is the
// site-wide contact address used elsewhere (forms, schema.org, header).
// The podcast owner contact is its own address per Daniel's instruction.
const PODCAST_OWNER_EMAIL = "social@sikatrix.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(dateStr: string): string {
  return new Date(`${dateStr}T00:00:00Z`).toUTCString();
}

function durationToSeconds(duration: string): string {
  const parts = duration.split(":").map(Number);
  if (parts.length === 2) return String(parts[0] * 60 + parts[1]);
  if (parts.length === 3) return String(parts[0] * 3600 + parts[1] * 60 + parts[2]);
  return duration;
}

export async function GET() {
  const episodes = getAllEpisodes();
  const channelLink = `${SITE.url}/resources/podcast`;
  const feedUrl = `${channelLink}/feed.xml`;
  const image = `${SITE.url}/photos/podcast/vat-thresholds-2026-what-changed-cover.png`;
  const lastBuildDate = new Date().toUTCString();

  const items = episodes
    .filter((ep) => ep.audioFile && ep.rssGeneratedDate)
    .map((ep) => {
      const episodeUrl = `${channelLink}/${ep.slug}`;
      const audioUrl = `${SITE.url}${ep.audioFile}`;
      const pubDate = toRfc822(ep.rssGeneratedDate as string);
      return `    <item>
      <title>${escapeXml(ep.title)}</title>
      <description>${escapeXml(ep.description)}</description>
      <link>${episodeUrl}</link>
      <guid isPermaLink="false">${escapeXml(ep.guid)}</guid>
      <pubDate>${pubDate}</pubDate>
      <enclosure url="${audioUrl}" length="${ep.audioFileSize}" type="${ep.audioFileType}" />
      <itunes:title>${escapeXml(ep.title)}</itunes:title>
      <itunes:summary>${escapeXml(ep.description)}</itunes:summary>
      <itunes:author>${escapeXml(ep.author.name)}</itunes:author>
      <itunes:duration>${durationToSeconds(ep.duration)}</itunes:duration>
      <itunes:episode>${ep.episodeNumber}</itunes:episode>
      <itunes:episodeType>full</itunes:episodeType>
      <itunes:explicit>false</itunes:explicit>
      <itunes:image href="${SITE.url}${ep.featuredImage}" />
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sikatrix Resources</title>
    <link>${channelLink}</link>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${feedUrl}" rel="self" type="application/rss+xml" />
    <language>en-za</language>
    <copyright>© ${new Date().getFullYear()} Sikatrix Business Accountants</copyright>
    <description>Short, practical audio briefings from Sikatrix Business Accountants — SAIPA-registered Professional Accountants and SARS-registered Tax Practitioners based in Alberton, Gauteng — on SARS compliance, tax, and bookkeeping for South African SMEs.</description>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <itunes:author>Sikatrix Business Accountants</itunes:author>
    <itunes:type>episodic</itunes:type>
    <itunes:owner>
      <itunes:name>Sikatrix Business Accountants</itunes:name>
      <itunes:email>${PODCAST_OWNER_EMAIL}</itunes:email>
    </itunes:owner>
    <itunes:image href="${image}" />
    <itunes:category text="Business">
      <itunes:category text="Management" />
    </itunes:category>
    <itunes:explicit>false</itunes:explicit>
    <image>
      <url>${image}</url>
      <title>Sikatrix Resources</title>
      <link>${channelLink}</link>
    </image>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
