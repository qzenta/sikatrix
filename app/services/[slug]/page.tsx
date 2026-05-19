import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle, ArrowRight,
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, ShieldCheck, Globe
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { SERVICES, LOCATIONS } from "@/lib/site";
import { getAllPosts } from "@/lib/blog";

// Deliberate backlinking: service pages link to their most relevant articles
const SERVICE_ARTICLE_MAP: Record<string, string[]> = {
  "annual-financial-statements": ["registering-a-company-cipc-guide", "small-business-bookkeeping-mistakes", "sme-tax-compliance-calendar-2025-2026"],
  "tax-services":                ["sars-provisional-tax-guide-2025", "vat-registration-when-and-how", "sars-penalties-objections-appeals"],
  "bookkeeping":                 ["small-business-bookkeeping-mistakes", "cloud-accounting-vs-desktop"],
  "payroll":                     ["paye-uif-sdl-explained", "coida-return-of-earnings-guide-south-africa", "workmens-compensation-south-africa"],
  "cloud-accounting":            ["cloud-accounting-vs-desktop", "small-business-bookkeeping-mistakes"],
  "company-secretarial":         ["registering-a-company-cipc-guide", "tax-clearance-certificate-south-africa"],
  "business-permit-support":     ["registering-a-company-cipc-guide"],
  "import-export-license":       [],
};

// ICP targeting: who each service is (and isn't) for
const SERVICE_WHO_FOR: Record<string, { for: string[]; notFor: string[] }> = {
  "annual-financial-statements": {
    for: [
      "Private companies (Pty Ltd, NPC, CC) with CIPC annual filing obligations",
      "Businesses applying for a bank loan, overdraft, or external funding",
      "Companies with shareholders or a board requiring formal financial reporting",
      "Any entity that must prove financial compliance to a regulatory body or funder",
    ],
    notFor: [
      "Sole proprietors who only need a simple cash book or management summary",
      "Dormant companies with no trading activity in the year",
    ],
  },
  "tax-services": {
    for: [
      "Business owners with ITR14 (company) or IRP6 (provisional tax) obligations",
      "VAT vendors with monthly or bi-monthly VAT201 submissions",
      "Anyone with outstanding SARS returns, penalties, or objections pending",
      "Sole proprietors, freelancers, and individuals with multiple income sources",
    ],
    notFor: [
      "Employees whose only income is a single salary with PAYE fully deducted — SARS Auto-Assessment typically handles these",
    ],
  },
  "bookkeeping": {
    for: [
      "Growing SMEs that need reliable monthly management accounts to make decisions",
      "VAT vendors who need clean, complete records for every bi-monthly submission",
      "Businesses that are months or years behind on their bookkeeping",
      "Business owners who want to stop guessing where the money is at month-end",
    ],
    notFor: [
      "Businesses with fewer than 15 monthly transactions already using a well-maintained system",
    ],
  },
  "payroll": {
    for: [
      "Any business employing at least one person — full-time, part-time, or casual",
      "Employers with PAYE, UIF, SDL, and COIDA (Compensation Fund) obligations",
      "Businesses with complex payroll: overtime, commissions, leave accruals, bonuses",
      "Companies that have received SARS payroll penalties and need to get clean",
    ],
    notFor: [
      "Sole proprietors with no employees who only draw owner's drawings or dividends",
    ],
  },
  "cloud-accounting": {
    for: [
      "Businesses moving from desktop accounting software (Pastel, QuickBooks Desktop) to cloud",
      "Businesses with no formal accounting system who need one set up from scratch",
      "Multi-location or remote businesses needing real-time financial visibility",
      "Business owners who want 24/7 access to their numbers from any device",
    ],
    notFor: [
      "Businesses already on a well-configured cloud platform with clean, current data",
    ],
  },
  "company-secretarial": {
    for: [
      "Entrepreneurs registering a new Pty Ltd, NPC, or converting a CC",
      "Existing companies needing CIPC annual returns filed before the deadline",
      "Businesses requiring director, shareholder, or registered office amendments",
      "Foreign nationals needing a South African company legally registered",
    ],
    notFor: [
      "Sole proprietors with no CIPC registration requirements",
      "Companies already self-managing CIPC compliance with a dedicated in-house secretary",
    ],
  },
  "business-permit-support": {
    for: [
      "Foreign nationals starting or running a business in South Africa",
      "South African employers hiring foreign skills under a critical skills or work visa",
      "Permit applicants who need financial viability reports for DHA submissions",
      "Businesses needing CIPC registration and SARS tax registration for foreign principals",
    ],
    notFor: [
      "South African citizens with no immigration or permit requirements",
    ],
  },
  "import-export-license": {
    for: [
      "Businesses importing goods for resale, manufacturing, or distribution in South Africa",
      "South African businesses exporting goods or services internationally",
      "Any business crossing the SARS customs registration threshold",
      "Companies dealing in goods subject to specific import duties or permits",
    ],
    notFor: [
      "Businesses that exclusively buy and sell within South Africa with no cross-border activity",
    ],
  },
};

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud, Briefcase, ShieldCheck, Globe,
};

