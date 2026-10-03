/**
 * Compliance calendar rules engine.
 *
 * Deadlines are generated from structured rules, never hand-listed. Each rule
 * carries its source, the weekend/public-holiday adjustment SARS applies to
 * that obligation, an effective date and the date it was last reviewed.
 *
 * Adjustment wording verified against SARS on 2026-10-03:
 *  - EMP201: "If the 7th falls on a weekend or public holiday, you need to submit
 *    your EMP201 together with your payment ... by the last business day before
 *    the weekend or public holiday."
 *  - VAT201: manual by the 25th, eFiling by the last business day of the month;
 *    where the 25th is not a business day the business day preceding it applies.
 *  - SARS calendar general rule: "if the day identified is on a weekend or public
 *    holiday, the applicable date ... is the last business day prior to that date."
 *    Applied to provisional tax (IRP6).
 *  - Filing-season windows (Notice 7422) are published dates, not computed due
 *    dates, so no adjustment is applied to them.
 */

import { adjustDueDate, addDays, lastBusinessDayOfMonth, type Adjustment } from "./public-holidays";

export type Category = "PAYE" | "VAT" | "Provisional Tax" | "Income Tax" | "CIPC" | "COIDA";
export const CATEGORIES: Category[] = ["PAYE", "VAT", "Provisional Tax", "Income Tax", "CIPC", "COIDA"];

export type VatCategory = "A" | "B" | "C" | "D" | "micro4";
export type VatMethod = "efiling" | "manual";

export interface RuleSource {
  title: string;
  url: string;
  gazette?: string;
}

export const REVIEWED_ON = "2026-10-03";

const SARS_EMP201: RuleSource = {
  title: "SARS: Completing the monthly employer declaration (EMP201)",
  url: "https://www.sars.gov.za/types-of-tax/pay-as-you-earn/completing-the-monthly-employer-declaration-emp201/",
};
const SARS_VAT201: RuleSource = {
  title: "SARS: Guide to completing the VAT201 return",
  url: "https://www.sars.gov.za/guide-to-completing-the-value-added-tax-vat201-return/",
};
const SARS_VAT_PERIODS: RuleSource = {
  title: "SARS: Tax periods for VAT vendors",
  url: "https://www.sars.gov.za/types-of-tax/value-added-tax/tax-periods-for-vat-vendors/",
};
const SARS_SMALL_BUSINESS_VAT: RuleSource = {
  title: "SARS: Small businesses and VAT (micro business four-month periods)",
  url: "https://www.sars.gov.za/businesses-and-employers/small-businesses-taxpayers/small-businesses-and-vat/",
};
const SARS_CALENDAR: RuleSource = {
  title: "SARS: Calendar",
  url: "https://www.sars.gov.za/individuals/i-need-help-with-my-tax/calendar/",
};
const SARS_FILING_SEASON: RuleSource = {
  title: "SARS: Filing season 2026",
  url: "https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/",
  gazette: "Notice No. 7422, Government Gazette 54598 (30 April 2026)",
};
const SARS_EMP_RECON: RuleSource = {
  title: "SARS: Guide to the employer reconciliation process",
  url: "https://www.sars.gov.za/guide-to-the-employer-reconciliation-process/",
};
const SIKATRIX_COIDA: RuleSource = {
  title: "Sikatrix: COIDA Return of Earnings guide (gazetted 30 June window, owner decision)",
  url: "https://www.sikatrix.com/resources/coida-return-of-earnings-guide-south-africa",
};

export interface WindowRange {
  from: string;
  to: string;
}

/** Display window: the 2026/27 year plus the optional third provisional top-up. */
export const CALENDAR_WINDOW: WindowRange = { from: "2026-03-01", to: "2027-09-30" };
/** Recurring monthly obligations are generated for due months up to here. */
export const RECURRING_UNTIL = "2027-03-31";

export interface FixedRule {
  id: string;
  obligation: string;
  category: Category;
  taxpayer: string;
  period: string;
  /** Plain-language due-date rule. */
  dueRule: string;
  nominal: string;
  adjustment: Adjustment;
  effectiveFrom: string;
  source: RuleSource;
  reviewedOn: string;
  label: string;
  note: string;
  /** True when the date is modelled from SARS's pattern and depends on SARS's annual notice. */
  indicative?: boolean;
  /** Set when the date could not be verified from an official source. */
  unverified?: boolean;
}

