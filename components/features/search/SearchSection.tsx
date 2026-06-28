'use client';

import { useState } from 'react';

import { EmptyState } from '@/components/features/common/EmptyState';
import { ErrorState } from '@/components/features/common/ErrorState';
import { LoadingState } from '@/components/features/common/LoadingState';
import { AreaSearchInput } from '@/components/features/search/AreaSearchInput';
import { UrlInput } from '@/components/features/search/UrlInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  isValidSpeedhomeUrl,
  normalizeSpeedhomeUrl,
} from '@/lib/validators/speedhomeUrl';
import type { SearchFormState, SearchMode, SearchResult, SearchStatus } from '@/types/search';
import { getSearchQuery } from '@/types/search';
import { cn } from '@/lib/utils';

const INITIAL_FORM: SearchFormState = {
  mode: 'area',
  url: '',
  area: '',
};

export function SearchSection() {
  const [form, setForm] = useState<SearchFormState>(INITIAL_FORM);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<SearchResult | null>(null);

  const isSubmitting = status === 'loading';

  function switchMode(mode: SearchMode) {
    setForm((current) => ({ ...current, mode }));
    setStatus('idle');
    setErrorMessage(null);
    setResult(null);
  }

  function validateForm(): string | null {
    if (form.mode === 'url') {
      if (!form.url.trim()) {
        return 'Please paste a SPEEDHOME URL.';
      }

      if (!isValidSpeedhomeUrl(form.url)) {
        return 'Please enter a valid SPEEDHOME URL from speedhome.com.my.';
      }

      return null;
    }

    if (!form.area.trim()) {
      return 'Please enter a property or area name.';
    }

    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setStatus('error');
      setErrorMessage(validationError);
      setResult(null);
      return;
    }

    const query =
      form.mode === 'url' ? normalizeSpeedhomeUrl(form.url) : form.area.trim();

    setStatus('loading');
    setErrorMessage(null);
    setResult(null);

    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Unable to reach the application backend.');
      }

      const health = (await response.json()) as {
        supabase?: { status?: string; message?: string };
      };

      if (health.supabase?.status === 'migration_pending') {
        throw new Error(
          'Supabase tables are not ready yet. Run the SQL migration in Supabase Dashboard.',
        );
      }

      if (health.supabase?.status === 'error') {
        throw new Error(health.supabase.message ?? 'Supabase connection failed.');
      }

      setResult({ mode: form.mode, query });
      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Search failed. Please try again.',
      );
    }
  }

  function handleRetry() {
    setStatus('idle');
    setErrorMessage(null);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Rental Listings</CardTitle>
          <CardDescription>
            Search by SPEEDHOME URL or property area to prepare the pricing dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1 sm:w-fit">
              <ModeButton
                active={form.mode === 'area'}
                label="Area Search"
                onClick={() => switchMode('area')}
              />
              <ModeButton
                active={form.mode === 'url'}
                label="URL Search"
                onClick={() => switchMode('url')}
              />
            </div>

            {form.mode === 'url' ? (
              <UrlInput
                value={form.url}
                disabled={isSubmitting}
                onChange={(url) => setForm((current) => ({ ...current, url }))}
              />
            ) : (
              <AreaSearchInput
                value={form.area}
                disabled={isSubmitting}
                onChange={(area) => setForm((current) => ({ ...current, area }))}
              />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                Current query:{' '}
                <span className="text-foreground font-medium">
                  {getSearchQuery(form) || 'Not entered yet'}
                </span>
              </p>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? 'Searching...' : 'Search Listings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {status === 'loading' ? (
        <LoadingState message="Validating your search and preparing the dashboard view." />
      ) : null}

      {status === 'error' && errorMessage ? (
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      ) : null}

      {status === 'success' && result ? (
        <EmptyState
          title="Search ready — scraping starts in Phase 3"
          message={`Your ${result.mode === 'url' ? 'URL' : 'area'} search for "${result.query}" is valid. Listing collection and dashboard results will be connected in the next phase.`}
        />
      ) : null}

      {status === 'idle' ? (
        <EmptyState
          title="Start with a search"
          message="Enter a SPEEDHOME URL or property area above to begin exploring rental pricing insights."
        />
      ) : null}
    </div>
  );
}

function ModeButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        'rounded-md px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
