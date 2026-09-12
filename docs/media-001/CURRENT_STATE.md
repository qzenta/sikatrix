# CURRENT_STATE.md

_Last updated: 12 Sep 2026 — episode page built and locally verified._

## Where are we?

The `/resources/podcast` episode page is now real, working code on branch
`media-001-podcast-activation` — built, locally verified (dev server,
screenshots, `tsc --noEmit`), one rendering bug found and fixed. **Not
merged to master, not deployed, not published.** Marked with an internal
"not published" banner and `noindex` as a safeguard. Repurposing plan
(Section 20) has **not** been started, per instruction — that's explicitly
gated on the episode page and audio actually being live, not before.
Distribution boundary (Spotify/Apple/YouTube accounts, submission,
publish) still untouched.

## What has been completed?

- v1/v2 audio QA, content QA (v2 passed), podcast identity, website image
  resolution, artwork deferral decision, editorial listening QA confirmed
  by Daniel — all prior history, see git log / DECISIONS.md.
- **`/resources/podcast` route built:**
  - `content/podcast/vat-thresholds-2026-what-changed.md` — episode
    content, following the `content/posts/` frontmatter pattern.
  - `lib/podcast.ts` — small dedicated loader (parallel to `lib/blog.ts`,
    not modifying it), `getAllEpisodes`/`getEpisodeBySlug`.
  - `components/podcast/PodcastPlayer.tsx` — real audio player component
    with a graceful "hosting pending" fallback state (no audio file is
    wired in yet — that's still a placeholder, deliberately).
  - `app/resources/podcast/page.tsx` — index/listing page.
  - `app/resources/podcast/[slug]/page.tsx` — the episode page itself:
    hero, player, "Listen on" platform placeholders, episode body,
    source-article cross-links (pulled from real `Post` objects via
    `lib/blog`, not hardcoded), related Sikatrix tools, related services,
    CTA, author/publisher, PodcastEpisode + Breadcrumb schema.org JSON-LD,
    SEO metadata, canonical URL.
  - Both pages carry an "Internal preview — not published (MEDIA-001)"
    banner and `robots: { index: false, follow: false }` on the episode
    page metadata.
- **Verified locally:** ran the dev server, navigated both pages,
  screenshotted every section, clicked through index→episode and
  episode→source-article links, checked console for errors (none
  attributable to this change — only pre-existing site-wide Clarity/CSP
  warnings also present on existing pages), ran `tsc --noEmit` clean.
- **Found and fixed a real bug during verification:** the shared
  `ArticleContent` component doesn't parse inline markdown links inside
  bullet lists, so a `## Source Articles` list in the episode markdown
  rendered as raw unparsed text. Removed that redundant section from the
  markdown body (the properly-styled, working "Source articles" cards
  section built directly into the page already covers this) rather than
  touching the shared component used by all 36 existing blog posts.
- `git status` confirms only new files added — no existing files
  modified.

## What is currently being worked on?

Nothing — reporting this back for review, as instructed.

## What remains?

- Daniel's review of the built page (locally, or via `npm run dev` on
  this branch).
- Repurposing plan (Section 20) — explicitly **not started**, per
  instruction: comes after the episode page and audio are actually live.
- Podcast-directory artwork — still deferred (see prior decision).
- Every Spotify/Apple/YouTube account-boundary action — not started.
- Branch review/merge decision.

## What is blocked?

Nothing technically — QA, identity, and now the episode page are all
done. What's left is account-level work that's out of scope until a
fresh, explicit instruction to cross that boundary, and the repurposing
plan which is explicitly sequenced after go-live.

## What decisions have been made?

See `DECISIONS.md`.

## What requires human action?

- Review the built episode page.
- Decide when/whether to build the actual RSS-hosted audio file wiring
  (the player component is ready, just has no `audioFile` value yet).
- Review and merge (or reject) branch `media-001-podcast-activation`.
- When ready: explicit instruction to start Spotify/Apple/YouTube work.
- When the episode page + audio are live: green light to start the
  Section 20 repurposing plan.

## What must NOT be done?

- Do not start the Section 20 repurposing plan yet.
- Do not proceed to any Spotify/Apple/YouTube account creation,
  authentication, or submission step.
- Do not publish anything, anywhere — the `noindex`/preview-banner
  safeguards on the new pages are not a substitute for actual
  authorization.
- Do not overwrite or destructively modify either master audio file.
- Do not merge `media-001-podcast-activation` into `master` without human
  review.
- Do not expand scope beyond MEDIA-001 (CC handoff Section 32).
