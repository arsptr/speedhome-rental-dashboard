import type { ScrapeStatistics } from '@/types/analytics';
import type { ScrapedProperty, ScrapeMode, ScrapeResult } from '@/types/scraping';

function escapeCsv(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function buildCsv(rows: Array<Array<string | number | null | undefined>>, headers: string[]): string {
  const headerRow = headers.map((header) => escapeCsv(header)).join(',');
  const body = rows
    .map((row) => row.map((cell) => escapeCsv(cell === null || cell === undefined ? '' : String(cell))).join(','))
    .join('\n');

  return `${headerRow}\n${body}`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildFilename(prefix: string, query: string, mode: ScrapeMode, extension: string) {
  const safeQuery = query.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${mode}-${safeQuery}-${date}.${extension}`;
}

export function downloadScrapeResultCsv(scrapeResult: ScrapeResult, visibleListings: ScrapedProperty[]) {
  const listingHeaders = [
    'Title',
    'Property Name',
    'Area',
    'Bedrooms',
    'Size (sqft)',
    'Monthly Price',
    'Annual Price',
    'Type',
    'Listing URL',
    'Scraped At',
  ];

  const listingRows = visibleListings.map((listing) => [
    listing.title,
    listing.property_name,
    listing.area,
    listing.bedrooms,
    listing.property_size_sqft,
    listing.monthly_price,
    listing.annual_price,
    listing.property_type,
    listing.listing_url,
    listing.scraped_at,
  ]);

  const csv = buildCsv(listingRows, listingHeaders);
  const filename = buildFilename('speedhome-listings', scrapeResult.query, scrapeResult.mode, 'csv');
  downloadBlob(filename, new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
}

export function downloadScrapeStatisticsCsv(scrapeResult: ScrapeResult, statistics: ScrapeStatistics[]) {
  const statsHeaders = [
    'Property Type',
    'Listing Count',
    'Average Price',
    'Median Price',
    'Mode Price',
    'Fair Price',
    'Average Size (sqft)',
  ];

  const statsRows = statistics.map((stat) => [
    stat.propertyType,
    stat.listingCount,
    stat.averagePrice,
    stat.medianPrice,
    stat.modePrice,
    stat.fairPrice,
    stat.averageSizeSqft,
  ]);

  const csv = buildCsv(statsRows, statsHeaders);
  const filename = buildFilename('speedhome-statistics', scrapeResult.query, scrapeResult.mode, 'csv');
  downloadBlob(filename, new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
}

export async function downloadScrapeResultExcel(scrapeResult: ScrapeResult, visibleListings: ScrapedProperty[]) {
  const XLSX = await import('xlsx');
  const listingRows = visibleListings.map((listing) => ({
    Title: listing.title,
    PropertyName: listing.property_name,
    Area: listing.area,
    Bedrooms: listing.bedrooms,
    SizeSqft: listing.property_size_sqft,
    MonthlyPrice: listing.monthly_price,
    AnnualPrice: listing.annual_price,
    Type: listing.property_type,
    ListingURL: listing.listing_url,
    ScrapedAt: listing.scraped_at,
  }));

  const statisticsRows = scrapeResult.statistics.map((stat) => ({
    PropertyType: stat.propertyType,
    ListingCount: stat.listingCount,
    AveragePrice: stat.averagePrice,
    MedianPrice: stat.medianPrice,
    ModePrice: stat.modePrice,
    FairPrice: stat.fairPrice,
    AverageSizeSqft: stat.averageSizeSqft,
  }));

  const workbook = XLSX.utils.book_new();
  const listingSheet = XLSX.utils.json_to_sheet(listingRows);
  const statsSheet = XLSX.utils.json_to_sheet(statisticsRows);

  XLSX.utils.book_append_sheet(workbook, listingSheet, 'Listings');
  XLSX.utils.book_append_sheet(workbook, statsSheet, 'Statistics');

  const arrayBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const filename = buildFilename('speedhome-export', scrapeResult.query, scrapeResult.mode, 'xlsx');
  const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  downloadBlob(filename, blob);
}
