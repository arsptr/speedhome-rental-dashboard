'use client';

import { useEffect, useState } from 'react';

import { AUTOCOMPLETE_MIN_QUERY_LENGTH } from '@/utils/constants';

type UseAutocompleteOptions = {
  query: string;
  enabled?: boolean;
};

export function useAutocomplete({ query, enabled = true }: UseAutocompleteOptions) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!enabled || query.trim().length < AUTOCOMPLETE_MIN_QUERY_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch suggestions');
        }

        const data = (await response.json()) as { suggestions: string[] };
        setSuggestions(data.suggestions);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [enabled, query]);

  return { suggestions, isLoading };
}
