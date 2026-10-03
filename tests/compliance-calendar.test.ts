import { describe, expect, it } from "vitest";
import {
  DEPENDS_ON_YOU,
  EMP201_RULE,
  FIXED_RULES,
  VAT_CATEGORIES,
  generateDeadlines,
  generateEmp201,
  generateFixed,
  generateVat,
} from "@/lib/rules/compliance-calendar";

describe("EMP201", () => {
  const list = generateEmp201();
  it("7 Oct 2026 is the September payroll, not October", () => {
    const d = list.find((x) => x.id === "emp201-monthly:2026-10")!;
    expect(d.date).toBe("2026-10-07");
    expect(d.description).toContain("September 2026 payroll");
    expect(d.description).not.toContain("October 2026 payroll");
  });
  it("7 Nov 2026 (Saturday) is adjusted to Fri 6 Nov", () => {
    const d = list.find((x) => x.id === "emp201-monthly:2026-11")!;
    expect(d.date).toBe("2026-11-06");
    expect(d.adjusted).toBe(true);
    expect(d.nominal).toBe("2026-11-07");
  });
  it("7 Dec 2026 does not move; 7 Feb 2027 (Sunday) moves to Fri 5 Feb", () => {
    expect(list.find((x) => x.id === "emp201-monthly:2026-12")!.date).toBe("2026-12-07");
    expect(list.find((x) => x.id === "emp201-monthly:2027-02")!.date).toBe("2027-02-05");
  });
  it("covers one deadline per month and cites SARS", () => {
    expect(list).toHaveLength(13);
    expect(EMP201_RULE.source.url).toContain("sars.gov.za");
    expect(EMP201_RULE.adjustment).toBe("preceding");
  });
});

describe("VAT201", () => {
  it("manual: 25 Oct 2026 (Sunday) moves to Fri 23 Oct for a monthly (C) vendor", () => {
    const d = generateVat("C", "manual").find((x) => x.nominal === "2026-10-25")!;
    expect(d.date).toBe("2026-10-23");
    expect(d.adjusted).toBe(true);
  });
  it("manual: 25 Dec 2026 (holiday) moves to Thu 24 Dec", () => {
    expect(generateVat("C", "manual").find((x) => x.nominal === "2026-12-25")!.date).toBe("2026-12-24");
  });
  it("eFiling is the last business day of the month, not the 25th", () => {
    const list = generateVat("C", "efiling");
    expect(list.find((x) => x.id.endsWith(":2026-10"))!.date).toBe("2026-10-30");
    expect(list.find((x) => x.id.endsWith(":2027-01"))!.date).toBe("2027-01-29");
    expect(list.every((d) => !d.nominal.endsWith("-25"))).toBe(true);
  });
  it("A and B alternate, C is monthly, D is six-monthly, micro is four-monthly", () => {
    const n = (c: "A" | "B" | "C" | "D" | "micro4") => generateVat(c, "efiling").length;
    expect(n("A") + n("B")).toBe(n("C"));
    expect(n("D")).toBe(3);
    expect(generateVat("A", "efiling").map((d) => d.id.split(":")[1])).toEqual(
      ["2026-04", "2026-06", "2026-08", "2026-10", "2026-12", "2027-02"]
    );
    expect(n("micro4")).toBeGreaterThan(0);
  });
  it("Category F no longer exists and E has no generated date", () => {
    const ids: string[] = VAT_CATEGORIES.map((c) => c.id);
    expect(ids).not.toContain("F");
    expect(ids).not.toContain("E");
    expect(DEPENDS_ON_YOU.some((d) => d.id === "vat-category-e")).toBe(true);
  });
});

describe("fixed rules", () => {
  const list = generateFixed();
  const byId = (id: string) => list.find((d) => d.id === id)!;
  it("SARS-published filing dates are shown exactly as published", () => {
    expect(byId("itr12-nonprov-2026").date).toBe("2026-10-23");
    expect(byId("itr12-provisional-2027").date).toBe("2027-01-22");
    expect(byId("trusts-open-2026").date).toBe("2026-09-19");
    expect(byId("emp501-interim-open-2026").date).toBe("2026-09-21");
    expect(byId("emp501-interim-close-2026").date).toBe("2026-10-31");
    expect(byId("itr12-nonprov-2026").adjusted).toBe(false);
  });
  it("provisional tax: 28 Feb 2027 (Sunday) moves to Fri 26 Feb; others stand", () => {
    expect(byId("provisional-p2-2027").date).toBe("2027-02-26");
    expect(byId("provisional-p1-2026").date).toBe("2026-08-31");
    expect(byId("provisional-p3-2027").date).toBe("2027-09-30");
  });
  it("COIDA ROE keeps the 30 June window and the Act note", () => {
    expect(byId("coida-roe-2026").date).toBe("2026-06-30");
    expect(byId("coida-roe-2026").description).toContain("31 March");
  });
  it("next year's EMP501 annual window is marked indicative", () => {
    expect(byId("emp501-annual-2027").indicative).toBe(true);
  });
  it("no deadline is labelled estimated", () => {
    for (const d of list) expect(d.title.toLowerCase()).not.toContain("estimated");
  });
  it("every rule carries source, effective date and review date", () => {
    for (const r of FIXED_RULES) {
      expect(r.source.url).toMatch(/^https:\/\//);
      expect(r.effectiveFrom).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.label.length).toBeGreaterThan(0);
      expect(r.note.length).toBeGreaterThan(0);
    }
  });
});

describe("whole calendar", () => {
  const all = generateDeadlines();
  it("is sorted and computed due dates never land on a weekend", () => {
    for (let i = 1; i < all.length; i++) expect(all[i - 1].date <= all[i].date).toBe(true);
    const published = new Set([
      "emp501-interim-close-2026",
      "emp501-annual-2026",
      "emp501-annual-2027",
      "trusts-open-2026",
    ]);
    for (const d of all) {
      if (published.has(d.ruleId)) continue;
      const day = new Date(d.date + "T00:00:00Z").getUTCDay();
      expect([0, 6]).not.toContain(day);
    }
  });
  it("CIPC has no generated date", () => {
    expect(all.some((d) => d.category === "CIPC")).toBe(false);
    expect(DEPENDS_ON_YOU.find((d) => d.id === "cipc-annual-return")!.text).toContain("anniversary");
  });
  it("ids are unique", () => {
    expect(new Set(all.map((d) => d.id)).size).toBe(all.length);
  });
});
