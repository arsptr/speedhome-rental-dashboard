import type { SearchMode } from '@/types/search';

export type ScrapedProperty = {
  listing_url: string;
  title: string;
  property_name: string;
  area: string;
  monthly_price: number | null;
  annual_price: number | null;
  bedrooms: string;
  furniture_status: string;
  property_size_sqft: number | null;
  property_type: string;
  scraped_at: string;
};

export type ScrapeMode = SearchMode;

export type ScrapeRequest = {
  mode: ScrapeMode;
  query: string;
};

export type ScrapeResult = {
  mode: ScrapeMode;
  query: string;
  url: string;
  listingCount: number;
  listings: ScrapedProperty[];
  fetchedAt: string;
};
