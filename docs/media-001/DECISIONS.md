# DECISIONS.md

| Date | Decision | Basis |
|------|----------|-------|
| 12 Sep 2026 | Adopt the portable project-state governance pattern (AGENTS.md at repo root + `docs/media-001/` state files) for MEDIA-001 | Per CC handoff spec — prevents dependence on any single agent's conversation history |
| 12 Sep 2026 | Preserve `audio/master/The_R2_podcast.m4a` as immutable master; any processing produces a documented derivative under `audio/derivatives/` | Per CC handoff Section 7 |
| 12 Sep 2026 | Do not regenerate the podcast merely because it is AI-generated | Explicit instruction in CC handoff Section 0 |
| 12 Sep 2026 | Reconciled against live qzenta/sikatrix repo before writing anything: repo had no pre-existing AGENTS.md/governance docs, so this bootstrap creates rather than merges | Per CC handoff Section 5 ("avoid overwriting useful existing governance") — confirmed nothing existed to overwrite |
| 12 Sep 2026 | Governance docs placed in `docs/media-001/` (repo already has a `docs/` convention: `LINKEDIN_SETUP.md`, `X_SETUP.md`); `AGENTS.md` alone kept at repo root per its conventional discovery location | Matches existing repo convention rather than inventing a new one |
| 12 Sep 2026 | Did not attempt automated transcription to identify the source articles before asking Daniel | Would require downloading a model file without prior approval; left as a human-confirmed action instead of a guess, per CC handoff Section 9 |
| 12 Sep 2026 | Daniel confirmed the two source articles: `vat-registration-threshold-voluntary-growing-sme` and `sars-automatic-vat-registration-2026` | Explicit human confirmation, per Section 9 requirement not to guess |
| 12 Sep 2026 | Downloaded `ggml-small.en.bin` (~465MB whisper.cpp model, from huggingface.co/ggerganov/whisper.cpp) to transcribe the podcast locally | Explicit-permission action; asked Daniel first (filename/source/size), approved before downloading |
| 12 Sep 2026 | Content QA (Section 10) run against the confirmed sources; result treated as a stop condition, not a checklist item, and publication work halted | Findings are material (a factual contradiction + two omitted core facts + a deadline drift) — see CONTENT_QA.md and AGENTS.md's "STOP, DOCUMENT, ESCALATE, DO NOT PUBLISH" rule |
