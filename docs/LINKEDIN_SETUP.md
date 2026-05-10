# LinkedIn API Setup — Sikatrix

Complete this once. After the 5-step setup, posting to LinkedIn is a single terminal command.

---

## What you need

- A LinkedIn account that is **admin of the Sikatrix company page**
- Access to `linkedin.com/developers`

---

## Step 1 — Create a LinkedIn App

1. Go to **https://www.linkedin.com/developers/apps/new**
2. Fill in:
   - **App name**: Sikatrix Social Publisher
   - **LinkedIn Page**: search and select the Sikatrix company page
   - **Privacy policy URL**: `https://www.sikatrix.com/privacy-policy`
   - **App logo**: upload sikatrix logo
3. Agree to terms → **Create app**
4. On the app page, open the **Auth** tab
5. Under **OAuth 2.0 scopes**, request these scopes:
   - `openid`
   - `profile`
   - `w_member_social`
   - `w_organization_social`
   - `r_organization_social`
6. Under **Authorized redirect URLs**, add:
   `http://localhost:3003/linkedin-callback`
7. Copy your **Client ID** and **Client Secret**

---

## Step 2 — Add credentials to `.env.local`

Open `C:\Users\Daniel\Documents\sikatrix\.env.local` and add:

```
LINKEDIN_CLIENT_ID=your_client_id_here
LINKEDIN_CLIENT_SECRET=your_client_secret_here
LINKEDIN_REDIRECT_URI=http://localhost:3003/linkedin-callback
```

---

## Step 3 — Get your access token (run this once, then again every 60 days)

```bash
cd C:\Users\Daniel\Documents\sikatrix
node scripts/linkedin-auth.mjs
```

This will:
1. Print an authorization URL — open it in your browser
2. You click **Allow** on LinkedIn
3. LinkedIn redirects to localhost:3003 — the script captures the code automatically
4. The script exchanges the code for an access token and saves it to `.env.local`

---

## Step 4 — Get your company page URN

```bash
node scripts/linkedin-get-urn.mjs
```

This fetches your company pages, finds Sikatrix automatically, and saves `LINKEDIN_AUTHOR_URN` to `.env.local`.

---

## Step 5 — Post an article

```bash
node scripts/linkedin-post.mjs sars-provisional-tax-guide-2025
```

Replace the slug with any article slug from `content/posts/`.

---

## Token renewal

LinkedIn access tokens last **60 days**. When one expires:
1. Re-run `node scripts/linkedin-auth.mjs`
2. Authorize again in the browser
3. Token is updated in `.env.local` automatically

---

## Troubleshooting

| Error | Fix |
|---|---|
| `401 Unauthorized` | Token expired — run `linkedin-auth.mjs` again |
| `403 Forbidden` | Missing scope — check app permissions in developer portal |
| `LINKEDIN_CLIENT_ID not set` | Check `.env.local` has the credentials |
| Callback page not loading | Make sure dev server is NOT running on port 3003 during auth |

---

## Full workflow after initial setup

```bash
# 1. Write and publish your article
# 2. git push origin master   (auto-deploys to sikatrix.com)
# 3. Post to LinkedIn:
node scripts/linkedin-post.mjs your-article-slug

# 4. (Optional) also fire Make webhook for Facebook + X:
node scripts/publish-post.mjs your-article-slug
```
