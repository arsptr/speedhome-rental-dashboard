import { NextResponse } from 'next/server';

import { isSupabaseConfigured } from '@/lib/supabase/config';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    supabase: isSupabaseConfigured() ? 'configured' : 'pending',
    timestamp: new Date().toISOString(),
  });
}
