# CONTENT_QA_V2.md — Content Fidelity QA, v2 (CC handoff Section 10)

**Date:** 12 September 2026
**File:** `The_R2_podcast_v2.m4a` (supplied as
`The_R2_podcast_v2.m4a.m4a`; double extension is an artifact of how it was
saved, not part of the intended filename)
**Method:** Independent fresh pass — new transcription
(`transcript-v2-automated.srt`, same tooling: ffmpeg whisper filter,
`ggml-small.en.bin`) compared against both source articles from scratch.
Not a diff against `CONTENT_QA.md`'s v1 findings — the full Section 10
checklist was re-run.

## Result: PASS

All four material findings from v1 are resolved. No new material
discrepancies found.

### v1 finding #1 (automatic registration framed as future hypothetical) — RESOLVED

The episode now states the present-tense fact first and prominently
(~18:46–18:57): *"SARS' automatic data matching system is already
integrated, it is already pulling your banking and CIPC data and it is
actively catching businesses on that rolling 12-month treadmill **today**."*
This matches source article 2's premise correctly.

The episode still closes with forward-looking speculation ("how long
until tax returns are eliminated entirely," "real-time invisible
deduction on every swipe") — but this is now clearly built *on top of*
the correctly-stated present-tense fact, not a replacement for it, and
isn't attributed to either source article as current reality. Acceptable.

### v1 finding #2 (R120,000 voluntary threshold absent) — RESOLVED

Now stated explicitly multiple times (~02:50, ~03:02, ~12:25–12:31,
~18:31–18:37), and the episode dedicates a full segment (~12:11–16:58) to
voluntary registration — pros, cons, and the B2B-vs-B2C decision
framework — matching source article 1's core content and structure.

### v1 finding #3 (1 April 2026 effective date absent) — RESOLVED

Now stated explicitly and repeatedly (~02:20, ~02:29–02:32, ~03:02–03:05,
~06:20–06:23, ~18:37–18:39): both thresholds are tied to the "effective
on 1 April 2026" date, matching both source articles.

### v1 finding #4 ("21 days" vs "21 business days") — RESOLVED

Now consistently "21 business days" (~03:26, ~03:32–03:38, ~05:20,
~18:13–18:16), including an explicit callout: *"21 business days, not
just 30 days"* — actively correcting the ambiguity rather than just
happening to get it right once.

### v1 findings #5–6 (R2.5M payment-basis mention; unsourced forward-looking-test/VAT101 detail) — no longer present

Searched for these specifically; neither appears in v2. Not a fix
(they weren't stop-condition material to begin with) but removing them
also removes the risk of listener confusion flagged in finding #5.

### Additional accurate detail beyond v1

The 6-month self-service backdating limit and the requirement to visit a
SARS branch in person beyond that window (~10:20–10:44) are now covered
accurately, matching source article 2's detail on this point precisely
(a detail v1 omitted entirely).

### Checked, no issues found

Rolling 12-month "treadmill" mechanic, R2.3 million compulsory threshold
figure (6+ occurrences, all consistent), R1 million historical threshold,
backdated-liability mechanics, taxable-vs-exempt-supply distinction — all
consistent with source articles and internally consistent across the
episode.

## Conclusion

**Content QA: PASS.** No material factual discrepancy, no material
omission, against either confirmed source article. Cleared to proceed
toward the remaining Section 33 acceptance items (metadata, artwork,
distribution prep) — see updated `NEXT_ACTIONS.md`.

Editorial/human listening QA is still separately required and not
satisfied by this automated pass (per AGENTS.md — technical/content QA
and human listening QA are never interchangeable).
