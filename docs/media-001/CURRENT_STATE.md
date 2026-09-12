# CURRENT_STATE.md

_Last updated: 12 Sep 2026 — PR #20 merged and live in production; audio
hosting + RSS feed built on a new branch, awaiting review._

## Where are we?

**PR #20 merged into `master` on Daniel's explicit authorization.** The
`/resources/podcast` episode page is genuinely live at
`https://www.sikatrix.com/resources/podcast/vat-thresholds-2026-what-changed`
— verified directly against the production domain, not just a preview
deployment. It still carries the "Internal preview — not published"
banner and `noindex`.

Following that, built audio hosting + a real RSS feed on a new branch
(`media-001-audio-rss`, off the updated `master`) per the plan: self-hosted
the QA'd v2 audio file, wired a real URL into the player, and built +
validated a full podcast RSS 2.0 feed. **Not yet merged** — held for
review the same way every other production-facing change in this project
has been.

## What has been completed?

- PR #20 merged (`234cff0`). Confirmed via Vercel API that the resulting
  deployment was `target: production` and live-verified at
  `www.sikatrix.com`.
- **Audio hosting:** self-hosted, not a third-party podcast host account.
  `audio/master/The_R2_podcast_v2.m4a` copied to
  `public/podcast/vat-thresholds-2026-what-changed.m4a` (39,204,565
  bytes). No new account created — see `DECISIONS.md` for why this
  reading of "audio hosting decision" was chosen over creating an
  account with Buzzsprout/Transistor/etc.
- **Player wired:** `content/podcast/vat-thresholds-2026-what-changed.md`'s
  `audioFile` now points at the real path; `PodcastPlayer` renders an
  actual `<audio>` element instead of the "hosting pending" fallback.
  Verified real playback locally (`audio.paused === false`,
  `currentTime` advancing, `duration` = 1218.1s matching the QA'd
  20:18 runtime, no error).
- **RSS feed built and validated:** `app/resources/podcast/feed.xml/route.ts`
  — RSS 2.0 + iTunes namespace, channel + item metadata, enclosure
  (real URL/length/type), GUID, pubDate, itunes:duration/episode/image/
  category/owner. Linked from the index page (`<link rel="alternate">`
  equivalent via Next.js `alternates.types`, plus a visible "Subscribe
  via RSS" link). Validated: `Content-Type: application/rss+xml;
  charset=utf-8` confirmed, XML parses cleanly (`xml.dom.minidom`),
  UTF-8 encoding verified byte-for-byte (an em-dash that looked
  corrupted in one terminal print was confirmed as correct `E2 80 94`
  UTF-8 bytes, not a real encoding bug).
- **Found and fixed a second real bug:** the episode markdown rendered
  literal `## Heading` text instead of parsed headings locally. Root
  cause: this machine's `core.autocrlf=true` re-materializes the
  LF-only git blob as CRLF on checkout, and the shared `ArticleContent`
  component's blank-line splitter doesn't match `\r\n\r\n`. Confirmed via
  `git show` that the actual committed/deployed content is LF-only and
  unaffected — a local-checkout artifact, not a production bug. Fixed
  by normalizing the local working file, not by touching git config or
  the shared component.
- `npx tsc --noEmit` clean.

## What is currently being worked on?

Nothing — reporting this back for review before merging, matching the
pattern used for every prior change in this project.

## What remains?

- Daniel's review of the audio/RSS work (preview or local).
- Explicit merge authorization for `media-001-audio-rss`.
- Podcast-directory artwork — still deferred.
- Every Spotify/Apple/YouTube account-boundary action — explicitly
  Daniel's step alone, still blocked on artwork resolution per his
  instruction.
- Section 20 repurposing plan — still not started; now that the episode
  page and RSS/audio are close to fully live, this is close to being
  unblocked, but hasn't been explicitly greenlit yet.

## What is blocked?

Only the human-only items: Spotify/Apple/YouTube (Daniel's step,
blocked on artwork), and Section 20 (sequenced after full go-live,
pending explicit confirmation that "live" has been reached).

## What decisions have been made?

See `DECISIONS.md`.

## What requires human action?

- Review and merge (or request changes to) `media-001-audio-rss`.
- Resolve podcast-directory artwork when ready to actually submit.
- Take the Spotify/Apple/YouTube steps personally, once artwork is
  resolved — this worker will not touch them.
- Confirm when "live" is reached, to greenlight Section 20.

## What must NOT be done?

- Do not touch Spotify/Apple/YouTube accounts — Daniel's step alone.
- Do not start the Section 20 repurposing plan without explicit
  confirmation that go-live is reached.
- Do not merge `media-001-audio-rss` without human review, same as
  every prior production-facing change in this project.
- Do not overwrite or destructively modify either master audio file.
- Do not expand scope beyond MEDIA-001 (CC handoff Section 32).
