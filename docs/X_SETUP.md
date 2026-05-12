# X (Twitter) Posting Setup

This guide gets `scripts/x-post.mjs` working for @sikatrix in about 10 minutes.

---

## What you need

Four credentials from the X Developer Portal:

| Variable | Where to find it |
|---|---|
| `X_API_KEY` | App → Keys and Tokens → Consumer Keys → **API Key** |
| `X_API_SECRET` | App → Keys and Tokens → Consumer Keys → **API Key Secret** |
| `X_ACCESS_TOKEN` | App → Keys and Tokens → Authentication Tokens → **Access Token** |
| `X_ACCESS_TOKEN_SECRET` | App → Keys and Tokens → Authentication Tokens → **Access Token Secret** |

> **Important:** Bearer Token is NOT needed and will not work here. You need the OAuth 1.0a keys only.

---

## Step-by-step

### 1. Go to the developer portal
Open [developer.twitter.com](https://developer.twitter.com) and sign in with the **@sikatrix** account (not a personal account).

### 2. Open your app
Click **Projects & Apps** in the left sidebar → select your existing app (or create one if none exists).

### 3. Check app permissions — this is the most common mistake
- Click **App Settings** → **User authentication settings** → **Edit**
- Set **App permissions** to **Read and Write** (not Read only)
- Set **Type of App** to **Web App, Automated App or Bot**
- For Callback URI enter: `https://sikatrix.com` (placeholder — not used)
- Save

If you change permissions, you **must regenerate** the Access Token & Secret after saving — the old tokens will stop working.

### 4. Get your Consumer Keys
- Go to **Keys and Tokens** tab
- Under **Consumer Keys**, click **Regenerate** if you haven't already
- Copy **API Key** → paste as `X_API_KEY`
- Copy **API Key Secret** → paste as `X_API_SECRET`

### 5. Generate Access Token & Secret
- Still on the **Keys and Tokens** tab
- Under **Authentication Tokens**, click **Generate** next to Access Token and Secret
- This generates tokens **for the @sikatrix account specifically**
- Copy **Access Token** → paste as `X_ACCESS_TOKEN`
- Copy **Access Token Secret** → paste as `X_ACCESS_TOKEN_SECRET`

> **Do this while logged in as @sikatrix.** If you were logged in as a personal account when you generated these, they won't post as @sikatrix.

### 6. Add to .env.local
Open `.env.local` in the sikatrix project folder and add:

```
X_API_KEY=paste_your_api_key_here
X_API_SECRET=paste_your_api_key_secret_here
X_ACCESS_TOKEN=paste_your_access_token_here
X_ACCESS_TOKEN_SECRET=paste_your_access_token_secret_here
```

### 7. Test it
```bash
node scripts/x-post.mjs sars-provisional-tax-guide-2025
```

You should see the tweet text printed and then `✅  Posted successfully!` with a link to the live tweet.

---

## Common errors

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Wrong tokens or permissions not set to Read & Write | Regenerate access token AFTER setting permissions to Read & Write |
| `403 Forbidden` | App doesn't have Write permission | Step 3 above — change permissions then regenerate access token |
| `Your credentials do not allow access to this resource` | Access token was generated for the wrong account | Log in as @sikatrix, then regenerate the access token |
| `453` / `access_level` error | Free API tier restriction | Make sure your X developer account is on the Free tier with a confirmed phone number on @sikatrix |

---

## Usage

After setup, post any article to X with:

```bash
node scripts/x-post.mjs <article-slug>
```

Example:
```bash
node scripts/x-post.mjs vat-registration-when-and-how
node scripts/x-post.mjs sme-tax-compliance-calendar-2025-2026
```

The script reads the article frontmatter, builds a tweet with the title, URL, and up to 3 hashtags, and posts it directly.
