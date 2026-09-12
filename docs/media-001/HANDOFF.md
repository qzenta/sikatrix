# HANDOFF.md

**From:** Claude Code (bootstrap pass)
**To:** next implementation worker (any of Claude Code / Codex / Hermes)
**Date:** 12 September 2026

## Current branch / commit

Branch: `media-001-podcast-activation` (not merged to `master`).
Commit: see `git log -1` on this branch — bootstrap commit, message
"MEDIA-001: governance bootstrap + audio master intake".

## Files changed

- `AGENTS.md` (new, repo root)
- `docs/media-001/README.md` (new)
- `docs/media-001/GOVERNANCE.md` (new)
- `docs/media-001/CURRENT_STATE.md` (new, updated after Content QA)
- `docs/media-001/NEXT_ACTIONS.md` (new, updated after Content QA)
- `docs/media-001/HANDOFF.md` (new, this file)
- `docs/media-001/DECISIONS.md` (new)
- `docs/media-001/ARCHITECTURE.md` (new)
- `docs/media-001/DISTRIBUTION_CHECKLIST.md` (new)
- `docs/media-001/AUDIO_QA.md` (new)
- `docs/media-001/CONTENT_QA.md` (new — Section 10 findings)
- `docs/media-001/transcript-automated.srt` (new — machine transcript, evidence only)
- `docs/media-001/CC_HANDOFF_MEDIA-001.md` (new — original spec, copied for reference)
- `audio/master/The_R2_podcast.m4a` (new — copy of supplied master)

No other files touched. No application code, no dependencies, no config.

## Tests run / results

No automated test suite exists for this repo relevant to this change (it's
documentation + a static asset addition). Verified instead by:
- `git status` before and after — confirmed no other files were touched.
- `ffprobe`/`ffmpeg` technical audio QA on the master file — PASS, full
  results in `AUDIO_QA.md`.
- Confirmed `audio/master/The_R2_podcast.m4a` is byte-identical to the
  source file supplied (straight copy, not re-encoded).

## Unresolved issues

- **Content QA found material discrepancies** — see `CONTENT_QA.md`.
  Automatic VAT registration framed as a future hypothetical rather than
  present fact (contradicts source article 2's premise); R120,000
  voluntary threshold and 1 April 2026 effective date both absent from
  the podcast; "21 days" stated where both sources say "21 business
  days." This is a stop condition, not a routine pending item.
- Editorial/human listening QA not performed (no listening facility used).
- Podcast artwork decision not made.
- Website episode-page structure is proposed but not built.

## Pending human actions

See `NEXT_ACTIONS.md` — all items marked `[HUMAN ACTION]`.

## Next recommended action

Daniel is regenerating the podcast audio to address the Content QA
findings. When the new file arrives: run a full, independent technical
audio QA (Section 8) and content QA (Section 10) pass against it — same
two confirmed source articles — as if it were a brand-new, unverified
master. Do not assume the regeneration fixed only the specific findings
listed and skip re-checking the rest. Branch stays unmerged and no
distribution prep happens until that fresh pass is clean.

## Prohibited actions

No regeneration of the podcast master. No publication anywhere — this
episode failed Content QA in its current form. No account creation,
payment, or credential handling. No unrelated refactoring. No merge to
`master`/production without explicit human authorization.

## Relevant URLs

- Repo: https://github.com/qzenta/sikatrix
- Site: https://www.sikatrix.com (per `reference-sikatrix-domain` — not
  `sikatrix.co.za`)

## Relevant source documents

- `docs/media-001/CC_HANDOFF_MEDIA-001.md` — full originating spec
  (12 Sep 2026).

## Environment assumptions

`audio/master/The_R2_podcast.m4a` is now present in-repo on this branch;
no need to re-source it from elsewhere. ffmpeg/ffprobe 8.1.1 available in
the environment used for QA (not necessarily every future environment —
re-verify tooling availability before relying on it again).
