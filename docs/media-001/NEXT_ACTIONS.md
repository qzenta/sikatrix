# NEXT_ACTIONS.md

[COMPLETE]
Editorial/human listening QA of v2 — confirmed by Daniel. Does not by
itself authorize distribution-boundary work (see CURRENT_STATE.md).

[DEFERRED — not now, revisit before actual submission]
Podcast-directory cover art (1400×1400 minimum) — see
`ARTWORK_ASSESSMENT.md` and `DECISIONS.md`. Website image is resolved
separately and doesn't need this.

[HUMAN ACTION]
Review branch `media-001-podcast-activation` and decide whether to merge.

[HUMAN ACTION — when ready, requires a fresh explicit instruction]
Cross the distribution boundary: Spotify account setup, Apple Podcasts
submission prep, YouTube RSS ingestion. None of the QA/identity work
completed so far authorizes starting these on its own.

[READY — once Daniel confirms the route structure in ARCHITECTURE.md]
Build the `/resources/podcast` route/template in code and wire in the
`EPISODE_PAGE_DRAFT.md` content, including the now-resolved website
image at `public/photos/podcast/vat-thresholds-2026-what-changed-cover.png`.
