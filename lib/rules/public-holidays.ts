/**
 * South African public holidays, 2026 and 2027, plus the business-day helpers
 * used by the compliance calendar.
 *
 * Sources (reviewed 2026-10-03):
 *  - gov.za public holidays list: https://www.gov.za/about-sa/public-holidays
 *  - Public Holidays Act 36 of 1994, s2(2): a holiday that falls on a Sunday is
 *    followed by a public holiday on the Monday.
 *  - Proclamation Notice 346 of 2026, Government Gazette 55352, 8 September 2026
 *    (Public Holidays Act s2A): 4 November 2026 (local government elections).
 *    https://www.gov.za/documents/notices/public-holidays-act-declaration-fourth-day-november-2026-public-holiday
 *
 * Dates are ISO yyyy-mm-dd and handled in UTC so results do not depend on the
 * viewer's time zone.
 */

export type HolidayStatus = "confirmed" | "unconfirmed";

export interface PublicHoliday {
  date: string;
  name: string;
  kind: "statutory" | "observed" | "proclaimed";
  /** "unconfirmed" = derived from the Act but not listed on the official page we checked. */
  status: HolidayStatus;
  source: { title: string; url: string; gazette?: string };
}

export const HOLIDAYS_SOURCE = {
  title: "gov.za: Public holidays in South Africa",
  url: "https://www.gov.za/about-sa/public-holidays",
};
export const HOLIDAYS_REVIEWED_ON = "2026-10-03";

const PROCLAMATION_SOURCE = {
  title: "Public Holidays Act: Declaration of 4 November 2026 as public holiday",
  url: "https://www.gov.za/documents/notices/public-holidays-act-declaration-fourth-day-november-2026-public-holiday",
  gazette: "Proclamation Notice 346 of 2026, Government Gazette 55352 (8 September 2026)",
};

const STATUTORY: { date: string; name: string }[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-03-21", name: "Human Rights Day" },
  { date: "2026-04-03", name: "Good Friday" },
  { date: "2026-04-06", name: "Family Day" },
  { date: "2026-04-27", name: "Freedom Day" },
  { date: "2026-05-01", name: "Workers' Day" },
  { date: "2026-06-16", name: "Youth Day" },
  { date: "2026-08-09", name: "National Women's Day" },
  { date: "2026-09-24", name: "Heritage Day" },
  { date: "2026-12-16", name: "Day of Reconciliation" },
  { date: "2026-12-25", name: "Christmas Day" },
  { date: "2026-12-26", name: "Day of Goodwill" },
  { date: "2027-01-01", name: "New Year's Day" },
  { date: "2027-03-21", name: "Human Rights Day" },
  { date: "2027-03-26", name: "Good Friday" },
  { date: "2027-03-29", name: "Family Day" },
  { date: "2027-04-27", name: "Freedom Day" },
  { date: "2027-05-01", name: "Workers' Day" },
  { date: "2027-06-16", name: "Youth Day" },
  { date: "2027-08-09", name: "National Women's Day" },
  { date: "2027-09-24", name: "Heritage Day" },
  { date: "2027-12-16", name: "Day of Reconciliation" },
  { date: "2027-12-25", name: "Christmas Day" },
  { date: "2027-12-26", name: "Day of Goodwill" },
];

/** Observed Mondays that the gov.za list shows explicitly. Any other Sunday shift is derived and unconfirmed. */
const CONFIRMED_OBSERVED = new Set(["2026-08-10", "2027-03-22"]);

export function addDays(iso: string, n: number): string {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday */
export function weekday(iso: string): number {
  return new Date(iso + "T00:00:00Z").getUTCDay();
}

function buildHolidays(): PublicHoliday[] {
  const out: PublicHoliday[] = [];
  for (const h of STATUTORY) {
    out.push({ ...h, kind: "statutory", status: "confirmed", source: HOLIDAYS_SOURCE });
    if (weekday(h.date) === 0) {
      const observed = addDays(h.date, 1);
      out.push({
        date: observed,
        name: `${h.name} (observed)`,
        kind: "observed",
        status: CONFIRMED_OBSERVED.has(observed) ? "confirmed" : "unconfirmed",
        source: HOLIDAYS_SOURCE,
      });
    }
  }
  out.push({
    date: "2026-11-04",
    name: "Local government elections",
    kind: "proclaimed",
    status: "confirmed",
    source: PROCLAMATION_SOURCE,
  });
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

export const PUBLIC_HOLIDAYS: readonly PublicHoliday[] = buildHolidays();

const HOLIDAY_DATES = new Set(PUBLIC_HOLIDAYS.map((h) => h.date));

export function holidayOn(iso: string): PublicHoliday | undefined {
  return PUBLIC_HOLIDAYS.find((h) => h.date === iso);
}

export function isHoliday(iso: string): boolean {
  return HOLIDAY_DATES.has(iso);
}

export function isWeekend(iso: string): boolean {
  const w = weekday(iso);
  return w === 0 || w === 6;
}

export function isBusinessDay(iso: string): boolean {
  return !isWeekend(iso) && !isHoliday(iso);
}

export function previousBusinessDay(iso: string): string {
  let d = iso;
  while (!isBusinessDay(d)) d = addDays(d, -1);
  return d;
}

export function nextBusinessDay(iso: string): string {
  let d = iso;
  while (!isBusinessDay(d)) d = addDays(d, 1);
  return d;
}

/** Last business day of the month containing `iso`. */
export function lastBusinessDayOfMonth(yyyyMm: string): string {
  const [y, m] = yyyyMm.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);
  return previousBusinessDay(last);
}

export type Adjustment = "preceding" | "following" | "none";

export interface AdjustedDate {
  nominal: string;
  date: string;
  adjusted: boolean;
  /** What the nominal date is, for display ("a Sunday", "a public holiday (...)"). Empty when it did not move. */
  reason: string;
}

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Apply a weekend and public-holiday adjustment to a nominal due date. */
export function adjustDueDate(nominal: string, rule: Adjustment): AdjustedDate {
  if (rule === "none" || isBusinessDay(nominal)) {
    return { nominal, date: nominal, adjusted: false, reason: "" };
  }
  const date = rule === "preceding" ? previousBusinessDay(nominal) : nextBusinessDay(nominal);
  const hol = holidayOn(nominal);
  const reason = hol
    ? `a public holiday (${hol.name})`
    : `a ${WEEKDAY_NAMES[weekday(nominal)]}`;
  return { nominal, date, adjusted: true, reason };
}
