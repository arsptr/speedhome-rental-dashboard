export type SearchMode = 'url' | 'area';

export type SearchFormState = {
  mode: SearchMode;
  url: string;
  area: string;
};

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';

export type SearchResult = {
  mode: SearchMode;
  query: string;
};

export function getSearchQuery(form: SearchFormState): string {
  return form.mode === 'url' ? form.url.trim() : form.area.trim();
}
