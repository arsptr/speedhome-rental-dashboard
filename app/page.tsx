import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { APP_DESCRIPTION, APP_NAME } from '@/utils/constants';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export default function HomePage() {
  const supabaseReady = isSupabaseConfigured();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-muted-foreground text-sm">{APP_DESCRIPTION}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Phase 1 — Project Initialization</CardTitle>
            <CardDescription>Foundation setup is in place. Core UI starts in Phase 2.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <SetupItem label="Next.js App Router" ready />
            <SetupItem label="TypeScript" ready />
            <SetupItem label="Tailwind CSS" ready />
            <SetupItem label="shadcn/ui (New York)" ready />
            <SetupItem label="ESLint & Prettier" ready />
            <SetupItem
              label="Supabase integration"
              ready={supabaseReady}
              note={
                supabaseReady
                  ? 'Environment variables detected.'
                  : 'Add Supabase credentials to .env.local when your project is ready.'
              }
            />
            <SetupItem label="Vercel deployment" ready note="Connect repository and env vars on Vercel." />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function SetupItem({
  label,
  ready,
  note,
}: {
  label: string;
  ready?: boolean;
  note?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-4">
        <span>{label}</span>
        <span
          className={
            ready
              ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800'
              : 'rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800'
          }
        >
          {ready ? 'Ready' : 'Pending'}
        </span>
      </div>
      {note ? <p className="text-muted-foreground text-xs">{note}</p> : null}
    </div>
  );
}
