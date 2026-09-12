# CURRENT_STATE.md

_Last updated: 12 Sep 2026 — artwork deferred by decision (not blocked);
website image resolved; listening QA recorded as confirmed by Daniel._

## Where are we?

v2 audio passed technical + content QA, and **Daniel has confirmed
(verbally, relayed in chat) that he has completed editorial/human
listening QA of v2.** Podcast identity is finalized. Website episode-page
content is drafted and now has a real image (the existing bevel-style
Sikatrix mark, used at its native 800×800 on the website, which has no
resolution minimum). **Podcast-directory cover art (Spotify/Apple — the
1400×1400 minimum) is deliberately deferred**, not blocked — a decision,
not a gap, per `DECISIONS.md`. Distribution boundary (Spotify/Apple/
YouTube accounts, any submission/publish step) has still not been
touched and is not authorized by any of the above.

## What has been completed?

- v1/v2 audio QA, content QA — v1 failed, v2 passed (prior history).
- Podcast identity finalized (`PODCAST_IDENTITY.md`).
- **Editorial/human listening QA of v2: confirmed by Daniel** (verbal,
  relayed in this session — see `DECISIONS.md` for exactly how this is
  logged and what it does/doesn't authorize).
- Website episode-page content drafted and finalized on the image:
  `sikatrix_profile_picture_800x800.png` copied to
  `public/photos/podcast/vat-thresholds-2026-what-changed-cover.png`,
  used as-is (`EPISODE_PAGE_DRAFT.md`).
- Podcast-directory artwork: **deferred by explicit decision** (option 3
  from `ARTWORK_ASSESSMENT.md`) — revisit before actual Spotify/Apple
  submission, not now.

## What is currently being worked on?

Nothing — stopping here. Distribution boundary still not crossed.

## What remains?

- Podcast-directory cover art, when actual submission approaches
  (deferred, not forgotten).
- Building the actual `/resources/podcast` route/template in code (the
  episode-page content is drafted; the route itself isn't built).
- Review of branch `media-001-podcast-activation` for merge.
- Every Spotify/Apple/YouTube account-boundary action — not started, and
  listening QA being confirmed does not by itself authorize starting
  them (Section 25: passing one gate never implies the next).

## What is blocked?

Nothing on the QA front anymore — technical, content, and editorial
listening QA have all now passed/been confirmed for v2. What remains is
account-level work that's explicitly out of scope until Daniel gives a
fresh, specific instruction to cross that boundary.

## What decisions have been made?

See `DECISIONS.md`.

## What requires human action?

- Explicit go-ahead (separate from listening QA) before any
  Spotify/Apple/YouTube account or submission work starts.
- Review and merge (or reject) branch `media-001-podcast-activation`.
- Revisit podcast-directory artwork when actual submission is imminent.

## What must NOT be done?

- Do not proceed to any Spotify/Apple/YouTube account creation,
  authentication, or submission step without a fresh, explicit
  instruction — listening QA being confirmed is not that instruction.
- Do not publish anything, anywhere.
- Do not overwrite or destructively modify either master audio file.
- Do not upscale the 800×800 asset for podcast-directory use — the
  deferred decision means revisiting with real options at submission
  time, not upscaling to force it through now.
- Do not merge `media-001-podcast-activation` into `master` without human
  review.
- Do not expand scope beyond MEDIA-001 (CC handoff Section 32).
