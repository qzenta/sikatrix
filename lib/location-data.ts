export interface LocationDetail {
  slug: string;
  name: string;
  province: string;
  isHQ: boolean;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  bodyParagraphs: string[];
  keyServices: string[];
  localContext: string;
  testimonial: {
    name: string;
    role: string;
    body: string;
  };
  nearbyLocations: string[];
  schemaCity: string;
}

export const LOCATION_DETAILS: LocationDetail[] = [
  {
    slug: "alberton",
    name: "Alberton",
    province: "Gauteng",
    isHQ: true,
    metaTitle: "Accountants in Alberton | Sikatrix Business Accountants (HQ)",
    metaDescription:
      "Sikatrix Business Accountants is based in Alberton, Gauteng. SAIPA-registered accountants and SARS Tax Practitioners serving Alberton SMEs, sole proprietors, NGOs and professionals. Call (011) 867-2550.",
    headline: "Your Trusted Accountants in Alberton — Based Right Here",
    intro:
      "Sikatrix Business Accountants is headquartered at 42 Hennie Alberts Street, Brackenhurst, Alberton. We're not a remote firm operating from another province — we're your neighbours, and we've been part of the Alberton business community for over ten years.",
    bodyParagraphs: [
      "Alberton is home to a diverse and growing business community — from established manufacturers in New Redruth and Alrode to professional practices in Eden Glen and retailers across Brackendowns. We've served them all, and we understand the financial pressures and opportunities unique to this area.",
      "As SAIPA-registered Professional Accountants and SARS Tax Practitioners, we provide Alberton businesses with the same quality of financial services you'd expect from a Sandton firm — without the Sandton rates or the impersonal service.",
      "Whether you're a sole trader just starting out, an established SME needing monthly bookkeeping and payroll, or a nonprofit requiring donor-compliant financial statements — Sikatrix is your local partner.",
      "We've built our reputation in Alberton on one simple principle: be the accountant your business actually needs, not the one who only surfaces at year-end.",
    ],
    keyServices: [
      "Annual Financial Statements (IFRS for SMEs)",
      "SARS Tax Returns (ITR12, ITR14, IRP6)",
      "Monthly Bookkeeping on QuickBooks / Xero / Sage",
      "Payroll & EMP201 Submissions",
      "CIPC Company Registration & Annual Returns",
      "VAT Registration & Monthly VAT201",
      "Business Permit Support",
      "Import/Export License Applications",
    ],
    localContext:
      "Alberton's industrial base — particularly the Alrode and New Redruth industrial zones — creates strong demand for import/export code assistance, payroll management for medium-sized workforces, and corporate tax planning. We're experienced in all three.",
    testimonial: {
      name: "Thabo M.",
      role: "Director, TM Construction CC — Alberton",
      body: "Sikatrix turned our messy books into a clean set of management accounts we could actually use to grow the business. Having them just down the road means they know exactly what's happening in Alberton's construction market.",
    },
    nearbyLocations: ["johannesburg", "vereeniging", "germiston"],
    schemaCity: "Alberton",
  },
  {
    slug: "johannesburg",
    name: "Johannesburg",
    province: "Gauteng",
    isHQ: false,
    metaTitle: "Accountants in Johannesburg | Sikatrix Business Accountants",
    metaDescription:
      "Cloud-based accounting and tax services for Johannesburg businesses. SAIPA-registered accountants and SARS Tax Practitioners. Bookkeeping, payroll, tax returns and compliance.",
    headline: "Cloud-Based Accounting for Johannesburg Businesses",
    intro:
      "Greater Johannesburg is South Africa's commercial engine — and its businesses deserve accounting partners who can keep pace. Sikatrix delivers professional, cloud-based financial management to Johannesburg SMEs with the speed and responsiveness the city demands.",
    bodyParagraphs: [
      "From Soweto to Rosebank, Midrand to Johannesburg CBD, we work with a wide range of Johannesburg businesses. Our cloud-first delivery model means geography is no barrier — you get the same high-quality service whether you're in our office or on the other side of the city.",
      "Johannesburg businesses face unique challenges: a fast-moving commercial environment, a diverse regulatory landscape, and intense competition. Our job is to handle your financial compliance so you can focus on the opportunities.",
      "We serve Johannesburg clients across multiple sectors — retail, professional services, construction, healthcare, and nonprofits. Each receives a tailored service package, not a one-size-fits-all approach.",
      "Using QuickBooks Online, Xero, and Sage, we give your Johannesburg business real-time financial visibility — so you're always one step ahead of your cash flow.",
    ],
    keyServices: [
      "Cloud Accounting Setup & Management",
      "Monthly Bookkeeping & Management Accounts",
      "Corporate Tax Returns (ITR14)",
      "Payroll Processing & PAYE Submissions",
      "VAT Returns (VAT201)",
      "Annual Financial Statements",
      "Company Registration (CIPC)",
      "Tax Practitioner Services",
    ],
    localContext:
      "Johannesburg's concentration of financial services, tech startups, and professional firms creates demand for sophisticated cloud accounting, multi-entity structures, and proactive tax planning — all areas where Sikatrix delivers.",
    testimonial: {
      name: "Priya N.",
      role: "Owner, Greenleaf Pharmacy — Johannesburg South",
      body: "Running a pharmacy comes with endless compliance obligations. Sikatrix handles all our financial submissions — I haven't missed a SARS deadline since working with them.",
    },
    nearbyLocations: ["alberton", "sandton", "randburg"],
    schemaCity: "Johannesburg",
  },
  {
    slug: "sandton",
    name: "Sandton",
    province: "Gauteng",
    isHQ: false,
    metaTitle: "Accountants in Sandton | Tax & Accounting Services | Sikatrix",
    metaDescription:
      "Professional accounting and tax services for Sandton businesses. SAIPA-registered accountants providing bookkeeping, payroll, tax planning and SARS compliance. Cloud-based delivery.",
    headline: "Professional Tax & Accounting Services for Sandton Businesses",
    intro:
      "Sandton is the financial hub of Africa — and the businesses that operate here expect financial partners who match their pace and professionalism. Sikatrix brings SAIPA-registered accounting expertise to Sandton companies via a modern, cloud-based delivery model.",
    bodyParagraphs: [
      "Whether you're a boutique professional services firm in Morningside, a startup in the Sandton CBD, or an established company in Bryanston — your financial compliance obligations are the same. We ensure you meet every SARS deadline, maintain accurate records, and plan your tax liability effectively.",
      "Sandton businesses often have more complex requirements: multi-currency transactions, shareholder loan accounts, or cross-border supplier relationships. Our team is experienced in navigating these complexities.",
      "We use Xero and QuickBooks Online to deliver real-time financial dashboards — so Sandton executives can make data-driven decisions without waiting for a quarterly report.",
      "Our SARS dispute resolution service is particularly valued in Sandton, where SARS audit activity tends to be higher. We represent you professionally and protect your interests.",
    ],
    keyServices: [
      "Tax Planning & Advisory",
      "SARS Audit Representation",
      "Cloud Accounting (Xero / QuickBooks)",
      "Corporate Tax Returns",
      "Payroll & Employee Tax",
      "Annual Financial Statements",
      "Company Secretarial Services",
      "VAT Compliance",
    ],
    localContext:
      "Sandton's high concentration of professional services firms, financial institutions, and multinational subsidiaries drives demand for sophisticated tax planning, multi-entity accounting, and SARS dispute resolution.",
    testimonial: {
      name: "Nandi D.",
      role: "Executive Director, Thrive NPO — Sandton",
      body: "Sikatrix helped us achieve our PBO status and prepare the donor-ready financials our funders required. Their knowledge of the nonprofit compliance environment is exceptional.",
    },
    nearbyLocations: ["johannesburg", "randburg"],
    schemaCity: "Sandton",
  },
  {
    slug: "randburg",
    name: "Randburg",
    province: "Gauteng",
    isHQ: false,
    metaTitle: "Accountants in Randburg | Sikatrix Business Accountants",
    metaDescription:
      "Trusted accountants serving Randburg, Ferndale, Bloubosrand and surrounds. Bookkeeping, payroll, tax returns and CIPC filings. SAIPA-registered. Cloud-based service delivery.",
    headline: "Trusted Accountants for Randburg's Business Community",
    intro:
      "From Ferndale to Bloubosrand, Randpark Ridge to Northgate — Randburg is home to a vibrant mix of SMEs, professional practices, and growing startups. Sikatrix provides the accounting backbone that lets these businesses focus on what they do best.",
    bodyParagraphs: [
      "Randburg's business environment is characterised by owner-managed businesses, retail operators, and professional service providers — exactly the client base we've built our practice to serve. We understand the cash flow pressures, the staffing challenges, and the SARS compliance requirements that come with running a business in this market.",
      "Our cloud-based delivery means you don't need to travel to our Alberton office — we manage your books remotely, deliver monthly management accounts, and handle all SARS interactions on your behalf.",
      "For Randburg businesses with employees, our payroll service is particularly valuable. We manage the full payroll cycle, calculate PAYE, SDL, and UIF, and submit EMP201 returns monthly — taking the burden completely off your desk.",
      "Need to register a new company or file outstanding CIPC annual returns? We handle company secretarial work efficiently, keeping your entity in good standing.",
    ],
    keyServices: [
      "Monthly Bookkeeping & Bank Reconciliation",
      "Payroll Processing & EMP201 Submissions",
      "Individual & Company Tax Returns",
      "CIPC Annual Returns & Registrations",
      "VAT Returns",
      "Annual Financial Statements",
      "Cloud Accounting Setup",
      "Management Accounts",
    ],
    localContext:
      "Randburg's retail and professional services concentration means payroll compliance and VAT management are among the most in-demand services. We help business owners stay on top of both without the administrative burden.",
    testimonial: {
      name: "Mia van der Merwe",
      role: "Owner, Randburg Beauty Studio",
      body: "I used to dread month-end because of the books. Sikatrix took over completely — now I get a clean management report every month and my tax is sorted before deadlines. Game-changer.",
    },
    nearbyLocations: ["johannesburg", "sandton"],
    schemaCity: "Randburg",
  },
  {
    slug: "vereeniging",
    name: "Vereeniging",
    province: "Gauteng",
    isHQ: false,
    metaTitle: "Accountants in Vereeniging | Vaal Triangle | Sikatrix",
    metaDescription:
      "Professional accounting and tax services for Vereeniging, Vanderbijlpark, and the Vaal Triangle. Bookkeeping, payroll, SARS compliance, and financial statements. Cloud-based delivery.",
    headline: "Reliable Accounting & Tax Services in Vereeniging & the Vaal Triangle",
    intro:
      "Sikatrix Business Accountants serves Vereeniging, Vanderbijlpark, and the broader Vaal Triangle business community. Our cloud-based model delivers professional accounting, payroll, and tax services to Vaal businesses efficiently and affordably.",
    bodyParagraphs: [
      "The Vaal Triangle hosts a diverse economy — from industrial manufacturers and logistics companies to retail chains, professional practices, and family-owned businesses. Each has unique accounting needs, and Sikatrix tailors its services accordingly.",
      "Distance is no barrier with our cloud-first model. We connect your business to QuickBooks Online or Xero, manage your books remotely, and deliver management accounts and compliance submissions on schedule — just as if we were around the corner.",
      "For Vereeniging manufacturers and industrial operators, payroll management is a priority. We handle multi-employee payrolls, manage PAYE and UIF submissions, and ensure every deadline is met without fail.",
      "Tax planning is another critical service for Vaal Triangle businesses. With Sikatrix, your provisional tax estimates are calculated accurately, your annual return is prepared on time, and your tax liability is minimised through every available deduction.",
    ],
    keyServices: [
      "Bookkeeping & Monthly Management Accounts",
      "Payroll for Manufacturing & Industrial Businesses",
      "Company & Individual Tax Returns",
      "Annual Financial Statements",
      "VAT Registration & Returns",
      "CIPC Annual Returns",
      "Cloud Accounting Migration",
      "SARS Compliance & Dispute Support",
    ],
    localContext:
      "Vereeniging's industrial base — including steel, chemicals, and manufacturing — drives demand for payroll management and corporate tax planning for medium-to-large workforces. Sikatrix has experience serving precisely these businesses.",
    testimonial: {
      name: "Carel van Wyk",
      role: "MD, Van Wyk Engineering — Vereeniging",
      body: "Our payroll used to take two days a month internally. Sikatrix took it over completely — EMP201 submissions are always on time, payslips go out on the right day, and I haven't had a SARS penalty since.",
    },
    nearbyLocations: ["alberton", "johannesburg", "germiston"],
    schemaCity: "Vereeniging",
  },
  {
    slug: "germiston",
    name: "Germiston",
    province: "Gauteng",
    isHQ: false,
    metaTitle: "Accountants in Germiston | Sikatrix Business Accountants",
    metaDescription:
      "Professional accounting, bookkeeping, payroll and tax services for Germiston businesses. SAIPA-registered accountants and SARS Tax Practitioners. Cloud-based delivery from our Alberton office.",
    headline: "Professional Accounting & Tax Services in Germiston",
    intro:
      "Sikatrix Business Accountants serves Germiston's diverse business community — from Wadeville's industrial operators to Germiston CBD's growing SMEs. Our cloud-based model delivers professional, responsive accounting and tax services with the personal touch of a local firm.",
    bodyParagraphs: [
      "Germiston is one of Ekurhuleni's most active commercial and industrial hubs, with strong manufacturing, logistics, and professional services sectors. Businesses here need accountants who understand the pace of operations — and the compliance obligations that come with it.",
      "Based just across the border in Alberton's Brackenhurst, Sikatrix is a natural fit for Germiston businesses seeking a nearby, responsive accounting partner. We manage your books, process payroll, and handle all SARS interactions so you can focus on growing your business.",
      "Our cloud-based delivery via QuickBooks Online, Xero, and Sage means you get real-time financial visibility without scheduling an office visit. Monthly management accounts, bank reconciliations, and compliance submissions — all handled on time, every time.",
      "Whether you're registering a new company, dealing with a SARS query, or simply looking for a reliable bookkeeper, Sikatrix has served Germiston businesses with the same professionalism we bring to every client.",
    ],
    keyServices: [
      "Monthly Bookkeeping & Bank Reconciliation",
      "Payroll Processing & EMP201 Submissions",
      "Company & Individual Tax Returns",
      "Annual Financial Statements",
      "CIPC Registration & Annual Returns",
      "VAT Registration & Returns",
      "Cloud Accounting Setup (QuickBooks / Xero / Sage)",
      "SARS Compliance & Dispute Support",
    ],
    localContext:
      "Germiston's manufacturing and logistics base, particularly around Wadeville and the East Rand industrial zones, drives demand for payroll management, import/export licensing, and corporate tax compliance — all services Sikatrix handles with expertise.",
    testimonial: {
      name: "Kevin Nkosi",
      role: "Owner, KN Logistics — Germiston",
      body: "Switching to Sikatrix was one of the best business decisions I made. They cleaned up two years of messy books, got our SARS submissions up to date, and now I get monthly reports I can actually use to manage my fleet.",
    },
    nearbyLocations: ["alberton", "johannesburg", "vereeniging"],
    schemaCity: "Germiston",
  },
];
