"use client";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";
import { useEffect, useRef, useState } from "react";
import { AnimateIn } from "@/components/ui/AnimateIn";

interface TestimonialsGridProps {
  limit?: number;
  title?: string;
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[0] }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-6 h-full">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: t.rating }).map((_, s) => (
          <Star key={s} size={14} className="fill-accent text-accent" />
        ))}
      </div>
      <p className="text-sm text-neutral-300 leading-relaxed mb-4">"{t.body}"</p>
      <div>
        <div className="text-sm font-semibold text-white">{t.name}</div>
        <div className="text-sm text-neutral-400">{t.role}</div>
        <div className="text-sm text-accent-light mt-0.5">{t.location}</div>
      </div>
    </div>
  );
}

export default function TestimonialsGrid({
  limit = 4,
  title = "What our clients say",
}: TestimonialsGridProps) {
  const items = TESTIMONIALS.slice(0, limit);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const goTo = (index: number) => {
    const container = carouselRef.current;
    if (!container) return;
    const card = container.children[index] as HTMLElement;
    if (card) container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    setCurrent(index);
  };

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent(prev => {
        const next = (prev + 1) % items.length;
        const container = carouselRef.current;
        if (container) {
          const card = container.children[next] as HTMLElement;
          if (card) container.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [items.length, paused]);

  return (
    <section className="py-20 md:py-28 bg-slate-800">
      <div className="container-page">
        <AnimateIn className="text-center mb-12 md:mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-light border-b-2 border-accent-light pb-0.5 inline-block mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-snug">{title}</h2>
        </AnimateIn>

        {/* Mobile: auto-scrolling carousel */}
        <div className="sm:hidden">
          <div
            ref={carouselRef}
            className="relative flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide"
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {items.map((t, i) => (
              <div key={i} className="snap-center shrink-0 w-[85vw]">
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center items-center gap-2 mt-5">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => { setPaused(true); goTo(i); setTimeout(() => setPaused(false), 5000); }}
                className={`rounded-full transition-all duration-300 h-2 ${
                  i === current ? "bg-accent w-6" : "bg-white/30 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: staggered grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((t, i) => (
            <AnimateIn key={i} delay={i * 100}>
              <TestimonialCard t={t} />
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
