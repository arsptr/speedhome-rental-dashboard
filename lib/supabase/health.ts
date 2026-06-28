import { isSupabaseConfigured } from '@/lib/supabase/config';
import { createServiceRoleClient } from '@/lib/supabase/server';

export type SupabaseHealthStatus =
  | 'pending'
  | 'configured'
  | 'connected'
  | 'migration_pending'
  | 'error';

export type SupabaseHealthResult = {
  status: SupabaseHealthStatus;
  message?: string;
};

export async function checkSupabaseHealth(): Promise<SupabaseHealthResult> {
  if (!isSupabaseConfigured()) {
    return {
      status: 'pending',
      message: 'Supabase environment variables are missing or invalid.',
    };
  }

  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase.from('search_sessions').select('id').limit(1);

    if (error?.code === '42P01') {
      return {
        status: 'migration_pending',
        message: 'Supabase is configured but database tables are not created yet.',
      };
    }

    if (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }

    return { status: 'connected' };
  } catch (error) {
    return {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown Supabase error',
    };
  }
}
