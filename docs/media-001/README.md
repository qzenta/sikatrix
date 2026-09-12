# MEDIA-001 — Podcast Activation

Sikatrix Content Distribution programme. First proof-of-concept for a
portable, agent-agnostic project governance pattern.

See:
- `AGENTS.md` (repo root) — project constitution
- `GOVERNANCE.md` — authority hierarchy and agent roles
- `CURRENT_STATE.md` — operational snapshot (read this first, every session)
- `NEXT_ACTIONS.md` — explicit action queue
- `HANDOFF.md` — state required for another worker to continue
- `DECISIONS.md` — decisions made and their basis
- `ARCHITECTURE.md` — where this fits in the Sikatrix site/content structure
- `DISTRIBUTION_CHECKLIST.md` — acceptance criteria
- `AUDIO_QA.md` / `AUDIO_QA_V2.md` — technical audio QA results (v1, v2)
- `CONTENT_QA.md` / `CONTENT_QA_V2.md` — content fidelity QA vs. source
  articles (v1 failed, v2 passed)
- `transcript-automated.srt` / `transcript-v2-automated.srt` — machine
  transcripts used for content QA (evidence only, not human-verified)
- `PODCAST_IDENTITY.md` — show/episode identity draft (Section 11)
- `ARTWORK_ASSESSMENT.md` — brand asset review; first candidate turned out
  to be the wrong brand style and was removed; blocked again pending
  Daniel's direction (Section 12)
- `EPISODE_PAGE_DRAFT.md` — original content draft (Section 18); **now
  built** as real code — see `app/resources/podcast/`, `lib/podcast.ts`,
  `content/podcast/`, `components/podcast/`
- `CC_HANDOFF_MEDIA-001.md` — the original full spec (12 Sep 2026)

Master audio: `audio/master/The_R2_podcast.m4a` (v1, failed Content QA,
kept as historical record) and `audio/master/The_R2_podcast_v2.m4a` (v2,
current candidate master, passed technical + content QA) — repo root,
outside this docs directory. See AGENTS.md's immutable master rule: never
overwrite either file.
