/**
 * linkedin-get-urn.mjs
 *
 * Fetches your LinkedIn profile URN and any admin'd organization URNs,
 * then adds LINKEDIN_AUTHOR_URN to .env.local.
 *
 * Run after linkedin-auth.mjs:
 *   node scripts/linkedin-get-urn.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");

// Load .env.local
const envRaw = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
const envMap = {};
for (const line of envRaw.split("\n")) {
  const idx = line.indexOf("=");
  if (idx > 0) {
    envMap[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
}

const token = envMap.LINKEDIN_ACCESS_TOKEN || process.env.LINKEDIN_ACCESS_TOKEN;
if (!token) {
  console.error("❌  LINKEDIN_ACCESS_TOKEN not found. Run linkedin-auth.mjs first.");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "LinkedIn-Version": "202501",
  "X-Restli-Protocol-Version": "2.0.0",
};

// 1. Get personal profile URN
console.log("\n── Fetching your LinkedIn profile ──────────────────────────────────────────");
const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", { headers });
if (!profileRes.ok) {
  console.error("❌  Could not fetch profile:", profileRes.status, await profileRes.text());
  process.exit(1);
}
const profile = await profileRes.json();
const personUrn = `urn:li:person:${profile.sub}`;
console.log(`✓  Personal profile  : ${profile.name} (${profile.email ?? ""})`);
console.log(`   Personal URN      : ${personUrn}`);

// 2. Get administered organizations
console.log("\n── Fetching administered company pages ──────────────────────────────────────");
const orgRes = await fetch(
  `https://api.linkedin.com/v2/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,name)))`,
  { headers: { ...headers, "LinkedIn-Version": undefined } }
);

let chosenUrn = personUrn;

if (orgRes.ok) {
  const orgData = await orgRes.json();
  const orgs = (orgData.elements ?? []).map((el) => {
    const id = el["organization~"]?.id ?? el.organization?.split(":").pop();
    const name = el["organization~"]?.name?.localized?.en_US ?? "Unknown";
    return { id, name, urn: `urn:li:organization:${id}` };
  });

  if (orgs.length > 0) {
    console.log("✓  Company pages you admin:");
    orgs.forEach((o, i) => console.log(`   [${i + 1}] ${o.name} — ${o.urn}`));

    // Auto-pick if Sikatrix is there
    const sikatrix = orgs.find((o) => /sikatrix/i.test(o.name));
    if (sikatrix) {
      chosenUrn = sikatrix.urn;
      console.log(`\n✅  Auto-selected Sikatrix company page: ${chosenUrn}`);
    } else {
      chosenUrn = orgs[0].urn;
      console.log(`\n    Auto-selected first org: ${chosenUrn}`);
      console.log("    If wrong, manually edit LINKEDIN_AUTHOR_URN in .env.local");
    }
  } else {
    console.log("   No company pages found — will use personal profile URN.");
  }
} else {
  console.log("   Could not fetch org pages — using personal profile URN.");
}

// Save chosen URN to .env.local
const urnLine = `LINKEDIN_AUTHOR_URN=${chosenUrn}`;
let updated = envRaw;
if (updated.includes("LINKEDIN_AUTHOR_URN=")) {
  updated = updated.replace(/LINKEDIN_AUTHOR_URN=.*/g, urnLine);
} else {
  updated += `\n${urnLine}`;
}
writeFileSync(ENV_PATH, updated, "utf8");

console.log(`\n✅  Saved LINKEDIN_AUTHOR_URN=${chosenUrn} → .env.local`);
console.log("\n── You are ready to post! ───────────────────────────────────────────────────");
console.log("   node scripts/linkedin-post.mjs <article-slug>");
console.log("   e.g. node scripts/linkedin-post.mjs sars-provisional-tax-guide-2025\n");
