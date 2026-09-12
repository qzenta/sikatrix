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

## Proposed podcast integration (not yet built)

Preferred: extend the existing Resources architecture rather than a
standalone microsite, e.g.:

```
/resources/podcast              — index of episodes
/resources/podcast/[slug]        — individual episode page
```

mirroring the existing `content/posts/` + `lib/blog.ts` pattern (a parallel
`content/podcast/*.md` collection with its own small loader, or an
extension of `blog-config.ts` if a unified content type is preferred).
This is a design decision for the next implementation pass — not built in
this bootstrap, per AGENTS.md scope discipline (governance file creation +
audio master intake only).

## Future media engine (documented only — not built in MEDIA-001)

```
Sikatrix authoritative source → Research/verification → Human editorial
approval → AI-assisted transformation → Podcast/YouTube/Shorts/Social/
Newsletter → Distribution → Analytics → Audience → Revenue
```

Prove the manual loop before automating it. n8n is a future automation
candidate, not a MEDIA-001 deliverable.
