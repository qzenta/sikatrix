# ARTWORK_ASSESSMENT.md — Podcast Artwork (CC handoff Section 12)

## Existing Sikatrix brand assets inspected

| Asset | Dimensions | Format | Suitable as podcast cover art? |
|---|---|---|---|
| `public/logo.png` (also in Downloads as `sikatrix_logo.png`) | 1346×460 | PNG | No — wordmark, wrong aspect ratio (not square) |
| `public/logo-footer.webp` | 351×120 | WebP | No — same issue, also too small |
| `public/og-default.png` | 1200×630 | PNG | No — landscape (1.91:1) OG image, not square |
| `app/icon.png` | 558×583 | PNG | No — near-square but not exact, has a baked-in "TM" mark and a skeuomorphic rounded-square/drop-shadow app-icon treatment, and resolution is below platform minimums |
| `sikatrix_profile_picture_800x800.png` (Downloads) | 800×800 | PNG | Closest candidate — correct 1:1 aspect ratio, on-brand navy/gold "S" mark, clean flat design, no watermark. **But** 800×800 is below both Spotify's and Apple Podcasts' stated minimum of 1400×1400px, and has no show/episode text, which most podcast directories expect on cover art. |

## Conclusion

**No existing Sikatrix asset meets podcast cover art requirements
(square, ≥1400×1400px, ideally ≤3000×3000px, with the show identifiable
at thumbnail size).** This is a genuine gap, not a "good enough" call —
per Section 12: document gap, propose option, stop for human approval.
No new artwork has been created by this worker.

## Proposed options (for Daniel to choose/approve — none actioned)

1. **Upscale the existing "S" profile picture** (`sikatrix_profile_picture_800x800.png`)
   to 3000×3000 and add show-name text. Fastest path, stays closest to
   the current visible Sikatrix brand mark; upscaling a flat vector-style
   mark tends to hold up better than upscaling a photo.
2. **Recreate the mark at native high resolution** from whatever source
   file (Illustrator/Figma/etc.) produced the original "S" logo, if one
   exists, rather than upscaling the PNG. Cleanest result, but depends on
   whether a source file is available — worth checking the
   `Sikatrix Design System` files noted in this worker's memory before
   assuming it doesn't exist.
3. **New artwork commissioned/generated for the podcast specifically**,
   using the same navy/gold palette for consistency, but designed at
   native square resolution with show-name text. Most work, but the only
   option guaranteed to actually meet directory display requirements
   well (a diretory-legible show name is expected at thumbnail size).

This worker has not generated, upscaled, or otherwise produced a
candidate image — that's a design action beyond MEDIA-001's scope
("do not create a new visual identity merely for the sake of the
podcast," Section 12) and squarely a human decision point.
