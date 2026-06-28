import {
  AREA_SUGGESTIONS,
  AUTOCOMPLETE_MAX_SUGGESTIONS,
  AUTOCOMPLETE_MIN_QUERY_LENGTH,
} from '@/utils/constants';

export function filterAreaSuggestions(query: string): string[] {
  const normalized = query.trim().toLowerCase();

  if (normalized.length < AUTOCOMPLETE_MIN_QUERY_LENGTH) {
    return [];
  }

  return AREA_SUGGESTIONS.filter((area) => area.toLowerCase().includes(normalized)).slice(
    0,
    AUTOCOMPLETE_MAX_SUGGESTIONS,
  );
}
