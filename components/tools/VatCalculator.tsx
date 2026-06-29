"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, Info } from "lucide-react";

const VAT_RATE = 0.15;

type Mode = "add" | "remove" | "split";

function fmt(n: number) {
  return `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function VatCalculator() {
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState<Mode>("add");

  const result = useMemo(() => {
    const val = parseFloat(amount.replace(/,/g, ""));
    if (!val || isNaN(val) || val <= 0) return null;
    if (mode === "add") {
      const vat = val * VAT_RATE;
      return { label: "Total (VAT-inclusive)", vat, total: val + vat, excl: val };
    } else if (mode === "remove") {
      const excl = val / (1 + VAT_RATE);
      const vat = val - excl;
      return { label: "Amount excl. VAT", vat, total: val, excl };
    } else {
      // split: given total, show both components
      const excl = val / (1 + VAT_RATE);
      const vat = val - excl;
      return { label: "VAT component", vat, total: val, excl };
    }
  }, [amount, mode]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-brand px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Calculator size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">VAT Calculator — South Africa</h2>
          <p className="text-xs text-brand-100">Standard VAT rate: 15% (SARS)</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Mode tabs */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">I want to</p>
          <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
            {[
              { key: "add",    label: "Add VAT" },
              { key: "remove", label: "Remove VAT" },
              { key: "split",  label: "Split VAT" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setMode(opt.key as Mode)}
                className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                  mode === opt.key
                    ? "bg-brand text-white"
                    : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            {mode === "add" && "Enter an amount excluding VAT — we'll calculate the VAT and total."}
            {mode === "remove" && "Enter a VAT-inclusive amount — we'll extract the VAT and show the net."}
            {mode === "split" && "Enter any VAT-inclusive total — we'll show the VAT and excl. components."}
          </p>
        </div>

        {/* Input */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            {mode === "add" ? "Amount excl. VAT (R)" : "Amount incl. VAT (R)"}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">R</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full pl-8 pr-4 py-3 text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
            />
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-xl bg-brand-dark text-white p-5 space-y-3">
            <p className="text-2xs font-semibold uppercase tracking-widest text-brand-100 mb-1">Result</p>

            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm text-brand-100">Amount excl. VAT</span>
              <span className="text-sm font-semibold">{fmt(result.excl)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm text-brand-100">VAT @ 15%</span>
              <span className="text-sm font-semibold text-accent-light">{fmt(result.vat)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-white">Total incl. VAT</span>
              <span className="text-xl font-bold text-accent-light">{fmt(result.total)}</span>
            </div>
          </div>
        )}

        {/* Info note */}
        <div className="flex gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-100">
          <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            South Africa's standard VAT rate is <strong>15%</strong>. Zero-rated supplies (basic foods,
            exports) and exempt supplies (residential rent, certain financial services) are calculated
            differently.{" "}
            <Link href="/services/tax-services" className="underline font-medium">
              Consult a tax practitioner
            </Link>{" "}
            for complex VAT scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}
