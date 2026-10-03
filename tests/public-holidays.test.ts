import { describe, expect, it } from "vitest";
import {
  PUBLIC_HOLIDAYS,
  adjustDueDate,
  holidayOn,
  isBusinessDay,
  lastBusinessDayOfMonth,
  nextBusinessDay,
  previousBusinessDay,
  weekday,
} from "@/lib/rules/public-holidays";

describe("public holiday list", () => {
  it("has the 4 November 2026 proclaimed holiday with its gazette reference", () => {
    const h = holidayOn("2026-11-04");
    expect(h?.kind).toBe("proclaimed");
    expect(h?.status).toBe("confirmed");
    expect(h?.source.gazette).toContain("55352");
  });
  it("moves Sunday holidays to the Monday", () => {
    expect(weekday("2026-08-09")).toBe(0);
    expect(holidayOn("2026-08-10")?.kind).toBe("observed");
    expect(holidayOn("2026-08-10")?.status).toBe("confirmed");
    expect(weekday("2027-03-21")).toBe(0);
    expect(holidayOn("2027-03-22")?.status).toBe("confirmed");
  });
  it("does not shift Saturday holidays", () => {
    expect(weekday("2026-03-21")).toBe(6);
    expect(holidayOn("2026-03-23")).toBeUndefined();
    expect(weekday("2026-12-26")).toBe(6);
    expect(holidayOn("2026-12-28")).toBeUndefined();
  });
  it("flags the derived 27 Dec 2027 observed holiday as unconfirmed", () => {
    expect(holidayOn("2027-12-27")?.status).toBe("unconfirmed");
  });
  it("every holiday has a gov.za source and a valid date", () => {
    for (const h of PUBLIC_HOLIDAYS) {
      expect(h.source.url).toMatch(/^https:\/\/www\.gov\.za\//);
      expect(h.date).toMatch(/^20(26|27)-\d\d-\d\d$/);
    }
  });
});

describe("adjustDueDate fixtures", () => {
  it("25 Oct 2026 (Sunday) moves back to Fri 23 Oct", () => {
    expect(weekday("2026-10-25")).toBe(0);
    const r = adjustDueDate("2026-10-25", "preceding");
    expect(r.date).toBe("2026-10-23");
    expect(r.adjusted).toBe(true);
    expect(r.reason).toBe("a Sunday");
  });
  it("7 Nov 2026 (Saturday) moves back to Fri 6 Nov", () => {
    expect(adjustDueDate("2026-11-07", "preceding").date).toBe("2026-11-06");
  });
  it("25 Dec 2026 (Christmas, Friday) moves back to Thu 24 Dec", () => {
    const r = adjustDueDate("2026-12-25", "preceding");
    expect(r.date).toBe("2026-12-24");
    expect(r.reason).toContain("Christmas Day");
  });
  it("16 Dec 2026 (Reconciliation, Wednesday) moves back to Tue 15 Dec", () => {
    expect(adjustDueDate("2026-12-16", "preceding").date).toBe("2026-12-15");
  });
  it("1 Jan 2027 (New Year, Friday) moves back to Thu 31 Dec 2026", () => {
    expect(adjustDueDate("2027-01-01", "preceding").date).toBe("2026-12-31");
  });
  it("7 Dec 2026 (ordinary Monday) does not move", () => {
    const r = adjustDueDate("2026-12-07", "preceding");
    expect(r.date).toBe("2026-12-07");
    expect(r.adjusted).toBe(false);
  });
  it("4 Nov 2026 election holiday rolls back to Tue 3 Nov", () => {
    expect(adjustDueDate("2026-11-04", "preceding").date).toBe("2026-11-03");
  });
  it("skips a weekend plus holiday run (Good Friday and Family Day 2027)", () => {
    expect(previousBusinessDay("2027-03-29")).toBe("2027-03-25");
  });
  it("following rule rolls forward", () => {
    expect(adjustDueDate("2026-10-25", "following").date).toBe("2026-10-26");
    expect(nextBusinessDay("2026-12-25")).toBe("2026-12-28");
  });
  it("none never moves a date", () => {
    expect(adjustDueDate("2026-10-31", "none")).toMatchObject({ date: "2026-10-31", adjusted: false });
  });
  it("business-day helpers", () => {
    expect(isBusinessDay("2026-10-23")).toBe(true);
    expect(isBusinessDay("2026-10-24")).toBe(false);
    expect(lastBusinessDayOfMonth("2026-10")).toBe("2026-10-30");
    expect(lastBusinessDayOfMonth("2026-12")).toBe("2026-12-31");
    expect(lastBusinessDayOfMonth("2027-01")).toBe("2027-01-29");
  });
});
