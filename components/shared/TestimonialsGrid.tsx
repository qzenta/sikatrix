import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/site";

interface TestimonialsGridProps {
  limit?: number;
  title?: string;
}

export default function TestimonialsGrid({
  limit = 4,
  title = "What our clients say",
}: TestimonialsGridProps) {
  const items = TESTIMONIALS.slice(0, limit);

  return (
    <section className="py-16 bg-slate-800">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-light block mb-2">Testimonials</span>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-snug">{title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((t, i) => (
            <div key={i} className="rounded-xl bg-white/5 border border-white/10 p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} size={12} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-neutral-300 leading-relaxed mb-4">"{t.body}"</p>
              <div>
                <div className="text-sm font-semibold text-white">{t.name}</div>
                <div className="text-xs text-neutral-500">{t.role}</div>
                <div className="text-xs text-accent-light mt-0.5">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
