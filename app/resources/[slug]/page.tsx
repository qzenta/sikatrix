import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, ArrowLeft, Tag } from "lucide-react";
import CTABlock from "@/components/shared/CTABlock";
import { BLOG_POSTS, SERVICES, LOCATIONS } from "@/lib/site";

// Deliberate internal backlinking: each article links to its most relevant services
const ARTICLE_SERVICE_MAP: Record<string, string[]> = {
  "sars-provisional-tax-guide-2025":    ["tax-services", "bookkeeping", "cloud-accounting"],
  "small-business-bookkeeping-mistakes": ["bookkeeping", "cloud-accounting", "tax-services"],
  "cloud-accounting-vs-desktop":         ["cloud-accounting", "bookkeeping", "annual-financial-statements"],
  "registering-a-company-cipc-guide":    ["company-secretarial", "tax-services", "bookkeeping"],
  "paye-uif-sdl-explained":             ["payroll", "tax-services", "bookkeeping"],
  "vat-registration-when-and-how":            ["tax-services", "bookkeeping", "annual-financial-statements"],
  "sars-efiling-business-registration":       ["tax-services", "company-secretarial", "bookkeeping"],
  "how-to-submit-company-tax-return-itr14":   ["tax-services", "annual-financial-statements", "bookkeeping"],
};

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
    "[img]https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&auto=format&fit=crop&q=60|A calendar open on a desk beside a laptop — marking SARS provisional tax deadlines|Mark 31 August and 28 February in your calendar every year — these are the two IRP6 deadlines that cannot move",
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
    "[img]https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60|Accountant reviewing financial data on a laptop with charts visible|Cloud accounting software automates bank reconciliation and flags anomalies before they become costly errors",
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
    "[img]https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=60|Person working on a laptop with accounting software open|Cloud platforms like QuickBooks Online give your accountant and you simultaneous real-time access to the same data",
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
    "[img]https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60|Business owner signing company registration documents at a desk|Your Memorandum of Incorporation is a binding legal document — understand what it permits before signing",
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
    "[img]https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop&q=60|HR professional reviewing payroll documents on a desk|PAYE, UIF and SDL are all declared and paid together on the same monthly EMP201 return — due by the 7th of each month",
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

  "sars-efiling-business-registration": [
    "Every company that needs to file tax returns, pay PAYE, or manage VAT with SARS must have an active eFiling profile. Without one, you cannot submit returns, make payments, receive refunds, or respond to SARS correspondence online. Setting up your business profile on SARS eFiling is the single most important administrative task after incorporation — and it is not automatic, even though CIPC now shares company registration data with SARS.",
    "## Who Needs to Register?",
    "Any company, close corporation, trust, or other legal entity that is registered for any tax type in South Africa must have a SARS eFiling profile. This includes: Private Companies (Pty Ltd) registered for Corporate Income Tax, any entity registered as an employer (PAYE), businesses registered or registering for VAT, and trusts with an obligation to submit IT3(t) returns. A director or public officer acts as the responsible representative on the account.",
    "## What You Need Before You Start",
    "Before registering, gather the following: your South African ID document or passport (for the representative), the company's tax reference number (issued by SARS at incorporation — check your CIPC confirmation documents or any previous SARS correspondence), the company registration number (your CoR14.3 certificate from CIPC), a valid email address and South African mobile number for one-time PIN (OTP) verification, and the company's physical and postal address.",
    "If you cannot locate a tax reference number, your company may not yet be registered for Income Tax. Companies incorporated after CIPC's integration with SARS are typically auto-registered, but this is not guaranteed. In that case, visit your nearest SARS branch with your CIPC documentation to complete the IT77C registration form.",
    "## Step 1: Register or Log In as the Responsible Representative",
    "Navigate to efiling.sars.gov.za. If the director or public officer does not yet have a personal eFiling profile, click 'Register' and follow the prompts. You will enter your ID number, name, and date of birth, then verify your identity via OTP sent to your registered mobile number. If a personal profile already exists from prior individual tax returns, simply log in — you do not need to create a new profile.",
    "Once logged in, go to the 'Home' tab and select 'Manage Tax Types'. This section is where you associate the company's tax reference number with your personal eFiling login.",
    "## Step 2: Add the Company to Your eFiling Profile",
    "On the 'Manage Tax Types' screen, select 'Register New' or 'Add Tax Type'. Enter the company's Income Tax reference number and select 'Company Income Tax (CIT)' as the tax type. SARS will send an OTP to the company's registered contact details — you will need access to that number or email to complete the verification. Once confirmed, the company appears under your eFiling portfolio.",
    "If the company has multiple tax types (PAYE, VAT), repeat this step for each — entering the relevant reference number and selecting the correct tax type. Each type may require a separate activation step.",
    "[img]https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&auto=format&fit=crop&q=60|Person completing SARS eFiling registration on a laptop at a desk|Once you add your company's tax reference number to your eFiling profile, all returns and correspondence become accessible online",
    "## Step 3: Activate the Correct Tax Types",
    "Every tax type your company is registered for must be activated individually on eFiling: **Corporate Income Tax (CIT):** for submitting your annual ITR14 return. **PAYE (Employer taxes):** for monthly EMP201 submissions once you have employees. **VAT:** for bi-monthly or monthly VAT201 submissions once you are registered as a VAT vendor. **SDL and UIF:** activated alongside PAYE and declared on the same EMP201 return.",
    "Only activate tax types you are actually registered for. Activating a type without a valid reference number will generate errors. If you need to register for a new tax type (such as VAT), complete the relevant registration application first — VAT101 on eFiling for VAT, EMP101e for employer taxes.",
    "## Step 4: Link a Bank Account for Refunds",
    "Under 'My Profile' → 'Bank Account Details', capture the company's business bank account. This is where SARS will pay any tax refunds, including VAT refund payments. The account must be in the company's name — SARS will not pay refunds to a personal account. Linking the wrong account is a common cause of delayed refunds.",
    "## What Happens After Registration",
    "Once your company's eFiling profile is active and tax types are linked, you can: view and download all returns due, submit returns and make payments via the payment portal or EFT, respond to SARS queries and audits online, request tax clearance certificates (which are now issued in real-time via the system), and track correspondence under 'SARS Correspondence'. Returns become available under the relevant tax type as soon as they are issued by SARS.",
    "## Common Mistakes to Avoid",
    "**Using the wrong representative:** The person registered as the representative must be a director or public officer of the company. Using an employee's personal profile creates complications when staff change. **Mismatching reference numbers:** Corporate Income Tax, PAYE, and VAT each have separate reference numbers. Entering a VAT number into the CIT field, or vice versa, will fail. **Not activating all relevant tax types:** It is common for businesses to activate only CIT and then discover they cannot access eFiling for PAYE or VAT when those deadlines arrive. **Outdated contact details:** OTP verification will fail if SARS has an old mobile number on record. Update your contact details at a SARS branch or via the RAV01 form if necessary.",
    "Sikatrix Business Accountants manages eFiling registration and setup for all our new clients as part of our onboarding process. If you are registering a new company or taking over a business with a dormant eFiling profile, contact us for a free consultation.",
  ],

  "how-to-submit-company-tax-return-itr14": [
    "The ITR14 is the Income Tax Return for Companies — the annual return a private company, close corporation, or other juristic person submits to SARS to declare its taxable income and calculate the corporate tax it owes. Getting it right requires accurate financial statements, a proper tax computation, and a clear understanding of the deductions and allowances available to your business. Filing late, filing incomplete, or filing with errors are three of the fastest routes to a SARS audit.",
    "## What is the ITR14?",
    "The ITR14 is SARS's income tax return form for companies. It collects the information SARS needs to raise a tax assessment — the formal determination of how much corporate tax your company owes for the financial year. The current corporate tax rate is 27% of taxable income (reduced from 28% for years of assessment ending on or after 31 March 2023). Small Business Corporations (SBCs) that qualify under Section 12E of the Income Tax Act are taxed on a progressive scale, with the first R95,750 of taxable income tax-free.",
    "## Who Must File an ITR14?",
    "Every company registered for Corporate Income Tax with SARS must file an ITR14 for each year of assessment, regardless of whether it traded or made a profit. This includes: Private Companies (Pty Ltd), Close Corporations (CC), Public Companies (Ltd), Non-Profit Companies (NPC) with taxable income, Trusts registered as companies, and Personal Liability Companies (Inc.). A company that made a loss must still file — the assessed loss is carried forward to reduce future taxable income.",
    "## When is the ITR14 Due?",
    "The ITR14 is due within 12 months of the last day of the company's financial year end. For example, if your financial year ends on 28 February 2025, your ITR14 is due by 28 February 2026. SARS issues returns filing season notices that specify the exact filing window. Late submission attracts a penalty of R250 per month for each month the return is outstanding, up to a maximum of R16,000 per return. These penalties apply even if no tax is owed.",
    "Note that provisional tax payments (IRP6) are due before the final ITR14. The first IRP6 is due six months into your financial year; the second is due on the last day of the financial year. The ITR14 then reconciles your actual taxable income against the provisional payments you made.",
    "## Before You Start: What You Need",
    "Prepare the following before opening the ITR14 on eFiling: your Annual Financial Statements (signed and finalised for the financial year), a tax computation showing the move from accounting profit to taxable income, a fixed asset register (for Section 12C, 11(e), or 12E wear-and-tear allowance claims), schedules for any assessed losses brought forward from prior years, details of any dividends received or paid, and records of any controlled foreign company (CFC) interests if applicable. The ITR14 cannot be accurately completed from bank statements alone — you need finalised, IFRS-compliant financial statements.",
    "[img]https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&auto=format&fit=crop&q=60|Accountant working through financial documents and a tax computation on a desk|Your signed Annual Financial Statements and a formal tax computation are the two non-negotiable inputs for an accurate ITR14",
    "## Step 1: Access the ITR14 on eFiling",
    "Log in at efiling.sars.gov.za. Ensure you are in your company's portfolio — click the dropdown next to your name and select the company entity. Navigate to 'Returns' → 'Returns Issued' → 'Income Tax' → 'ITR14'. Select the relevant year of assessment and click 'Open Return'. If the return is not listed, it may not yet have been issued by SARS — check 'Returns History' or contact SARS to request the return be issued.",
    "## Step 2: Work Through the Return Sections",
    "The ITR14 is a dynamic form — sections appear or disappear based on your answers. The main sections are: **Company Information:** confirm legal name, registration number, financial year dates, and public officer details. **Income Details:** gross income, cost of sales, and operating expenses drawn from your income statement. **Tax Computation:** adjustments to accounting profit — adding back non-deductible expenses (entertainment, penalties, provisions), deducting allowable items (wear-and-tear, Section 12E allowances, bad debts). **Assessed Loss:** carry forward any assessed loss from prior years to reduce taxable income. **Capital Gains:** declare any disposal of assets and the resulting capital gain or loss (companies pay CGT at an inclusion rate of 80%, taxed at 27%, giving an effective rate of 21.6%). **Dividends:** declare dividends received and dividends paid. **Foreign Income:** report any foreign-source income and applicable foreign tax credits.",
    "Work methodically through each section. Do not skip fields or enter estimated figures — SARS cross-references the ITR14 against your provisional tax returns, VAT returns, and in some cases third-party data from banks and other institutions.",
    "## Step 3: Attach Supporting Documents",
    "After completing the return, eFiling will prompt you to attach supporting documents. At minimum, attach: your signed Annual Financial Statements (PDF), your tax computation schedule, and your fixed asset register if you are claiming depreciation allowances. For first-time filers or where the return differs significantly from prior years, SARS may request additional documentation during verification. Attaching everything upfront reduces the risk of being selected for a verification audit.",
    "## Step 4: Review, Calculate, and Submit",
    "Click 'Calculate' to generate a tax liability figure. Review this carefully against your own computation — if the eFiling calculation differs from yours, identify the discrepancy before submitting. Common causes of differences include incorrectly capturing gross income, missing deduction fields, or errors in the assessed loss schedule. Once satisfied, click 'File Return'. eFiling will confirm submission and generate a submission receipt number — save this.",
    "If tax is owed, payment is due within the deadline. Pay via SARS eFiling's payment gateway, or by EFT using the payment reference number on your assessment. SARS does not accept cash or cheque payments.",
    "## After Submission: What to Expect",
    "SARS will issue an assessment — either an ITA34 (auto-assessment confirming your submission) or a request for verification (a letter requesting additional documents). Most accurate ITR14 submissions are processed within 7–21 business days. If SARS selects your return for audit, they will issue a letter specifying what they require. Respond within the stated deadline — non-response results in SARS estimating the assessment, almost always unfavourably.",
    "## If You Disagree with SARS's Assessment",
    "You have 30 business days from the date of the assessment to lodge a Notice of Objection (NOO) via eFiling. If you miss this window, you can apply for condonation of late objection — but this is not guaranteed. Common grounds for objection include SARS disallowing a legitimate deduction, misinterpreting income classification, or failing to credit provisional tax payments correctly. A Tax Practitioner can prepare and submit an objection on your behalf.",
    "## Common Mistakes That Trigger SARS Audits",
    "**Gross income understated:** SARS compares your declared turnover against VAT returns, third-party data, and industry benchmarks. Significant differences raise flags. **Deductions without supporting documents:** Claiming wear-and-tear, bad debts, or travel allowances without proper records invites a verification audit. **Omitting assessed losses:** Forgetting to carry forward an assessed loss from a prior year results in paying more tax than necessary. **Filing late after provisional tax underpayment:** Late ITR14 combined with underpaid provisional tax doubles the penalty exposure. **Misclassifying personal expenses as business deductions:** Owner-managed companies are SARS's highest-scrutiny category — entertainment, motor vehicle, and home office deductions must be defensible.",
    "Sikatrix Business Accountants prepares and submits ITR14 returns for all our corporate clients. We prepare the tax computation from your financial statements, identify all permissible deductions, and manage any SARS correspondence that arises. If you are behind on corporate tax returns or need support with an upcoming filing, contact us for a free consultation.",
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
    "[img]https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60|Business owner issuing a tax invoice to a client|Every VAT vendor must issue valid tax invoices showing their VAT registration number — SARS can disallow input claims without them",
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
    title: { absolute: `${post.title} | Sikatrix Resources` },
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
    if (line.startsWith("[img]")) {
      const [src, alt, caption] = line.replace("[img]", "").split("|");
      return (
        <figure key={i} className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="w-full h-56 object-cover rounded-xl" />
          {caption && (
            <figcaption className="text-xs text-neutral-400 text-center mt-2 italic">
              {caption}
            </figcaption>
          )}
        </figure>
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
  const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
  const relatedServiceSlugs = ARTICLE_SERVICE_MAP[slug] ?? SERVICES.slice(0, 3).map((s) => s.slug);
  const relatedServices = relatedServiceSlugs.map((s) => SERVICES.find((sv) => sv.slug === s)).filter(Boolean);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Daniel [Surname]",
      jobTitle: "SAIPA Professional Accountant (SA)",
      worksFor: {
        "@type": "AccountingService",
        name: "Sikatrix Business Accountants",
        url: "https://sikatrix.com",
      },
    },
    publisher: {
      "@type": "AccountingService",
      name: "Sikatrix Business Accountants",
      url: "https://sikatrix.com",
    },
    url: `https://sikatrix.com/resources/${slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Hero */}
      <section className="relative bg-brand-dark py-12 md:py-16 overflow-hidden">
        {post.image && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            />
            <div className="absolute inset-0 bg-brand-dark/80" />
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-dark/90 via-brand-dark/60 to-transparent" />
          </>
        )}
        <div className="container-page relative">
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
          <div className="flex items-center gap-2 text-xs text-brand-100 flex-wrap">
            <Calendar size={11} />
            Published{" "}
            {new Date(post.date).toLocaleDateString("en-ZA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            <span className="opacity-40">·</span>
            <span>By Daniel [Surname], SAIPA Professional Accountant (SA)</span>
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

              {/* Internal links — topic-specific service backlinking */}
              <div className="mt-8 pt-8 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Related services</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedServices.map((s) => s && (
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

              {/* Prev / Next navigation */}
              {(prevPost || nextPost) && (
                <div className="mt-10 pt-8 border-t border-neutral-200 grid sm:grid-cols-2 gap-3">
                  {prevPost ? (
                    <Link
                      href={`/resources/${prevPost.slug}`}
                      className="card p-4 group flex items-start gap-3 hover:border-brand/30 transition-colors"
                    >
                      <ArrowLeft size={15} className="text-brand mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-2xs text-neutral-400 block mb-1">← Previous</span>
                        <span className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {prevPost.title}
                        </span>
                      </div>
                    </Link>
                  ) : <div />}
                  {nextPost ? (
                    <Link
                      href={`/resources/${nextPost.slug}`}
                      className="card p-4 group flex items-start gap-3 text-right justify-end hover:border-brand/30 transition-colors"
                    >
                      <div>
                        <span className="text-2xs text-neutral-400 block mb-1">Next →</span>
                        <span className="text-xs font-semibold text-neutral-800 group-hover:text-brand transition-colors leading-snug">
                          {nextPost.title}
                        </span>
                      </div>
                      <ArrowRight size={15} className="text-brand mt-0.5 flex-shrink-0" />
                    </Link>
                  ) : <div />}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* CTA */}
              <div className="card p-5 bg-brand-50 border-brand/20">
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">Talk to an accountant</h3>
                <p className="text-xs text-neutral-500 mb-4">
                  Questions about {post.category.toLowerCase()}? Book a free 30-minute consultation.
                </p>
                <Link href="/contact" className="btn-primary w-full justify-center text-xs">
                  Book Consultation
                </Link>
              </div>

              {/* All articles by category */}
              <div className="card p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">All Articles</h3>
                <div className="space-y-5">
                  {(["Tax", "SARS Compliance", "Bookkeeping", "Business Growth"] as const).map((cat) => {
                    const catPosts = BLOG_POSTS.filter((p) => p.category === cat);
                    if (catPosts.length === 0) return null;
                    return (
                      <div key={cat}>
                        <span className="text-2xs font-semibold uppercase tracking-widest text-accent block mb-2">
                          {cat}
                        </span>
                        <ul className="space-y-3">
                          {catPosts.map((p) => (
                            <li key={p.slug}>
                              <Link
                                href={`/resources/${p.slug}`}
                                className={`group flex gap-2.5 items-start ${p.slug === slug ? "pointer-events-none" : ""}`}
                              >
                                <div className="w-14 h-11 rounded-md overflow-hidden flex-shrink-0 bg-neutral-100">
                                  {p.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={p.image} alt="" className="w-full h-full object-cover" />
                                  )}
                                </div>
                                <span className={`text-xs leading-snug mt-0.5 transition-colors ${p.slug === slug ? "font-semibold text-brand" : "text-neutral-600 group-hover:text-brand font-medium"}`}>
                                  {p.title}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
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
