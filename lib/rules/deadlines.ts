/**
 * SARS 2026 filing dates. Source: Notice No. 7422, Government Gazette 54598
 * (30 April 2026) and https://www.sars.gov.za/types-of-tax/personal-income-tax/filing-season/
 * (reviewed 2026-10-03).
 */
export const FILING_DATES_2026 = {
  autoAssessmentStart: "2026-07-01",
  autoAssessmentEnd: "2026-07-12",
  nonProvisionalOpens: "2026-07-13",
  nonProvisionalDeadline: "2026-10-23",
  provisionalDeadline: "2027-01-22",
  trustsOpen: "2026-09-19",
  trustsDeadline: "2027-01-22",
  emp501InterimOpens: "2026-09-21",
  emp501InterimDeadline: "2026-10-31",
} as const;
