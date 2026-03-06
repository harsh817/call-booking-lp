# Hostinger Subdomain Deployment Plan
## `call-booking-lp` → `book.thriveonp.com`

> **This is a static HTML site** — no build step required. Files upload directly as-is.

---

## Architecture Overview

```
YOUR COMPUTER
  c:\Users\goel.harsh\call-booking-lp\
  ├── index.html          ← Main landing page
  ├── stitch-extracted/
  │   └── code.html
  └── .github/
      └── workflows/
          └── deploy.yml  ← (you will create this)
        ↓ git push

GITHUB
  Repository: harsh817/call-booking-lp
  GitHub Actions:
    1. Checkout code
    2. Upload via FTP (no build needed — static HTML)
        ↓ FTP Upload

HOSTINGER SERVER  (srv981.hstgr.io)
  public_html/
  └── book/               ← Your subdomain folder
      ├── index.html
      └── stitch-extracted/
          └── code.html
        ↓ serves

LIVE SITE
  https://book.thriveonp.com
```

> **Note:** Replace `book` with whatever subdomain name you want (e.g. `call`, `coaching`, `bondstyle`). You pick this in Step 1.

---

## Step-by-Step Setup

---

### Step 1 — Create the Subdomain in Hostinger hPanel

1. Log into [hPanel](https://hpanel.hostinger.com)
2. Go to **Hosting** → **Manage** → **Subdomains**
3. Click **Create Subdomain** and fill in:
   - **Subdomain:** `book` *(or your chosen name)*
   - **Domain:** `thriveonp.com`
   - **Document Root:** `public_html/book`
4. Click **Create** — SSL auto-generates within 5–10 min
5. Verify the DNS A record was auto-added:
   - Go to **DNS Zone** → confirm `book` A record → `89.117.27.169`

---

### Step 2 — Get Your FTP Credentials from Hostinger

1. In hPanel go to **Files** → **FTP Accounts**
2. Note down (or copy):
   - **FTP Host:** `ftp.thriveonp.com`
   - **FTP Username:** `u469468858`
   - **FTP Password:** *(the one you set — reset it here if forgotten)*

---

### Step 3 — Add GitHub Repository Secrets

1. Go to [github.com/harsh817/call-booking-lp](https://github.com/harsh817/call-booking-lp)
2. **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
3. Add these three secrets one by one:

| Name | Value |
|------|-------|
| `FTP_HOST` | `ftp.thriveonp.com` |
| `FTP_USER` | `u469468858` |
| `FTP_PASS` | *(your FTP password)* |

---

### Step 4 — Create the GitHub Actions Workflow File

Create this file in your project (or copy-paste it):

**File path:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to Hostinger

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_HOST }}
          username: ${{ secrets.FTP_USER }}
          password: ${{ secrets.FTP_PASS }}
          local-dir: ./
          server-dir: /book/
          exclude: |
            **/.git*
            **/.git*/**
            DEPLOY.md
            copy.md
            stitch.zip
            stitch-extracted/**
            node_modules/**
```

> **`server-dir: /book/`** maps to `public_html/book/` on Hostinger automatically.
> The `exclude` list keeps junk files off the server — only `index.html` is uploaded.

---

### Step 5 — Initialize Local Git & Push

Run these commands in your terminal from `c:\Users\goel.harsh\call-booking-lp\`:

```powershell
# Set up git identity (one-time)
git config --global user.name "harsh817"
git config --global user.email "your@email.com"

# Initialize git (already done — repo exists on GitHub)
git init
git remote add origin https://github.com/harsh817/call-booking-lp.git
git pull origin main --allow-unrelated-histories

# Create the workflow file
mkdir .github\workflows
# (paste the deploy.yml content into .github\workflows\deploy.yml)

# Commit and push
git add .
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

---

### Step 6 — Watch the Deployment

1. Go to [github.com/harsh817/call-booking-lp/actions](https://github.com/harsh817/call-booking-lp/actions)
2. You will see a running workflow — click it to watch live logs
3. It takes ~30–60 seconds for a static site this small
4. Green ✅ = deployed

---

### Step 7 — Verify Everything Works

- [ ] GitHub Actions shows ✅ green checkmark
- [ ] Hostinger File Manager: `public_html/book/` folder has `index.html` with a recent timestamp
- [ ] Visit **https://book.thriveonp.com** — landing page loads
- [ ] SSL padlock shows in browser (https works)
- [ ] Test on mobile (responsive layout)
- [ ] Check Facebook Pixel Helper if Meta Pixel is added

---

## What Gets Uploaded vs Excluded

```
UPLOADED to server:            EXCLUDED from server:
✅ index.html                  ❌ DEPLOY.md
                               ❌ copy.md
                               ❌ stitch.zip
                               ❌ stitch-extracted/
                               ❌ .git/ folder
                               ❌ .github/ folder
```

---

## Every Future Update

After the initial setup, deploying changes is just:

```powershell
git add .
git commit -m "Update landing page copy"
git push origin main
# GitHub Actions auto-deploys in ~30 seconds
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| FTP login failed | Double-check FTP_PASS secret in GitHub — reset password in hPanel if unsure |
| Site shows 404 | Confirm subdomain Document Root is `public_html/book` in hPanel |
| `server-dir` error | Make sure it's `/book/` with leading and trailing slash |
| Old files still showing | Hard refresh browser: `Ctrl + Shift + R` |
| SSL not working | Wait 10 min after subdomain creation for auto-SSL to kick in |

---

*Repository: [harsh817/call-booking-lp](https://github.com/harsh817/call-booking-lp)*
