"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Stagger step: 60ms each, capped at 8 steps. */
  delay?: number;
}

const STEP_MS = 60;
const MAX_STEPS = 8;

/*
 * Scroll reveal that never hides server-rendered content.
 *
 * The server HTML (and a no-JS visit) is always fully visible. On mount, only an
 * element whose top is below the viewport is moved to the hidden start state;
 * it is revealed once, when it enters view. Elements already in view on load
 * are left alone, so there is no flash and no layout shift (only opacity and
 * transform change). Reduced motion skips the effect entirely.
 */
export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const steps = Math.min(Math.max(Math.round(delay), 0), MAX_STEPS);
    el.style.setProperty("--reveal-delay", `${steps * STEP_MS}ms`);
    el.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "shown";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
