"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, Info } from "lucide-react";

type Category = "PAYE" | "VAT" | "Provisional Tax" | "Income Tax" | "CIPC" | "COIDA";

interface Deadline {
  date: string; // ISO yyyy-mm-dd
  title: string;
  category: Category;
  description: string;
  approx?: boolean;
}

const CATEGORY_STYLES: Record<Category, { badge: string; dot: string }> = {
  "PAYE":             { badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-500" },
  "VAT":               { badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-500" },
  "Provisional Tax":   { badge: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  "Income Tax":        { badge: "bg-red-50 text-red-700 border-red-200", dot: "bg-red-500" },
  "CIPC":              { badge: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  "COIDA":             { badge: "bg-teal-50 text-teal-700 border-teal-200", dot: "bg-teal-500" },
};

const CATEGORIES: Category[] = ["PAYE", "VAT", "Provisional Tax", "Income Tax", "CIPC", "COIDA"];

// Compliance calendar, 1 Mar 2026 – 28 Feb 2027 (2026/27 tax year), plus early
// 2027/28-period entries that fall due before this window closes.
// Monthly EMP201 (7th) and VAT201 (25th) dates assume the deadline lands on a
// business day; if it falls on a weekend/public holiday, SARS moves it to the
// preceding business day.
function buildDeadlines(): Deadline[] {
  const months = [
    ["2026-03", "Mar 2026"], ["2026-04", "Apr 2026"], ["2026-05", "May 2026"],
    ["2026-06", "Jun 2026"], ["2026-07", "Jul 2026"], ["2026-08", "Aug 2026"],
    ["2026-09", "Sep 2026"], ["2026-10", "Oct 2026"], ["2026-11", "Nov 2026"],
    ["2026-12", "Dec 2026"], ["2027-01", "Jan 2027"], ["2027-02", "Feb 2027"],
  ] as const;

  const recurring: Deadline[] = months.flatMap(([iso, label]) => [
    {
      date: `${iso}-07`,
      title: "EMP201 due",
      category: "PAYE",
      description: `PAYE, UIF, and SDL for the ${label} payroll period, declared and paid via EMP201.`,
    },
    {
      date: `${iso}-25`,
      title: "VAT201 due",
      category: "VAT",
      description: "Submission deadline for vendors whose VAT period closes this month (Category A/B bi-monthly, or Category C monthly).",
    },
  ]);

  const onceOff: Deadline[] = [
    {
      date: "2026-05-31",
      title: "COIDA Return of Earnings (ROE)",
      category: "COIDA",
      description: "Annual Return of Earnings to the Compensation Fund, covering the period 1 March 2025 – 28 February 2026.",
    },
    {
      date: "2026-05-31",
      title: "EMP501 Annual Reconciliation",
      category: "PAYE",
      description: "Annual employer reconciliation for the 2025/26 tax year (1 March 2025 – 28 February 2026) — EMP501, IRP5/IT3(a) certificates.",
    },
    {
      date: "2026-08-31",
      title: "Provisional Tax — 1st period (IRP6)",
      category: "Provisional Tax",
      description: "First provisional tax payment for the 2026/27 tax year — 50% of your estimated annual liability.",
    },
    {
      date: "2026-10-15",
      title: "Individual filing season deadline (non-provisional)",
      category: "Income Tax",
      description: "Estimated eFiling/branch deadline for non-provisional individual taxpayers for the 2026 tax year. SARS confirms the exact date annually.",
      approx: true,
    },
    {
      date: "2026-10-31",
      title: "EMP501 Interim Reconciliation",
      category: "PAYE",
      description: "Interim employer reconciliation covering 1 March – 31 August 2026.",
    },
    {
      date: "2027-01-31",
      title: "Individual filing season deadline (provisional, eFiling)",
      category: "Income Tax",
      description: "Estimated eFiling deadline for provisional taxpayers for the 2026 tax year. SARS confirms the exact date annually.",
      approx: true,
    },
    {
      date: "2027-02-28",
      title: "Provisional Tax — 2nd period (IRP6) & 2026/27 tax year-end",
      category: "Provisional Tax",
      description: "Second and final provisional tax payment for the 2026/27 tax year, due the same day the tax year closes.",
    },
    {
      date: "2027-09-30",
      title: "Provisional Tax — 3rd period (voluntary top-up)",
      category: "Provisional Tax",
      description: "Optional top-up payment for the 2026/27 tax year to reduce interest if your 1st/2nd period estimates fell short.",
    },
  ];

  return [...recurring, ...onceOff].sort((a, b) => a.date.localeCompare(b.date));
}

const DEADLINES = buildDeadlines();

function daysUntil(iso: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(iso + "T00:00:00");
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function ComplianceCalendar() {
  const [activeFilter, setActiveFilter] = useState<Category | "All">("All");

  const { upcoming, grouped } = useMemo(() => {
    const filtered = activeFilter === "All" ? DEADLINES : DEADLINES.filter((d) => d.category === activeFilter);
    const future = filtered.filter((d) => daysUntil(d.date) >= 0);
    const upcoming = future.slice(0, 3);

    const byMonth = new Map<string, Deadline[]>();
    for (const d of future) {
      const key = d.date.slice(0, 7);
      if (!byMonth.has(key)) byMonth.set(key, []);
      byMonth.get(key)!.push(d);
    }
    return { upcoming, grouped: byMonth };
  }, [activeFilter]);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-brand px-6 py-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <CalendarClock size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-base font-bold text-white">SARS Compliance Calendar — 2026/27</h2>
          <p className="text-xs text-brand-100">Every recurring PAYE, VAT, provisional tax, and reconciliation deadline in one place</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filter chips */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Filter by category</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveFilter("All")}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                activeFilter === "All"
                  ? "bg-brand text-white border-brand"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-brand/40"
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  activeFilter === cat
                    ? "bg-brand text-white border-brand"
                    : `${CATEGORY_STYLES[cat].badge} hover:border-brand/40`
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Next 3 upcoming */}
        {upcoming.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Coming up next</p>
            <div className="grid sm:grid-cols-3 gap-3">
              {upcoming.map((d) => {
                const days = daysUntil(d.date);
                const style = CATEGORY_STYLES[d.category];
                return (
                  <div key={`${d.date}-${d.title}`} className="rounded-xl bg-brand-dark text-white p-4">
                    <span className={`inline-block text-2xs font-semibold px-2 py-0.5 rounded-full border ${style.badge} bg-white/10 border-white/20 text-white mb-2`}>
                      {d.category}
                    </span>
                    <p className="text-sm font-semibold leading-snug">{d.title}</p>
                    <p className="text-2xs text-brand-100 mt-1">{formatDate(d.date)}</p>
                    <p className="text-2xs font-bold text-accent-light mt-2">
                      {days === 0 ? "Due today" : days === 1 ? "Due tomorrow" : `${days} days away`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Full timeline, grouped by month */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Full calendar</p>
          <div className="space-y-5 max-h-[520px] overflow-y-auto pr-1">
            {[...grouped.entries()].map(([monthKey, items]) => (
              <div key={monthKey}>
                <p className="text-2xs font-bold text-neutral-400 uppercase tracking-widest mb-2 sticky top-0 bg-white py-1">
                  {new Date(monthKey + "-01T00:00:00").toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
                </p>
                <ul className="space-y-2">
                  {items.map((d) => {
                    const style = CATEGORY_STYLES[d.category];
                    return (
                      <li key={`${d.date}-${d.title}`} className="flex gap-3 items-start border border-neutral-100 rounded-lg p-3">
                        <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${style.dot}`} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-neutral-900">{d.title}</span>
                            <span className={`text-2xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}>{d.category}</span>
                            {d.approx && (
                              <span className="text-2xs font-medium px-2 py-0.5 rounded-full border bg-neutral-50 text-neutral-500 border-neutral-200">approx.</span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{formatDate(d.date)}</p>
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">{d.description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {grouped.size === 0 && (
              <p className="text-sm text-neutral-500 py-6 text-center">No upcoming deadlines in this category for the current window.</p>
            )}
          </div>
        </div>

        {/* Info note */}
        <div className="flex gap-2.5 p-3.5 rounded-lg bg-amber-50 border border-amber-100">
          <Info size={14} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            This calendar covers the standard recurring deadlines that apply to most SME taxpayers.
            It does not include <strong>CIPC Annual Returns</strong>, which fall due 30 business days
            after your specific company's registration anniversary, or <strong>Annual Financial
            Statement</strong> deadlines, which depend on your entity's financial year-end.{" "}
            <Link href="/services/company-secretarial" className="underline font-medium">
              Talk to us
            </Link>{" "}
            about your specific dates.
          </p>
        </div>
      </div>
    </div>
  );
}
