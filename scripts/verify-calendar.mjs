// Real-browser check of /tools/sars-compliance-calendar (renders client-side).
// Usage: node scripts/verify-calendar.mjs [baseUrl]   (default http://localhost:3000)
// Uses a fixed clock (3 Oct 2026) so assertions do not depend on the day it is run,
// plus a no-JS pass and a pass on the real clock to confirm passed dates are hidden.
import { chromium } from "playwright";

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const url = `${base}/tools/sars-compliance-calendar?cb=${Date.now()}`;
let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!ok) failures++;
};

async function rows(page, js = true) {
  await page.waitForSelector('[data-testid="calendar-list"] li', { timeout: 15000 });
  // The server render shows the full calendar; wait for hydration to apply today's date.
  if (js) await page.waitForFunction(() => !document.body.innerText.includes("Showing the full 2026/27 calendar"), null, { timeout: 15000 });
  return page.$$eval('[data-testid="calendar-list"] li', (els) =>
    els.map((e) => ({
      id: e.getAttribute("data-deadline-id"),
      date: e.getAttribute("data-date"),
      text: e.innerText.replace(/\s+/g, " "),
    }))
  );
}

const browser = await chromium.launch();

// 1. Fixed clock 2026-10-03, default VAT (Category A, eFiling)
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date("2026-10-03T08:00:00+02:00") });
  await page.goto(url, { waitUntil: "load" });
  let r = await rows(page);
  const has = (id, date) => r.some((x) => x.id === id && x.date === date);
  check("EMP201 7 Oct 2026 (September payroll)", has("emp201-monthly", "2026-10-07"));
  check("EMP201 row says September payroll", r.some((x) => x.date === "2026-10-07" && x.text.includes("September 2026 payroll")));
  check("Individual filing deadline 23 Oct 2026", has("itr12-nonprov-2026", "2026-10-23"));
  check("EMP201 7 Nov 2026 adjusted to 6 Nov", has("emp201-monthly", "2026-11-06") && r.some((x) => x.date === "2026-11-06" && x.text.includes("Moved from")));
  check("Provisional filing deadline 22 Jan 2027", has("itr12-provisional-2027", "2027-01-22"));
  check("No passed dates shown (nothing before 2026-10-03)", r.every((x) => x.date >= "2026-10-03"));
  check("No 'estimated' wording", !r.some((x) => /estimated/i.test(x.text)));

  // VAT Category C, manual: 25 Dec 2026 -> 24 Dec; 25 Oct 2026 (Sunday) -> 23 Oct
  await page.selectOption("#vat-category", "C");
  await page.selectOption("#vat-method", "manual");
  r = await rows(page);
  check("VAT201 manual 25 Dec 2026 adjusted to 24 Dec", r.some((x) => x.id.startsWith("vat201-C-manual") && x.date === "2026-12-24"));
  check("VAT201 manual 25 Oct 2026 adjusted to 23 Oct", r.some((x) => x.id.startsWith("vat201-C-manual") && x.date === "2026-10-23"));
  await page.selectOption("#vat-method", "efiling");
  r = await rows(page);
  check("VAT201 eFiling Oct 2026 is last business day (30 Oct)", r.some((x) => x.id.startsWith("vat201-C-efiling") && x.date === "2026-10-30"));
  await ctx.close();
}

// 2. Fixed clock after the 7 Oct deadline: passed dates hidden client-side
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.clock.install({ time: new Date("2026-10-24T08:00:00+02:00") });
  await page.goto(url, { waitUntil: "load" });
  const r = await rows(page);
  check("On 24 Oct 2026 the 23 Oct deadline is hidden", !r.some((x) => x.date === "2026-10-23"));
  check("On 24 Oct 2026 nothing earlier is shown", r.every((x) => x.date >= "2026-10-24"));
  await ctx.close();
}

// 3. No-JS: server HTML is not empty and carries the key dates
{
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "load" });
  const r = await page.$$eval('[data-testid="calendar-list"] li', (els) =>
    els.map((e) => e.getAttribute("data-date"))
  );
  check("No-JS render lists deadlines", r.length > 20, `(${r.length} rows)`);
  check("No-JS render includes 23 Oct 2026 and 22 Jan 2027", r.includes("2026-10-23") && r.includes("2027-01-22"));
  await ctx.close();
}

// 4. Real clock: page renders and hides anything already passed
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  // /_vercel/* (analytics, speed insights) only exists on Vercel, so it 404s on a local server.
  page.on("console", (m) => m.type() === "error" && !/_vercel|status of 404|MIME type/.test(m.text()) && errors.push(m.text()));
  await page.goto(url, { waitUntil: "load" });
  const r = await rows(page);
  const today = new Date().toISOString().slice(0, 10);
  check("Real clock: no deadline earlier than today", r.every((x) => x.date >= new Date(Date.now() - 864e5).toISOString().slice(0, 10)), `(today ${today})`);
  check("No console or page errors", errors.length === 0, errors.join(" | ").slice(0, 200));
  const bundle = await page.$$eval("script[src]", (s) => s.map((x) => x.src).filter((x) => /calendar|page-/.test(x)));
  console.log("bundles:", bundle.filter((b) => b.includes("sars-compliance-calendar")).join(", ") || "(none matched)");
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) FAILED` : "\nAll checks passed");
process.exit(failures ? 1 : 0);
