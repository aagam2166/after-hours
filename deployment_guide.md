# After Hours — Deployment Guide (Vercel + Supabase)

> [!NOTE]
> Your stack is fully compatible with **Vercel + Supabase**. The frontend (Vite/React) deploys as a static site, the backend (Express) deploys as Vercel Serverless Functions, and the database runs on Supabase PostgreSQL.

## Architecture Overview

```mermaid
graph LR
    A["Frontend<br/>(Vercel Static)"] -->|HTTPS| B["Backend API<br/>(Vercel Serverless)"]
    B -->|Pooled Connection| C["Supabase<br/>PostgreSQL"]
```

---

## Step 1: Set Up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a **region** close to your users (e.g., `ap-south-1` for India)
3. Set a strong **database password** — save it somewhere safe
4. Once the project is created, go to **Settings → Database**
5. Copy both connection strings:

| String | Where to Find | Port | Use |
|--------|--------------|------|-----|
| **Connection string (pooled)** | `URI` tab → Session mode | `6543` | `DATABASE_URL` — runtime queries |
| **Connection string (direct)** | `URI` tab → Direct | `5432` | `DIRECT_URL` — migrations |

> [!IMPORTANT]
> Append `?pgbouncer=true` to the **pooled** `DATABASE_URL`. The **direct** URL does NOT need this.

Example:
```
DATABASE_URL="postgresql://postgres.xxxx:password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxx:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres"
```

### Run Migrations Against Supabase

From your local machine, temporarily set the env vars and push the schema:

```bash
cd backend

# Set env vars temporarily
export DATABASE_URL="your-pooled-url"
export DIRECT_URL="your-direct-url"

# Deploy existing migrations to Supabase
npx prisma migrate deploy

# (Optional) Seed the database
npx tsx prisma/seed.ts
```

---

## Step 2: Deploy Backend to Vercel

### 2a. Install Vercel CLI (if not already)

```bash
npm i -g vercel
```

### 2b. Deploy the Backend

```bash
cd backend
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your Vercel account
- **Link to existing project?** → No (create new)
- **Project name?** → `after-hours-api`
- **Directory?** → `./`

### 2c. Set Environment Variables

Go to [Vercel Dashboard](https://vercel.com) → `after-hours-api` → **Settings** → **Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `DATABASE_URL` | Your Supabase **pooled** connection string | Production |
| `DIRECT_URL` | Your Supabase **direct** connection string | Production |
| `JWT_SECRET` | A strong random string (32+ chars) | Production |
| `JWT_EXPIRES_IN` | `7d` | Production |
| `NODE_ENV` | `production` | Production |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` (set after frontend deploy) | Production |
| `OTP_MOCK_MODE` | `true` (set to `false` when you have real SMS) | Production |
| `OTP_MOCK_CODE` | `1234` | Production |

> [!TIP]
> Generate a strong JWT secret: `openssl rand -base64 32`

### 2d. Redeploy with Env Vars

```bash
cd backend
vercel --prod
```

Your backend API will be live at something like: `https://after-hours-api.vercel.app`

Test it: `curl https://after-hours-api.vercel.app/health`

---

## Step 3: Deploy Frontend to Vercel

### 3a. Deploy

```bash
cd frontend
vercel
```

Follow the prompts:
- **Project name?** → `after-hours`
- **Framework?** → Vite (auto-detected)
- **Build command?** → `npm run build` (default)
- **Output directory?** → `dist` (default)

### 3b. Set Environment Variables

Go to Vercel Dashboard → `after-hours` → **Settings** → **Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `VITE_API_URL` | `https://after-hours-api.vercel.app` (your backend URL) | Production |

> [!WARNING]
> `VITE_` prefix is required — Vite only exposes env vars with this prefix to the browser.

### 3c. Redeploy with Env Vars

```bash
cd frontend
vercel --prod
```

---

## Step 4: Update Backend CORS

Now that your frontend is live, go back to the backend project on Vercel:

1. **Settings → Environment Variables**
2. Update `FRONTEND_URL` to your actual frontend URL (e.g., `https://after-hours.vercel.app`)
3. Redeploy: `cd backend && vercel --prod`

---

## Summary of Code Changes Made

| File | Change |
|------|--------|
| [`client.ts`](file:///home/aagam/Desktop/after-hours/frontend/src/api/client.ts) | Uses `VITE_API_URL` env var for production API base |
| [`env.ts`](file:///home/aagam/Desktop/after-hours/backend/src/config/env.ts) | Added `DIRECT_URL` and `FRONTEND_URL` to schema |
| [`app.ts`](file:///home/aagam/Desktop/after-hours/backend/src/app.ts) | CORS uses `FRONTEND_URL`; skips `listen()` on Vercel |
| [`schema.prisma`](file:///home/aagam/Desktop/after-hours/backend/prisma/schema.prisma) | Added `directUrl` for Supabase connection pooling |
| [`vercel.json`](file:///home/aagam/Desktop/after-hours/backend/vercel.json) | Routes `/api/*` and `/health` to serverless function |
| [`api/index.ts`](file:///home/aagam/Desktop/after-hours/backend/api/index.ts) | Vercel serverless entry point (re-exports Express app) |
| [`package.json`](file:///home/aagam/Desktop/after-hours/backend/package.json) | Added `postinstall`, `vercel-build`, `prisma:deploy` scripts |
| [`.env.example`](file:///home/aagam/Desktop/after-hours/backend/.env.example) | Updated with Supabase connection string templates |
| [`frontend/.env.example`](file:///home/aagam/Desktop/after-hours/frontend/.env.example) | New — documents `VITE_API_URL` |

---

## Quick Reference — Deploy Commands

```bash
# 1. Set up Supabase DB & run migrations
cd backend
export DATABASE_URL="..." DIRECT_URL="..."
npx prisma migrate deploy
npx tsx prisma/seed.ts

# 2. Deploy backend
cd backend
vercel              # first time setup
vercel --prod       # production deploy

# 3. Deploy frontend
cd frontend
vercel              # first time setup
vercel --prod       # production deploy
```

> [!CAUTION]
> Never commit your `.env` file. The `.gitignore` already excludes it. Use Vercel's dashboard or CLI (`vercel env add`) for production secrets.

## Custom Domain (Optional)

Both projects can have custom domains configured in **Vercel Dashboard → Settings → Domains**.
For example: `api.afterhours.in` and `afterhours.in`.
