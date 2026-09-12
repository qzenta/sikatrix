# DISTRIBUTION_CHECKLIST.md
(Acceptance criteria — CC handoff Section 33)

### Governance
- [x] `AGENTS.md` exists in repo (root)
- [x] boundaries explicit
- [x] project state portable (`docs/media-001/`)
- [x] no secrets committed

### Audio
- [x] original master preserved (`audio/master/The_R2_podcast.m4a`, untouched)
- [x] v2 master added (`audio/master/The_R2_podcast_v2.m4a`), v1 not overwritten
- [x] technical characteristics documented (`AUDIO_QA.md`, `AUDIO_QA_V2.md`)
- [x] technical QA completed — PASS (both v1 and v2)
- [x] editorial listening status explicitly recorded — still PENDING (human), v2

### Source
- [x] exact two source articles identified (confirmed by Daniel)
- [x] URLs documented
- [x] source/content relationship documented (`CONTENT_QA.md`)

### Content QA
- [x] transcript obtained (v1: `transcript-automated.srt`, v2: `transcript-v2-automated.srt`)
- [x] compared against both source articles (v1 and v2, independently)
- [x] **PASS (v2).** v1 failed with 4 material findings (`CONTENT_QA.md`);
      v2 resolved all of them, fresh pass found no new issues
      (`CONTENT_QA_V2.md`). v2 is the current candidate master.

### Metadata
- [x] show identity prepared (`PODCAST_IDENTITY.md` — 2 items flagged for Daniel's sign-off)
- [x] episode identity prepared (`PODCAST_IDENTITY.md`)
- [x] description prepared (`PODCAST_IDENTITY.md`, `EPISODE_PAGE_DRAFT.md`)
- [x] artwork decision recorded — as a documented gap + 3 options for
      Daniel to choose from (`ARTWORK_ASSESSMENT.md`); no asset exists yet

### Distribution
- [ ] Spotify path prepared
- [ ] RSS path documented
- [ ] Apple submission prepared
- [ ] YouTube RSS path prepared
- [ ] website implementation prepared

### Website
- [x] Sikatrix location identified (proposed: `/resources/podcast`, see ARCHITECTURE.md)
- [x] episode page prepared — content draft (`EPISODE_PAGE_DRAFT.md`);
      route/template not yet built in code
- [x] source links included
- [x] SEO metadata prepared
- [x] CTA included

### Repurposing
- [ ] derivative-content plan documented
- [x] no mass-produced/repetitive content strategy introduced (none attempted)

### Governance (close-out)
- [x] human approval gates identified
- [x] publication remains unauthorized until approved
- [x] final CURRENT_STATE.md / NEXT_ACTIONS.md / HANDOFF.md updated

Content QA, metadata, artwork, and all distribution-platform prep remain
blocked on source-article identification (Content QA depends on it) and
are therefore out of scope for this pass — see NEXT_ACTIONS.md.
