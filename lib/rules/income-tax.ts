/**
 * Individual income tax rules, versioned by tax year.
 * Each year keeps its own values; never overwrite a past year with a newer one.
 * Sources: SARS "Rates of tax for individuals" and SARS Budget 2026 FAQ.
 */

export interface RuleSource {
  title: string;
  url: string;
  gazette?: string;
}

export interface Bracket {
  min: number;
  max: number;
  base: number;
  rate: number;
  label: string;
}

export interface TaxYearRules {
  label: string;
  period: string;
  effectiveFrom: string;
  brackets: readonly Bracket[];
  rebates: { primary: number; secondary: number; tertiary: number };
  thresholds: { under65: number; age65: number; age75: number };
  /** Medical scheme fees tax credit, rand per month. */
  medCredits: { main: number; first: number; additional: number };
  /** Retirement deduction: lesser of rate x income, or the annual cap. */
  retirement: { rate: number; cap: number };
  uifRate: number;
  /** SARS UIF remuneration ceiling, a MONTHLY figure. */
  uifMonthCap: number;
  source: RuleSource;
  reviewedOn: string;
  owner: string;
  version: number;
}

const SARS_RATES: RuleSource = {
  title: "SARS: Rates of tax for individuals",
  url: "https://www.sars.gov.za/tax-rates/income-tax/rates-of-tax-for-individuals/",
};
const SARS_BUDGET_2026_FAQ: RuleSource = {
  title: "SARS: Budget 2026 Frequently Asked Questions",
  url: "https://www.sars.gov.za/about/sars-tax-and-customs-system/budget/budget-2026-frequently-asked-questions/",
};

const BRACKETS_2025: Bracket[] = [
  { min: 0,       max: 237100,   base: 0,      rate: 0.18, label: "R0 – R237,100" },
  { min: 237101,  max: 370500,   base: 42678,  rate: 0.26, label: "R237,101 – R370,500" },
  { min: 370501,  max: 512800,   base: 77362,  rate: 0.31, label: "R370,501 – R512,800" },
  { min: 512801,  max: 673000,   base: 121475, rate: 0.36, label: "R512,801 – R673,000" },
  { min: 673001,  max: 857900,   base: 179147, rate: 0.39, label: "R673,001 – R857,900" },
  { min: 857901,  max: 1817000,  base: 251258, rate: 0.41, label: "R857,901 – R1,817,000" },
  { min: 1817001, max: Infinity, base: 644489, rate: 0.45, label: "R1,817,001+" },
];

export const TAX_YEARS = {
  "2026/27": {
    label: "2026/27",
    period: "1 March 2026 – 28 February 2027",
    effectiveFrom: "2026-03-01",
    brackets: [
      { min: 0,       max: 245100,   base: 0,      rate: 0.18, label: "R0 – R245,100" },
      { min: 245101,  max: 383100,   base: 44118,  rate: 0.26, label: "R245,101 – R383,100" },
      { min: 383101,  max: 530200,   base: 79998,  rate: 0.31, label: "R383,101 – R530,200" },
      { min: 530201,  max: 695800,   base: 125599, rate: 0.36, label: "R530,201 – R695,800" },
      { min: 695801,  max: 887000,   base: 185215, rate: 0.39, label: "R695,801 – R887,000" },
      { min: 887001,  max: 1878600,  base: 259783, rate: 0.41, label: "R887,001 – R1,878,600" },
      { min: 1878601, max: Infinity, base: 666339, rate: 0.45, label: "R1,878,601+" },
    ],
    rebates: { primary: 17820, secondary: 9765, tertiary: 3249 },
    thresholds: { under65: 99000, age65: 153250, age75: 171300 },
    medCredits: { main: 376, first: 376, additional: 254 },
    retirement: { rate: 0.275, cap: 430000 },
    uifRate: 0.01,
    uifMonthCap: 17712,
    source: SARS_BUDGET_2026_FAQ,
    reviewedOn: "2026-10-03",
    owner: "Sikatrix",
    version: 2,
  },
  "2025/26": {
    label: "2025/26",
    period: "1 March 2025 – 28 February 2026",
    effectiveFrom: "2025-03-01",
    brackets: BRACKETS_2025,
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    thresholds: { under65: 95750, age65: 148217, age75: 165689 },
    medCredits: { main: 364, first: 364, additional: 246 },
    retirement: { rate: 0.275, cap: 350000 },
    uifRate: 0.01,
    uifMonthCap: 17712,
    source: SARS_RATES,
    reviewedOn: "2026-10-03",
    owner: "Sikatrix",
    version: 2,
  },
  "2024/25": {
    label: "2024/25",
    period: "1 March 2024 – 28 February 2025",
    effectiveFrom: "2024-03-01",
    brackets: BRACKETS_2025,
    rebates: { primary: 17235, secondary: 9444, tertiary: 3145 },
    thresholds: { under65: 95750, age65: 148217, age75: 165689 },
    medCredits: { main: 364, first: 364, additional: 246 },
    retirement: { rate: 0.275, cap: 350000 },
    uifRate: 0.01,
    uifMonthCap: 17712,
    source: SARS_RATES,
    reviewedOn: "2026-10-03",
    owner: "Sikatrix",
    version: 2,
  },
} as const satisfies Record<string, TaxYearRules>;

export type TaxYear = keyof typeof TAX_YEARS;
export type TaxData = TaxYearRules;
export type AgeGroup = "under65" | "65-74" | "75+";

export function calculateIncomeTax(
  income: number,
  age: AgeGroup,
  medMembers: number,
  raContrib: number,
  d: TaxData
) {
  const raDeduction = Math.min(raContrib, income * d.retirement.rate, d.retirement.cap);
  const taxableIncome = Math.max(0, income - raDeduction);

  let grossTax = 0;
  for (const b of d.brackets) {
    if (taxableIncome <= b.max) {
      grossTax = b.base + (taxableIncome - b.min) * b.rate;
      break;
    }
  }

  let rebate = d.rebates.primary;
  if (age === "65-74") rebate += d.rebates.secondary;
  if (age === "75+") rebate += d.rebates.secondary + d.rebates.tertiary;

  let medCredit = 0;
  if (medMembers >= 1) medCredit += d.medCredits.main;
  if (medMembers >= 2) medCredit += d.medCredits.first;
  if (medMembers >= 3) medCredit += d.medCredits.additional * (medMembers - 2);
  medCredit *= 12;

  const threshold =
    age === "under65" ? d.thresholds.under65 :
    age === "65-74" ? d.thresholds.age65 : d.thresholds.age75;
  const belowThreshold = taxableIncome <= threshold;

  const netTax = belowThreshold ? 0 : Math.max(0, grossTax - rebate - medCredit);
  const uifMonthly = Math.min(income / 12, d.uifMonthCap) * d.uifRate;
  const uifAnnual = uifMonthly * 12;

  return {
    taxableIncome,
    raDeduction,
    grossTax: belowThreshold ? 0 : grossTax,
    rebate: belowThreshold ? 0 : rebate,
    medCredit: belowThreshold ? 0 : medCredit,
    netTax,
    uifAnnual,
    uifMonthly,
    effectiveRate: income > 0 ? (netTax / income) * 100 : 0,
    monthlyPAYE: netTax / 12,
    monthlyTakeHome: income / 12 - netTax / 12 - uifMonthly,
    annualTakeHome: income - netTax - uifAnnual,
    belowThreshold,
  };
}
