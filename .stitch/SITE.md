# Sikatrix Business Accountants — Site Map & Vision

## 1. Site Identity

**Brand:** Sikatrix Business Accountants  
**Tagline:** The accountant Alberton's businesses call first  
**URL:** https://www.sikatrix.com  
**Entity type:** Professional services — SAIPA-registered accountants, SARS Tax Practitioners  
**Location:** Alberton, Johannesburg, Gauteng, South Africa  
**Target audience:** SMEs, startups, NGOs, sole proprietors across Gauteng  
**Tone:** Professional, plain-spoken, locally grounded, credible, reassuring  
**Build:** Next.js 15 · Tailwind CSS 3 · TypeScript · Framer Motion · deployed on Vercel

---

## 2. Stitch Project ID

> **STATUS: NOT YET CREATED**  
> Populate `projectId` here after calling `create_project` and running `design-md`.  
> Save full metadata to `.stitch/metadata.json`.

```json
{
  "projectId": "TBD",
  "title": "Sikatrix Business Accountants"
}
```

---

## 3. Navigation Architecture

### Top Bar (desktop only)
- Pulse indicator + value proposition text + "Book free consultation →" link
- Phone number · Email address

### Primary Navigation
| Label | Route | Has Dropdown |
|---|---|---|
| Home | / | No |
| Pricing | /pricing | No |
| Services | /services | Yes — 6 service slugs |
| Industries | /industries | Yes — all industry slugs |
| Locations | /locations | Yes — all location slugs |
| Resources | /resources | Yes — categories + Tax Calculator |
| About | /about | No |
| Contact | /contact | No |

### Header CTA
- Desktop: "Book Consultation" → `/contact` (btn-primary, xs size)
- Mobile: Hamburger → full-screen nav with expandable sub-menus

---

## 4. Sitemap

### Core Pages
- [x] `/` — Homepage
- [x] `/about` — About Sikatrix
- [x] `/contact` — Contact & booking
- [x] `/pricing` — Fixed-fee pricing tiers
- [x] `/faq` — Frequently asked questions

### Service Pages
- [x] `/services` — Services hub
- [x] `/services/[slug]` — Individual service pages (dynamic)

### Industry Pages
- [x] `/industries` — Industries hub
- [x] `/industries/[slug]` — Individual industry pages (dynamic)

### Location Pages
- [x] `/locations` — Locations hub
- [x] `/locations/[slug]` — Individual location pages (dynamic)

### Resources / Blog
- [x] `/resources` — Blog listing (all posts)
- [x] `/resources/[slug]` — Individual blog post
- [x] `/resources/category/[slug]` — Category filtering

### Tools
- [x] `/tools/tax-calculator` — Income tax calculator 2026/27

### Legal
- [x] `/popia` — POPIA compliance notice
- [x] `/privacy-policy` — Privacy policy
- [x] `/cookie-policy` — Cookie policy
- [x] `/terms` — Terms and conditions

### API / Crons (internal — not pages)
- `/api/contact` — Contact form handler (Brevo)
- `/api/newsletter` — Newsletter signup (MailerLite)
- `/api/cron/*` — 7 Vercel cron jobs (client reminders, deadlines, engagement, monthly-summary, seed-deadlines, update-statuses, welcome)

---

## 5. Homepage Component Structure

The homepage assembles these components in order:

```
Hero                    — 3-slide carousel, brand-dark bg, photo overlay, stats bar
TrustBar               — Scrolling partner logos (QuickBooks, Xero, Sage, Draftworx, SimplePay, Syft)
ServicesGrid           — 8+ service cards in responsive grid
HowItWorks             — 4-step numbered process with photo band
PricingTeaser          — Pricing preview with CTA to /pricing
LocationHighlights     — Key service area cards
LeadMagnet             — Newsletter/lead capture section
TestimonialsGrid       — Client testimonials
ProofModules           — 5 case study cards (sector → problem → outcome)
[Blog Preview]         — Latest 3 posts, inline in page.tsx
[Final CTA section]    — CTABlock: "Ready to simplify your accounting?"
```

---

## 6. Inner Page Template (PageHero)

All non-home pages use the shared `PageHero` component:
- `bg-brand-dark` background with dot-grid texture and accent glow
- Breadcrumb navigation (BreadcrumbList JSON-LD)
- Optional `bgImage` with gradient overlays
- `size` prop: `sm` (py-10/14) | `md` (py-14/20) | `lg` (py-20/28)
- `goldLabel` prop for accent-coloured eyebrow text

---

## 7. Design Constraints — DO NOT CHANGE

- `middleware.ts` — www redirect logic. **DO NOT TOUCH.**
- `app/layout.tsx` — Vercel Analytics + Speed Insights wired in. **DO NOT TOUCH.**
- `next.config.ts` — image domains, CSP headers. **DO NOT TOUCH.**
- `vercel.json` — cron schedule configuration. **DO NOT TOUCH.**
- All canonical, og:url, and schema URLs. **DO NOT TOUCH.**
- All cron routes under `/api/cron/`. **DO NOT TOUCH.**
- All page routes and slugs — no renaming, no restructuring.

---

## 8. Roadmap — Visual Lift Tasks

> **Scope:** Typography weight, spacing, visual hierarchy only. No restructuring.

| # | Task | Page(s) | Status |
|---|---|---|---|
| 1 | Section spacing lift — increase `py-12/16` → `py-16/24` in bg-white sections | All | [ ] |
| 2 | Section labels — add a 2px gold underline or pill style to `section-label` class | All | [ ] |
| 3 | Headline weight — `section-title` from `font-semibold` → `font-bold` | All | [ ] |
| 4 | Hero h1 — increase desktop size: `text-5xl md:text-6xl` and `font-bold` | Home | [ ] |
| 5 | HowItWorks step numbers — replace circle bg with bordered ring + gold number | Home | [ ] |
| 6 | ProofModules — add subtle left-border accent on cards | Home | [ ] |
| 7 | PageHero — increase title weight to `font-bold`, subtitle opacity softened | All inner pages | [ ] |
| 8 | TrustBar label — increase contrast, uppercase spacing refinement | Home | [ ] |
| 9 | Card hover states — add `ring-1 ring-brand/10` on hover | ServicesGrid, blog preview | [ ] |
| 10 | Footer — audit contrast ratios, increase link visibility | All | [ ] |
| 11 | Pricing page — accent band behind recommended tier | /pricing | [ ] |
| 12 | Blog post typography — increase body line-height and h2 weight | /resources/[slug] | [ ] |

---

## 9. Content Blog Posts — Pending Creation

> Two new MDX blog posts to be created in `content/posts/`. Review before publishing.

| # | Slug | Title |
|---|---|---|
| 1 | `sars-section-210-penalty-how-to-fight` | What happens when SARS issues a Section 210 penalty — and how to fight it |
| 2 | `vat-registration-mandatory-threshold-south-africa` | VAT registration in South Africa: when it becomes mandatory and what to do next |

> **Note:** `sars-penalties-objections-appeals.md` and `vat-registration-when-and-how.md` already exist. New posts take distinct angles (s210-specific + RFR/deferred payment; approaching-threshold journey).
