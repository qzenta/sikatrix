import { ExternalLink } from "lucide-react";

const AUTHORITY_LINKS = [
  {
    category: "Tax & Revenue",
    links: [
      { label: "SARS eFiling", href: "https://www.sarsefiling.co.za", desc: "Submit your tax returns online via SARS." },
      { label: "SARS Tax Practitioner Register", href: "https://www.sars.gov.za/businesses-and-employers/tax-practitioners/", desc: "Verify your accountant is SARS-registered." },
      { label: "SARS 2026/27 Tax Tables", href: "https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/", desc: "Official SARS individual tax rate tables." },
    ],
  },
  {
    category: "Business Registration",
    links: [
      { label: "CIPC Company Registration", href: "https://www.cipc.co.za", desc: "Register a new company or CC with CIPC." },
      { label: "BizPortal", href: "https://bizportal.gov.za", desc: "One-stop government portal for business registration." },
    ],
  },
  {
    category: "Professional Bodies",
    links: [
      { label: "SAIPA", href: "https://www.saipa.co.za", desc: "South African Institute of Professional Accountants." },
      { label: "IBASA", href: "https://www.ibasa.org.za", desc: "Institute of Business Advisors South Africa." },
    ],
  },
  {
    category: "Cloud Accounting",
    links: [
      { label: "QuickBooks Online", href: "https://quickbooks.intuit.com/za/", desc: "Cloud accounting for South African SMEs." },
      { label: "Xero South Africa", href: "https://www.xero.com/za/", desc: "Online accounting software for small businesses." },
      { label: "Sage Business Cloud", href: "https://www.sage.com/en-za/", desc: "SA-specific payroll and accounting platform." },
    ],
  },
];

export default function AuthorityLinks() {
  return (
    <section className="py-14 bg-brand border-t border-white/10">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">
            Useful Resources
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white leading-snug mt-2">
            Official government &amp; industry links
          </h2>
          <p className="text-base text-white/60 mt-3 max-w-xl mx-auto leading-relaxed">
            Direct links to the official platforms and professional bodies that govern accounting,
            tax, and business compliance in South Africa.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {AUTHORITY_LINKS.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
                {cat.category}
              </h3>
              <ul className="space-y-4">
                {cat.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2.5"
                    >
                      <ExternalLink
                        size={13}
                        className="text-accent mt-0.5 flex-shrink-0 group-hover:text-accent-light transition-colors"
                      />
                      <span>
                        <span className="block text-sm font-medium text-white group-hover:text-accent-light transition-colors">
                          {link.label}
                        </span>
                        <span className="block text-sm text-white/50 leading-snug mt-0.5">
                          {link.desc}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
