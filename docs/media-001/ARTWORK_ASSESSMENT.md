# ARTWORK_ASSESSMENT.md — Podcast Artwork (CC handoff Section 12)

## Existing Sikatrix brand assets inspected

| Asset | Dimensions | Format | Suitable as podcast cover art? |
|---|---|---|---|
| `public/logo.png` (also in Downloads as `sikatrix_logo.png`) | 1346×460 | PNG | No — wordmark, wrong aspect ratio (not square) |
| `public/logo-footer.webp` | 351×120 | WebP | No — same issue, also too small |
| `public/og-default.png` | 1200×630 | PNG | No — landscape (1.91:1) OG image, not square |
| `app/icon.png` | 558×583 | PNG | No — near-square but not exact, has a baked-in "TM" mark and a skeuomorphic rounded-square/drop-shadow app-icon treatment, and resolution is below platform minimums |
| `sikatrix_profile_picture_800x800.png` (Downloads) | 800×800 | PNG | Closest candidate — correct 1:1 aspect ratio, on-brand navy/gold "S" mark, clean flat design, no watermark. **But** 800×800 is below both Spotify's and Apple Podcasts' stated minimum of 1400×1400px, and has no show/episode text, which most podcast directories expect on cover art. |

## Update: vector source found — cover produced from it

Per Daniel's follow-up instruction, searched beyond `public/` and
Downloads for a vector or higher-resolution source. Found one at
`OneDrive - Ghana Diaspora SA/Desk_1/Sikatrix Design System (4)/stationery/exports/`:

- `avatar-1024-transparent.svg` / `avatar-1024-rounded.svg` — genuine
  vector SVGs. The "S" is real rendered text (Manrope, weight 800, navy
  `#172846`), not an embedded raster — infinitely scalable, no
  upscaling artifacts possible.
- Matching 1024×1024 PNG exports from the same pipeline.

This is a materially better source than `sikatrix_profile_picture_800x800.png`
(higher-res, and genuinely vector rather than raster).

**One complication:** rendering the SVG correctly requires the Manrope
font, which wasn't installed locally. Per explicit approval, downloaded
the official open-source Manrope variable font (Google Fonts / GitHub,
~165KB) rather than let it fall back to a generic system font, which
would have silently produced an off-brand result.

**Method:** embedded the Manrope font directly in a self-contained SVG
(square, full-bleed navy `#172846` background — no rounded corners baked
in, since directories apply their own corner treatment — white "S",
gold `#E8B53C` underline bar, matching `avatar-1024-rounded.svg`'s
color scheme exactly), rendered it via canvas at 2000×2000 in a
headless browser context, and flattened to RGB (no alpha channel, per
Apple/Spotify's preference for opaque cover art).

**Result:** `artwork/podcast-cover-2000x2000.png` — 2000×2000, RGB, no
transparency, within the 1400–3000px compliant range. The safe-margin
ratio is inherited directly from the original SVG's own proportions
(glyph occupies roughly the vertical 27–70% band, gold bar bottom edge
sits at ~86.5% — both comfortably inside the ~10% outer safe zone) since
this is a straight proportional scale-up of the source design, not a
redraw.

**This is a candidate, not a final decision.** No show-name text is
baked in (not required by Spotify, per Daniel's instruction) — if a
directory-legible show name at thumbnail size is wanted, that's an
additional design pass on top of this file, not done here.

## Original assessment (superseded by the above, kept for the record)

**No existing raster Sikatrix asset in `public/` or Downloads meets
podcast cover art requirements** (square, ≥1400×1400px). That conclusion
still stands for those files — it's the vector source above that
resolves the gap.
