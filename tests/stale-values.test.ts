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
// A line is historical only when it carries an explicit date ("1 April 2026",
// "April 2026") or a "before 1 April 2026" style qualifier. A bare "2025/26",
// "previous" or "was R" no longer exempts a line.
const HISTORICAL = /\b(\d{1,2} )?(January|February|March|April|May|June|July|August|September|October|November|December) 20\d{2}\b/i;
// Files that are deliberately historical in whole or in part.
const FILE_ALLOWLIST = [
  "content/posts/vat-registration-mandatory-threshold-south-africa.md",
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
