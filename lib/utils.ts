import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeText(value: string): string {
  return value
    .replace(/\s+/g, ' ')
    .replace(/[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g, ' ')
    .trim();
}

export function parseCurrency(text: string, fallbackPattern?: RegExp): number | null {
  const currencyPatterns = [
    /RM\s*([\d,.]+)/gi,
    /MYR\s*([\d,.]+)/gi,
    /([\d,]+(?:\.\d+)?)\s*(?:per month|pm|monthly|monthly rental)/gi,
  ];

  const patterns = fallbackPattern ? [fallbackPattern, ...currencyPatterns] : currencyPatterns;

  for (const pattern of patterns) {
    const match = pattern.exec(text);
    if (match?.[1]) {
      const numeric = match[1].replace(/,/g, '').trim();
      const parsed = Number(numeric);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

export function parseBedrooms(text: string): string {
  const bedroomPatterns = [
    /(\d+)\s*(?:bedrooms?|bdrm|bd|br)\b/i,
    /(studio)\b/i,
    /(1\s*room)\b/i,
  ];

  for (const pattern of bedroomPatterns) {
    const match = pattern.exec(text);
    if (match) {
      return normalizeText(match[0]);
    }
  }

  return 'Not Available';
}

export function parsePropertySize(text: string): number | null {
  const sizePatterns = [
    /(\d+[\d,.]*)\s*(?:sqft|sq\.ft|sq ft|ft²|ft2)\b/i,
    /(\d+[\d,.]*)\s*(?:sqm|sq\.m|sq m|m²|m2)\b/i,
  ];

  for (const pattern of sizePatterns) {
    const match = pattern.exec(text);
    if (match?.[1]) {
      const numeric = match[1].replace(/,/g, '').trim();
      const parsed = Number(numeric);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }
  }

  return null;
}

export function parsePropertyType(text: string): string {
  const types = [
    'studio',
    'apartment',
    'condo',
    'terrace',
    'house',
    'townhouse',
    'service apartment',
    'semi-detached',
    'bungalow',
    'duplex',
    'pavilion',
  ];

  const normalized = text.toLowerCase();
  for (const type of types) {
    if (normalized.includes(type)) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  }

  return 'Not Available';
}