export const FIXED_RULES: FixedRule[] = [
  {
    id: "coida-roe-2026",
    obligation: "COIDA Return of Earnings",
    category: "COIDA",
    taxpayer: "Employers registered with the Compensation Fund",
    period: "Annual",
    dueRule: "30 June (gazetted window)",
    nominal: "2026-06-30",
    adjustment: "none",
    effectiveFrom: "2026-03-01",
    source: SIKATRIX_COIDA,
    reviewedOn: REVIEWED_ON,
    label: "COIDA Return of Earnings (ROE)",
    note: "Annual Return of Earnings to the Compensation Fund. The Act's text refers to 31 March; the gazetted window (to 30 June) governs in practice.",
    unverified: true,
  },
  {
    id: "emp501-annual-2026",
    obligation: "EMP501 annual reconciliation",
    category: "PAYE",
    taxpayer: "Employers",
    period: "1 March 2025 to 28 February 2026",
    dueRule: "SARS-published window end (31 May 2026)",
    nominal: "2026-05-31",
    adjustment: "none",
    effectiveFrom: "2026-03-01",
    source: SARS_EMP_RECON,
    reviewedOn: REVIEWED_ON,
    label: "EMP501 Annual Reconciliation",
    note: "Annual employer reconciliation for the 2025/26 tax year, with IRP5/IT3(a) certificates. The 2026 window has closed.",
  },
  {
    id: "emp501-annual-2027",
    obligation: "EMP501 annual reconciliation",
    category: "PAYE",
    taxpayer: "Employers",
    period: "1 March 2026 to 28 February 2027",
    dueRule: "Modelled on the 2026 window (31 May); depends on SARS's annual notice",
    nominal: "2027-05-31",
    adjustment: "none",
    effectiveFrom: "2027-03-01",
    source: SARS_EMP_RECON,
    reviewedOn: REVIEWED_ON,
    label: "EMP501 Annual Reconciliation (2026/27)",
    note: "Indicative only. SARS publishes the annual window each year; confirm the dates in its notice.",
    indicative: true,
  },
  {
    id: "provisional-p1-2026",
    obligation: "Provisional tax, first period (IRP6)",
    category: "Provisional Tax",
    taxpayer: "Provisional taxpayers with a 28/29 February year-end",
    period: "First period of the 2026/27 tax year",
    dueRule: "31 August, or the last business day before it",
    nominal: "2026-08-31",
    adjustment: "preceding",
    effectiveFrom: "2026-03-01",
    source: SARS_CALENDAR,
    reviewedOn: REVIEWED_ON,
    label: "Provisional Tax, 1st period (IRP6)",
    note: "First provisional tax payment for the 2026/27 tax year, 50% of your estimated annual liability. Exact dates depend on the year-end.",
  },
  {
    id: "provisional-p2-2027",
    obligation: "Provisional tax, second period (IRP6)",
    category: "Provisional Tax",
    taxpayer: "Provisional taxpayers with a 28/29 February year-end",
    period: "Second period of the 2026/27 tax year",
    dueRule: "Last day of February, or the last business day before it",
    nominal: "2027-02-28",
    adjustment: "preceding",
    effectiveFrom: "2026-03-01",
    source: SARS_CALENDAR,
    reviewedOn: REVIEWED_ON,
    label: "Provisional Tax, 2nd period (IRP6) and 2026/27 tax year-end",
    note: "Second and final provisional tax payment for the 2026/27 tax year. Exact dates depend on the year-end.",
  },
  {
    id: "provisional-p3-2027",
    obligation: "Provisional tax, third period (voluntary top-up)",
    category: "Provisional Tax",
    taxpayer: "Provisional taxpayers with a 28/29 February year-end",
    period: "Third (optional) period of the 2026/27 tax year",
    dueRule: "30 September, or the last business day before it",
    nominal: "2027-09-30",
    adjustment: "preceding",
    effectiveFrom: "2026-03-01",
    source: SARS_CALENDAR,
    reviewedOn: REVIEWED_ON,
    label: "Provisional Tax, 3rd period (voluntary top-up)",
    note: "Optional top-up for the 2026/27 tax year to reduce interest if the 1st and 2nd period estimates fell short. Dates depend on the year-end.",
  },
  {
    id: "trusts-open-2026",
    obligation: "Trust return filing season opens",
    category: "Income Tax",
    taxpayer: "Trusts",
    period: "2026 tax year",
    dueRule: "SARS-published window start",
    nominal: "2026-09-19",
    adjustment: "none",
    effectiveFrom: "2026-09-19",
    source: SARS_FILING_SEASON,
    reviewedOn: REVIEWED_ON,
    label: "Trust filing season opens",
    note: "Trust returns can be filed from 19 September 2026 until 22 January 2027.",
  },
  {
    id: "emp501-interim-open-2026",
    obligation: "EMP501 interim reconciliation window opens",
    category: "PAYE",
    taxpayer: "Employers",
    period: "1 March to 31 August 2026",
    dueRule: "SARS-published window start",
    nominal: "2026-09-21",
    adjustment: "none",
    effectiveFrom: "2026-09-21",
    source: SARS_FILING_SEASON,
    reviewedOn: REVIEWED_ON,
    label: "EMP501 Interim Reconciliation opens",
    note: "The interim submission window opens on 21 September 2026.",
  },
  {
    id: "itr12-nonprov-2026",
    obligation: "Individual income tax return (ITR12), non-provisional",
    category: "Income Tax",
    taxpayer: "Non-provisional individual taxpayers",
    period: "2026 tax year",
    dueRule: "SARS-published filing-season deadline",
    nominal: "2026-10-23",
    adjustment: "none",
    effectiveFrom: "2026-07-13",
    source: SARS_FILING_SEASON,
    reviewedOn: REVIEWED_ON,
    label: "Individual filing deadline (non-provisional)",
    note: "SARS-published deadline for non-provisional individuals (13 July to 23 October 2026).",
  },
  {
    id: "emp501-interim-close-2026",
    obligation: "EMP501 interim reconciliation",
    category: "PAYE",
    taxpayer: "Employers",
    period: "1 March to 31 August 2026",
    dueRule: "SARS-published window end",
    nominal: "2026-10-31",
    adjustment: "none",
    effectiveFrom: "2026-09-21",
    source: SARS_FILING_SEASON,
    reviewedOn: REVIEWED_ON,
    label: "EMP501 Interim Reconciliation closes",
    note: "Window 21 September to 31 October 2026. 31 October 2026 is a Saturday; SARS publishes the window end as 31 October, so confirm on eFiling and do not leave it to the last day.",
  },
  {
    id: "itr12-provisional-2027",
    obligation: "Income tax return, provisional taxpayers and trusts",
    category: "Income Tax",
    taxpayer: "Provisional taxpayers and trusts",
    period: "2026 tax year",
    dueRule: "SARS-published filing-season deadline",
    nominal: "2027-01-22",
    adjustment: "none",
    effectiveFrom: "2026-07-13",
    source: SARS_FILING_SEASON,
    reviewedOn: REVIEWED_ON,
    label: "Filing deadline: provisional taxpayers and trusts",
    note: "SARS-published deadline for provisional taxpayers (from 13 July 2026) and trusts (from 19 September 2026).",
  },
];

