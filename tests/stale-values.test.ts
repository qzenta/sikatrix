import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

/**
 * Drift guard: superseded tax and compliance figures must not reappear in
 * present-tense copy. Markdown posts cannot import lib/rules, so we scan.
 * A line is allowed when it is clearly historical (see HISTORICAL).
 */
const ROOT = path.resolve(__dirname, "..");
const DIRS = ["app", "components", "content"];
const EXT = /\.(tsx?|md)$/;
const HISTORICAL = /(increased from|up from|raised from|was R|were R|previous|from R1 million|from R50,000|bracing for|before 1 April 2026|old R|old threshold|earlier years|2025\/26|2024\/25|Threshold update|April 2026 update)/i;
// Files that are deliberately historical in whole or in part.
const FILE_ALLOWLIST = [
  "content/posts/vat-registration-mandatory-threshold-south-africa.md",
  "content/posts/sme-tax-compliance-calendar-2025-2026.md",
];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (EXT.test(e.name)) out.push(p);
  }
  return out;
}

const files = DIRS.flatMap((d) => walk(path.join(ROOT, d))).map((f) => ({
  rel: path.relative(ROOT, f).split(path.sep).join("/"),
  lines: fs.readFileSync(f, "utf8").split(/\r?\n/),
}));

const rules: { name: string; test: (l: string) => boolean }[] = [
  { name: "old 20 October filing date", test: (l) => /20 October/.test(l) },
  { name: "estimated 15 Oct / 31 Jan filing dates", test: (l) => /15 October 2026|31 January 2027/.test(l) },
  { name: "R364/R246 medical credit as current value", test: (l) => /R364|R246/.test(l) },
  { name: "R350,000 retirement cap as current value", test: (l) => /R350,000/.test(l) },
  {
    name: "R1 million VAT threshold as current value",
    test: (l) => /VAT/i.test(l) && /R1 million|R1,000,000|R1m\b/.test(l) && !/R2\.3|R2,300,000/.test(l),
  },
  { name: "R50,000 voluntary VAT threshold as current value", test: (l) => /voluntary/i.test(l) && /R50,000/.test(l) },
  { name: "COIDA ROE 31 March as the due date", test: (l) => /(Return of Earnings|ROE)/.test(l) && /31 March/.test(l) && !/Act/.test(l) },
];

describe("stale-value guard", () => {
  for (const rule of rules) {
    it(`no ${rule.name}`, () => {
      const hits: string[] = [];
      for (const f of files) {
        if (FILE_ALLOWLIST.includes(f.rel)) continue;
        f.lines.forEach((l, i) => {
          if (rule.test(l) && !HISTORICAL.test(l)) hits.push(`${f.rel}:${i + 1}: ${l.trim().slice(0, 140)}`);
        });
      }
      expect(hits).toEqual([]);
    });
  }
});
