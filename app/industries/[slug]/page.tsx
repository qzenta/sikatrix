import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle, ArrowRight,
  TrendingUp, Rocket, Stethoscope, Scale, Home, Heart, GraduationCap, Compass,
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { INDUSTRIES, SERVICES } from "@/lib/site";

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Rocket, Stethoscope, Scale, Home, Heart, GraduationCap, Compass,
};

const SERVICE_ICON_MAP: Record<string, React.ElementType> = {
  FileText: TrendingUp, Receipt: TrendingUp, BookOpen: TrendingUp,
  Users: TrendingUp, Cloud: TrendingUp, Briefcase: TrendingUp,
  ShieldCheck: TrendingUp, Globe: TrendingUp,
};

type IndustryDetail = {
  metaTitle: string;
  metaDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  bgImage: string;
  contentImage: string;
  contentImageAlt: string;
  outcome: string;
  highlight: string;
  services: string[];
  faqs: { q: string; a: string }[];
  relatedServiceSlugs: string[];
};

const INDUSTRY_DATA: Record<string, IndustryDetail> = {
  "smes-growing-businesses": {
    metaTitle: "Accounting for SMEs & Growing Businesses | Sikatrix Business Accountants",
    metaDesc: "Fixed-fee bookkeeping, payroll, tax, and annual financial statements for South African SMEs. Scalable accounting support as your business grows.",
    heroTitle: "Accounting That Scales With Your Business",
    heroSubtitle: "Whether you're a sole proprietor or running a 50-person operation, we handle your compliance, books, and tax so you can focus on growth.",
    bgImage: "/photos/industries/smes.jpg",
    contentImage: "/photos/industries/smes.jpg",
    contentImageAlt: "Black South African male business owner reviewing financial reports with his accountant",
    outcome: "Within 30 days of onboarding, you'll have clean, current books, a monthly management account schedule, and full visibility into your tax position. No surprises at year-end.",
    highlight: "We grow with you — from a sole proprietor startup to a 50-person team.",
    services: [
      "Bookkeeping and monthly management accounts",
      "VAT201 submissions (monthly or bi-monthly)",
      "Payroll and EMP201 compliance",
      "Annual Financial Statements (AFS)",
      "Corporate Income Tax (ITR14)",
      "Provisional tax (IRP6) calculations",
    ],
    faqs: [
      {
        q: "At what point should a small business hire an accountant?",
        a: "The cost of a qualified accountant is almost always less than SARS penalties, missed deductions, and the time you spend trying to manage compliance yourself. Most SMEs benefit from outsourced accounting from the moment they register.",
      },
      {
        q: "Do I need to register for VAT as an SME?",
        a: "VAT registration is compulsory once your taxable turnover exceeds R1 million in any 12-month period. Voluntary registration is possible from R50,000. We assess your position and advise on the timing and implications.",
      },
      {
        q: "What are management accounts and why do I need them?",
        a: "Management accounts are a simplified set of monthly financial reports (income statement and balance sheet) prepared from your books. They let you see how profitable your business is, track cash flow, and make informed decisions. Banks and funders also request them.",
      },
    ],
    relatedServiceSlugs: ["bookkeeping", "tax-services", "payroll", "annual-financial-statements"],
  },

  "startups-new-companies": {
    metaTitle: "Accounting for Startups & New Companies | Sikatrix Business Accountants",
    metaDesc: "Company registration, SARS eFiling setup, cloud accounting, and first-year compliance for South African startups. Get your books right from day one.",
    heroTitle: "Start Right. Stay Compliant from Day One.",
    heroSubtitle: "We handle the admin so you can focus on building your business. Company registration, SARS setup, and clean books from the moment you open.",
    bgImage: "/photos/industries/startups.jpg",
    contentImage: "/photos/industries/startups.jpg",
    contentImageAlt: "Young Black South African male entrepreneur working on his laptop to launch his new business",
    outcome: "By the end of your first month with us, your company is registered, SARS profiles are active, your cloud accounting is set up, and you have a compliance calendar so you never miss a deadline.",
    highlight: "Get your compliance right from day one. We've helped 40+ startups launch cleanly.",
    services: [
      "CIPC company registration (Pty Ltd)",
      "SARS income tax and PAYE registration",
      "VAT registration (when applicable)",
      "Cloud accounting setup (QuickBooks or Xero)",
      "First-year Annual Financial Statements",
      "Provisional tax planning",
    ],
    faqs: [
      {
        q: "Do I need to register a company or can I trade as a sole proprietor?",
        a: "Both are legal. A Pty Ltd separates your personal and business liability and often looks more credible to clients and banks. A sole proprietorship is simpler but provides no legal separation of assets. We advise based on your specific situation.",
      },
      {
        q: "What must I register for with SARS after incorporating?",
        a: "At a minimum, Corporate Income Tax (CIT). If you take on employees, you must also register as an employer for PAYE. VAT registration is required once taxable turnover exceeds R1 million. We handle all three simultaneously.",
      },
      {
        q: "When does my first tax return become due?",
        a: "Your ITR14 (corporate tax return) is due 12 months after your financial year-end. For a company with a February year-end incorporated in 2025, the first return is due February 2026. We set up your tax calendar from day one so nothing catches you off guard.",
      },
    ],
    relatedServiceSlugs: ["company-secretarial", "cloud-accounting", "bookkeeping", "tax-services"],
  },

  "medical-healthcare": {
    metaTitle: "Accounting for Medical Practices & Healthcare Professionals | Sikatrix Business Accountants",
    metaDesc: "Practice accounting, SARS compliance, payroll, and annual financial statements for South African doctors, dentists, physiotherapists, and private healthcare businesses.",
    heroTitle: "Financial Management for Healthcare Professionals",
    heroSubtitle: "We understand the unique billing environment, professional body requirements, and compliance obligations of private healthcare in South Africa.",
    bgImage: "/photos/industries/medical.jpg",
    contentImage: "/photos/industries/medical.jpg",
    contentImageAlt: "Black South African medical professional discussing patient care and practice finances",
    outcome: "You'll have monthly reconciled revenue accounts, compliant payroll for clinical and administrative staff, and zero outstanding SARS obligations. Your practice runs. We handle the numbers.",
    highlight: "We understand the unique billing and compliance environment of private healthcare.",
    services: [
      "Practice revenue reconciliation (medical aid, cash, GAP)",
      "Clinical and administrative staff payroll",
      "Monthly VAT submissions where applicable",
      "Annual Financial Statements",
      "Personal and corporate income tax returns",
      "HPCSA practice number compliance support",
    ],
    faqs: [
      {
        q: "Is medical practice income subject to VAT?",
        a: "Most medical services rendered by registered medical practitioners are exempt from VAT in South Africa under Section 12(b) of the VAT Act. However, certain ancillary services (medical supplies, cosmetic procedures, and non-core services) may be taxable. We assess your practice's full VAT exposure.",
      },
      {
        q: "Can a doctor operate through a company (Pty Ltd)?",
        a: "Yes. Many healthcare professionals practice through a personal service company or trust for tax and succession planning purposes. There are important SARS rules around personal service companies — we advise correctly and within the law.",
      },
      {
        q: "How do we account for unpaid or rejected medical aid claims?",
        a: "Unpaid or rejected medical aid claims are a significant receivables challenge in healthcare. We set up correct income recognition policies and track outstanding claims against monthly submission reports so nothing falls through the cracks.",
      },
    ],
    relatedServiceSlugs: ["bookkeeping", "payroll", "tax-services", "annual-financial-statements"],
  },

  "legal-professionals": {
    metaTitle: "Accounting for Attorneys & Legal Professionals | Sikatrix Business Accountants",
    metaDesc: "Trust account reconciliations, LSSA compliance support, practice bookkeeping, and tax returns for South African attorneys and law firms.",
    heroTitle: "Accounting Precision for Legal Practices",
    heroSubtitle: "Trust accounts and LSSA compliance records have to be right. We handle both so your practice stays in good standing.",
    bgImage: "/photos/industries/legal.jpg",
    contentImage: "/photos/industries/legal.jpg",
    contentImageAlt: "Black South African male attorney reviewing legal documents and compliance records at his desk",
    outcome: "Your trust account reconciles to the cent every month. LSSA compliance records are in order. And your personal and practice tax returns are filed on time, every time.",
    highlight: "Trust account compliance is your professional reputation. We reconcile it exactly.",
    services: [
      "Monthly trust account reconciliations",
      "LSSA audit-readiness record keeping",
      "Practice bookkeeping (business account)",
      "Payroll for attorneys and support staff",
      "Personal and corporate income tax returns",
      "Provisional tax (IRP6) submissions",
    ],
    faqs: [
      {
        q: "What are the LSSA trust account requirements?",
        a: "Attorneys must reconcile their trust accounts monthly, maintain a proper bookkeeping record, and ensure trust creditors are always covered. The Law Society (LSSA) requires an annual compliance audit. We prepare records that satisfy these requirements.",
      },
      {
        q: "Must attorneys register for VAT?",
        a: "Yes, if annual taxable turnover from legal fees exceeds R1 million. Legal services are standard-rated at 15%. Trust account receipts held on behalf of clients are not taxable turnover. We set up your VAT registration and returns correctly from the start.",
      },
      {
        q: "Can you prepare the records needed for our annual LSSA compliance audit?",
        a: "Yes. We maintain your practice bookkeeping records in a format specifically structured to support LSSA compliance audits. We work with your auditor or appointed assurance provider directly where needed.",
      },
    ],
    relatedServiceSlugs: ["bookkeeping", "tax-services", "annual-financial-statements", "payroll"],
  },

  "property-investors": {
    metaTitle: "Accounting for Property Investors & Landlords | Sikatrix Business Accountants",
    metaDesc: "Rental income tax, provisional tax, Capital Gains Tax, and property entity structuring for South African property investors and landlords.",
    heroTitle: "Maximise Your Property Returns. Minimise Your Tax.",
    heroSubtitle: "Property tax in South Africa has real complexity. We find every deduction you qualify for and structure your portfolio properly.",
    bgImage: "/photos/industries/property.jpg",
    contentImage: "/photos/industries/property.jpg",
    contentImageAlt: "Black South African male property investor consulting with an accountant about rental income and tax planning",
    outcome: "After working with us, your rental income is correctly declared, every allowable deduction is claimed, and your provisional tax instalments are based on accurate projections. No overpayments, no penalties.",
    highlight: "Property tax has real complexity. We find every deduction you qualify for and file it properly.",
    services: [
      "Rental income tax declarations (ITR12 and ITR14)",
      "Provisional tax calculations (IRP6)",
      "Capital Gains Tax (CGT) on property disposal",
      "Property holding company setup advice",
      "Section 13sex depreciation allowance calculations",
      "VAT implications on commercial property",
    ],
    faqs: [
      {
        q: "What expenses can I deduct against rental income?",
        a: "Deductible expenses include bond interest, rates and taxes, levies, insurance, property management fees, repairs (not improvements), and depreciation on qualifying assets. We ensure every allowable deduction is claimed correctly.",
      },
      {
        q: "When does Capital Gains Tax apply to property?",
        a: "CGT applies when you sell a property for more than its base cost. For individuals, the primary residence exclusion of R2 million applies. Companies and trusts are subject to different inclusion rates. We calculate your CGT accurately before disposal so there are no surprises.",
      },
      {
        q: "Should I hold my rental property in a company or personally?",
        a: "This depends on your marginal tax rate, your long-term plans for the property, and your estate planning goals. Companies pay a flat 27% on profits; individuals pay at marginal rates up to 45%. We model the tax outcome of each structure before you decide.",
      },
    ],
    relatedServiceSlugs: ["tax-services", "annual-financial-statements", "bookkeeping", "company-secretarial"],
  },

  "ngos-nonprofits": {
    metaTitle: "Accounting for NGOs & Nonprofits | Sikatrix Business Accountants",
    metaDesc: "SARS PBO applications, donor-ready annual financial statements, CIPC NPC registration, and grant reporting for South African nonprofits and NGOs.",
    heroTitle: "Accounting That Supports Your Mission",
    heroSubtitle: "We help NGOs achieve PBO status, prepare donor-ready financial statements, and maintain the compliance records that funders and SARS require.",
    bgImage: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1600&auto=format&fit=crop&q=60",
    contentImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop&q=60",
    contentImageAlt: "Diverse South African NGO team and community volunteers working together on a project",
    outcome: "With PBO status in place and annual accounts prepared to donor standards, your organisation is positioned to attract and retain funding. We ensure the financials never stand in the way of your mission.",
    highlight: "We've registered multiple NPOs for SARS PBO tax exemption status. We know the process.",
    services: [
      "SARS Section 18A PBO application",
      "CIPC NPC and NPO registration",
      "Donor-ready Annual Financial Statements",
      "Grant income and expenditure reporting",
      "Annual returns to CIPC and DSD",
      "Payroll for staff and project workers",
    ],
    faqs: [
      {
        q: "What is PBO status and why does my NGO need it?",
        a: "Public Benefit Organisation (PBO) status from SARS exempts your organisation from income tax and allows donors to claim Section 18A deductions on their donations. Most major funders and corporates require PBO status before awarding grants.",
      },
      {
        q: "How long does a SARS PBO application take?",
        a: "SARS typically takes 3 to 6 months to process a PBO application. We prepare a complete, well-motivated submission to avoid queries and delays. We have successfully secured PBO status for multiple organisations.",
      },
      {
        q: "What financial statements do donors typically require?",
        a: "Most donors require IFRS for SMEs compliant financial statements, or at minimum a compilation report signed by a qualified accountant. Grant-specific income and expenditure reports showing restricted versus unrestricted funds are also commonly required.",
      },
    ],
    relatedServiceSlugs: ["annual-financial-statements", "company-secretarial", "bookkeeping", "payroll"],
  },

  "private-schools": {
    metaTitle: "Accounting for Private Schools & Educational Institutions | Sikatrix Business Accountants",
    metaDesc: "School fee income accounting, teaching staff payroll, SARS compliance, and annual financial statements for South African independent schools and educational institutions.",
    heroTitle: "Financial Management for Private Educational Institutions",
    heroSubtitle: "Private schools have specific accounting requirements: fee income cycles, bursaries, tuck shop operations, and layered payroll. We handle all of it.",
    bgImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&auto=format&fit=crop&q=60",
    contentImage: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=900&auto=format&fit=crop&q=60",
    contentImageAlt: "Diverse South African private school students learning in a well-equipped classroom",
    outcome: "Your school fee income is correctly accounted for, staff payroll is accurate and SARS-compliant, and your AFS meets the standards required by your governing body and the Department of Education.",
    highlight: "School fee cycles, term payroll, and SARS compliance — we handle the full picture.",
    services: [
      "School fee income accounting and recognition",
      "Bursary and scholarship expense recording",
      "Teaching and administrative staff payroll",
      "Monthly PAYE, UIF, and SDL submissions",
      "Annual Financial Statements",
      "SARS compliance and income tax returns",
    ],
    faqs: [
      {
        q: "Are private schools exempt from income tax?",
        a: "Independent schools registered as Non-Profit Companies (NPC) and approved as PBOs may qualify for income tax exemption. For-profit schools are subject to normal corporate tax. We advise on the most appropriate legal structure and tax status for your institution.",
      },
      {
        q: "How should school fees paid in advance be accounted for?",
        a: "School fees received in advance are initially a liability (deferred income) and recognised as income over the academic term or period to which they relate. Correct recognition is important for accurate financial statements and fair representation of your financial position.",
      },
      {
        q: "What payroll obligations does a school have?",
        a: "Like all employers, schools must register for PAYE, UIF, and SDL. Learnerships and internship programmes may attract special SDL treatment and potential rebates. Payslips must be issued monthly and IRP5 certificates at year-end.",
      },
    ],
    relatedServiceSlugs: ["payroll", "annual-financial-statements", "bookkeeping", "tax-services"],
  },

  "architecture-engineering": {
    metaTitle: "Accounting for Architects & Engineers | Sikatrix Business Accountants",
    metaDesc: "Project-based bookkeeping, WIP accounting, payroll, and tax for South African architects, engineers, quantity surveyors, and construction professionals.",
    heroTitle: "Accounting for Project-Based Professionals",
    heroSubtitle: "Architecture and engineering firms face unique financial challenges: WIP, project cost tracking, and professional practice compliance. We handle all of it.",
    bgImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1600&auto=format&fit=crop&q=60",
    contentImage: "https://images.unsplash.com/photo-1664575602276-acd073f104c1?w=900&auto=format&fit=crop&q=60",
    contentImageAlt: "Diverse South African architects and engineers reviewing project plans and financial schedules",
    outcome: "Your project costs are tracked correctly, WIP is accounted for on every active contract, and you receive a clear monthly picture of which projects are profitable and which need attention.",
    highlight: "We track project profitability and keep your practice financially healthy.",
    services: [
      "Project-based bookkeeping and cost allocation",
      "Work-in-progress (WIP) accounting",
      "Payroll for professional and site staff",
      "PAYE, UIF, and SDL submissions",
      "Provisional and income tax returns",
      "VAT201 submissions",
    ],
    faqs: [
      {
        q: "What is WIP accounting and why does it matter for my practice?",
        a: "Work-in-progress represents the value of services rendered on incomplete projects. Correct WIP accounting ensures your income statement reflects your actual earned income, not just invoiced amounts. This is critical for accurate profitability reporting and bankable financial statements.",
      },
      {
        q: "Must I register for VAT as an architect or engineer?",
        a: "Yes, if your taxable professional fee income exceeds R1 million in any 12-month period, VAT registration is compulsory. Voluntary registration from R50,000 is also possible. We assess your position and handle the full VAT101 registration process.",
      },
      {
        q: "How do we allocate costs correctly across multiple projects?",
        a: "We set up your accounting system with project codes or cost centres. All direct costs such as subcontractors, materials, and site expenses are allocated at the point of entry. You receive a project profitability report every month so you always know where you stand.",
      },
    ],
    relatedServiceSlugs: ["bookkeeping", "payroll", "tax-services", "annual-financial-statements"],
  },
};