export interface MonthlyRule {
  id: string;
  obligation: string;
  category: Category;
  taxpayer: string;
  period: string;
  dueRule: string;
  day: number;
  adjustment: Adjustment;
  effectiveFrom: string;
  source: RuleSource;
  reviewedOn: string;
  label: string;
  note: string;
}

export const EMP201_RULE: MonthlyRule = {
  id: "emp201-monthly",
  obligation: "EMP201 monthly employer declaration",
  category: "PAYE",
  taxpayer: "Employers",
  period: "Preceding payroll month",
  dueRule: "7th of the following month, or the last business day before it",
  day: 7,
  adjustment: "preceding",
  effectiveFrom: "2026-03-01",
  source: SARS_EMP201,
  reviewedOn: REVIEWED_ON,
  label: "EMP201 due",
  note: "PAYE, UIF and SDL declared and paid.",
};

export interface VatCategoryDef {
  id: VatCategory;
  name: string;
  /** Calendar months (1-12) in which tax periods end. */
  periodEndMonths: number[];
  description: string;
  source: RuleSource;
}

/**
 * Category F (four-monthly) was deleted from 1 July 2015 and existing Category F
 * vendors became Category B. Micro businesses may still elect four-monthly periods.
 * Category E (annual, year-end dependent) cannot be generated without the vendor's
 * year-end, so it is listed as "depends on you" rather than given a date.
 */
