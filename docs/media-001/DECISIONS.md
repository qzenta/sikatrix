# DECISIONS.md

| Date | Decision | Basis |
|------|----------|-------|
| 12 Sep 2026 | Adopt the portable project-state governance pattern (AGENTS.md at repo root + `docs/media-001/` state files) for MEDIA-001 | Per CC handoff spec — prevents dependence on any single agent's conversation history |
| 12 Sep 2026 | Preserve `audio/master/The_R2_podcast.m4a` as immutable master; any processing produces a documented derivative under `audio/derivatives/` | Per CC handoff Section 7 |
| 12 Sep 2026 | Do not regenerate the podcast merely because it is AI-generated | Explicit instruction in CC handoff Section 0 |
| 12 Sep 2026 | Reconciled against live qzenta/sikatrix repo before writing anything: repo had no pre-existing AGENTS.md/governance docs, so this bootstrap creates rather than merges | Per CC handoff Section 5 ("avoid overwriting useful existing governance") — confirmed nothing existed to overwrite |
| 12 Sep 2026 | Governance docs placed in `docs/media-001/` (repo already has a `docs/` convention: `LINKEDIN_SETUP.md`, `X_SETUP.md`); `AGENTS.md` alone kept at repo root per its conventional discovery location | Matches existing repo convention rather than inventing a new one |
| 12 Sep 2026 | Did not attempt automated transcription (e.g. ffmpeg's whisper filter) to identify the two source articles, despite the tooling being locally available | Would require downloading an unverified third-party model file without prior approval — explicit-permission action per operating rules, not taken unilaterally. Source article ID left as a human-confirmed action instead of a guess, per CC handoff Section 9 ("do not guess") |
