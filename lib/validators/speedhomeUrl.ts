import { SPEEDHOME_HOSTS } from '@/utils/constants';

const CANONICAL_HOSTS: Record<string, string> = {
  'speedhome.com.my': 'www.speedhome.com',
  'www.speedhome.com.my': 'www.speedhome.com',
  'speedhome.com': 'www.speedhome.com',
  'www.speedhome.com': 'www.speedhome.com',
};

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
  const rawUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(rawUrl);
    const canonical = CANONICAL_HOSTS[url.hostname.toLowerCase()] ?? url.hostname;
    url.hostname = canonical;
    return url.toString();
  } catch {
    return rawUrl;
  }
}
