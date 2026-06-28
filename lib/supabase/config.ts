function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function isSupabaseConfigured(): boolean {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL');
  const anonKey = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!url || !anonKey) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.hostname.endsWith('.supabase.co');
  } catch {
    return false;
  }
}

export function getSupabaseUrl(): string {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL');

  if (!url) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL');
  }

  return url;
}

export function getSupabaseAnonKey(): string {
  const key = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

  if (!key) {
    throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return key;
}

export function getSupabaseServiceRoleKey(): string {
  const key = readEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!key) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY');
  }

  return key;
}
