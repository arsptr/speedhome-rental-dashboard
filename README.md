# SPEEDHOME Rental Price Dashboard

Web application that collects publicly available SPEEDHOME Malaysia rental listings and transforms them into pricing insights.

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS 4
- shadcn/ui (New York)
- Supabase
- Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Supabase project (Phase 4)
- Vercel account (deployment)

### Installation

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` when your Supabase project is ready:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |

## Project Structure

```
app/              Next.js App Router pages and API routes
components/       UI and feature components
lib/              Shared libraries (Supabase, utils)
types/            TypeScript type definitions
utils/            App constants and helpers
docs/             Project documentation
```

## Supabase Setup

See **[docs/SUPABASE_SETUP.md](docs/SUPABASE_SETUP.md)** for the full guide.

Quick steps:

1. Create a project at [supabase.com/dashboard/new](https://supabase.com/dashboard/new).
2. Run `supabase/migrations/20250627000000_initial_schema.sql` in the SQL Editor.
3. Copy URL, anon key, and service role key into `.env.local` and Vercel env vars.

## Deploy to Vercel

1. Push this repository to GitHub.
2. Import the repository in [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables from `.env.local`.
4. Deploy.

Health check endpoint: `/api/health`

## Documentation

Read project docs in order:

1. `docs/00_PROJECT_OVERVIEW.md`
2. `docs/01_ENGINEERING_CONSTITUTION.md`
3. `docs/02_PROJECT_CONSTITUTION.md`
4. `docs/03_ENGINEERING_PLAYBOOK.md`
5. `docs/04_PRD.md`
6. `docs/05_IMPLEMENTATION_ROADMAP.md`

## License

Private — technical assessment project.
