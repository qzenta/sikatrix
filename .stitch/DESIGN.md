# Sikatrix Business Accountants — Design System

## 1. Brand Identity

**Business:** Sikatrix Business Accountants  
**Visual character:** Deep-navy authority · gold accent warmth · clean white space · professional South African accounting firm  
**Credentials:** SAIPA Registered Professional Accountant (SA) · SARS Registered Tax Practitioner  
**Location signal:** Alberton, Johannesburg — locally grounded, Gauteng-serving  
**Mood:** Trustworthy, credible, plain-spoken, quietly confident. Not corporate-cold. Not flashy.

---

## 2. Colour System

> These are the **actual deployed Tailwind tokens** — use these in all code. The design brief uses `#172846` / `#E8B53C` as brand references; the live tokens below are what the codebase uses.

### Brand (Navy)
| Token | Hex | Usage |
|---|---|---|
| `brand` / `brand.DEFAULT` | `#1B3A6B` | Primary buttons, links, icon accents |
| `brand-light` | `#2452A4` | Hover states, glow overlays |
| `brand-dark` | `#0F2347` | Hero backgrounds, PageHero, dark sections |
| `brand-50` | `#EEF3FB` | Light tinted backgrounds |
| `brand-100` | `#D5E2F4` | Muted text on dark backgrounds |

### Accent (Gold)
| Token | Hex | Usage |
|---|---|---|
| `accent` / `accent.DEFAULT` | `#D4920A` | Primary CTA buttons, section labels, highlights |
| `accent-light` | `#F0A823` | Hero text accents, stat values, glow |
| `accent-dark` | `#A5710A` | Hover state for accent buttons |

### Neutral (Slate)
| Token | Hex | Usage |
|---|---|---|
| `neutral-50` | `#F8FAFC` | Subtle section backgrounds |
| `neutral-100` | `#F1F5F9` | Section backgrounds, cards |
| `neutral-200` | `#E2E8F0` | Borders, dividers |
| `neutral-400` | `#94A3B8` | Muted / placeholder text |
| `neutral-500` | `#64748B` | Body text secondary |
| `neutral-700` | `#334155` | Nav links, mid-emphasis text |
| `neutral-800` | `#1E293B` | Default body text |
| `neutral-900` | `#0F172A` | Headlines, high-emphasis text |

### Semantic
- **White:** `#FFFFFF` — Card backgrounds, main content area
- **Dark hero:** `brand-dark` (`#0F2347`) — Hero, PageHero, dark CTA bands

---

## 3. Typography

**Font family:** Inter (Google Fonts) — weights 300, 400, 500, 600, 700  
**Base font size:** 16px · Line height: relaxed  
**Anti-aliasing:** `-webkit-font-smoothing: antialiased`

### Type Scale — Current
| Role | Classes | Notes |
|---|---|---|
| `section-label` | `text-xs font-semibold uppercase tracking-widest text-accent` | Eyebrow text above headings |
| `section-title` | `text-3xl sm:text-4xl font-semibold text-neutral-900 leading-snug` | Main section h2 |
| `section-subtitle` | `text-base text-neutral-500 leading-relaxed max-w-xl` | Section sub-copy |
| Hero `h1` | `text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight` | Homepage hero |
| PageHero `h1` | `text-2xl sm:text-3xl md:text-4xl font-semibold text-white leading-snug` | Inner page heroes |
| Card title | `text-sm font-semibold text-neutral-900 leading-snug` | Blog/service cards |
| Body copy | `text-base text-neutral-800 leading-relaxed` | Paragraphs |
| Small / meta | `text-xs text-neutral-500` | Dates, labels, footnotes |
| `2xs` | `0.625rem / 1rem` | Category tags, micro-labels |

