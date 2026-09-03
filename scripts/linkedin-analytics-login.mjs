/**
 * linkedin-analytics-login.mjs
 *
 * One-time (well, re-run whenever the session expires) manual login step
 * for the LinkedIn analytics capture script. Opens a real, visible browser
 * window so Daniel can log in and pass 2FA himself - no credentials are
 * ever typed, stored, or seen by this script. Once logged in, Playwright's
 * storage state (cookies + local storage) is saved to a local, gitignored
 * file that linkedin-analytics-capture.mjs reuses headlessly.
 *
 * Usage:
 *   node scripts/linkedin-analytics-login.mjs
 *   (log in + pass 2FA in the window that opens, then come back and press
 *   Enter in this terminal)
 */

import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import readline from "readline";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const STATE_PATH = resolve(ROOT, ".playwright-linkedin-state.json");

function waitForEnter(prompt) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(prompt, () => { rl.close(); res(); }));
}

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

console.log("\nOpening LinkedIn login...");
await page.goto("https://www.linkedin.com/login");

await waitForEnter(
  "\nLog in (and complete 2FA if prompted) in the browser window, navigate to your\n" +
  "feed or profile to confirm you're fully logged in, then press Enter here to save the session...\n"
);

await context.storageState({ path: STATE_PATH });
console.log(`\n✅  Session saved to ${STATE_PATH}`);
console.log("    This file is gitignored - it never leaves this machine.");
console.log("    Re-run this script whenever linkedin-analytics-capture.mjs reports the session expired.\n");

await browser.close();