export async function generateStaticParams() {
  return INDUSTRIES.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) return {};
  const data = INDUSTRY_DATA[slug];
  return {
    title: { absolute: data.metaTitle },
    description: data.metaDesc,
    alternates: { canonical: `https://www.sikatrix.com/industries/${slug}` },
  };
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const industry = INDUSTRIES.find((i) => i.slug === slug);
  if (!industry) notFound();

  const data = INDUSTRY_DATA[slug];
  if (!data) notFound();

  const Icon = ICON_MAP[industry.icon] ?? TrendingUp;
  const relatedServices = data.relatedServiceSlugs
    .map((s) => SERVICES.find((svc) => svc.slug === s))
    .filter(Boolean);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHero
        label="Industry"
        title={data.heroTitle}
        subtitle={data.heroSubtitle}
        crumbs={[
          { label: "Industries", href: "/industries" },
          { label: industry.shortTitle },
        ]}
        cta={{ label: "Book a Free Consultation", href: "/contact" }}
        bgImage={data.bgImage}
      />

      {/* Sidebar + main content */}
      <section id="content" className="py-14 bg-neutral-50 border-t-[3px] border-neutral-200">
        <div className="container-page">
          <div className="grid lg:grid-cols-[260px_1fr] gap-10 items-start">

            {/* Left sidebar */}
            <aside className="hidden lg:block sticky top-24">
              <div className="bg-brand-dark rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-white/10">
                  <p className="text-2xs font-bold uppercase tracking-widest text-accent">Industries We Serve</p>
                </div>
                <ul>
                  {INDUSTRIES.map((ind) => (
                    <li key={ind.slug}>
                      <Link
                        href={`/industries/${ind.slug}#content`}
                        scroll={false}
                        className={`flex items-center justify-between px-5 py-3.5 text-sm border-b border-white/5 transition-colors ${
                          ind.slug === slug
                            ? "text-accent font-semibold bg-white/5"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {ind.shortTitle}
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

              {/* Outcome + services */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-brand" />
                  </div>
                  <div>
                    <span className="section-label block mb-0.5">What We Do</span>
                    <h2 className="text-lg font-semibold text-neutral-900 leading-snug">
                      How we support {industry.name}
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-5 p-4 bg-brand-50 rounded-lg border-l-4 border-brand">
                  {data.outcome}
                </p>

                {/* Content image */}
                <div className="relative h-52 sm:h-64 rounded-xl overflow-hidden mb-5">
                  <Image
                    src={data.contentImage}
                    alt={data.contentImageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 700px"
                  />
                </div>

                <p className="text-sm italic text-brand font-medium mb-5">"{data.highlight}"</p>

                <ul className="space-y-3 mb-8">
                  {data.services.map((s) => (
                    <li key={s} className="flex gap-3 text-sm text-neutral-700">
                      <CheckCircle size={16} className="text-brand flex-shrink-0 mt-0.5" />
                      {s}
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
                        Get Specialist Accounting for {industry.shortTitle}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-4">
                        Book a free 15-minute call and we'll show you exactly how we support your sector.
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

              {/* FAQs */}
              <div className="pt-8 border-t border-neutral-200">
                <span className="section-label">FAQs</span>
                <h2 className="section-title mt-2 mb-6">
                  Common questions from {industry.name}
                </h2>
                <div className="space-y-4">
                  {data.faqs.map(({ q, a }) => (
                    <div key={q} className="card p-5">
                      <h3 className="text-sm font-semibold text-neutral-900 mb-2">{q}</h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="py-14 bg-neutral-50">
          <div className="container-page">
            <span className="section-label">Services</span>
            <h2 className="section-title mt-2 mb-7">Services we provide for {industry.shortTitle}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedServices.map((svc) => svc && (
                <Link
                  key={svc.slug}
                  href={`/services/${svc.slug}`}
                  className="card p-5 group"
                >
                  <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-brand transition-colors mb-1">
                    {svc.shortTitle}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">{svc.summary}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-brand font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight size={11} />
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