export const VAT_CATEGORIES: VatCategoryDef[] = [
  {
    id: "A",
    name: "Category A",
    periodEndMonths: [1, 3, 5, 7, 9, 11],
    description: "Two-monthly; periods end January, March, May, July, September, November.",
    source: SARS_VAT_PERIODS,
  },
  {
    id: "B",
    name: "Category B",
    periodEndMonths: [2, 4, 6, 8, 10, 12],
    description: "Two-monthly; periods end February, April, June, August, October, December.",
    source: SARS_VAT_PERIODS,
  },
  {
    id: "C",
    name: "Category C",
    periodEndMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    description: "Monthly; taxable supplies above R30 million, by written application, or placed by SARS.",
    source: SARS_VAT_PERIODS,
  },
  {
    id: "D",
    name: "Category D",
    periodEndMonths: [2, 8],
    description: "Six-monthly; periods end February and August (or approved alternative months). Mainly farming operations under R1.5 million and registered micro businesses.",
    source: SARS_VAT_PERIODS,
  },
  {
    id: "micro4",
    name: "Micro business, four-monthly",
    periodEndMonths: [2, 6, 10],
    description: "Four-monthly option for registered micro businesses; periods end February, June and October.",
    source: SARS_SMALL_BUSINESS_VAT,
  },
];

export const VAT_METHODS: { id: VatMethod; name: string; dueRule: string }[] = [
  { id: "efiling", name: "eFiling", dueRule: "Last business day of the month after the period ends" },
  { id: "manual", name: "Manual", dueRule: "25th of the month after the period ends, or the business day before it" },
];

export interface DependsOnYou {
  id: string;
  title: string;
  category: Category;
  text: string;
  source?: RuleSource;
}

/** Obligations with no generic date. Rendered as notes, never as invented dates. */
export const DEPENDS_ON_YOU: DependsOnYou[] = [
  {
    id: "cipc-annual-return",
    title: "CIPC annual return",
    category: "CIPC",
    text: "Due within 30 business days after your company's registration anniversary, so the date is different for every company. Check your own anniversary.",
  },
  {
    id: "afs",
    title: "Annual financial statements",
    category: "CIPC",
    text: "Depend on your entity's financial year-end.",
  },
  {
    id: "vat-category-e",
    title: "VAT Category E (annual)",
    category: "VAT",
    text: "Annual tax period ending on the last day of the vendor's year of assessment, so the date depends on your year-end.",
    source: SARS_VAT_PERIODS,
  },
  {
    id: "provisional-company",
    title: "Provisional tax for companies and non-February year-ends",
    category: "Provisional Tax",
    text: "Provisional periods are tied to the year-end. The dates shown assume a 28/29 February year-end.",
    source: SARS_CALENDAR,
  },
];

export interface Deadline {
  id: string;
  ruleId: string;
  /** Date the obligation is actually due, after any weekend/holiday adjustment. */
  date: string;
  nominal: string;
  adjusted: boolean;
  adjustmentReason: string;
  title: string;
  category: Category;
  description: string;
  indicative: boolean;
  unverified: boolean;
  source: RuleSource;
  rule: string;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function monthLabel(yyyyMm: string, short = false): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  const name = MONTHS[m - 1];
  return `${short ? name.slice(0, 3) : name} ${y}`;
}

function shiftMonth(yyyyMm: string, delta: number): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  const t = y * 12 + (m - 1) + delta;
  return `${Math.floor(t / 12)}-${String((t % 12) + 1).padStart(2, "0")}`;
}

/** All yyyy-mm months from `from` to `to` inclusive. */
export function monthsBetween(from: string, to: string): string[] {
  const out: string[] = [];
  let cur = from.slice(0, 7);
  const end = to.slice(0, 7);
  while (cur <= end) {
    out.push(cur);
    cur = shiftMonth(cur, 1);
  }
  return out;
}

