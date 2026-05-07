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
    <section className="py-16 bg-neutral-50">
      <div className="container-page">
        <div className="text-center mb-10">
          <span className="section-label">Testimonials</span>
          <h2 className="section-title mt-2">{title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((t, i) => (
            <div key={i} className="card p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} size={12} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed mb-4">"{t.body}"</p>
              <div>
                <div className="text-sm font-semibold text-neutral-900">{t.name}</div>
                <div className="text-xs text-neutral-400">{t.role}</div>
                <div className="text-xs text-brand mt-0.5">{t.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
