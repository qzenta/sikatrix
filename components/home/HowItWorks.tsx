import Image from "next/image";
import { AnimateIn } from "@/components/ui/AnimateIn";

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
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="container-page">
        <AnimateIn className="text-center mb-12 md:mb-16">
          <span className="section-label">How It Works</span>
          <h2 className="section-title mt-2">Simple, structured, and transparent</h2>
          <p className="section-subtitle mt-3 mx-auto">
            From first contact to monthly management accounts. A clear process designed around your business.
          </p>
        </AnimateIn>

        {/* Context image */}
        <AnimateIn className="relative h-52 sm:h-64 rounded-2xl overflow-hidden mb-12">
          <Image
            src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=600&dpr=1"
            alt="Diverse South African team including a Black male professional in a cloud accounting consultation"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8">
            <p className="text-white font-semibold text-lg sm:text-xl max-w-xs leading-snug">
              Up and running within <span className="text-accent-light">30 days</span> of your first call.
            </p>
          </div>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 100}>
              <div className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-2rem)] h-px bg-neutral-200" />
                )}
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-full border-2 border-brand bg-white text-accent font-bold flex items-center justify-center text-lg mb-4 mx-auto lg:mx-0">
                    {step.number}
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