function lastDayOf(yyyyMm: string): string {
  return addDays(shiftMonth(yyyyMm, 1) + "-01", -1);
}

function inWindow(date: string, w: WindowRange): boolean {
  return date >= w.from && date <= w.to;
}

export function generateEmp201(window: WindowRange = CALENDAR_WINDOW): Deadline[] {
  const r = EMP201_RULE;
  const to = window.to < RECURRING_UNTIL ? window.to : RECURRING_UNTIL;
  return monthsBetween(window.from, to).map((due) => {
    const adj = adjustDueDate(`${due}-0${r.day}`, r.adjustment);
    const payroll = shiftMonth(due, -1);
    return {
      id: `${r.id}:${due}`,
      ruleId: r.id,
      date: adj.date,
      nominal: adj.nominal,
      adjusted: adj.adjusted,
      adjustmentReason: adj.reason,
      title: r.label,
      category: r.category,
      description: `${r.note} For the ${monthLabel(payroll)} payroll month.`,
      indicative: false,
      unverified: false,
      source: r.source,
      rule: r.dueRule,
    };
  });
}

export function generateVat(
  category: VatCategory,
  method: VatMethod,
  window: WindowRange = CALENDAR_WINDOW
): Deadline[] {
  const def = VAT_CATEGORIES.find((c) => c.id === category);
  if (!def) return [];
  const to = window.to < RECURRING_UNTIL ? window.to : RECURRING_UNTIL;
  const out: Deadline[] = [];
  for (const due of monthsBetween(window.from, to)) {
    const periodEnd = shiftMonth(due, -1);
    const endMonth = Number(periodEnd.split("-")[1]);
    if (!def.periodEndMonths.includes(endMonth)) continue;
    const adj =
      method === "manual"
        ? adjustDueDate(`${due}-25`, "preceding")
        : { nominal: lastDayOf(due), date: lastBusinessDayOfMonth(due), adjusted: false, reason: "" };
    if (method === "efiling") {
      adj.adjusted = adj.date !== adj.nominal;
      adj.reason = adj.adjusted ? "a weekend or public holiday" : "";
    }
    out.push({
      id: `vat201-${category}-${method}:${due}`,
      ruleId: `vat201-${category}-${method}`,
      date: adj.date,
      nominal: adj.nominal,
      adjusted: adj.adjusted,
      adjustmentReason: adj.reason,
      title: "VAT201 due",
      category: "VAT",
      description: `Return and payment for the tax period ending ${lastDayOf(periodEnd).slice(8)} ${monthLabel(periodEnd)} (${def.name}, ${method === "efiling" ? "eFiling" : "manual"}).`,
      indicative: false,
      unverified: false,
      source: def.source === SARS_SMALL_BUSINESS_VAT ? SARS_SMALL_BUSINESS_VAT : SARS_VAT201,
      rule: VAT_METHODS.find((m) => m.id === method)!.dueRule,
    });
  }
  return out.filter((d) => inWindow(d.date, window));
}

export function generateFixed(window: WindowRange = CALENDAR_WINDOW): Deadline[] {
  return FIXED_RULES.map((r) => {
    const adj = adjustDueDate(r.nominal, r.adjustment);
    return {
      id: r.id,
      ruleId: r.id,
      date: adj.date,
      nominal: adj.nominal,
      adjusted: adj.adjusted,
      adjustmentReason: adj.reason,
      title: r.label,
      category: r.category,
      description: r.note,
      indicative: !!r.indicative,
      unverified: !!r.unverified,
      source: r.source,
      rule: r.dueRule,
    };
  }).filter((d) => inWindow(d.date, window));
}

export interface GenerateOptions {
  vatCategory?: VatCategory;
  vatMethod?: VatMethod;
  window?: WindowRange;
}

export const DEFAULT_VAT_CATEGORY: VatCategory = "A";
export const DEFAULT_VAT_METHOD: VatMethod = "efiling";

export function generateDeadlines(opts: GenerateOptions = {}): Deadline[] {
  const w = opts.window ?? CALENDAR_WINDOW;
  return [
    ...generateEmp201(w),
    ...generateVat(opts.vatCategory ?? DEFAULT_VAT_CATEGORY, opts.vatMethod ?? DEFAULT_VAT_METHOD, w),
    ...generateFixed(w),
  ].sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));
}
