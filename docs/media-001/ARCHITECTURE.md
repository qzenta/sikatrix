# ARCHITECTURE.md

## Content graph

```
Sikatrix Article
      ├── Podcast episode
      ├── YouTube
      ├── Short clips
      ├── LinkedIn / Facebook / X posts
      ├── Email/newsletter
      ├── Related Sikatrix tools
      └── Professional-service CTA
```

## Actual site architecture (verified against qzenta/sikatrix, 12 Sep 2026)

Next.js app router. Resources are Markdown files in `content/posts/*.md`,
rendered via `lib/blog.ts` (`getAllPosts`) at `app/resources/page.tsx` (index)
and `app/resources/[slug]/page.tsx` (article). 36 published posts currently
exist, all SA tax/accounting/compliance topics (SARS, VAT, PAYE, CIPC,
payroll, B-BBEE, etc.) — see `content/posts/` for the full list.

No podcast route, no audio player component, and no `AGENTS.md` or
governance docs existed in this repo before this MEDIA-001 bootstrap.

## Podcast integration — built (12 Sep 2026)

```
/resources/podcast              — index of episodes
/resources/podcast/[slug]        — individual episode page
```

Implemented exactly as proposed: `content/podcast/*.md` (parallel
collection to `content/posts/`, not merged into it), `lib/podcast.ts` (a
small dedicated loader, `lib/blog.ts` untouched), and
`components/podcast/PodcastPlayer.tsx`. See `HANDOFF.md` for the full
file list and `CURRENT_STATE.md` for verification detail. Marked
`noindex` with an internal "not published" banner — code exists on the
isolated branch, not merged or deployed.

## Future media engine (documented only — not built in MEDIA-001)

```
Sikatrix authoritative source → Research/verification → Human editorial
approval → AI-assisted transformation → Podcast/YouTube/Shorts/Social/
Newsletter → Distribution → Analytics → Audience → Revenue
```

Prove the manual loop before automating it. n8n is a future automation
candidate, not a MEDIA-001 deliverable.
