import { SPEEDHOME_HOSTS } from '@/utils/constants';

export function isValidSpeedhomeUrl(value: string): boolean {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    return SPEEDHOME_HOSTS.includes(url.hostname as (typeof SPEEDHOME_HOSTS)[number]);
  } catch {
    return false;
  }
}

export function normalizeSpeedhomeUrl(value: string): string {
  const trimmed = value.trim();
  return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
}
