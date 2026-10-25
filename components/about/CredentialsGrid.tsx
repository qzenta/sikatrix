import Reveal from "@/components/Reveal";

const CREDENTIALS = [
  {
    badge: "SAIPA",
    title: "Professional Accountant (SA)",
    desc: "Registered member of the South African Institute of Professional Accountants — your assurance of professional and ethical practice.",
    color: "bg-brand",
  },
  {
    badge: "SARS",
    title: "Registered Tax Practitioner",
    desc: "Officially registered with the South African Revenue Service to act as your tax practitioner and submit on your behalf.",
    color: "bg-accent",
  },
  {
    badge: "IBASA",
    title: "Registered Business Adviser",
    desc: "Member of the Institute of Business Advisors Southern Africa — qualified to provide structured business advisory and mentorship services to SMEs.",
    color: "bg-brand-dark",
  },
  {
    badge: "Cloud",
    title: "Cloud Accounting Specialist",
    desc: "Certified on QuickBooks, Xero, and Sage — bringing you real-time financial management without the spreadsheet chaos.",
    color: "bg-neutral-700",
  },
];

export default function CredentialsGrid() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
      {CREDENTIALS.map((c, i) => (
        <Reveal key={c.badge} delay={i * 2}>
          <div className="card p-6 h-full">
          <div className={`inline-block px-2.5 py-1 rounded ${c.color} text-white text-xs font-bold mb-3`}>
            {c.badge}
          </div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-2">{c.title}</h3>
          <p className="text-xs text-neutral-500 leading-relaxed">{c.desc}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