### Type Scale — Visual Lift Targets
| Role | Current | Lift Target |
|---|---|---|
| `section-title` | `font-semibold text-3xl sm:text-4xl` | `font-bold text-3xl sm:text-4xl` |
| Hero `h1` | `font-semibold text-3xl sm:text-4xl md:text-5xl` | `font-bold text-4xl sm:text-5xl md:text-6xl` |
| PageHero `h1` | `font-semibold text-2xl sm:text-3xl md:text-4xl` | `font-bold text-3xl sm:text-4xl md:text-5xl` |
| Step numbers | circle `bg-brand text-white font-semibold` | bordered ring with `text-accent-light font-bold` |

---

## 4. Spacing & Layout

### Container
- **Max-width:** `max-w-7xl` (80rem) with `px-4 sm:px-6 lg:px-8`
- Class: `.container-page`

### Section Padding — Current → Lift Target
| Pattern | Current | Lift Target |
|---|---|---|
| Standard sections | `py-12 md:py-16` | `py-16 md:py-24` |
| Tighter sections | `py-8 md:py-12` | `py-12 md:py-16` |
| Hero | `py-10 md:py-14 lg:py-18` | Retain — already generous |
| Section header margin | `mb-10 md:mb-12` | `mb-12 md:mb-16` |

### Grid Gaps
- Cards: `gap-5` → `gap-6`
- Steps: `gap-6` — retain
- Stats: `gap-4` — retain

### Border Radius
- Cards: `rounded-xl` — retain
- Buttons: `rounded-md` — retain
- Step circles → retain circular; improve with ring treatment

---

## 5. Component Patterns

### Buttons
```
btn-primary   — bg-accent text-white font-semibold shadow-sm, hover:bg-accent-dark
btn-secondary — bg-brand text-white font-semibold, hover:bg-brand-dark
btn-outline   — border-brand text-brand, hover:bg-brand hover:text-white
btn-ghost     — text-neutral-600, hover:bg-neutral-100
```
> Visual lift: increase `btn-primary` padding from `px-5 py-2.5` to `px-6 py-3` on key CTA instances.

### Cards
```
card — bg-white rounded-xl border border-neutral-200 shadow-card
     — hover:shadow-card-hover transition-shadow duration-200
```
> Visual lift: add `hover:ring-1 hover:ring-brand/10` for subtle brand ring on hover.

### Section Anatomy
```
[section-label]     — gold eyebrow text, xs uppercase tracking
[section-title]     — navy/neutral-900 headline, h2
[section-subtitle]  — slate body copy, max-w-xl
[content]           — grid / component
```
> Visual lift: add `border-b-2 border-accent pb-1 inline-block` treatment on `section-label` for a gold underline anchor.

### Dark Sections (Hero / PageHero)
```
bg-brand-dark (#0F2347)
  ↳ dot-grid: opacity-[0.045] white 1px dots on 28-30px grid
  ↳ accent glow: bg-brand-light/20 rounded-full blur-3xl (top-right corner)
  ↳ bottom fade: gradient-to-t from-black/20 to-transparent
  ↳ gradient overlay: from-brand-dark/95 via-brand-dark/85 to-brand-dark/55 (left-right)
```

### Shadow Tokens
```
shadow-card       — 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
shadow-card-hover — 0 4px 12px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
shadow-nav        — 0 1px 0 rgba(0,0,0,0.08)
```

---

## 6. Design System Notes for Stitch Generation

> **Copy this entire block into every Stitch prompt baton.**

