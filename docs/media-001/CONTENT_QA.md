# CONTENT_QA.md — Content Fidelity QA (MEDIA-001, CC handoff Section 10)

**Date:** 12 September 2026
**Method:** Automated local transcription of `audio/master/The_R2_podcast.m4a`
(ffmpeg's whisper.cpp filter, `ggml-small.en.bin` model) compared line-by-line
against the two confirmed source articles. Transcript saved at
`transcript-automated.srt` for reference — **this is a machine transcript,
not a human-verified one**; individual words/numbers can be mistranscribed,
so findings below were cross-checked by reading surrounding context, not a
single isolated line.

## Source articles (confirmed by Daniel)

1. [VAT Registration Thresholds and Voluntary Registration: When It Makes
   Sense for a Growing SME](/resources/vat-registration-threshold-voluntary-growing-sme)
   — published 2026-08-24
2. [SARS Can Now Register Your Business for VAT Automatically — Here's What
   Changed in 2026](/resources/sars-automatic-vat-registration-2026) —
   published 2026-07-27

Both confirm: **compulsory threshold R2.3 million, voluntary threshold
R120,000, effective 1 April 2026 (2026 Budget)**.

## Result: MATERIAL DISCREPANCIES FOUND — DO NOT PUBLISH

Per AGENTS.md/CC handoff Section 10, this is a stop condition. Findings
below, most material first.

### 1. Automatic VAT registration presented as a future hypothetical, not present fact (material — contradicts the whole premise of source article 2)

Source article 2 is written entirely in the present tense: SARS **is
already** doing this now ("a few of our clients have asked... why did SARS
just register my business for VAT? I never applied"), drawing on data it
**already** pulls from banks and CIPC.

The podcast's closing segment (`transcript-automated.srt` ~20:58–21:24)
instead frames this as a speculative future risk: *"How long will it be
until they integrate real-time commercial banking data to automatically
register businesses for VAT the very second... it pushes them over the
threshold"* — phrased as "how long until," not "this is already happening."

This inverts the source article's central, factual claim (SARS's automatic
registration power is current and active, not a looming possibility) and
would materially mislead a listener about whether this is something to
prepare for later or respond to now.

### 2. R120,000 voluntary registration threshold — entirely absent (material omission)

Searched the full transcript for "voluntary," "120,000," "R120," and
"50,000" in the registration-threshold context. The word "voluntary" only
appears once, referring to the unrelated **Voluntary Disclosure Programme**
(a different SARS mechanism). The R120,000 voluntary registration
threshold, the R50,000 prior threshold, and the entire "should you register
early" decision framework from source article 1 do not appear anywhere in
the podcast.

Since this is one of exactly two source articles and its core numeric fact
and topic are both absent, the podcast does not actually represent
"source article 1" as a source in any meaningful sense — it appears to
have drawn almost entirely on source article 2.

### 3. 1 April 2026 effective date — entirely absent (material omission)

Both source articles anchor the new thresholds to 1 April 2026 ("Following
the 2026 Budget," "Effective 1 April 2026"). The podcast states the
threshold "was officially raised... in 2026" and "historically" was R1
million, but never gives the specific effective date. A listener cannot
tell from the podcast alone whether the new threshold applies to them yet.

### 4. "21 days" vs. source's "21 business days" (material — real compliance-deadline drift)

The podcast says "21 days" to apply for registration in four separate
places (~06:14, ~06:32, ~11:22, ~21:19) and never qualifies it as business
days. Both source articles specify **21 business days**. 21 calendar days
is roughly 3 weeks; 21 business days is roughly 4–4.5 weeks depending on
public holidays — a real difference for a statutory deadline, not a
rounding nuance.

### 5. "R2.5 million" payment-basis threshold — real SARS rule, but not in either source article, and numerically close enough to the R2.3M compulsory threshold to risk listener confusion (moderate)

Around 13:25, the podcast introduces a *separate* SARS VAT rule — the
turnover threshold for accounting on a payment basis rather than invoice
basis — and states it as R2.5 million. This threshold is correct per SARS's
own VAT404 guide, but it is not sourced from either of the two source
articles, and stating two different "R2.x million" thresholds in the same
21-minute episode (2.3M for registration, 2.5M for payment basis) without
clearly distinguishing them creates real risk of a listener conflating the
two. Flagged as unsupported-by-source content requiring editorial review,
not necessarily a factual error in itself.

### 6. Forward-looking ("reasonable expectation") registration test and VAT101 form detail — accurate SA VAT law, not sourced from either article (minor)

Around 05:14–06:19, the podcast covers the forward-looking test (an
expected future crossing of the threshold, e.g. from a signed contract,
triggers immediate registration) and names the VAT101 form. This is
accurate under the VAT Act but isn't present in either source article — an
addition beyond the stated source material. Not a factual error, but
outside the "source articles → podcast" chain the CC handoff requires
(Section 9): *"The objective is to establish SOURCE ARTICLES → PODCAST
CONTENT → DISTRIBUTION... do not assume that because the source articles
are correct, the generated podcast is automatically correct."*

### Consistent / accurate

- Rolling 12-month window mechanic ("treadmill" analogy) — accurately
  matches both articles' description of the rolling test.
- R2.3 million compulsory threshold figure itself — stated correctly and
  consistently (6 occurrences checked).
- Distinction between taxable and exempt supplies, standard-rated vs.
  zero-rated — consistent with general SARS VAT categorisation (not
  explicitly detailed in either source article, but not contradicted by them).

## Conclusion

Per AGENTS.md stop conditions: **podcast content materially contradicts
source material** (finding #1) and **omits material facts from the source**
(#2, #3, #4). This podcast, in its current form, should not be published
against these two source articles without either (a) re-recording/editing
the audio to correct findings #1–4, or (b) Daniel reviewing and deciding
some of these are acceptable simplifications for an audio format — that is
an editorial judgement call for a human, not this worker.

**STOP. DO NOT PUBLISH. Escalating to Daniel per DECISIONS.md/CURRENT_STATE.md.**
