# EPISODE_PAGE_DRAFT.md — Website Episode Page (CC handoff Section 18)

Content draft only — **no route built, no code changed.** Written to
match the existing `content/posts/*.md` + `lib/blog.ts` pattern so it can
be dropped into whatever podcast content type gets built (see
`ARCHITECTURE.md` for the proposed `/resources/podcast` route structure,
still a separate implementation task).

## Proposed URL

```
https://www.sikatrix.com/resources/podcast/vat-thresholds-2026-what-changed
```

(Slug pattern matches existing `content/posts/` conventions — descriptive,
kebab-case, no date prefix.)

## Front-matter-equivalent metadata

```yaml
title: "VAT Thresholds Just Changed: What R2.3 Million (and R120,000) Means for Your SME in 2026"
description: "SARS raised both VAT registration thresholds on 1 April 2026 and is already auto-registering businesses that cross them. Sikatrix breaks down what changed and how to get ahead of it."
slug: "vat-thresholds-2026-what-changed"
type: "podcast"
category: "VAT"
tags: [VAT, SARS, SME, podcast, taxplanning]
author:
  name: "Sikatrix Business Accountants"
  title: "SAIPA Professional Accountants (SA)"
publishDate: null  # not set — publication not authorized
duration: "20:18"
episodeNumber: 1
audioFile: "/audio/vat-thresholds-2026-what-changed.mp3"  # placeholder path; actual hosting location depends on RSS host chosen
sourceArticles:
  - slug: "sars-automatic-vat-registration-2026"
  - slug: "vat-registration-threshold-voluntary-growing-sme"
relatedServices: ["tax-services", "bookkeeping"]
canonical: "https://www.sikatrix.com/resources/podcast/vat-thresholds-2026-what-changed"
```

## Page copy

### Short summary (listing/card view)

> SARS raised both VAT registration thresholds on 1 April 2026 — compulsory
> to R2.3 million, voluntary to R120,000 — and it's already auto-registering
> businesses that cross them. We break down what changed and how to get
> ahead of it.

### Full description (episode page body, above the player)

New VAT thresholds took effect on 1 April 2026: the compulsory
registration threshold rose from R1 million to R2.3 million, and the
voluntary threshold rose from R50,000 to R120,000. In this episode, we
unpack what that actually means for a growing South African SME —
how the rolling 12-month turnover test works, when voluntary registration
is worth doing before you're forced to, and why SARS is already using
bank and CIPC data to register businesses automatically, sometimes with a
backdated effective date that can mean owing VAT, penalties, and interest
for periods you never charged for.

This episode is based on two Sikatrix Resources articles, linked below —
listen for the overview, then read the full articles for the detail.

### [Embedded player — placeholder]

`{{ AUDIO PLAYER COMPONENT — embeds audioFile / RSS enclosure once hosting is chosen }}`

### Listen on

`{{ Spotify | Apple Podcasts | YouTube — links added once each submission is live; none exist yet }}`

### Source articles

- [SARS Can Now Register Your Business for VAT Automatically — Here's What Changed in 2026](/resources/sars-automatic-vat-registration-2026)
- [VAT Registration Thresholds and Voluntary Registration: When It Makes Sense for a Growing SME](/resources/vat-registration-threshold-voluntary-growing-sme)

### Related Sikatrix tools

- [VAT Calculator](/tools/vat-calculator)
- [SARS Compliance Calendar](/tools/sars-compliance-calendar)

### CTA (end of page, matches existing article CTA pattern)

> If you're not sure where your turnover stands against the new
> thresholds, we can review it for you. Contact Sikatrix Business
> Accountants at [info@sikatrix.com](mailto:info@sikatrix.com) or call
> [(011) 867-2550](tel:+27118672550). We're based in Brackenhurst,
> Alberton, and serve clients across Gauteng and remotely throughout
> South Africa.

## SEO / Open Graph metadata (matches existing article page pattern)

```yaml
metaTitle: "VAT Thresholds 2026: R2.3M Compulsory, R120K Voluntary | Sikatrix"
metaDescription: "SARS raised the VAT registration thresholds on 1 April 2026. Listen to Sikatrix break down what R2.3 million compulsory and R120,000 voluntary registration means for your SME."
ogTitle: "VAT Thresholds Just Changed: What It Means for Your SME | Sikatrix"
ogDescription: "New 2026 VAT thresholds, explained — and why SARS is already auto-registering businesses that cross them."
ogImage: "artwork/podcast-cover-2000x2000.png (see ARTWORK_ASSESSMENT.md — candidate, pending Daniel's sign-off)"
twitterCard: "summary_large_image"
canonical: "https://www.sikatrix.com/resources/podcast/vat-thresholds-2026-what-changed"
structuredData: "PodcastEpisode schema (schema.org) — episode name, description, datePublished (once set), duration (PT20M18S), associatedMedia pointing at the hosted audio file, partOfSeries referencing the show"
```

## Open items before this can go live

- Route/template doesn't exist yet — this is content only (ARCHITECTURE.md).
- `audioFile` path is a placeholder — depends on where the RSS-hosted
  audio ends up living.
- `ogImage` candidate exists (`artwork/podcast-cover-2000x2000.png`) but
  awaits Daniel's sign-off per `ARTWORK_ASSESSMENT.md`.
- `publishDate` intentionally null — publication is not authorized.
- Platform links are placeholders — none of Spotify/Apple/YouTube
  submission has happened, per the distribution boundary this pass isn't
  crossing.