// Hero backgrounds — swap to local file once dropped in public/photos/services/
const SERVICE_HERO_IMAGES: Record<string, string> = {
  "annual-financial-statements": "https://images.pexels.com/photos/5668482/pexels-photo-5668482.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1",
  "tax-services":                "https://images.pexels.com/photos/5690374/pexels-photo-5690374.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1",
  "bookkeeping":                 "/photos/services/bookkeeping.jpg",
  "payroll":                     "/photos/services/payroll.jpg",
  "cloud-accounting":            "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1",
  "company-secretarial":         "/photos/services/company-sec.jpg",
  "business-permit-support":     "/photos/services/permit-support.jpg",
  "import-export-license":       "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&dpr=1",
};

// Content section images — drop matching file in public/photos/services/ to override
const SERVICE_CONTENT_IMAGES: Record<string, { src: string; alt: string }> = {
  "annual-financial-statements": { src: "https://images.pexels.com/photos/7821681/pexels-photo-7821681.jpeg?auto=compress&cs=tinysrgb&w=900&h=500&dpr=1", alt: "Black South African accountant preparing annual financial statements at his desk" },
  "tax-services":                { src: "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=900&h=500&dpr=1", alt: "Tax practitioner reviewing SARS returns on a laptop with documents" },
  "bookkeeping":                 { src: "/photos/services/bookkeeping.jpg", alt: "Black South African male bookkeeper reviewing accounts and financial records on his desk" },
  "payroll":                     { src: "/photos/services/payroll.jpg", alt: "Black South African male business professional managing payroll on a laptop" },
  "cloud-accounting":            { src: "https://images.pexels.com/photos/6963944/pexels-photo-6963944.jpeg?auto=compress&cs=tinysrgb&w=900&h=500&dpr=1", alt: "Business owner accessing real-time financial data on cloud accounting software" },
  "company-secretarial":         { src: "/photos/services/company-sec.jpg", alt: "Black South African male professional reviewing CIPC company registration documents at his desk" },
  "business-permit-support":     { src: "/photos/services/permit-support.jpg", alt: "Black South African professional preparing financial documentation for a work permit application" },
  "import-export-license":       { src: "https://images.pexels.com/photos/1427107/pexels-photo-1427107.jpeg?auto=compress&cs=tinysrgb&w=900&h=500&dpr=1", alt: "Cargo containers at a South African port representing import and export trade" },
};

