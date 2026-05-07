import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, ArrowRight,
  FileText, Receipt, BookOpen, Users, Cloud,
  Briefcase, ShieldCheck, Globe
} from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { SERVICES, LOCATIONS } from "@/lib/site";

const ICON_MAP: Record<string, React.ElementType> = {
  FileText, Receipt, BookOpen, Users, Cloud, Briefcase, ShieldCheck, Globe,
};

const SERVICE_DETAILS: Record<string, { benefits: string[]; faqs: { q: string; a: string }[] }> = {
  "annual-financial-statements": {
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
    title: `${service.title} | Sikatrix Business Accountants`,
    description: service.description,
    alternates: { canonical: `https://sikatrix.com/services/${slug}` },
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

  return (
    <>
      <PageHero
        label="Service"
        title={service.title}
        subtitle={service.description}
        crumbs={[
          { label: "Services", href: "/services" },
          { label: service.shortTitle },
        ]}
        cta={{ label: "Book a Consultation", href: "/contact" }}
        bgImage="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&auto=format&fit=crop&q=60"
      />

      {/* Benefits */}
      {details.benefits.length > 0 && (
        <section className="py-14 md:py-18 bg-white">
          <div className="container-page">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="section-label">What's Included</span>
                <h2 className="section-title mt-2 mb-6">
                  What you get with our {service.shortTitle} service
                </h2>
                <ul className="space-y-3">
                  {details.benefits.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-neutral-700">
                      <CheckCircle size={16} className="text-brand flex-shrink-0 mt-0.5" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-7 bg-brand-50 border-brand/20">
                <div className="w-12 h-12 rounded-xl bg-brand flex items-center justify-center mb-4">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-3">
                  Get Started with {service.shortTitle}
                </h3>
                <p className="text-sm text-neutral-600 mb-5">
                  Book a free 30-minute consultation and we'll explain exactly how this service
                  applies to your business — with no obligation.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center text-sm">
                  Book Free Consultation <ArrowRight size={14} />
                </Link>
                <div className="mt-4 pt-4 border-t border-brand/20 space-y-1">
                  <p className="text-xs text-neutral-500">Or reach us directly:</p>
                  <a
                    href="tel:+27118672550"
                    className="block text-sm font-medium text-brand hover:underline"
                  >
                    (011) 867-2550
                  </a>
                  <a
                    href="mailto:info@sikatrix.com"
                    className="block text-sm font-medium text-brand hover:underline"
                  >
                    info@sikatrix.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      {details.faqs.length > 0 && (
        <section className="py-14 bg-neutral-50 border-y border-neutral-200">
          <div className="container-page max-w-3xl">
            <span className="section-label">FAQs</span>
            <h2 className="section-title mt-2 mb-8">Common questions about {service.shortTitle}</h2>
            <div className="space-y-6">
              {details.faqs.map(({ q, a }) => (
                <div key={q} className="card p-6">
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{q}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other services */}
      <section className="py-14 bg-white">
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

      <section className="py-14 bg-neutral-50">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
