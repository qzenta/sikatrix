import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import CTABlock from "@/components/shared/CTABlock";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Frequently Asked Questions | Sikatrix Business Accountants" },
  description:
    "Answers to the most common questions about our accounting, tax, and bookkeeping services — pricing, process, cloud software, SARS compliance, and more.",
  alternates: { canonical: "https://www.sikatrix.com/faq" },
};

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How do I get started with Sikatrix?",
        a: "Simply book a free 30-minute consultation by phone, video call, or at our Alberton office. We will assess your business needs, identify any compliance gaps, and recommend the right service package. There is no obligation and no fee for the initial consultation.",
      },
      {
        q: "Do I need to come to your office in person?",
        a: "No. While we're based in Brackenhurst, Alberton, most of our work is done remotely via cloud accounting platforms, email, and video calls. We serve clients across Gauteng and beyond without requiring in-person meetings. That said, if you're local and prefer face-to-face, you're always welcome.",
      },
      {
        q: "What size businesses do you work with?",
        a: "We work with sole proprietors, small and medium businesses (SMEs), professional practices, NGOs, and property investors. We do not have a minimum turnover requirement. If you need professional accounting and tax services, we can help.",
      },
      {
        q: "How long does it take to onboard a new client?",
        a: "For most clients, we can have your accounting system set up and your first month of bookkeeping underway within 5–7 business days of signing an engagement letter. If you're switching from another accountant, we manage the transition process for you.",
      },
    ],
  },
  {
    category: "Services & Pricing",
    items: [
      {
        q: "What services do you offer?",
        a: "We offer a full suite of accounting and compliance services: annual financial statements, tax services (ITR12, ITR14, provisional tax), bookkeeping, payroll (PAYE, UIF, SDL), cloud accounting setup and support, company secretarial (CIPC), business permit support, and import/export license applications.",
      },
      {
        q: "How much do your services cost?",
        a: "Our pricing depends on the volume of transactions, the complexity of your business, and the services required. We offer fixed monthly retainers for ongoing services (bookkeeping + payroll + tax) and project-based pricing for once-off work like annual financial statements or tax returns. Contact us for a tailored quote.",
      },
      {
        q: "Do you offer fixed-fee packages or only hourly billing?",
        a: "We prefer fixed monthly retainers for ongoing work, which is more predictable for you and aligns our incentives with yours. For once-off projects we provide a fixed quote upfront. We do not use hourly billing for most services.",
      },
      {
        q: "Can you help me if I'm behind on my tax returns or bookkeeping?",
        a: "Yes. Catching up on backlogged submissions is something we handle regularly. We'll assess how far behind you are, prepare the outstanding returns, and where necessary engage with SARS on your behalf to minimise penalties. It's always better to address outstanding submissions proactively.",
      },
    ],
  },
  {
    category: "SARS & Compliance",
    items: [
      {
        q: "Are you registered with SARS as a Tax Practitioner?",
        a: "Yes. Sikatrix Business Accountants is a SARS-registered Tax Practitioner and a SAIPA-registered Professional Accountant (SA). We are authorised to represent clients before SARS, submit returns on your behalf, and correspond with SARS on compliance matters.",
      },
      {
        q: "Can you help if SARS has sent me a query or audit notice?",
        a: "Yes. We handle SARS queries, verifications, and audits for our clients. If you have received a letter from SARS requesting information or disputing an assessment, contact us as soon as possible. The earlier we get involved, the more options you have.",
      },
      {
        q: "When do I need to register for VAT?",
        a: "You must register for VAT once your taxable turnover has exceeded R2.3 million in any 12-month period, or is expected to do so. This threshold was increased from R1 million effective 1 April 2026. Voluntary registration is possible from R50,000. We handle VAT registrations and submissions for our clients and can advise on whether voluntary registration makes sense for your business.",
      },
      {
        q: "Do I need to register for provisional tax?",
        a: "If you earn income outside of PAYE (from a business, rental property, freelance work, or investments over R30,000 per year), you likely need to register for provisional tax. We assess your situation and manage your IRP6 submissions twice a year to keep you compliant and penalty-free.",
      },
      {
        q: "What records do I need to keep for SARS?",
        a: "SARS requires you to retain all financial records for a minimum of five years. This includes bank statements, invoices (issued and received), payroll records, VAT records, and supporting documents for all tax deductions claimed. Cloud accounting software makes this significantly easier by digitising and storing records against transactions.",
      },
    ],
  },
  {
    category: "Cloud Accounting",
    items: [
      {
        q: "What accounting software do you use?",
        a: "We work primarily with QuickBooks Online, Xero, and Sage Business Cloud, the three leading cloud platforms in South Africa. We also use Draftworx for financial statements, SimplePay for payroll, and Syft Analytics for management reporting. We will recommend the right platform based on your business size and complexity.",
      },
      {
        q: "I'm currently on paper or spreadsheets — can you migrate me to cloud?",
        a: "Yes, and we do this regularly. We set up your cloud accounting system, import your opening balances, configure your chart of accounts and bank feeds, and train you or your team on day-to-day use. Most migrations take 1–2 weeks depending on the volume of historical data.",
      },
      {
        q: "Will I have access to my own financial data?",
        a: "Always. Your accounting data belongs to you. You will have your own login and full access to your books at any time. We work alongside your access and will never lock you out of your own records.",
      },
    ],
  },
  {
    category: "Working With Us",
    items: [
      {
        q: "Do you work with NGOs and non-profit organisations?",
        a: "Yes. We have experience with NPCs (Non-Profit Companies) and other NGOs, including donor-compliant financial statements, Section 18A tax exemption applications, and SARS returns for exempt organisations. Compliance requirements for NPOs differ significantly from commercial entities, and we understand those nuances.",
      },
      {
        q: "How do I send you my documents?",
        a: "For ongoing clients, documents flow automatically through your cloud accounting platform. Bank feeds pull transactions directly, and you can photograph and upload receipts from your phone. For once-off submissions, we accept documents via secure email or a shared cloud folder. We never ask you to post physical documents.",
      },
      {
        q: "What happens if I want to switch to a different accountant later?",
        a: "You're free to leave at any time. We'll provide a complete handover — all your records, working papers, and access credentials — to your new accountant or to you directly. We believe in earning your business every month, not locking you in.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap((section) =>
    section.items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    }))
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        label="FAQ"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about working with Sikatrix — from getting started to SARS compliance and cloud accounting."
        crumbs={[{ label: "FAQ" }]}
        bgImage="https://images.pexels.com/photos/4559704/pexels-photo-4559704.jpeg?auto=compress&cs=tinysrgb&w=1600&fit=crop"
      />

      <section className="py-14 bg-neutral-50 border-t-[3px] border-white/40">
        <div className="container-page max-w-3xl">
          <div className="space-y-12">
            {FAQS.map((section) => (
              <div key={section.category}>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-accent mb-5">
                  {section.category}
                </h2>
                <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
                  {section.items.map((item) => (
                    <details key={item.q} className="group py-4">
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none">
                        <span className="text-sm font-semibold text-neutral-900 leading-snug">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={15}
                          className="text-neutral-400 flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                        />
                      </summary>
                      <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still have questions */}
          <div className="mt-14 rounded-xl bg-brand-50 border border-brand/10 p-8 text-center">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Still have a question?
            </h3>
            <p className="text-sm text-neutral-500 mb-5">
              If you didn't find what you were looking for, reach us directly —
              we're happy to help.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/contact" className="btn-primary text-sm">
                Book a Free Consultation
              </Link>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="btn-outline text-sm"
              >
                {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-neutral-50 border-t border-neutral-200">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
