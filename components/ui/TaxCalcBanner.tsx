"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calculator, X } from "lucide-react";

const STORAGE_KEY = "taxBannerDismissed";

export default function TaxCalcBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setVisible(true), 3500);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 right-6 z-[200] w-56 rounded-xl bg-white/90 backdrop-blur-sm shadow-md ring-1 ring-neutral-200 overflow-hidden animate-slide-up"
      role="complementary"
      aria-label="Tax calculator promotion"
    >
      {/* Accent strip */}
      <div className="h-0.5 w-full bg-gradient-to-r from-accent to-accent-light" />

      <div className="p-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5">
            <Calculator size={13} className="text-accent" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
              Free Tool
            </span>
          </div>
          <button
            onClick={dismiss}
            className="text-neutral-400 hover:text-neutral-700 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X size={12} />
          </button>
        </div>

        <p className="text-xs font-semibold text-neutral-800 leading-snug mb-1">
          2026/27 Tax Calculator
        </p>
        <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">
          Calculate your PAYE and take-home pay instantly.
        </p>

        <Link
          href="/tools/tax-calculator"
          onClick={dismiss}
          className="block w-full text-center text-[11px] font-semibold bg-accent hover:bg-accent/90 text-white rounded-md py-1.5 transition-colors"
        >
          Calculate now →
        </Link>
      </div>
    </div>
  );
}
