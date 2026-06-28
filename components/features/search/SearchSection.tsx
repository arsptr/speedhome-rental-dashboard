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
import type { ScrapeResult } from '@/types/scraping';
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
  const [scrapeResult, setScrapeResult] = useState<ScrapeResult | null>(null);

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
      setScrapeResult(null);
      return;
    }

    const query =
      form.mode === 'url' ? normalizeSpeedhomeUrl(form.url) : form.area.trim();

    setStatus('loading');
    setErrorMessage(null);
    setResult(null);
    setScrapeResult(null);

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

      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: form.mode, query }),
      });

      const data = await scrapeResponse.json();
      if (!scrapeResponse.ok) {
        throw new Error(data?.error || 'Unable to scrape the provided query.');
      }

      setScrapeResult(data);

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

      {status === 'success' && scrapeResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Scrape Results</CardTitle>
            <CardDescription>
              Found {scrapeResult.listingCount} listing{scrapeResult.listingCount === 1 ? '' : 's'} from the scraped URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                URL: <span className="text-foreground font-medium break-all">{scrapeResult.url}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Scraped at: <span className="text-foreground font-medium">{new Date(scrapeResult.fetchedAt).toLocaleString()}</span>
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Listing count</p>
                  <p className="text-2xl font-semibold">{scrapeResult.listingCount}</p>
                </div>
                <div className="rounded-lg border border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Query type</p>
                  <p className="text-2xl font-semibold">{scrapeResult.mode.toUpperCase()}</p>
                </div>
              </div>
              {scrapeResult.statistics && scrapeResult.statistics.length > 0 ? (
                <div className="mt-6 space-y-4">
                  {scrapeResult.statistics.find((stat) => stat.propertyType === 'all') ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: 'Average price', value: scrapeResult.statistics.find((stat) => stat.propertyType === 'all')?.averagePrice },
                        { label: 'Median price', value: scrapeResult.statistics.find((stat) => stat.propertyType === 'all')?.medianPrice },
                        { label: 'Mode price', value: scrapeResult.statistics.find((stat) => stat.propertyType === 'all')?.modePrice },
                        { label: 'Fair price', value: scrapeResult.statistics.find((stat) => stat.propertyType === 'all')?.fairPrice },
                        { label: 'Average size', value: scrapeResult.statistics.find((stat) => stat.propertyType === 'all')?.averageSizeSqft },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-lg border border-muted p-4">
                          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-semibold">
                            {stat.value !== null && stat.value !== undefined ? (
                              stat.label === 'Average size' ? `${stat.value} sqft` : `RM ${stat.value}`
                            ) : (
                              'N/A'
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {scrapeResult.statistics.filter((stat) => stat.propertyType !== 'all').length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-sm font-semibold">Grouped statistics by property type</p>
                      <div className="grid gap-3">
                        {scrapeResult.statistics
                          .filter((stat) => stat.propertyType !== 'all')
                          .map((stat) => (
                            <div key={stat.propertyType} className="rounded-lg border border-muted p-4">
                              <p className="text-sm font-semibold">{stat.propertyType}</p>
                              <p className="text-xs text-muted-foreground">Listings: {stat.listingCount}</p>
                              <p className="text-sm">Avg: {stat.averagePrice !== null ? `RM ${stat.averagePrice}` : 'N/A'}</p>
                              <p className="text-sm">Median: {stat.medianPrice !== null ? `RM ${stat.medianPrice}` : 'N/A'}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              {scrapeResult.listings.slice(0, 3).map((listing) => (
                <div key={listing.listing_url} className="rounded-lg border border-muted p-4">
                  <p className="text-sm font-semibold text-foreground break-all">{listing.title}</p>
                  <p className="text-xs text-muted-foreground">{listing.listing_url}</p>
                  <p className="text-sm">Price: {listing.monthly_price ? `RM ${listing.monthly_price}` : 'Not Available'}</p>
                  <p className="text-sm">Bedrooms: {listing.bedrooms}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : status === 'success' && result ? (
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
