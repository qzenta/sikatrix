/**
 * linkedin-auth.mjs
 *
 * One-time helper to exchange your LinkedIn authorization code for an
 * access token, then save it to .env.local automatically.
 *
 * Run this once (and again every 60 days when the token expires):
 *   node scripts/linkedin-auth.mjs
 *
 * You must have set in .env.local:
 *   LINKEDIN_CLIENT_ID
 *   LINKEDIN_CLIENT_SECRET
 *   LINKEDIN_REDIRECT_URI   (e.g. http://localhost:3003/linkedin-callback)
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");

// ── Load .env.local ───────────────────────────────────────────────────────────
const envRaw = existsSync(ENV_PATH) ? readFileSync(ENV_PATH, "utf8") : "";
const envMap = {};
for (const line of envRaw.split("\n")) {
  const idx = line.indexOf("=");
  if (idx > 0) {
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    envMap[k] = v;
  }
}

const CLIENT_ID = envMap.LINKEDIN_CLIENT_ID || process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = envMap.LINKEDIN_CLIENT_SECRET || process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = envMap.LINKEDIN_REDIRECT_URI || "http://localhost:3003/linkedin-callback";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("❌  Missing LINKEDIN_CLIENT_ID or LINKEDIN_CLIENT_SECRET in .env.local");
  console.error("    See docs/LINKEDIN_SETUP.md for step-by-step instructions.");
  process.exit(1);
}

// ── Build the authorization URL ───────────────────────────────────────────────
// Scopes: add w_member_social+w_organization_social+r_organization_social
// once LinkedIn approves the "Share on LinkedIn" product for this app.
const authUrl =
  `https://www.linkedin.com/oauth/v2/authorization` +
  `?response_type=code` +
  `&client_id=${CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&scope=openid%20profile%20email`;

console.log("\n── LinkedIn OAuth Setup ─────────────────────────────────────────────────────");
console.log("Step 1: Open this URL in your browser and authorize the app:\n");
console.log(`  ${authUrl}\n`);
console.log("Step 2: After authorizing, LinkedIn redirects to your callback URL.");
console.log(`        Listening on: ${REDIRECT_URI}\n`);
console.log("────────────────────────────────────────────────────────────────────────────\n");

// ── Local callback server ─────────────────────────────────────────────────────
const port = new URL(REDIRECT_URI).port || 3003;
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization failed: ${error}`);
    console.error(`❌  LinkedIn returned error: ${error}`);
    server.close();
    process.exit(1);
  }

  if (!code || !url.pathname.includes("linkedin-callback")) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not the callback — waiting...");
    return;
  }

  // Exchange code for access token
  console.log("✓  Authorization code received. Exchanging for access token...");
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });

  const json = await tokenRes.json();

  if (!tokenRes.ok || !json.access_token) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Token exchange failed — check console.");
    console.error("❌  Token exchange failed:", JSON.stringify(json, null, 2));
    server.close();
    process.exit(1);
  }

  const { access_token, expires_in } = json;
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString().split("T")[0];

  // Save token to .env.local
  let updated = envRaw;
  const tokenLine = `LINKEDIN_ACCESS_TOKEN=${access_token}`;
  const expLine = `LINKEDIN_TOKEN_EXPIRES=${expiresAt}`;

  if (updated.includes("LINKEDIN_ACCESS_TOKEN=")) {
    updated = updated.replace(/LINKEDIN_ACCESS_TOKEN=.*/g, tokenLine);
  } else {
    updated += `\n${tokenLine}`;
  }
  if (updated.includes("LINKEDIN_TOKEN_EXPIRES=")) {
    updated = updated.replace(/LINKEDIN_TOKEN_EXPIRES=.*/g, expLine);
  } else {
    updated += `\n${expLine}`;
  }

  writeFileSync(ENV_PATH, updated, "utf8");

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<html><body style="font-family:sans-serif;padding:40px">
    <h2>✅ LinkedIn token saved!</h2>
    <p>Access token saved to <code>.env.local</code>.</p>
    <p>Token expires: <strong>${expiresAt}</strong></p>
    <p>You can close this tab and return to the terminal.</p>
  </body></html>`);

  console.log(`\n✅  Access token saved to .env.local`);
  console.log(`    Expires: ${expiresAt}`);
  console.log(`\n💡  Next: get your company page URN and add it as LINKEDIN_AUTHOR_URN`);
  console.log(`    Run:  node scripts/linkedin-get-urn.mjs\n`);

  server.close();
});

server.listen(port, () => {
  console.log(`Waiting for LinkedIn callback on port ${port}...`);
});
