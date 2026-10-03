"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ChevronRight, AlertCircle } from "lucide-react";
import { TAX_YEARS, calculateIncomeTax, type TaxYear, type AgeGroup } from "@/lib/rules/income-tax";

const ALL_TAX_DATA = TAX_YEARS;

function fmt(n: number): string {
  return "R " + Math.round(n).toLocaleString("en-ZA");
}
function pct(n: number): string {
  return n.toFixed(1) + "%";
}
function parseInput(val: string): number {
  return parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
}

const calculate = calculateIncomeTax;

export default function TaxCalculator() {
  const [taxYear, setTaxYear]     = useState<TaxYear>("2026/27");
  const [income, setIncome]       = useState("");
  const [age, setAge]             = useState<AgeGroup>("under65");
  const [medMembers, setMedMembers] = useState(0);
  const [raContrib, setRaContrib] = useState("");

  const d         = ALL_TAX_DATA[taxYear];
  const incomeNum = parseInput(income);
  const raNum     = parseInput(raContrib);

  const result = useMemo(
    () => calculate(incomeNum, age, medMembers, raNum, d),
    [incomeNum, age, medMembers, raNum, d]
  );

  const hasIncome    = incomeNum > 0;
  const activeBracket = hasIncome
    ? d.brackets.find((b) => result.taxableIncome >= b.min && result.taxableIncome <= b.max)
    : null;

  return (
    <div data-clarity-mask="True" className="bg-neutral-100 rounded-2xl border border-neutral-200 p-5 md:p-7">

      {/* ── Year selector ── */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-semibold text-neutral-500">Tax year:</span>
        {(Object.keys(ALL_TAX_DATA) as TaxYear[]).map((y) => (
          <button
            key={y}
            data-clarity-mask="True"
            onClick={() => setTaxYear(y)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              taxYear === y
                ? "bg-brand text-white border-brand"
                : "bg-white border-neutral-200 text-neutral-500 hover:border-brand/40"
            }`}
          >
            {y}
          </button>
        ))}
        <span className="text-2xs text-neutral-400">{d.period}</span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">

        {/* ── INPUTS ── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Calculator size={16} className="text-brand" />
              <h2 className="font-semibold text-neutral-900 text-sm">Your details</h2>
            </div>

            {/* Income */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Annual gross income (before tax)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">R</span>
                <input
                  type="text"
                  inputMode="numeric"
                  data-clarity-mask="True"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="500 000"
                  className="w-full pl-8 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                />
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-2">Your age</label>
              <div className="grid grid-cols-3 gap-2">
                {(["under65", "65-74", "75+"] as AgeGroup[]).map((a) => (
                  <button
                    key={a}
                    data-clarity-mask="True"
                    onClick={() => setAge(a)}
                    className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                      age === a
                        ? "bg-brand border-brand text-white"
                        : "border-neutral-200 text-neutral-600 hover:border-brand/40"
                    }`}
                  >
                    {a === "under65" ? "Under 65" : a === "65-74" ? "65 – 74" : "75 +"}
                  </button>
                ))}
              </div>
            </div>

            {/* Medical aid */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Medical aid members (including yourself)
              </label>
              <select
                data-clarity-mask="True"
                value={medMembers}
                onChange={(e) => setMedMembers(Number(e.target.value))}
                className="w-full border border-neutral-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors bg-white"
              >
                <option value={0}>Not on medical aid</option>
                <option value={1}>1 person (main member only)</option>
                <option value={2}>2 people</option>
                <option value={3}>3 people</option>
                <option value={4}>4 people</option>
                <option value={5}>5 people</option>
                <option value={6}>6+ people</option>
              </select>
            </div>

            {/* RA contribution */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                Annual RA / pension contributions{" "}
                <span className="font-normal text-neutral-400">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">R</span>
                <input
                  type="text"
                  inputMode="numeric"
                  data-clarity-mask="True"
                  value={raContrib}
                  onChange={(e) => setRaContrib(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
                />
              </div>
              <p className="text-2xs text-neutral-400 mt-1">
                Deduction capped at 27.5% of income or R{d.retirement.cap.toLocaleString("en-ZA")}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 mb-2">Not sure which deductions apply to you?</p>
              <Link href="/contact" className="btn-primary w-full justify-center text-xs">
                Book a free consultation
              </Link>
            </div>
          </div>
        </div>

        {/* ── RESULTS ── */}
        <div className="lg:col-span-3" data-clarity-mask="True">
          {!hasIncome ? (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-10 text-center text-neutral-400 flex flex-col items-center gap-3">
              <Calculator size={36} className="opacity-20" />
              <p className="text-sm">Enter your annual gross income to see your estimated tax</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Take-home hero */}
              <div className="rounded-xl bg-brand-dark text-white p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-100 mb-1">
                  Estimated monthly take-home
                </p>
                <p className="text-3xl font-bold text-white mb-0.5">
                  {fmt(result.monthlyTakeHome)}
                </p>
                <p className="text-xs text-brand-100">
                  {fmt(result.annualTakeHome)} per year · after tax &amp; UIF · {d.label}
                </p>
                {result.belowThreshold && (
                  <div className="mt-3 flex items-start gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <AlertCircle size={13} className="text-accent-light mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-brand-100">
                      Your income falls below the {d.label} tax threshold — no income tax is payable.
                    </p>
                  </div>
                )}
              </div>

              {/* Breakdown grid */}
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: "Annual tax (PAYE)", value: fmt(result.netTax),        sub: fmt(result.monthlyPAYE) + "/month" },
                  { label: "Effective tax rate", value: pct(result.effectiveRate), sub: "of gross income" },
                  { label: "UIF contribution",   value: fmt(result.uifAnnual),    sub: fmt(result.uifMonthly) + "/month" },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl border border-neutral-200 shadow-sm p-4">
                    <p className="text-2xs text-neutral-400 mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-neutral-900">{item.value}</p>
                    <p className="text-2xs text-neutral-400">{item.sub}</p>
                  </div>
                ))}
              </div>

              {/* Detailed breakdown */}
              <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
                <h3 className="text-xs font-semibold text-neutral-900 mb-4">Tax calculation breakdown</h3>
                <div className="space-y-2 text-xs">
                  {[
                    { label: "Gross annual income",       value: fmt(incomeNum),              muted: false },
                    ...(result.raDeduction > 0
                      ? [{ label: "Less: RA / pension deduction", value: `– ${fmt(result.raDeduction)}`, muted: true }]
                      : []),
                    { label: "Taxable income",            value: fmt(result.taxableIncome),   muted: false },
                    { label: "Gross tax (from bracket)",  value: fmt(result.grossTax),        muted: true },
                    { label: "Less: Primary rebate",      value: `– ${fmt(result.rebate)}`,   muted: true },
                    ...(result.medCredit > 0
                      ? [{ label: "Less: Medical scheme credit", value: `– ${fmt(result.medCredit)}`, muted: true }]
                      : []),
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-neutral-50">
                      <span className={row.muted ? "text-neutral-500" : "font-medium text-neutral-800"}>
                        {row.label}
                      </span>
                      <span className={row.muted ? "text-neutral-500" : "font-semibold text-neutral-900"}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-neutral-900">Net tax payable</span>
                    <span className="font-bold text-brand">{fmt(result.netTax)}</span>
                  </div>
                </div>

                {activeBracket && !result.belowThreshold && (
                  <div className="mt-4 pt-4 border-t border-neutral-100 flex items-start gap-2">
                    <ChevronRight size={13} className="text-accent mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-neutral-500">
                      Your taxable income falls in the{" "}
                      <span className="font-semibold text-neutral-700">{activeBracket.label}</span>{" "}
                      bracket — marginal rate{" "}
                      <span className="font-semibold text-neutral-700">{(activeBracket.rate * 100).toFixed(0)}%</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="flex items-start gap-2 text-2xs text-neutral-400 px-1">
                <AlertCircle size={11} className="mt-0.5 flex-shrink-0" />
                <span>
                  Estimates only. Does not account for fringe benefits, additional deductions, or allowances. Consult a{" "}
                  <Link href="/contact" className="underline hover:text-brand">registered tax practitioner</Link>{" "}
                  for advice specific to your situation.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
