
---

## 📄 `docs/DEPLOYMENT.md`

```markdown
# FamilyOS — Deployment Guide

Zero-ops deployment: Vercel (frontend) + Render or Railway (API) + MongoDB Atlas (DB).

## 1. Prerequisites

| Service | Purpose | Cost |
|---|---|---|
| [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) | Managed Mongo cluster | Free tier (M0) |
| [Render](https://render.com) or [Railway](https://railway.app) | Node API hosting | $7–15/mo |
| [Vercel](https://vercel.com) | Static PWA hosting | Free |
| [Cloudinary](https://cloudinary.com) | Media + vault storage | Free tier |
| [Resend](https://resend.com) or [SendGrid](https://sendgrid.com) | Transactional email | Free tier |
| [OneSignal](https://onesignal.com) | Web push | Free |
| [IntaSend](https://intasend.com) or [PesaPal](https://pesapal.com) | M-Pesa aggregator | Per-txn |
| [Sentry](https://sentry.io) | Error tracking | Free tier |

## 2. Environment Variables

Every variable below must be set on the **API host** (Render/Railway). Only `VITE_*` variables are needed on Vercel.

```bash
# ─── Server ────────────────────────────────────────────────
NODE_ENV=production
PORT=10000                        # Render sets this automatically
API_URL=https://api.familyos.app
CLIENT_URL=https://familyos.app

# ─── Database ──────────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/familyos

# ─── JWT ───────────────────────────────────────────────────
JWT_ACCESS_SECRET=<openssl rand -hex 32>
JWT_REFRESH_SECRET=<openssl rand -hex 32>
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=30d

# ─── Integrations ──────────────────────────────────────────
CLOUDINARY_CLOUD_NAME=…
CLOUDINARY_API_KEY=…
CLOUDINARY_API_SECRET=…
RESEND_API_KEY=…
EMAIL_FROM=noreply@familyos.app
ONESIGNAL_APP_ID=…
ONESIGNAL_REST_API_KEY=…
INTASEND_PUBLISHABLE_KEY=…
INTASEND_SECRET_KEY=…
INTASEND_SANDBOX=false

# ─── Monitoring ────────────────────────────────────────────
SENTRY_DSN=…

# ─── Client (Vercel only) ──────────────────────────────────
VITE_API_URL=https://api.familyos.app/api/v1