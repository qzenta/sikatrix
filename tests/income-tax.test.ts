import { describe, expect, it } from "vitest";
import { TAX_YEARS, calculateIncomeTax, type TaxYear } from "@/lib/rules/income-tax";

const calc = (y: TaxYear, income: number, age: "under65" | "65-74" | "75+" = "under65", med = 0, ra = 0) =>
  calculateIncomeTax(income, age, med, ra, TAX_YEARS[y]);

describe("UIF (monthly ceiling R17,712)", () => {
  it("R500,000 salary gives R177.12 per month and R2,125.44 per year", () => {
    const r = calc("2026/27", 500000);
    expect(r.uifMonthly).toBeCloseTo(177.12, 2);
    expect(r.uifAnnual).toBeCloseTo(2125.44, 2);
  });
  it("below, at and above the ceiling", () => {
    expect(calc("2026/27", 12 * 10000).uifMonthly).toBeCloseTo(100, 2);
    expect(calc("2026/27", 12 * 17712).uifMonthly).toBeCloseTo(177.12, 2);
    expect(calc("2026/27", 12 * 30000).uifMonthly).toBeCloseTo(177.12, 2);
  });
});

describe("medical scheme fees tax credit, per tax year", () => {
  const annual = (y: TaxYear, members: number) => calc(y, 2_000_000, "under65", members).medCredit;
  it("2026/27: R376 / R752 / +R254 per month", () => {
    expect(annual("2026/27", 1)).toBe(4512);
    expect(annual("2026/27", 2)).toBe(9024);
    expect(annual("2026/27", 3)).toBe(12072);
  });
  it("2025/26 and 2024/25 keep R364 / R246", () => {
    expect(annual("2025/26", 1)).toBe(4368);
    expect(annual("2025/26", 3)).toBe(364 * 24 + 246 * 12);
    expect(annual("2024/25", 3)).toBe(364 * 24 + 246 * 12);
  });
  it("no medical aid gives no credit", () => {
    expect(annual("2026/27", 0)).toBe(0);
  });
});

describe("retirement deduction", () => {
  it("2026/27 cap is R430,000, earlier years R350,000", () => {
    expect(calc("2026/27", 2_000_000, "under65", 0, 600000).raDeduction).toBe(430000);
    expect(calc("2025/26", 2_000_000, "under65", 0, 600000).raDeduction).toBe(350000);
  });
  it("27.5% binds when below the cap", () => {
    expect(calc("2026/27", 400000, "under65", 0, 200000).raDeduction).toBeCloseTo(110000, 2);
  });
  it("below cap deducts the contribution", () => {
    expect(calc("2026/27", 1_000_000, "under65", 0, 50000).raDeduction).toBe(50000);
  });
});

describe.each(Object.keys(TAX_YEARS) as TaxYear[])("brackets %s", (y) => {
  const d = TAX_YEARS[y];
  it("tax is continuous across each bracket boundary (within one rand of rounding)", () => {
    for (let i = 0; i < d.brackets.length - 1; i++) {
      const b = d.brackets[i];
      const next = d.brackets[i + 1];
      const atTop = b.base + (b.max - b.min + 1) * b.rate;
      expect(Math.abs(atTop - next.base)).toBeLessThan(1.5);
    }
  });
  it("zero income gives zero tax; very high income is positive and below income", () => {
    expect(calc(y, 0).netTax).toBe(0);
    const hi = calc(y, 50_000_000);
    expect(hi.netTax).toBeGreaterThan(0);
    expect(hi.netTax).toBeLessThan(50_000_000);
  });
  it("tax threshold boundary by age", () => {
    expect(calc(y, d.thresholds.under65).netTax).toBe(0);
    expect(calc(y, d.thresholds.age65, "65-74").netTax).toBe(0);
    expect(calc(y, d.thresholds.age75, "75+").netTax).toBe(0);
    expect(calc(y, d.thresholds.under65 + 20000).netTax).toBeGreaterThan(0);
  });
});

describe("2026/27 source values", () => {
  it("matches SARS published rebates and thresholds", () => {
    const d = TAX_YEARS["2026/27"];
    expect(d.rebates).toEqual({ primary: 17820, secondary: 9765, tertiary: 3249 });
    expect(d.thresholds).toEqual({ under65: 99000, age65: 153250, age75: 171300 });
    expect(d.brackets[0].max).toBe(245100);
    expect(d.brackets[6].base).toBe(666339);
  });
});