```
DESIGN SYSTEM — Sikatrix Business Accountants

Brand palette:
- Primary background (dark sections): #0F2347 (deep navy)
- Primary brand: #1B3A6B (navy)
- Accent / CTA: #D4920A → #F0A823 (gold, warm amber)
- Body text: #1E293B on white
- Muted text: #64748B
- Borders: #E2E8F0
- Section backgrounds alternate: #FFFFFF and #F1F5F9 (light slate)

Typography:
- Font: Inter (Google Fonts), weights 400–700
- Headlines: Inter Bold or SemiBold, tight tracking, #0F172A on light / #FFFFFF on dark
- Body: Inter Regular/Medium, 16px, relaxed line-height
- Eyebrow labels: Inter SemiBold, 11px, ALL CAPS, wide tracking, gold (#D4920A)

Tone & character:
- Professional South African accounting firm
- SAIPA-registered, SARS Tax Practitioner
- Based in Alberton, Johannesburg — locally credible, nationally capable
- Clean, trustworthy, credible. Not flashy. Quiet authority.
- White space is generous. Hierarchy is clear. CTAs are prominent but not aggressive.

Dark sections (Hero / page headers):
- Deep navy #0F2347 background
- White headline, gold accent on key word
- Subtle dot-grid texture (white 1px dots, 28px grid, 4–5% opacity)
- Brand-blue glow (top-right, blur-3xl, 20% opacity)
- Left-to-right gradient overlay softening photo backgrounds

Light sections:
- Alternate #FFFFFF and #F1F5F9 — never two consecutive same-colour sections
- Card component: white bg, rounded-xl, slate-200 border, soft shadow
- Accent gold used only for: section eyebrow labels, CTA buttons, stat values, highlight words

Buttons:
- Primary: gold (#D4920A) bg, white text, rounded-md, font-semibold — "Book Consultation", "Get Free Quote"
- Secondary: navy (#1B3A6B) bg, white text — used on dark backgrounds
- Outline: navy border, navy text — used as secondary CTA alongside primary
- Ghost: slate text, hover bg-slate-100 — used for "View all →" type links

Visual lift direction (NOT a revamp):
- Improve typography weight only (semibold → bold for main headlines)
- Increase section vertical padding for more breathing room
- Add subtle gold underline anchor to section eyebrow labels
- Improve card hover states (ring treatment)
- Do NOT restructure sections, rename pages, or change content
- Do NOT touch analytics, tracking, redirect logic, canonical URLs, or cron routes
```

---

## 7. What This Lift Is NOT

To keep scope tight and deployment risk low:

- ❌ Do not add, remove, or rename any page routes
- ❌ Do not restructure section order on any page
- ❌ Do not modify `middleware.ts`
- ❌ Do not modify `app/layout.tsx` (analytics wired there)
- ❌ Do not modify `next.config.ts`
- ❌ Do not modify `vercel.json`
- ❌ Do not change canonical URLs, og:url values, or structured data schema URLs
- ❌ Do not touch any files under `app/api/cron/`
- ❌ Do not change copy — visual changes only
- ❌ Do not introduce new dependencies

---

## 8. Implementation Notes for Code Changes

When applying the lift in code, these are the targeted global changes:

### globals.css
```css
/* section-title lift */
.section-title {
  @apply text-3xl sm:text-4xl font-bold text-neutral-900 leading-snug;
  /* was: font-semibold */
}

/* section-label gold anchor */
.section-label {
  @apply text-xs font-semibold uppercase tracking-widest text-accent
         border-b-2 border-accent pb-0.5;
  /* adds a 2px gold underline to every eyebrow label */
}
```

### Section padding (components)
```
py-12 md:py-16  →  py-16 md:py-24   (standard white/light sections)
mb-10           →  mb-12 md:mb-16   (section header bottom margin)
gap-5           →  gap-6            (card grids)
```

### Hero h1 (Hero.tsx)
```
text-3xl sm:text-4xl md:text-5xl font-semibold
→ text-4xl sm:text-5xl md:text-6xl font-bold
```

### PageHero h1 (PageHero.tsx)
```
text-2xl sm:text-3xl md:text-4xl font-semibold
→ text-3xl sm:text-4xl md:text-5xl font-bold
```

### HowItWorks step circles (HowItWorks.tsx)
```
w-14 h-14 rounded-full bg-brand text-white font-semibold
→ w-14 h-14 rounded-full border-2 border-brand bg-white text-accent-light font-bold
  (ring treatment — white fill with brand border and gold number)
```

### Card hover ring (globals.css)
```css
.card {
  @apply bg-white rounded-xl border border-neutral-200 shadow-card
         hover:shadow-card-hover hover:ring-1 hover:ring-brand/10
         transition-all duration-200;
  /* added: hover:ring-1 hover:ring-brand/10, transition-all */
}
```
