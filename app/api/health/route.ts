import { NextResponse } from 'next/server';

import { checkSupabaseHealth } from '@/lib/supabase/health';

export async function GET() {
  const supabase = await checkSupabaseHealth();

  return NextResponse.json({
    status: 'ok',
    supabase,
    timestamp: new Date().toISOString(),
  });
}
