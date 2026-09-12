# HANDOFF.md

**From:** Claude Code (bootstrap pass)
**To:** next implementation worker (any of Claude Code / Codex / Hermes)
**Date:** 12 September 2026

## Current branch / commit

Branch: `media-001-podcast-activation` (not merged to `master`).
Commit: see `git log -1` on this branch — bootstrap commit, message
"MEDIA-001: governance bootstrap + audio master intake".

## Files changed

- `content/podcast/vat-thresholds-2026-what-changed.md` (new — episode content)
- `lib/podcast.ts` (new — dedicated loader, doesn't touch `lib/blog.ts`)
- `components/podcast/PodcastPlayer.tsx` (new)
- `app/resources/podcast/page.tsx` (new — index)
- `app/resources/podcast/[slug]/page.tsx` (new — episode page, the Section 18 deliverable)
- `docs/media-001/PODCAST_IDENTITY.md` (Section 11 — show name/email now confirmed)
- `docs/media-001/ARTWORK_ASSESSMENT.md` (Section 12 — candidate produced,
  rejected as wrong brand style, removed; directory-art resolution now
  deferred by decision, not blocked)
- `docs/media-001/artwork/podcast-cover-2000x2000.png` — added then
  removed in a prior commit; see git log
- `public/photos/podcast/vat-thresholds-2026-what-changed-cover.png` (new
  — website episode image, `sikatrix_profile_picture_800x800.png` used
  as-is)
- `docs/media-001/EPISODE_PAGE_DRAFT.md` (Section 18, content only; image
  now resolved)
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

No automated test suite exists for this repo. Verified instead by:
- `git status` before and after each pass — confirmed no unintended files
  touched (the episode-page build added only new files, no existing file
  was modified).
- `ffprobe`/`ffmpeg` technical audio QA on both master files — PASS, full
  results in `AUDIO_QA.md`/`AUDIO_QA_V2.md`.
- `npx tsc --noEmit` — clean, no type errors from the new podcast code.
- Local dev server (`npm run dev` via `.claude/launch.json`'s
  `sikatrix-dev` config): navigated `/resources/podcast` and
  `/resources/podcast/vat-thresholds-2026-what-changed`, screenshotted
  every section, clicked through index→episode and episode→source-article
  links, checked browser console (no errors attributable to this change).
  Found and fixed one real bug (see DECISIONS.md — markdown list items
  weren't getting inline-link-parsed by the shared `ArticleContent`
  component; fixed by removing the redundant markdown section rather than
  touching shared code).

## Unresolved issues

- v1's Content QA findings are resolved by v2 — see `CONTENT_QA_V2.md`.
  v1 itself remains a failed/historical record, not deleted.
- Editorial/human listening QA not performed on v2 (no listening facility
  used by this worker).
- Podcast artwork decision not made.
- Website episode-page structure is proposed but not built.

## Pending human actions

See `NEXT_ACTIONS.md` — all items marked `[HUMAN ACTION]`.

## Next recommended action

The `/resources/podcast` episode page is now real, working, locally
verified code on this branch — not merged, not deployed. Daniel reviews
it, then decides on branch merge. **Section 20 (repurposing plan) is
explicitly not started** — sequenced after the episode page and audio
are actually live, not before. **Explicitly not touched: Spotify/Apple/
YouTube account-level actions or any submission/publish step** — cross
that boundary only on a fresh, explicit instruction to do so. Podcast-
directory artwork stays deferred per the earlier decision.

## Prohibited actions

No regeneration/overwrite of either master file (v1 or v2). No
publication anywhere — Content QA passing is not a publication
authorization by itself; human editorial QA + explicit approval still
required. No account creation, payment, or credential handling. No
unrelated refactoring. No merge to `master`/production without explicit
human authorization.

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