const SERVICE_DETAILS: Record<string, { outcome: string; benefits: string[]; faqs: { q: string; a: string }[] }> = {
  "annual-financial-statements": {
    outcome: "After your first engagement, you'll have a fully compliant, signed set of financial statements — ready for your bank, your funders, or your CIPC filing — delivered within 15 business days of receiving complete records.",
    benefits: [
      "IFRS for SMEs compliant statements prepared accurately",
      "Meet statutory filing deadlines with CIPC",
      "Support for bank loan applications and investor due diligence",
      "Signed by a SAIPA Professional Accountant (SA)",
      "Management commentary included",
      "Comparative figures and notes included",
    ],
    faqs: [
      {
        q: "Who is required to prepare Annual Financial Statements?",
        a: "All registered companies (Pty Ltd, CC) in South Africa must prepare AFS annually in accordance with the Companies Act. Sole proprietors with significant turnover also benefit from formal statements.",
      },
      {
        q: "How long does it take to prepare AFS?",
        a: "For a well-organised set of books, typically 10–15 business days. We work with you to resolve outstanding queries as quickly as possible.",
      },
      {
        q: "Do I need an audit or just a compilation?",
        a: "Most SMEs require only a compilation engagement. An audit or review is required if your company meets the Public Interest Score (PIS) threshold of 350+. We'll assess this during your consultation.",
      },
    ],
  },
  "tax-services": {
    outcome: "After your first filing season with us, you'll have zero outstanding SARS correspondence, a record of every submission with confirmation, and a written tax plan to reduce next year's liability.",
    benefits: [
      "ITR12 (individual) and ITR14 (company) returns filed",
      "Provisional tax (IRP6) calculated and submitted on time",
      "Tax planning to minimise your annual liability legally",
      "SARS dispute resolution and objections handled",
      "Capital Gains Tax (CGT) calculations",
      "VAT registration and monthly VAT201 submissions",
    ],
    faqs: [
      {
        q: "What is provisional tax and do I need to submit it?",
        a: "Provisional tax requires you to pay estimated tax in two instalments (August and February) based on your anticipated taxable income. Business owners, freelancers, and those with income beyond salary generally must submit.",
      },
      {
        q: "Can you handle SARS disputes on my behalf?",
        a: "Yes. As a registered Tax Practitioner, we can represent you in SARS disputes, lodge objections, and engage with SARS directly — including attending audit meetings where required.",
      },
      {
        q: "How far back can SARS audit my returns?",
        a: "SARS can audit up to 5 years back under normal circumstances, or up to 15 years in cases of fraud or negligence. Keeping accurate records is therefore essential.",
      },
    ],
  },
  "bookkeeping": {
    outcome: "Within 30 days of onboarding, your books are current, your bank is reconciled, and you're receiving monthly management accounts within 10 days of every month-end. No more guessing where your business stands.",
    benefits: [
      "Monthly bank reconciliations — no surprises at year-end",
      "Creditors and debtors ledgers maintained",
      "Management accounts delivered monthly",
      "VAT-ready records for every submission",
      "Cloud access to your financials at any time",
      "Seamless transition from manual records or a previous bookkeeper",
    ],
    faqs: [
      {
        q: "Which software do you use for bookkeeping?",
        a: "We work on QuickBooks Online, Xero, and Sage Business Cloud — whichever best suits your business size and budget. We handle setup, migration, and training.",
      },
      {
        q: "How often do you update the books?",
        a: "For most clients, we process transactions weekly and deliver monthly management accounts within 10 days of month-end.",
      },
      {
        q: "Can you take over from my existing bookkeeper?",
        a: "Yes. We handle the transition professionally, review and correct any existing records, and ensure a clean starting point going forward.",
      },
    ],
  },
  "payroll": {
    outcome: "From your first payroll run, your team receives accurate payslips on time, your EMP201 is submitted before the 7th of every month, and you carry zero SARS payroll penalties.",
    benefits: [
      "Monthly payslips for all employees",
      "EMP201 (PAYE/UIF/SDL) submitted to SARS monthly",
      "IRP5 / IT3(a) certificates issued at year-end",
      "EMP501 annual reconciliation filed",
      "Leave management and accrual calculations",
      "Compliant with BCEA, LRA, and UIF Act",
    ],
    faqs: [
      {
        q: "What is the EMP201 and when must I submit it?",
        a: "The EMP201 is your monthly employer declaration to SARS reporting PAYE, SDL, and UIF deductions. It's due by the 7th of each month following the payroll month.",
      },
      {
        q: "What happens if I miss a payroll submission?",
        a: "SARS charges administrative penalties and interest on late or missed EMP201 submissions. We track all deadlines and submit on time — every month.",
      },
      {
        q: "Do you handle payroll for casual or part-time workers?",
        a: "Yes. We handle payroll for permanent, part-time, casual, and contract workers — each correctly classified for tax and UIF purposes.",
      },
    ],
  },
  "cloud-accounting": {
    outcome: "Within 5 business days of setup, you have live financial data on any device, bank feeds importing automatically, and a clean chart of accounts your accountant and your team can actually use.",
    benefits: [
      "Real-time financial data accessible from any device",
      "Setup and migration from your existing system",
      "Team training on QuickBooks, Xero, or Sage",
      "Automated bank feeds and reconciliations",
      "Integration with invoice and payroll platforms",
      "Reduced data-entry errors and improved accuracy",
    ],
    faqs: [
      {
        q: "Which cloud platform is best for my business?",
        a: "QuickBooks Online suits most SMEs for its price-to-feature ratio. Xero is excellent for multi-currency and international businesses. Sage is preferred in manufacturing and larger teams. We'll recommend the right fit during your consultation.",
      },
      {
        q: "How difficult is the migration from desktop accounting?",
        a: "We manage the full migration — exporting your historical data, importing it to the new platform, and verifying opening balances. Most migrations are completed within 2–5 business days.",
      },
      {
        q: "Is my financial data secure in the cloud?",
        a: "Yes. QuickBooks, Xero, and Sage all use bank-level encryption (256-bit AES), two-factor authentication, and daily automated backups.",
      },
    ],
  },
  "company-secretarial": {
    outcome: "Your company is registered, in good standing with CIPC, and compliant with annual return obligations — so you never risk deregistration or the cost of reinstatement.",
    benefits: [
      "CIPC company registration (Pty Ltd, NPC, CC)",
      "Annual return filings to CIPC",
      "Director and shareholder amendments",
      "Registered office address updates",
      "Share certificate issuance",
      "MOI amendments and special resolutions",
    ],
    faqs: [
      {
        q: "How long does it take to register a company with CIPC?",
        a: "CIPC turnaround times vary from 1–10 business days depending on their processing queue. We submit professionally and follow up to minimise delays.",
      },
      {
        q: "What is an annual return and why is it important?",
        a: "Every registered company must file an annual return with CIPC within 30 business days of its anniversary date. Failure to file results in deregistration — which can have serious legal and financial consequences.",
      },
      {
        q: "Can you help us change company directors?",
        a: "Yes. We prepare and file all required CIPC forms to add or remove directors, ensuring your company records remain accurate and legally compliant.",
      },
    ],
  },
  "business-permit-support": {
    outcome: "We prepare a complete, compliant financial documentation package for your permit or visa application — so your submission arrives correct the first time and you avoid costly re-submissions or delays.",
    benefits: [
      "Work permit applications with full financial documentation",
      "Business and corporate visa financial viability reports",
      "Temporary and permanent residence permit support",
      "Visa renewal and extension financial records",
      "CIPC company registration for foreign nationals",
      "SARS tax registration for new businesses",
      "Bank account opening documentation (FICA-compliant)",
    ],
    faqs: [
      {
        q: "What financial documents are needed for a work permit application?",
        a: "SARS compliance certificates, proof of business viability, audited or compiled financial statements, and a letter confirming the employer's financial position are typically required. We prepare and certify all of these.",
      },
      {
        q: "Can you help a foreign national register a company in South Africa?",
        a: "Yes. We handle the full CIPC registration process for foreign nationals, ensuring all requirements for legal business operation in South Africa are met — from name reservation to share certificates.",
      },
      {
        q: "Do foreign-owned businesses have different SARS obligations?",
        a: "Every business operating in South Africa must register with SARS for income tax, and for VAT if turnover exceeds R1 million. We guide foreign business owners through registration and ongoing compliance from day one.",
      },
    ],
  },
  "import-export-license": {
    outcome: "Your SARS customs registration is in place within 15 business days of a complete application, so your trading activities can commence without regulatory delays.",
    benefits: [
      "Full SARS customs registration process managed",
      "Import license and/or export license secured",
      "Liaison with SARS Customs directly on your behalf",
      "Advice on HS tariff codes and duty implications",
      "Documentation checklist provided",
      "Fast-tracked where possible",
    ],
    faqs: [
      {
        q: "Do I need a separate import and export license?",
        a: "Yes. SARS issues separate licenses for importers and exporters. If you do both, you'll need both. We handle the application for one or both simultaneously.",
      },
      {
        q: "How long does it take to get an import/export license?",
        a: "SARS typically processes customs registration within 5–15 business days of receiving a complete application. We ensure your application is correct from the start to avoid delays.",
      },
      {
        q: "What documents do I need to apply?",
        a: "You'll need your CIPC registration documents, SARS tax clearance, company bank details, and proof of address. We provide a full checklist when you engage us.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: { absolute: `${service.title} | Sikatrix Business Accountants` },
    description: service.description,
    alternates: { canonical: `https://www.sikatrix.com/services/${slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = ICON_MAP[service.icon] ?? FileText;
  const details = SERVICE_DETAILS[slug] ?? {
    benefits: [],
    faqs: [],
  };

  const otherServices = SERVICES.filter((s) => s.slug !== slug).slice(0, 4);
  const relatedArticleSlugs = SERVICE_ARTICLE_MAP[slug] ?? [];
  const allPosts = getAllPosts();
  const relatedArticles = relatedArticleSlugs.map((a) => allPosts.find((p) => p.slug === a)).filter(Boolean);

  const faqSchema = details.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: details.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <PageHero
        label="Service"
        title={service.title}
        subtitle={service.description}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.shortTitle },
        ]}
        cta={{ label: "Book a Consultation", href: "/contact" }}
        bgImage={SERVICE_HERO_IMAGES[slug] ?? "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&auto=format&fit=crop&q=60"}
      />

      {/* Sidebar + Main content */}
      <section id="content" className="py-14 bg-neutral-50 border-t-[3px] border-neutral-200">
        <div className="container-page">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">

            {/* Left sidebar — all services nav */}
            <aside className="hidden lg:block sticky top-24">
              <div className="bg-brand-dark rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="text-2xs font-bold uppercase tracking-widest text-accent">Our Services</p>
                </div>
                <ul>
                  {SERVICES.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}#content`}
                        scroll={false}
                        className={`flex items-center justify-between px-5 py-3.5 text-sm border-b border-white/5 transition-colors ${
                          s.slug === slug
                            ? "text-accent font-semibold bg-white/5"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {s.shortTitle}
                        <ArrowRight size={13} className="flex-shrink-0 opacity-60" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="p-4">
                  <Link
                    href="/contact"
                    className="block text-center text-xs font-semibold bg-accent hover:bg-accent-light text-white py-2.5 rounded-lg transition-colors"
                  >
                    Book Free Consultation
                  </Link>
                </div>
              </div>
            </aside>

            {/* Right content */}
            <div className="space-y-10">

              {/* Benefits */}
              {details.benefits.length > 0 && (
                <div>
                  <span className="section-label">What's Included</span>
                  <h2 className="section-title mt-2 mb-4">
                    What you get with our {service.shortTitle} service
                  </h2>
                  {details.outcome && (
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6 p-4 bg-brand-50 rounded-lg border-l-4 border-brand">
                      {details.outcome}
                    </p>
                  )}

                  {/* Who this is for */}
                  {SERVICE_WHO_FOR[slug] && (
                    <div className="mb-6 p-5 bg-white rounded-xl border border-neutral-200">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-3">Who this service is for</h3>
                      <ul className="space-y-2 mb-4">
                        {SERVICE_WHO_FOR[slug].for.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm text-neutral-700">
                            <CheckCircle size={14} className="text-brand flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {SERVICE_WHO_FOR[slug].notFor.length > 0 && (
                        <>
                          <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Probably not for you if…</p>
                          <ul className="space-y-1.5">
                            {SERVICE_WHO_FOR[slug].notFor.map((item) => (
                              <li key={item} className="flex gap-2 text-sm text-neutral-400">
                                <span className="flex-shrink-0">·</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}

                  {/* Content image */}
                  {SERVICE_CONTENT_IMAGES[slug] && (
                    <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden mb-6">
                      <Image
                        src={SERVICE_CONTENT_IMAGES[slug].src}
                        alt={SERVICE_CONTENT_IMAGES[slug].alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 700px"
                        priority
                      />
                    </div>
                  )}

                  <ul className="space-y-3 mb-8">
                    {details.benefits.map((b) => (
                      <li key={b} className="flex gap-3 text-sm text-neutral-700">
                        <CheckCircle size={16} className="text-brand flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTA card */}
                  <div className="card p-6 bg-brand-50 border-brand/20">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                          Get Started with {service.shortTitle}
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">
                          Book a free 30-minute consultation and we'll explain exactly how this service applies to your business.
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <Link href="/contact" className="btn-primary text-sm">
                            Book Free Consultation <ArrowRight size={14} />
                          </Link>
                          <a href="tel:+27118672550" className="text-sm font-medium text-brand hover:underline">
                            (011) 867-2550
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FAQs */}
              {details.faqs.length > 0 && (
                <div className="pt-8 border-t border-neutral-200">
                  <span className="section-label">FAQs</span>
                  <h2 className="section-title mt-2 mb-6">Common questions about {service.shortTitle}</h2>
                  <div className="space-y-4">
                    {details.faqs.map(({ q, a }) => (
                      <div key={q} className="card p-5">
                        <h3 className="text-sm font-semibold text-neutral-900 mb-2">{q}</h3>
                        <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Other services */}
      <section className="py-14 bg-neutral-50">
        <div className="container-page">
          <h2 className="section-title mb-7">Other services you may need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {otherServices.map((s) => {
              const OtherIcon = ICON_MAP[s.icon] ?? FileText;
              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="card p-5 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center mb-3 group-hover:bg-brand transition-colors">
                    <OtherIcon size={16} className="text-brand group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors">
                    {s.shortTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{s.summary}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Related reading — backlink to matching resources articles */}
      {relatedArticles.length > 0 && (
        <section className="py-10 bg-neutral-50 border-t border-neutral-200">
          <div className="container-page">
            <span className="section-label">Related Reading</span>
            <h2 className="text-sm font-semibold text-neutral-900 mt-2 mb-5">
              Guides you may find useful
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              {relatedArticles.map((article) => article && (
                <Link
                  key={article.slug}
                  href={`/resources/${article.slug}`}
                  className="card p-5 group"
                >
                  <span className="text-2xs font-semibold uppercase tracking-widest text-accent block mb-1">
                    {article.category}
                  </span>
                  <p className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug mb-2">
                    {article.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-2xs text-brand font-medium">
                    Read guide <ArrowRight size={10} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
