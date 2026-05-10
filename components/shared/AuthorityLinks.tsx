import Link from "next/link";
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
    category: "Cloud Accounting Platforms",
    links: [
      { label: "QuickBooks Online", href: "https://quickbooks.intuit.com/za/", desc: "Cloud accounting for South African SMEs." },
      { label: "Xero South Africa", href: "https://www.xero.com/za/", desc: "Online accounting software for small businesses." },
      { label: "Sage Business Cloud", href: "https://www.sage.com/en-za/", desc: "SA-specific payroll and accounting platform." },
    ],
  },
];

export default function AuthorityLinks() {
  return (
    <section className="py-14 bg-neutral-50 border-t border-neutral-100">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="section-label">Useful Resources</span>
          <h2 className="section-title mt-2">Official government &amp; industry links</h2>
          <p className="text-sm text-neutral-500 mt-3 max-w-xl mx-auto">
            Direct links to the official platforms and professional bodies that govern accounting,
            tax, and business compliance in South Africa.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {AUTHORITY_LINKS.map((cat) => (
            <div key={cat.category}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                {cat.category}
              </h3>
              <ul className="space-y-3">
                {cat.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-2"
                    >
                      <ExternalLink
                        size={13}
                        className="text-brand mt-0.5 flex-shrink-0 group-hover:text-accent transition-colors"
                      />
                      <span>
                        <span className="block text-sm font-medium text-neutral-800 group-hover:text-brand transition-colors">
                          {link.label}
                        </span>
                        <span className="block text-xs text-neutral-400 leading-snug mt-0.5">
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

        {/* Embed / backlink widget */}
        <div className="mt-12 rounded-xl border border-brand/15 bg-white p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                Embed our free Tax Calculator on your website
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                If you run a South African business blog, HR platform, or directory, you can embed
                our free 2026/27 SARS Tax Calculator on your site — at no cost. Just paste the
                snippet below into your page.
              </p>
              <pre className="bg-neutral-100 rounded-lg p-4 text-xs text-neutral-700 overflow-x-auto whitespace-pre-wrap break-all">
                {`<iframe\n  src="https://www.sikatrix.com/tools/tax-calculator"\n  width="100%"\n  height="680"\n  style="border:none;border-radius:12px;"\n  title="2026/27 SARS Tax Calculator — Sikatrix Business Accountants"\n  loading="lazy"\n></iframe>\n<p style="font-size:11px;color:#666;margin-top:4px;">\n  Powered by <a href="https://www.sikatrix.com" target="_blank">Sikatrix Business Accountants</a>\n</p>`}
              </pre>
            </div>
            <div className="md:w-56 flex-shrink-0">
              <div className="rounded-lg bg-brand/5 border border-brand/10 p-4 text-xs text-neutral-600 leading-relaxed">
                <p className="font-semibold text-neutral-800 mb-2">Why embed it?</p>
                <ul className="space-y-1.5">
                  <li>✓ Free tool for your visitors</li>
                  <li>✓ Always up-to-date SARS rates</li>
                  <li>✓ No sign-up required</li>
                  <li>✓ Links back to sikatrix.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
