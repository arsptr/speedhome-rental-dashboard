'use client';

import { useMemo, useState } from 'react';

import { EmptyState } from '@/components/features/common/EmptyState';
import { ErrorState } from '@/components/features/common/ErrorState';
import { LoadingState } from '@/components/features/common/LoadingState';
import { AreaSearchInput } from '@/components/features/search/AreaSearchInput';
import { ListingTable } from '@/components/features/search/ListingTable';
import { StatisticsSummary } from '@/components/features/search/StatisticsSummary';
import { UrlInput } from '@/components/features/search/UrlInput';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  isValidSpeedhomeUrl,
  normalizeSpeedhomeUrl,
} from '@/lib/validators/speedhomeUrl';
import type { SearchFormState, SearchMode, SearchResult, SearchStatus } from '@/types/search';
import { getSearchQuery } from '@/types/search';
import type { ScrapeResult, ScrapedProperty } from '@/types/scraping';
import { cn } from '@/lib/utils';
import {
  downloadScrapeResultCsv,
  downloadScrapeResultExcel,
  downloadScrapeStatisticsCsv,
} from '@/lib/exportData';

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
  const [sortBy, setSortBy] = useState<'price' | 'area' | 'type'>('price');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | string>('all');

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

  const propertyTypes = useMemo(() => {
    if (!scrapeResult) return ['all'];
    const types = Array.from(
      new Set(scrapeResult.listings.map((listing) => listing.property_type).filter(Boolean)),
    );
    return ['all', ...types.sort()];
  }, [scrapeResult]);

  const sortedListings = useMemo((): ScrapedProperty[] => {
    if (!scrapeResult) return [];

    let listings = [...scrapeResult.listings];
    if (filterType !== 'all') {
      listings = listings.filter((listing) => listing.property_type === filterType);
    }

    return listings.sort((a, b) => {
      if (sortBy === 'price') {
        const aPrice = a.monthly_price ?? 0;
        const bPrice = b.monthly_price ?? 0;
        return sortDirection === 'asc' ? aPrice - bPrice : bPrice - aPrice;
      }

      if (sortBy === 'area') {
        return sortDirection === 'asc'
          ? a.area.localeCompare(b.area)
          : b.area.localeCompare(a.area);
      }

      return sortDirection === 'asc'
        ? a.property_type.localeCompare(b.property_type)
        : b.property_type.localeCompare(a.property_type);
    });
  }, [scrapeResult, sortBy, sortDirection, filterType]);

  const exportButtons = (
    <div className="grid gap-3 sm:grid-cols-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => scrapeResult && downloadScrapeResultCsv(scrapeResult, sortedListings)}
      >
        Download listings CSV
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => scrapeResult && downloadScrapeStatisticsCsv(scrapeResult, scrapeResult.statistics)}
      >
        Download statistics CSV
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => scrapeResult && downloadScrapeResultExcel(scrapeResult, sortedListings)}
      >
        Download Excel
      </Button>
    </div>
  );

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
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Listing count</p>
                  <p className="text-2xl font-semibold">{scrapeResult.listingCount}</p>
                </div>
                <div className="rounded-lg border border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Query type</p>
                  <p className="text-2xl font-semibold">{scrapeResult.mode.toUpperCase()}</p>
                </div>
                <div className="rounded-lg border border-muted p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Visible listings</p>
                  <p className="text-2xl font-semibold">{sortedListings.length}</p>
                </div>
              </div>

              <div className="mt-4">
                {exportButtons}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1 rounded-lg border border-muted p-4">
                  <label className="text-sm font-medium text-slate-700">Urutkan</label>
                  <select
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as 'price' | 'area' | 'type')}
                  >
                    <option value="price">Harga</option>
                    <option value="area">Area</option>
                    <option value="type">Tipe Properti</option>
                  </select>
                </div>

                <div className="space-y-1 rounded-lg border border-muted p-4">
                  <label className="text-sm font-medium text-slate-700">Arah</label>
                  <select
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    value={sortDirection}
                    onChange={(event) => setSortDirection(event.target.value as 'asc' | 'desc')}
                  >
                    <option value="asc">Asc</option>
                    <option value="desc">Desc</option>
                  </select>
                </div>

                <div className="space-y-1 rounded-lg border border-muted p-4">
                  <label className="text-sm font-medium text-slate-700">Filter tipe</label>
                  <select
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    value={filterType}
                    onChange={(event) => setFilterType(event.target.value)}
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type === 'all' ? 'Semua tipe' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {scrapeResult.statistics && scrapeResult.statistics.length > 0 ? (
                <div className="mt-6 space-y-6">
                  <StatisticsSummary statistics={scrapeResult.statistics} />

                  {scrapeResult.statistics.filter((stat) => stat.propertyType !== 'all').length > 0 ? (
                    <div className="space-y-3 rounded-lg border border-muted p-4">
                      <p className="text-sm font-semibold">Grouped statistics by property type</p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {scrapeResult.statistics
                          .filter((stat) => stat.propertyType !== 'all')
                          .map((stat) => (
                            <div key={stat.propertyType} className="rounded-lg border border-muted p-4">
                              <p className="text-sm font-semibold">{stat.propertyType}</p>
                              <p className="text-xs text-muted-foreground">Listings: {stat.listingCount}</p>
                              <p className="text-sm">Avg: {stat.averagePrice !== null ? `RM ${stat.averagePrice}` : 'N/A'}</p>
                              <p className="text-sm">Median: {stat.medianPrice !== null ? `RM ${stat.medianPrice}` : 'N/A'}</p>
                              <p className="text-sm">Fair: {stat.fairPrice !== null ? `RM ${stat.fairPrice}` : 'N/A'}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="mt-6">
                <ListingTable listings={scrapeResult.listings} />
              </div>
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
