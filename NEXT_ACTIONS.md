# NEXT_ACTIONS.md — sprint cycle 2026-11-04

## Awaiting owner
- Decide on the 34-vs-29 post-count discrepancy (repo files vs handoff baseline). Establish which count is authoritative before any content pruning or publication decisions.
- Review Package D findings (apex-domain 307 redirect at Vercel platform layer; mail.sikatrix.com origin HTTP 530) — both need owner-level action since they sit outside this repo.

## Next agent steps (on branch feat/sikatrix-opencode-cycle3-20261104)
1. Commit the single changed file once owner approves:
   `content/posts/dtic-business-visa-waiver-factual-findings-report.md`
   (contains: verification-log HTML comment + 12-months claim replacement)
2. Open PR to `master` for owner preview, per sprint skill. Do not push/merge without explicit approval.
3. After merge, verify live URL `resources/dtic-business-visa-waiver-factual-findings-report` renders the corrected timing sentence.

## Do not touch this session
- `package-lock.json` — already restored to origin state.
- `docs/media-001/*` — belongs to the separate MEDIA-001 podcast workstream.
