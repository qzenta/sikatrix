"use client";

import { useState, useMemo } from "react";
import { ClipboardList, Info } from "lucide-react";
import Link from "next/link";

function fmt(n: number) {
  return `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// 2026/27 SARS tax calculation
function calcTax(taxable: number): number {
  const brackets = [
    { min: 0,        max: 245100,   base: 0,       rate: 0.18 },
    { min: 245101,   max: 383100,   base: 44118,   rate: 0.26 },
    { min: 383101,   max: 530200,   base: 79998,   rate: 0.31 },
    { min: 530201,   max: 695800,   base: 125599,  rate: 0.36 },
    { min: 695801,   max: 887000,   base: 185215,  rate: 0.39 },
    { min: 887001,   max: 1878600,  base: 259783,  rate: 0.41 },
    { min: 1878601,  max: Infinity, base: 666339,  rate: 0.45 },
  ];
  const b = brackets.find((br) => taxable >= br.min && taxable <= br.max) ?? brackets[brackets.length - 1];
  return b.base + (taxable - b.min) * b.rate;
}

const PRIMARY_REBATE = 17820;
const PENALTY_THRESHOLD = 0.9; // must pay ≥90% of actual to avoid 20% penalty

export default function ProvisionalTaxCalculator() {
  const [taxableIncome, setTaxableIncome] = useState("");
  const [paye, setPaye] = useState("");
  const [period, setPeriod] = useState<"1st" | "2nd">("1st");

  const result = useMemo(() => {
    const income = parseFloat(taxableIncome.replace(/,/g, ""));
    const payeDeducted = parseFloat(paye.replace(/,/g, "") || "0");
    if (!income || isNaN(income) || income <= 0) return null;

    const grossTax = Math.max(0, calcTax(income) - PRIMARY_REBATE);
    const taxAfterPAYE = Math.max(0, grossTax - payeDeducted);
    const p1 = taxAfterPAYE / 2;   // 1st period: 50% of estimated annual liability
    const p2 = taxAfterPAYE;        // 2nd period: 100% of estimated (cumulative)
    const minSafeAmount = grossTax * PENALTY_THRESHOLD;
    const penaltyRisk = taxAfterPAYE < minSafeAmount - payeDeducted;

    return {
      grossTax,
      taxAfterPAYE,
      p1,
      p2,
      minSafe: minSafeAmount,
      penaltyRisk,
      effectiveRate: ((grossTax / income) * 100).toFixed(1),
    };
  }, [taxableIncome, paye]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-brand px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <ClipboardList size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">Provisional Tax Estimator</h2>
          <p className="text-xs text-brand-100">2026/27 tax year · IRP6 submissions</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Period selector */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">IRP6 Submission</p>
          <div className="flex rounded-lg border border-neutral-200 overflow-hidden">
            {[
              { key: "1st", label: "1st Period (Aug 2026)" },
              { key: "2nd", label: "2nd Period (Feb 2027)" },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setPeriod(opt.key as "1st" | "2nd")}
                className={`flex-1 text-sm font-medium py-2.5 transition-colors ${
                  period === opt.key ? "bg-brand text-white" : "text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Estimated annual taxable income (R)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">R</span>
              <input
                type="number"
                min="0"
                value={taxableIncome}
                onChange={(e) => setTaxableIncome(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              PAYE already deducted this year (R)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-400">R</span>
              <input
                type="number"
                min="0"
                value={paye}
                onChange={(e) => setPaye(e.target.value)}
                placeholder="0"
                className="w-full pl-8 pr-3 py-3 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="rounded-xl bg-brand-dark text-white p-5 space-y-3">
            <p className="text-2xs font-semibold uppercase tracking-widest text-brand-100 mb-1">Estimated IRP6 Payment</p>

            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm text-brand-100">Gross tax liability (2026/27)</span>
              <span className="text-sm font-semibold">{fmt(result.grossTax)}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm text-brand-100">Less: PAYE deducted</span>
              <span className="text-sm font-semibold text-red-300">-{fmt(parseFloat(paye || "0"))}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-sm text-brand-100">Balance to pay via provisional tax</span>
              <span className="text-sm font-semibold">{fmt(result.taxAfterPAYE)}</span>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-base font-bold text-white">
                {period === "1st" ? "1st period payment (50%)" : "2nd period payment (100%)"}
              </span>
              <span className="text-xl font-bold text-accent-light">
                {fmt(period === "1st" ? result.p1 : result.p2)}
              </span>
            </div>

            <div className="mt-2 pt-3 border-t border-white/10 flex justify-between text-xs text-brand-100">
              <span>Effective tax rate</span>
              <span className="font-semibold text-white">{result.effectiveRate}%</span>
            </div>
          </div>
        )}

        {!result && (
          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-5 text-center">
            <ClipboardList size={28} className="text-neutral-300 mx-auto mb-2" />
            <p className="text-sm text-neutral-400">Enter your estimated taxable income above to see your IRP6 payment.</p>
          </div>
        )}

        {/* Info */}
        <div className="flex gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-100">
          <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Underpayment of provisional tax by more than 10% of actual liability triggers a <strong>20% penalty</strong> plus interest.{" "}
            <Link href="/services/tax-services" className="underline font-medium">
              Let us calculate your IRP6 accurately.
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
