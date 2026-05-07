# Sikatrix Website — Deployment Guide

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 3
- **Language:** TypeScript
- **Rendering:** Static Site Generation (SSG) — all 33 pages pre-rendered

---

## Local Development

```bash
cd Documents/sikatrix
npm install        # already done
npm run dev        # starts at http://localhost:3000
```

---

## Deploy to Vercel (Recommended)

### Option A — Vercel CLI
```bash
npm i -g vercel
cd Documents/sikatrix
vercel            # follow prompts, connects to your Vercel account
```

### Option B — GitHub + Vercel Dashboard
1. Push to GitHub: `git init && git add . && git commit -m "init" && git remote add origin <your-repo-url> && git push -u origin main`
2. Go to vercel.com → New Project → Import your repo
3. Vercel auto-detects Next.js — click Deploy

### Environment Variables (Vercel)
None required for the static version. Add these when wiring up a real contact form backend:
- `RESEND_API_KEY` — for email delivery (Resend.com)
- `RECAPTCHA_SECRET_KEY` — for form spam protection

---

## Deploy to Cloudflare Pages

```bash
npm run build
# Upload the `.next` directory via Cloudflare Pages dashboard
# Framework preset: Next.js
```

Or connect your GitHub repo to Cloudflare Pages with build command `npm run build` and output directory `.next`.

---

## Custom Domain
Point your domain's DNS to Vercel or Cloudflare Pages nameservers. Both platforms issue free SSL certificates automatically.

---

## Next Steps (Phase 2)

### Contact Form Backend
- Wire up the contact form (`app/contact/page.tsx`) to Resend or EmailJS
- Add reCAPTCHA v3 for spam protection

### Google Maps Integration
- Replace map placeholders in `/locations/[slug]/page.tsx` and `/contact/page.tsx`
- Get a Google Maps Embed API key from console.cloud.google.com

### Analytics
- Add `<GoogleAnalytics>` from `@next/third-parties/google` in `app/layout.tsx`
- Or use Plausible Analytics for a privacy-first alternative

### Blog CMS
- Replace the static `BLOG_POSTS` array in `lib/site.ts` with a CMS
- Recommended: Sanity.io or Contentful (both have Next.js adapters)

### Lead Magnet
- Connect the email capture form in `LeadMagnet.tsx` to Mailchimp, ConvertKit, or Resend

### WhatsApp Button
- The float button is live — update `SITE.whatsapp` in `lib/site.ts` with the correct number

---

## File Map

```
app/
  page.tsx                    → Home
  about/page.tsx              → About
  services/page.tsx           → Services hub
  services/[slug]/page.tsx    → 8 service detail pages
  industries/page.tsx         → Industries
  locations/page.tsx          → Locations hub
  locations/[slug]/page.tsx   → 5 city pages (SEO-optimised)
  resources/page.tsx          → Blog hub
  resources/[slug]/page.tsx   → 6 blog posts
  contact/page.tsx            → Contact + form
  privacy-policy/page.tsx     → Privacy Policy (POPIA)
  terms/page.tsx              → Terms & Conditions
  cookie-policy/page.tsx      → Cookie Policy
  popia/page.tsx              → POPIA Compliance Notice

lib/
  site.ts                     → All business data (services, locations, testimonials, blog)
  location-data.ts            → Rich location page content
  metadata.ts                 → SEO metadata helpers + Schema.org JSON-LD

components/
  layout/Header.tsx           → Sticky nav with dropdown + mobile menu
  layout/Footer.tsx           → Full footer with links, contact, partners
  home/Hero.tsx               → Conversion hero with stats bar
  home/ServicesGrid.tsx       → Services overview cards
  home/HowItWorks.tsx         → 4-step process
  home/LocationHighlights.tsx → Location cards
  home/LeadMagnet.tsx         → SARS checklist email capture
  home/TrustBar.tsx           → Accreditations + partner logos
  shared/PageHero.tsx         → Reusable inner page hero
  shared/CTABlock.tsx         → Reusable CTA section
  shared/TestimonialsGrid.tsx → 4-up testimonials
  ui/CookieBanner.tsx         → POPIA-compliant cookie consent
```
