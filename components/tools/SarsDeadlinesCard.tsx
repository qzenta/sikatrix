"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { generateFixed } from "@/lib/rules/compliance-calendar";

/*
 * Annual SARS deadlines from lib/rules/compliance-calendar.ts (the same engine
 * as /tools/sars-compliance-calendar). Window-opening events are excluded.
 *
 * The server render filters on `buildDate` so static HTML never lists dates
 * that had already passed at build time. After hydration the client re-filters
 * on the visitor's real date.
 */

const LIMIT = 5;

function todayIso(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-ZA", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });
}

export default function SarsDeadlinesCard({ buildDate }: { buildDate: string }) {
  const [today, setToday] = useState(buildDate);

  useEffect(() => {
    setToday(todayIso());
  }, []);

  const upcoming = useMemo(
    () =>
      generateFixed()
        .filter((d) => !d.ruleId.includes("-open-") && d.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, LIMIT),
    [today]
  );

  return (
    <div className="card p-5">
      <p className="text-2xs font-semibold uppercase tracking-widest text-accent mb-4">
        SARS deadlines
      </p>
      {upcoming.length > 0 ? (
        <ul className="space-y-3">
          {upcoming.map((d) => (
            <li key={d.id} className="flex gap-3 items-start pb-3 border-b border-neutral-100 last:border-0 last:pb-0">
              <span className="text-2xs font-semibold text-brand bg-brand-50 px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
                {formatDate(d.date)}
              </span>
              <span className="text-xs text-neutral-600">
                {d.title}
                {d.indicative && <span className="text-neutral-400"> (indicative)</span>}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-neutral-600">No annual deadlines in the current calendar window.</p>
      )}
      <Link href="/tools/sars-compliance-calendar" className="inline-block mt-4 text-xs font-semibold text-brand hover:underline">
        Full calendar, including monthly EMP201 and VAT dates →
      </Link>
    </div>
  );
}
