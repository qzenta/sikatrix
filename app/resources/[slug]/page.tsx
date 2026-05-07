import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import CTABlock from "@/components/shared/CTABlock";
import { BLOG_POSTS, SERVICES, LOCATIONS } from "@/lib/site";

const ARTICLE_CONTENT: Record<string, string[]> = {
  "sars-provisional-tax-guide-2025": [
    "Provisional tax is one of the most misunderstood obligations for South African business owners. If you earn income that isn't subject to employees' tax (PAYE), or you earn more than R30,000 per year from sources other than your main salary, you're likely a provisional taxpayer.",
    "## Who Must Register for Provisional Tax?",
    "You must register for provisional tax if you: (1) are a company or close corporation, (2) earn income from a business or profession, (3) receive rental income, investment income, or income from a trust, or (4) earn non-employment income exceeding R30,000 per year.",
    "Employed individuals who only earn a salary don't need to register — their employer deducts PAYE. But if you have a side business, rental property, or freelance income, provisional tax likely applies to you.",
    "## The Two Submission Deadlines",
    "**First period (August):** You must submit an IRP6 return and pay provisional tax by 31 August each year. This is based on your estimate of taxable income for the current year, with a minimum based on the prior year's assessment.",
    "**Second period (February):** Your second IRP6 is due by 28 February. By this point, you have more information about your actual year's income, so your estimate should be more accurate.",
    "There's also an optional third period (September) that allows you to top up if you've underpaid — this can help avoid interest charges.",
    "## How to Calculate Your Provisional Tax Estimate",
    "Your estimate must be at least as high as your basic amount (the taxable income from your last assessment). If your estimate is less than 90% of your actual taxable income, SARS will charge a penalty of 20% on the underpayment.",
    "To avoid penalties: always estimate at least equal to your basic amount, and update your estimate in February once you have a clearer picture of the year's income.",
    "## Penalties for Late or Underpayment",
    "Late submission carries a flat penalty of 10% of the tax liability, plus interest at the prescribed rate. Underestimation by more than 10% of actual taxable income triggers an additional 20% penalty on the shortfall.",
    "The best defence is accurate record-keeping throughout the year — which is where cloud accounting pays dividends.",
    "## Working with a Tax Practitioner",
    "As a SARS-registered Tax Practitioner, Sikatrix Business Accountants manages provisional tax submissions for all our business clients. We calculate your estimates accurately, submit on time, and advise on any top-up required before the September window closes.",
    "If you're not sure whether you're correctly registered for provisional tax, or you've missed a submission, contact us for a free consultation.",
  ],
  "small-business-bookkeeping-mistakes": [
    "Bookkeeping errors don't announce themselves. They accumulate quietly until SARS sends a query, your bank declines a loan application, or you discover at year-end that you've been making decisions based on wrong numbers.",
    "Here are the seven most expensive bookkeeping mistakes we see — and how to fix them.",
    "## 1. Mixing Personal and Business Accounts",
    "This is the single most common mistake among owner-managed businesses. When personal expenses flow through the business account, your records become impossible to reconcile. SARS may disallow deductions, and your financial statements become meaningless.",
    "**Fix:** Open a dedicated business bank account immediately. Never use it for personal expenses.",
    "## 2. Ignoring VAT",
    "Many business owners only think about VAT at submission time. Without proper VAT tracking throughout the month, input tax claims are missed and output tax is miscalculated.",
    "**Fix:** Tag every transaction with the correct VAT treatment. Cloud accounting software does this automatically when set up correctly.",
    "## 3. Skipping Bank Reconciliations",
    "Without monthly bank reconciliations, errors and fraud go undetected. Duplicate payments, missing deposits, and bank charges can distort your records significantly over time.",
    "**Fix:** Reconcile your bank account every month, immediately after the statement is available.",
    "## 4. Poor Debtor Management",
    "Many small businesses don't track what's owed to them. Invoices go unreconciled, bad debts accumulate, and cash flow suffers.",
    "**Fix:** Run an aged debtors report monthly and follow up on anything over 30 days.",
    "## 5. Misclassifying Expenses",
    "Putting a capital expense into the wrong account, or misclassifying loan repayments as operating expenses, distorts your profit figures and creates tax complications.",
    "**Fix:** Use a consistent chart of accounts and have a qualified bookkeeper review your classifications quarterly.",
    "## 6. Not Keeping Source Documents",
    "SARS requires you to retain financial records for 5 years. Losing invoices, bank statements, or payment receipts can result in disallowed deductions in an audit.",
    "**Fix:** Digitise everything. Use a document management app or cloud accounting system that stores source documents against transactions.",
    "## 7. DIY Bookkeeping Without Training",
    "Business owners who manage their own books without proper training often don't know what they don't know. The errors are invisible until they cause real damage.",
    "**Fix:** Use a qualified bookkeeper from the start. The cost is far less than fixing two years of errors — or paying SARS penalties.",
  ],
  "cloud-accounting-vs-desktop": [
    "The shift from desktop accounting software to cloud platforms is well underway in South Africa. But choosing the right solution for your business still depends on your size, budget, internet reliability, and the complexity of your accounting needs.",
    "## What is Cloud Accounting?",
    "Cloud accounting software runs on remote servers and is accessed through a web browser or mobile app. Your data is stored securely online, automatically backed up, and accessible from any device.",
    "QuickBooks Online, Xero, and Sage Business Cloud are the three dominant platforms in South Africa.",
    "## What is Desktop Accounting?",
    "Desktop software — like older versions of Sage Pastel or QuickBooks Desktop — is installed locally on a computer. Data is stored on that machine (or a server), and access is limited to devices with the software installed.",
    "## Cloud Advantages",
    "**Real-time access:** You and your accountant see the same data simultaneously. No more emailing spreadsheets.",
    "**Automatic backups:** Your data is backed up daily to multiple servers. No risk of hard drive failure wiping your records.",
    "**Automatic updates:** Cloud software updates automatically. You always have the latest SARS tax tables and compliance requirements.",
    "**Bank feeds:** Direct integration with South African banks means transactions import automatically.",
    "**Scalability:** Add users, features, or integrations as your business grows.",
    "## Desktop Advantages",
    "**Works offline:** No internet dependency. Useful in areas with unreliable connectivity.",
    "**One-time purchase (historically):** Some desktop options had perpetual licences. This is now largely gone.",
    "**Performance:** Complex reports run locally without internet latency.",
    "## Our Recommendation",
    "For most South African SMEs, QuickBooks Online offers the best price-to-feature ratio. Xero is excellent for businesses with international transactions. Sage Business Cloud suits larger teams and complex inventory requirements.",
    "If you're still on desktop software, migration to cloud is simpler than you think — and your accountant (including us) can manage the entire process.",
  ],

  "registering-a-company-cipc-guide": [
    "Registering a company in South Africa is more straightforward than most people expect — but the decisions you make at incorporation have lasting legal and tax consequences. This guide walks you through the CIPC process for a Private Company (Pty Ltd), which is the most common structure for South African SMEs.",
    "## Choose Your Business Structure First",
    "Before registering, you need to decide what type of legal entity you're forming. The most common options are: a Sole Proprietorship (no registration required, no legal separation from the owner), a Private Company (Pty Ltd, separate legal entity, limited liability, one or more shareholders), a Non-Profit Company (NPC, for public benefit or community purposes), and a Personal Liability Company (Inc., typically used by professionals like attorneys).",
    "For most business owners, a Private Company offers the best balance of protection and flexibility. Your personal assets are separated from business liabilities, and you can have multiple shareholders from the outset.",
    "## Step 1: Reserve Your Company Name",
    "Name reservation is optional but strongly recommended. You can reserve up to four alternative names in order of preference using the CoR9.1 form on the CIPC e-Services portal (eservices.cipc.co.za). The fee is R50 per name reservation. Your name must not be identical or confusingly similar to an existing registered company, and it cannot contain restricted words (like 'bank', 'trust', or 'national') without prior approval.",
    "CIPC processes name reservations within 5–7 business days. You'll receive a CoR9.4 reservation confirmation, which is valid for 6 months.",
    "## Step 2: Complete Your Memorandum of Incorporation (MOI)",
    "Every company is governed by a Memorandum of Incorporation. CIPC provides a standard MOI (Form CoR15.1A) for Private Companies, which is sufficient for most SMEs. You can accept the standard MOI or draft a customised one if your company has specific requirements around shareholder rights, director powers, or decision thresholds.",
    "The standard MOI allows for flexible share structures and is accepted immediately by CIPC without additional review.",
    "## Step 3: Register on the CIPC Portal",
    "Log in to eservices.cipc.co.za and complete the CoR14.1 registration application. You'll need: your reserved name (or apply for name and registration simultaneously), the number and class of shares, details of each incorporator (ID number, contact details), and your registered office address in South Africa.",
    "The registration fee for a standard Private Company is R175. Payment is made through the CIPC portal. CIPC typically processes registrations within 5–7 business days, after which you receive a CoR14.3 registration certificate with your company registration number.",
    "## First Compliance Steps After Incorporation",
    "Registration is just the beginning. Within the first 60 days you should: open a dedicated business bank account in the company name, register for Income Tax with SARS (CIPC shares incorporation data with SARS, but you must still complete the IT77C registration or confirm via eFiling), apply for a tax clearance certificate once your tax profile is active, register for PAYE with SARS if you intend to pay any salaries, and register for VAT once your projected or actual taxable turnover exceeds R1 million.",
    "CIPC also requires annual returns, due within 30 business days of your company's anniversary date each year. The fee scales with your turnover and ranges from R100 to R450.",
    "## Common Mistakes to Avoid",
    "**Using personal accounts for company transactions:** Once incorporated, the company is a separate legal person. Mixing funds defeats the purpose of limited liability and creates bookkeeping and tax complications.",
    "**Neglecting your MOI:** Standard or not, directors must understand what the MOI allows. Decisions taken outside its bounds can be challenged or invalidated.",
    "**Missing CIPC annual returns:** Two consecutive years of non-compliance results in deregistration. Once deregistered, reinstating a company is expensive and time-consuming.",
    "If you're incorporating a company and want to get the compliance foundation right from day one, Sikatrix Business Accountants handles the full setup — including SARS registration, company secretarial obligations, and your first year of bookkeeping.",
  ],

  "paye-uif-sdl-explained": [
    "The moment you hire your first employee in South Africa, three statutory obligations arise simultaneously: PAYE (Pay-As-You-Earn), UIF (Unemployment Insurance Fund), and SDL (Skills Development Levy). Missing any of them can result in SARS penalties, backdated assessments, and interest charges. Here's exactly what each one means and how to comply from day one.",
    "## What is PAYE?",
    "PAYE is the income tax withheld from employees' salaries on behalf of SARS. As the employer, you are responsible for calculating the correct tax on each employee's remuneration, deducting it before payment, and remitting it to SARS by the 7th of the following month (or the last business day before the 7th).",
    "PAYE applies to all employees who earn above the tax threshold — currently R95,750 per year for taxpayers under 65 (2024/25 tax year). Employees earning below this amount are not subject to PAYE, but you must still register as an employer and report their earnings.",
    "## How PAYE is Calculated",
    "You calculate PAYE using the SARS tax tables published annually in the Budget. The calculation takes each employee's monthly remuneration, annualises it, applies the tax brackets, subtracts applicable rebates (primary, secondary for employees over 65, tertiary for those over 75), and divides by 12.",
    "The most reliable way to handle this is through a SARS-compatible payroll system such as SimplePay or Sage Payroll, which updates automatically when tax tables change. Manual calculations are error-prone and difficult to reconcile.",
    "## UIF — Unemployment Insurance Fund",
    "UIF provides short-term relief to workers who lose income due to unemployment, illness, maternity, or adoption leave. Both employer and employee contribute 1% of the employee's gross remuneration each — a total of 2% per month.",
    "Contributions are capped at a monthly remuneration ceiling updated annually by the Department of Employment and Labour. Employees earning above this ceiling still contribute, but only on the ceiling amount. As of 2024, the monthly ceiling is R17,712.",
    "You must register your business with the Department of Employment and Labour (not SARS) for UIF purposes. However, UIF contributions are declared and paid alongside PAYE via your monthly EMP201 return on SARS eFiling — SARS collects UIF on behalf of the UIF Commissioner.",
    "## SDL — Skills Development Levy",
    "SDL is a levy paid by employers to fund workplace training through the SETA (Sector Education and Training Authority) system. It applies at 1% of your total leviable amount (gross payroll).",
    "Employers are only required to pay SDL if their total annual leviable amount exceeds R500,000. If your annual payroll is below this threshold, you are SDL-exempt — but you must still register as an employer and indicate your exempt status. Public benefit organisations and certain government entities are also exempt.",
    "SDL is submitted and paid together with PAYE and UIF via the monthly EMP201 return.",
    "## The EMP201 — Your Monthly Payroll Return",
    "The EMP201 is a payment declaration submitted to SARS by the 7th of each month. It declares your PAYE, SDL, and UIF contributions for the prior month. Late submission carries a penalty of 10% of the amount due, plus interest at the prescribed rate.",
    "Every six months (August and February), you must also submit an EMP501 reconciliation, which reconciles your monthly EMP201 submissions against the IRP5/IT3(a) certificates issued to employees.",
    "## Registering as an Employer with SARS",
    "To register as an employer, log into SARS eFiling and complete the EMP101e registration form. You'll need your company registration number, tax reference number, banking details, and the details of at least one director or representative. SARS typically issues an employer tax reference number within 48 hours.",
    "Once registered, you can generate and submit EMP201 returns directly from eFiling or via compatible payroll software. Sikatrix Business Accountants manages the full employer registration and monthly payroll compliance process for all our clients — contact us to get set up correctly from the first payslip.",
  ],

  "vat-registration-when-and-how": [
    "VAT (Value-Added Tax) is a consumption tax levied at 15% on the supply of most goods and services in South Africa. As a VAT vendor, you collect VAT from your customers (output tax), offset it against the VAT you paid to your suppliers (input tax), and pay the difference to SARS. Getting this right matters — and getting it wrong is expensive.",
    "## The R1 Million Threshold — When Registration is Mandatory",
    "You are legally required to register for VAT if your taxable turnover has exceeded R1 million in any consecutive 12-month period, or if it is reasonably expected to exceed R1 million in the next 12 months. 'Taxable turnover' includes all standard-rated and zero-rated supplies, but excludes exempt supplies (such as residential rental income and certain financial services).",
    "You must apply for VAT registration within 21 days of the date your turnover first exceeds — or is expected to exceed — R1 million. Late registration results in deemed VAT liability from the date you should have registered, plus a 10% penalty on the outstanding amount.",
    "## Voluntary VAT Registration",
    "Businesses with taxable turnover between R50,000 and R1 million per year may apply for voluntary VAT registration. This can be advantageous if you supply other VAT-registered businesses, as they can claim the VAT you charge as an input tax credit — making your pricing more competitive.",
    "To qualify for voluntary registration, you must be able to demonstrate that you are making or intend to make taxable supplies. SARS may request supporting documentation such as signed contracts, invoices, or a business plan.",
    "Voluntary registration is not always beneficial. If most of your customers are end-consumers (not VAT vendors), adding 15% VAT to your prices makes you more expensive relative to non-registered competitors. Assess your customer base before registering voluntarily.",
    "## How to Register for VAT with SARS",
    "VAT registration is completed on SARS eFiling using the VAT101 application form. You will need your income tax reference number, company registration number (for companies), banking details, details of the business premises, and a description of your principal business activity.",
    "Supporting documents typically required include: a copy of your ID, proof of address for the business, recent bank statements (3–6 months), and a signed lease agreement or title deed if you own the premises. SARS may contact you for a field visit or additional documentation before approving registration.",
    "Once approved, SARS issues a VAT registration certificate and assigns you a VAT number. This number must appear on all tax invoices you issue.",
    "## Output Tax and Input Tax",
    "**Output tax:** VAT you charge on your sales. Every time you issue a tax invoice to a customer, you collect 15% VAT on their behalf and owe it to SARS.",
    "**Input tax:** VAT you pay on your business expenses. When you purchase goods or services from another VAT vendor and receive a valid tax invoice, you can claim that VAT back from SARS.",
    "The net amount — output tax minus input tax — is what you pay to SARS (or claim as a refund if input tax exceeds output tax in a given period).",
    "## VAT Periods and Submission Deadlines",
    "SARS assigns you a VAT category based on your turnover and the nature of your business. Category A vendors submit bi-monthly (every two months), Category B vendors also submit bi-monthly but on different month-end cycles, and Category C vendors (typically large businesses with annual taxable supplies exceeding R30 million) submit monthly.",
    "Returns are due by the last business day of the month following the end of your VAT period (or the 25th of the month for eFiling submissions). Late payment attracts a 10% penalty plus interest.",
    "## Penalties for Failure to Register",
    "If SARS discovers you should have registered and did not, they will raise a VAT assessment for all periods from the date you were required to register. This includes output tax on all sales made during that period — regardless of whether you collected VAT from customers. Add penalties of up to 10% and interest, and the exposure can be substantial.",
    "If you believe you've crossed the R1 million threshold and haven't yet registered, act immediately — voluntary disclosure before SARS raises an assessment significantly reduces the penalty exposure. Sikatrix Business Accountants can assess your registration obligation and manage the registration process on your behalf.",
  ],
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Sikatrix Resources`,
    description: post.excerpt,
    alternates: { canonical: `https://sikatrix.com/resources/${slug}` },
  };
}

