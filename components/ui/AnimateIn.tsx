"use client";
import Reveal from "@/components/Reveal";

interface Props {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms, converted to Reveal's 60ms stagger steps. */
  delay?: number;
}

// Kept for existing call sites. Delegates to Reveal so server HTML is never hidden.
export function AnimateIn({ children, className = "", delay = 0 }: Props) {
  return (
    <Reveal className={className} delay={Math.round(delay / 60)}>
      {children}
    </Reveal>
  );
}
