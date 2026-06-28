# Supabase Setup Guide

## 1. Create a Supabase project

1. Open [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in or create an account
3. Click **New project**
4. Recommended settings:
   - **Name:** `speedhome-rental-dashboard`
   - **Database password:** generate a strong password and save it
   - **Region:** `Southeast Asia (Singapore)` — closest to Malaysia

## 2. Run the database migration

1. In Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/20250627000000_initial_schema.sql`
4. Click **Run**

## 3. Copy API credentials

In **Project Settings → API**, copy:

| Variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (keep secret) |

## 4. Configure local environment

```bash
cp .env.local.example .env.local
```

Paste the three Supabase values into `.env.local`.

## 5. Configure Vercel

In Vercel → Project → **Settings → Environment Variables**, add the same three variables for **Production**, **Preview**, and **Development**.

Redeploy after saving env vars.

## 6. Verify

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — Supabase should show **Ready**.

Health check: [http://localhost:3000/api/health](http://localhost:3000/api/health) → `"supabase": "configured"`
