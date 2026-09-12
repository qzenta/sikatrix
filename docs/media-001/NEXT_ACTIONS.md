# NEXT_ACTIONS.md

[HUMAN ACTION]
Identify the exact two Sikatrix Resources articles used to generate
`The_R2_podcast.m4a` (title, URL, publication/last-updated date), from the
36 candidates in `content/posts/`. Content QA cannot start without this.

[HUMAN ACTION]
Alternatively: approve running local transcription (ffmpeg's whisper
filter) on the master, naming an approved ggml model source, so Claude
Code can attempt automated topic matching instead of a human recalling
which two articles were used.

[HUMAN ACTION]
Perform editorial/human listening QA of `audio/master/The_R2_podcast.m4a`
and record the result — technical QA (PASS) does not cover this.

[HUMAN ACTION]
Confirm whether suitable podcast artwork already exists in Sikatrix brand
assets, or approve creating new artwork.

[HUMAN ACTION]
Review branch `media-001-podcast-activation` and decide whether to merge
the governance bootstrap into `master`.

[BLOCKED — pending source article ID]
Content QA: compare podcast transcript against the two source articles for
factual/numerical/SARS-terminology consistency (CC handoff Section 10).

[BLOCKED — pending source article ID + Content QA]
Prepare podcast/episode identity (title, description, keywords, CTA,
source-article links) — CC handoff Section 11.

[READY — once artwork decision is made]
Prepare or source podcast artwork per the human decision above.

[READY — once site architecture decision is confirmed by Daniel]
Design and build the `/resources/podcast` episode-page structure proposed
in `ARCHITECTURE.md`, mirroring `content/posts/` + `lib/blog.ts`.

[READY]
Prepare Spotify/Apple/YouTube distribution metadata (does not require
account access) once episode identity exists.
