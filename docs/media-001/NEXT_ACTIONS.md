# NEXT_ACTIONS.md

[HUMAN ACTION]
Perform editorial/human listening QA of `audio/master/The_R2_podcast_v2.m4a`
— separate from, and not satisfied by, the automated technical + content
QA that just passed.

[HUMAN ACTION]
Confirm v2 as the adopted working master. (v1 remains in the repo as a
historical record but failed Content QA and should not be used going
forward.)

[HUMAN ACTION]
Confirm whether suitable podcast artwork already exists in Sikatrix brand
assets, or approve creating new artwork.

[HUMAN ACTION]
Review branch `media-001-podcast-activation` and decide whether to merge
the governance bootstrap + QA history into `master`.

[READY]
Prepare podcast/episode identity (title, description, keywords, CTA,
source-article links) — CC handoff Section 11. Content QA no longer
blocks this.

[READY — once artwork decision is made]
Prepare or source podcast artwork per the human decision above.

[READY — once site architecture decision is confirmed by Daniel]
Design and build the `/resources/podcast` episode-page structure proposed
in `ARCHITECTURE.md`, mirroring `content/posts/` + `lib/blog.ts`.

[READY]
Prepare Spotify/Apple/YouTube distribution metadata (does not require
account access) once episode identity exists.

[HUMAN ACTION — when reached]
Every account-boundary action for Spotify/Apple/YouTube (account
authentication, ownership, terms, actual publication).
