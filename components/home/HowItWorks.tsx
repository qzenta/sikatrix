const STEPS = [
  {
    number: "01",
    title: "Book a Free Consultation",
    desc: "Tell us about your business. We'll assess your needs, identify compliance gaps, and recommend the right service package.",
  },
  {
    number: "02",
    title: "We Set Up Your System",
    desc: "We onboard you to the right cloud platform (QuickBooks, Xero, or Sage), migrate your data, and establish your reporting structure.",
  },
  {
    number: "03",
    title: "We Handle the Numbers",
    desc: "Monthly bookkeeping, payroll, VAT returns and PAYE. Every deadline met, every submission filed — you focus on your business.",
  },
  {
    number: "04",
    title: "You Get Clarity & Growth",
    desc: "Monthly management accounts, tax planning advice, and one accountant who knows your file. Clear numbers, confident decisions.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-page">
        <div className="text-center mb-12">
          <span className="section-label">How It Works</span>
          <h2 className="section-title mt-2">Simple, structured, and transparent</h2>
          <p className="section-subtitle mt-3 mx-auto">
            From first contact to monthly management accounts. A clear process designed around your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-px bg-neutral-200" />
              )}
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center text-lg font-semibold mb-4 mx-auto lg:mx-0">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{step.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