function renderContent(lines: string[]) {
  return lines.map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-lg font-semibold text-neutral-900 mt-8 mb-3">
          {line.replace("## ", "")}
        </h2>
      );
    }
    if (line.startsWith("**") && line.includes(":**")) {
      const parts = line.split(":**");
      const bold = parts[0].replace("**", "");
      const rest = parts[1];
      return (
        <p key={i} className="text-sm text-neutral-700 leading-relaxed mb-3">
          <strong className="text-neutral-900">{bold}:</strong>
          {rest}
        </p>
      );
    }
    return (
      <p key={i} className="text-sm text-neutral-700 leading-relaxed mb-4">
        {line}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = ARTICLE_CONTENT[slug];
  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-brand-dark py-12 md:py-16">
        <div className="container-page">
          <nav className="flex items-center gap-2 text-xs text-brand-100 mb-5">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-white">Resources</Link>
            <span>/</span>
            <span className="text-white">{post.category}</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 text-2xs font-semibold uppercase tracking-widest text-accent-light">
              <Tag size={9} /> {post.category}
            </span>
            <span className="text-brand-100 text-2xs">·</span>
            <span className="text-2xs text-brand-100 flex items-center gap-1">
              <Clock size={9} /> {post.readTime}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-snug mb-4 max-w-3xl text-balance">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-xs text-brand-100">
            <Calendar size={11} />
            Published{" "}
            {new Date(post.date).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            <span>· Sikatrix Business Accountants</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              {/* Excerpt */}
              <div className="card p-5 mb-8 border-l-4 border-brand bg-brand-50">
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">{post.excerpt}</p>
              </div>

              {/* Article body */}
              <article>
                {content
                  ? renderContent(content)
                  : (
                    <div className="space-y-4">
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        This article explores {post.title.toLowerCase()} — a topic critical for South African business owners navigating SARS compliance and financial management.
                      </p>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        Contact Sikatrix Business Accountants for expert guidance on this topic.
                      </p>
                    </div>
                  )}
              </article>

              {/* CTA inline */}
              <div className="mt-10 p-6 rounded-xl bg-brand text-white">
                <h3 className="font-semibold mb-2">Need help with this?</h3>
                <p className="text-sm text-brand-100 mb-4">
                  Sikatrix Business Accountants handles {post.category.toLowerCase()} matters for 148+ South African businesses.
                  Book a free consultation.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-accent-dark transition-colors">
                  Book Free Consultation <ArrowRight size={13} />
                </Link>
              </div>

              {/* Internal links */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Related services</h3>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.slice(0, 4).map((s) => (
                    <Link
                      key={s.slug}
                      href={`/services/${s.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand px-3 py-1.5 rounded-full bg-brand-50 hover:bg-brand hover:text-white transition-colors"
                    >
                      {s.shortTitle} <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">We serve clients near you</h3>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <Link
                      key={l.slug}
                      href={`/locations/${l.slug}`}
                      className="text-xs text-brand hover:underline"
                    >
                      Accountants in {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">More articles</h3>
                <ul className="space-y-4">
                  {otherPosts.map((p) => (
                    <li key={p.slug}>
                      <Link href={`/resources/${p.slug}`} className="group">
                        <span className="text-2xs text-accent font-semibold uppercase block mb-0.5">
                          {p.category}
                        </span>
                        <span className="text-xs font-medium text-neutral-800 group-hover:text-brand transition-colors leading-snug block">
                          {p.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card p-5 bg-brand-50 border-brand/20">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Talk to an accountant</h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Questions about {post.category.toLowerCase()}? Book a free 30-minute consultation.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center text-xs">
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page pb-4">
        <Link href="/resources" className="inline-flex items-center gap-2 text-sm text-brand hover:underline">
          <ArrowLeft size={13} /> Back to Resources
        </Link>
      </div>

      <section className="py-14 bg-neutral-50 border-t border-neutral-200">
        <div className="container-page">
          <CTABlock />
        </div>
      </section>
    </>
  );
}
