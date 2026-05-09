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
      className="fixed bottom-20 right-6 z-[200] w-72 rounded-2xl bg-brand-dark shadow-2xl ring-1 ring-white/10 overflow-hidden animate-slide-up"
      role="complementary"
      aria-label="Tax calculator promotion"
    >
      {/* Accent strip */}
      <div className="h-1 w-full bg-gradient-to-r from-accent to-accent-light" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Calculator size={16} className="text-accent-light" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-accent-light">
              Free Tool
            </span>
          </div>
          <button
            onClick={dismiss}
            className="text-neutral-500 hover:text-white transition-colors flex-shrink-0 -mt-0.5"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>

        <h3 className="text-sm font-bold text-white leading-snug mb-1">
          ⚡ 2026/27 Tax Calculator
        </h3>
        <p className="text-xs text-neutral-400 leading-relaxed mb-4">
          Know your PAYE, take-home pay, and effective tax rate in seconds — no sign-up needed.
        </p>

        <Link
          href="/tools/tax-calculator"
          onClick={dismiss}
          className="block w-full text-center text-xs font-semibold bg-accent hover:bg-accent/90 text-white rounded-lg py-2.5 transition-colors"
        >
          Calculate now →
        </Link>
      </div>
    </div>
  );
}
