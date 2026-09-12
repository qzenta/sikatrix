# ARTWORK_ASSESSMENT.md — Podcast Artwork (CC handoff Section 12)

## Correction (12 Sep 2026)

The candidate cover previously produced from the "Sikatrix Design System
(4)" stationery vector source (flat navy background, flat white "S", flat
gold bar) **does not match the actual Sikatrix brand mark.** Daniel
confirmed the real style is the embossed/beveled "S" — navy letterform
with dimensional shading, on a white background, with a curved gold
ribbon/flag shape beneath it (not a flat rectangle) — as seen in
`sikatrix_profile_picture_800x800.png`. That candidate file has been
removed from `artwork/` (still recoverable from git history — see
`DECISIONS.md`). The rest of this document is corrected accordingly.

## Existing Sikatrix brand assets inspected (updated)

| Asset | Dimensions | Style | Suitable as podcast cover art? |
|---|---|---|---|
| `public/logo.png` / `sikatrix_logo.png` | 1346×460 | Wordmark | No — wrong aspect ratio |
| `public/logo-footer.webp` | 351×120 | Wordmark | No — too small, wrong ratio |
| `public/og-default.png` | 1200×630 | — | No — landscape OG image |
| `Sikatrix Design System/assets/logo-sikatrix-3d.png` | 487×228 | **Bevel style** (wordmark, "Sikatrix" + tagline) | No — low-res, wordmark not a mark, on a gray gradient background, not square |
| `app/icon.png` | 558×583 | Bevel style, rounded-square container, "TM" baked in, straight gold bars | No — near-square but not exact, watermarked, container treatment not appropriate for bare cover art, below resolution minimum |
| Design System stationery `avatar-1024.png` / `avatar-1024-white.png` (all 4 folder copies) | 1024×1024 | **Bevel style**, but same rounded-square container + "TM" + straight gold bars as `app/icon.png` | No — same issues as above; container/TM/straight-bar treatment doesn't match the bare-mark reference Daniel confirmed |
| Design System stationery `avatar-1024-transparent.svg` / `avatar-1024-rounded.svg` | vector, 1024 viewBox | **Flat style** (no bevel) — a different, simplified variant of the mark | **No — wrong style entirely**, despite being genuinely vector. This is what the previous (now-removed) candidate was built from. |
| `sikatrix_profile_picture_800x800.png` (Downloads) | 800×800 | **Bevel style, bare mark, white background, wavy gold ribbon** — matches Daniel's confirmed reference exactly | Correct style, but below the 1400×1400 minimum |

## Search for a higher-resolution or vector source of the correct (bevel) style

Per Daniel's explicit instruction, searched beyond the files above before
concluding anything:

- All 5 "Sikatrix Design System" folder copies on OneDrive (`Desk_1/Sikatrix Design System`,
  `(1)` through `(4)`) — the only files in this exact bevel/bare-mark/
  wavy-ribbon composition top out at 1024×1024, and all of them add the
  rounded-square container + "TM" + straight gold bars that the
  confirmed reference doesn't have.
- OneDrive-wide search for `.ai`, `.psd`, `.fig`, `.sketch`, or any other
  Sikatrix-named SVG, and for any file with "3d"/"bevel"/"emboss" in the
  name — **nothing found** beyond what's already catalogued above.

**Conclusion: no source exists, anywhere accessible to this worker, at
or above 1400×1400 for the correct bevel-style bare mark.** The
embossed/shaded rendering appears to have been produced by a design tool
(gradient/shadow effects baked into the raster export) rather than kept
as editable vector paths — a 3D bevel effect like this typically isn't
representable as a flat SVG in the first place, which is consistent with
no SVG of it existing.

## Per the existing stop condition: not upscaling, reporting back

Per Daniel's standing instruction: do not attempt to upscale the 800×800
PNG to cover-art quality. Reporting back with the actual options rather
than guessing which to take:

1. **Recreate the bevel effect at native high resolution** in a design
   tool (Illustrator/Figma/Photoshop) from scratch, matching the
   `sikatrix_profile_picture_800x800.png` reference exactly — the only
   option that reproduces the *exact* existing look at true high-res,
   but needs a human with design tooling (or a source file this worker
   doesn't have access to — worth checking if the original designer has
   the working file, e.g. an Illustrator/Photoshop file that produced
   `logo-sikatrix-3d.png` and the avatar bevel renders).
2. **Approximate the bevel effect programmatically** (CSS/SVG gradients
   and drop-shadow filters composited at 2000×2000+) as a close visual
   match rather than a pixel-exact reproduction. Faster, no new design
   tooling needed, but won't be identical to the reference — this
   worker could attempt it and show Daniel the result for a fidelity
   judgement call before treating it as final.
3. **Accept the 800×800 asset as-is for now** and revisit cover art
   resolution before actual Spotify/Apple submission (both platforms
   validate resolution at upload time — this wouldn't pass, so this
   option really means "defer the decision," not "ship it").

Nothing in this list has been actioned. Awaiting Daniel's direction.
