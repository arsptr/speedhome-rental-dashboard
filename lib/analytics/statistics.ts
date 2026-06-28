import type { ScrapedProperty } from '@/types/scraping';

export type ScrapeStatistics = {
  propertyType: string;
  listingCount: number;
  averagePrice: number | null;
  medianPrice: number | null;
  modePrice: number | null;
  fairPrice: number | null;
  averageSizeSqft: number | null;
};

function normalizeMonthlyPrice(property: ScrapedProperty): number | null {
  if (property.monthly_price !== null && !Number.isNaN(property.monthly_price)) {
    return property.monthly_price;
  }

  if (property.annual_price !== null && !Number.isNaN(property.annual_price)) {
    return Math.round((property.annual_price / 12) * 100) / 100;
  }

  return null;
}

function roundTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}

function calculateAverage(values: number[]): number | null {
  if (values.length === 0) return null;
  return roundTwoDecimals(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return roundTwoDecimals((sorted[middle - 1] + sorted[middle]) / 2);
  }

  return roundTwoDecimals(sorted[middle]);
}

function calculateMode(values: number[]): number | null {
  if (values.length === 0) return null;
  const frequency = new Map<number, number>();

  for (const value of values) {
    frequency.set(value, (frequency.get(value) ?? 0) + 1);
  }

  let mode: number | null = null;
  let maxCount = 0;

  for (const [value, count] of frequency.entries()) {
    if (count > maxCount || (count === maxCount && value < (mode ?? Infinity))) {
      maxCount = count;
      mode = value;
    }
  }

  return mode === null ? null : roundTwoDecimals(mode);
}

function calculateFairPrice(values: number[]): number | null {
  const average = calculateAverage(values);
  const median = calculateMedian(values);
  const mode = calculateMode(values);
  const candidates = [average, median, mode].filter((value): value is number => value !== null);

  if (candidates.length === 0) {
    return null;
  }

  return roundTwoDecimals(candidates.reduce((sum, value) => sum + value, 0) / candidates.length);
}

function calculateAverageSizeSqft(properties: ScrapedProperty[]): number | null {
  const sizes = properties
    .map((property) => property.property_size_sqft)
    .filter((size): size is number => size !== null && !Number.isNaN(size));

  if (sizes.length === 0) return null;
  return roundTwoDecimals(sizes.reduce((sum, size) => sum + size, 0) / sizes.length);
}

export function groupListingsByPropertyType(properties: ScrapedProperty[]) {
  return properties.reduce<Record<string, ScrapedProperty[]>>((groups, property) => {
    const key = property.property_type || 'Not Available';
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(property);
    return groups;
  }, {});
}

export function buildScrapeStatistics(
  properties: ScrapedProperty[],
  propertyType = 'all',
): ScrapeStatistics {
  const monthlyPrices = properties
    .map(normalizeMonthlyPrice)
    .filter((price): price is number => price !== null && !Number.isNaN(price));

  return {
    propertyType,
    listingCount: properties.length,
    averagePrice: calculateAverage(monthlyPrices),
    medianPrice: calculateMedian(monthlyPrices),
    modePrice: calculateMode(monthlyPrices),
    fairPrice: calculateFairPrice(monthlyPrices),
    averageSizeSqft: calculateAverageSizeSqft(properties),
  };
}

export function buildGroupedScrapeStatistics(properties: ScrapedProperty[]) {
  const groups = groupListingsByPropertyType(properties);
  return Object.entries(groups).map(([propertyType, groupedProperties]) =>
    buildScrapeStatistics(groupedProperties, propertyType),
  );
}
