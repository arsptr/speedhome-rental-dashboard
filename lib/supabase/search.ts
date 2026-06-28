import type { Database } from '@/types/database';
import type { ScrapedProperty, ScrapeResult } from '@/types/scraping';
import type { ScrapeStatistics } from '@/types/analytics';
import { createServiceRoleClient } from '@/lib/supabase/server';

const TABLE_SEARCH_SESSIONS = 'search_sessions';
const TABLE_PROPERTY_LISTINGS = 'property_listings';
const TABLE_SEARCH_STATISTICS = 'search_statistics';

export async function createSearchSession(
  searchType: Database['public']['Tables']['search_sessions']['Row']['search_type'],
  searchQuery: string,
) {
  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from(TABLE_SEARCH_SESSIONS)
    .insert({ search_type: searchType, search_query: searchQuery, status: 'scraping' })
    .select('id')
    .single();

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create search session.');
  }

  return data.id;
}

export async function updateSearchSession(
  sessionId: string,
  status: Database['public']['Tables']['search_sessions']['Row']['status'],
  listingCount?: number,
  errorMessage?: string | null,
) {
  const supabase = createServiceRoleClient();
  const updatePayload: Partial<Database['public']['Tables']['search_sessions']['Update']> = {
    status,
  };

  if (typeof listingCount === 'number') {
    updatePayload.listing_count = listingCount;
  }

  if (errorMessage !== undefined) {
    updatePayload.error_message = errorMessage;
  }

  if (status === 'completed' || status === 'failed') {
    updatePayload.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from(TABLE_SEARCH_SESSIONS)
    .update(updatePayload)
    .eq('id', sessionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function insertPropertyListings(
  sessionId: string,
  listings: ScrapedProperty[],
): Promise<number> {
  const supabase = createServiceRoleClient();

  const normalizedListings = listings
    .map((listing) => ({
      session_id: sessionId,
      listing_url: listing.listing_url,
      title: listing.title || 'Not Available',
      property_name: listing.property_name || 'Not Available',
      area: listing.area || 'Not Available',
      monthly_price: listing.monthly_price,
      annual_price: listing.annual_price,
      bedrooms: listing.bedrooms || 'Not Available',
      furniture_status: listing.furniture_status || 'Not Available',
      property_size_sqft: listing.property_size_sqft,
      property_type: listing.property_type || 'Not Available',
      scraped_at: listing.scraped_at || new Date().toISOString(),
    }))
    .filter((row) => row.listing_url.trim().length > 0);

  if (normalizedListings.length === 0) {
    return 0;
  }

  const uniqueListings = Array.from(
    new Map(normalizedListings.map((row) => [row.listing_url, row])).values(),
  );

  let insertedCount = 0;

  for (const listing of uniqueListings) {
    const { error } = await supabase
      .from(TABLE_PROPERTY_LISTINGS)
      .insert(listing);

    if (error) {
      const isDuplicate =
        error.code === '23505' ||
        error.message?.toLowerCase().includes('duplicate') ||
        error.details?.toLowerCase().includes('duplicate');

      if (isDuplicate) {
        continue;
      }

      throw new Error(error.message);
    }

    insertedCount += 1;
  }

  return insertedCount;
}

export async function insertSearchStatistics(
  sessionId: string,
  statistics: ScrapeStatistics[],
): Promise<void> {
  const supabase = createServiceRoleClient();

  const payload = statistics.map((stat) => ({
    session_id: sessionId,
    property_type: stat.propertyType,
    listing_count: stat.listingCount,
    average_price: stat.averagePrice,
    median_price: stat.medianPrice,
    mode_price: stat.modePrice,
    fair_price: stat.fairPrice,
    average_size_sqft: stat.averageSizeSqft,
  }));

  const { error } = await supabase
    .from(TABLE_SEARCH_STATISTICS)
    .upsert(payload, { onConflict: 'session_id,property_type' });

  if (error) {
    throw new Error(error.message);
  }
}

export async function persistScrapeResult(
  sessionId: string,
  result: ScrapeResult,
  statistics: ScrapeStatistics[],
) {
  const listingCount = await insertPropertyListings(sessionId, result.listings);
  await insertSearchStatistics(sessionId, statistics);
  await updateSearchSession(sessionId, 'completed', listingCount);
}
