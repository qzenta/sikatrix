"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Phone, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { SITE } from "@/lib/site";

function StatCounter({ raw, label }: { raw: string; label: string }) {
  const num = parseInt(raw.replace(/\D/g, ""), 10);
  const suffix = raw.replace(/[0-9]/g, "");
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * num));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [started, num]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-xl font-semibold text-accent-light">{count}{suffix}</div>
      <div className="text-xs text-brand-100 mt-0.5">{label}</div>
    </div>
  );
}

const SLIDES = [
  {
    tag: "Alberton · Johannesburg · Gauteng",
    heading: "Accounting That Works",
    highlight: "for Your World",
    body: "A modern, cloud-based accounting and compliance partner for South African SMEs. Professional. Responsive. Transparent.",
    points: [
      "SAIPA Registered Professional Accountant",
      "SARS Registered Tax Practitioner",
    ],
    bgImage: "/hero/slide-1.png",
    bgPosition: "center center",
  },
  {
    tag: "SARS Registered Tax Practitioner",
    heading: "Tax Compliance,",
    highlight: "Handled for You",
    body: "From provisional tax submissions to VAT returns and SARS dispute resolution — every deadline met, every time.",
    points: [
      "ITR12 & ITR14 returns filed on time",
      "Provisional tax calculated & submitted",
    ],
    bgImage: "/hero/slide-2.png",
    bgPosition: "center top",
  },
  {
    tag: "QuickBooks · Xero · Sage",
    heading: "Real-Time Financials,",
    highlight: "Anywhere",
    body: "Cloud accounting setup, migration, and ongoing management — so you always know where your business stands.",
    points: [
      "Setup & migration managed end-to-end",
      "Bank feeds, reconciliations & management accounts",
    ],
    bgImage: "/hero/slide-3.png",
    bgPosition: "center center",
  },
];

const STATS = [
  { value: "148+", label: "Happy Clients" },
  { value: "10+", label: "Years Experience" },
  { value: "8+",  label: "Core Services" },
  { value: "100%", label: "Cloud-Based" },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  const goTo = (index: number) => {
    setVisible(false);
    setTimeout(() => {
      setCurrent(index);
      setVisible(true);
    }, 400);
  };

  const next = () => goTo((current + 1) % SLIDES.length);
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);

  // Auto-advance — resets whenever slide changes
  useEffect(() => {
    const t = setTimeout(next, 6000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative bg-brand-dark overflow-hidden">

      {/* ── Background image (fades with slide) ── */}
      <div
        className="absolute inset-0 bg-cover transition-opacity duration-700 ease-in-out"
        style={{
          backgroundImage: `url(${slide.bgImage})`,
          backgroundPosition: slide.bgPosition,
          opacity: visible ? 1 : 0,
        }}
      />

      {/* ── Gradient overlays — ensures text stays readable on any photo ── */}
      {/* Strong left-side cover fades to semi-transparent on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/95 via-brand-dark/85 to-brand-dark/55" />
      {/* Bottom fade into stats bar */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-brand-dark/80 to-transparent" />
      {/* Subtle dot grid texture */}
      <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:30px_30px]" />
      {/* Accent glow */}
      <div className="absolute -top-40 -right-40 w-[520px] h-[520px] bg-brand-light/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page relative py-20 md:py-28 lg:py-32">
        {/* Slide content */}
        <div
          className="max-w-2xl transition-opacity duration-400 ease-in-out"
          style={{ opacity: visible ? 1 : 0 }}
        >
          <span className="inline-block text-accent-light text-xs font-semibold uppercase tracking-widest mb-4">
            {slide.tag}
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight mb-5 text-balance">
            {slide.heading}{" "}
            <span className="text-accent-light">{slide.highlight}</span>
          </h1>

          <p className="text-base md:text-lg text-brand-100 leading-relaxed mb-7 max-w-xl">
            {slide.body}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
            {slide.points.map((p) => (
              <li key={p} className="flex items-center gap-1.5 text-sm text-brand-100">
                <CheckCircle size={13} className="text-accent-light flex-shrink-0" />
                {p}
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/contact" className="btn-primary text-sm px-6 py-3">
              Book Free Consultation
              <ArrowRight size={14} />
            </Link>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md border border-white/25 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              <Phone size={14} />
              {SITE.phone}
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mt-10">
          {/* Dots */}
          <div className="flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-accent"
                    : "w-1.5 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-1.5 ml-2">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={next}
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-white/50 hover:text-white transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar — fixed, not part of carousel */}
      <div className="border-t border-white/10 bg-black/25 relative">
        <div className="container-page py-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s) => (
              <StatCounter key={s.label} raw={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
