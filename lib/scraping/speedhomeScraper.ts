import { load } from 'cheerio';

import { isPathAllowed } from '@/lib/scraping/robots';
import {
  normalizeText,
  parseCurrency,
  parseBedrooms,
  parsePropertySize,
  parsePropertyType,
} from '@/lib/utils';
import type { ScrapeResult, ScrapedProperty } from '@/types/scraping';

const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const MAX_LISTING_PAGES = 6;
const DELAY_MS = 450;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildListingFromPage($: ReturnType<typeof load>, listingUrl: string): ScrapedProperty {
  const bodyText = normalizeText($('body').text());
  const title = normalizeText($('h1').first().text() || $('title').first().text()) || 'Not Available';
  const property_name = title;
  const area = findArea(bodyText) || 'Not Available';
  const monthly_price = parseCurrency(bodyText, /rm\s*([\d,]+(?:\.\d+)?)/i);
  const annual_price = parseCurrency(bodyText, /rm\s*([\d,]+(?:\.\d+)?).*?(?:per year|yearly|annually)/i) ?? (monthly_price ? Math.round(monthly_price * 12 * 100) / 100 : null);
  const bedrooms = parseBedrooms(bodyText);
  const furniture_status = parseFurniture(bodyText);
  const property_size_sqft = parsePropertySize(bodyText);
  const property_type = parsePropertyType(bodyText);

  return {
    listing_url: listingUrl,
    title: title === '' ? 'Not Available' : title,
    property_name: property_name === '' ? 'Not Available' : property_name,
    area,
    monthly_price,
    annual_price,
    bedrooms,
    furniture_status,
    property_size_sqft,
    property_type,
    scraped_at: new Date().toISOString(),
  };
}

function findArea(text: string): string | null {
  const areaMatch = text.match(/(?:area|location|neighborhood|district)[:\s]*([A-Za-z0-9\s\-,]+)/i);
  return areaMatch ? normalizeText(areaMatch[1]).replace(/\s+$/u, '') : null;
}

function parseFurniture(text: string): string {
  const furnitureMatch = text.match(/(fully furnished|partially furnished|unfurnished|furnished)/i);
  if (!furnitureMatch) {
    return 'Not Available';
  }

  return normalizeText(furnitureMatch[1]);
}

function extractListingUrls($: ReturnType<typeof load>, pageUrl: URL): string[] {
  const candidates: Set<string> = new Set();
  const pathPattern = /(property|listing|rent|property-detail|unit|room)/i;

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) {
      return;
    }

    try {
      const resolved = new URL(href, pageUrl).toString();
      const parsed = new URL(resolved);
      if (parsed.origin !== pageUrl.origin) {
        return;
      }

      if (parsed.toString() === pageUrl.toString()) {
        return;
      }

      if (pathPattern.test(parsed.pathname)) {
        candidates.add(parsed.toString());
      }
    } catch {
      return;
    }
  });

  return Array.from(candidates).slice(0, MAX_LISTING_PAGES);
}

async function scrapeListingPage(listingUrl: string): Promise<ScrapedProperty> {
  const targetUrl = new URL(listingUrl);
  if (!(await isPathAllowed(targetUrl))) {
    throw new Error(`Listing URL is blocked by robots.txt: ${listingUrl}`);
  }

  const response = await fetch(targetUrl.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch listing page: ${listingUrl}`);
  }

  const html = await response.text();
  const $ = load(html);
  return buildListingFromPage($, targetUrl.toString());
}

export async function scrapeSpeedhomePage(url: string): Promise<ScrapeResult> {
  const normalizedUrl = new URL(url).toString();
  const targetUrl = new URL(normalizedUrl);

  if (!(await isPathAllowed(targetUrl))) {
    throw new Error('The requested URL is disallowed by robots.txt.');
  }

  const response = await fetch(targetUrl.toString(), {
    headers: {
      'User-Agent': USER_AGENT,
      Accept: 'text/html',
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch target page: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = load(html);
  const listingUrls = extractListingUrls($, targetUrl);
  const items: ScrapedProperty[] = [];

  if (listingUrls.length > 0) {
    for (const listingUrl of listingUrls) {
      await delay(DELAY_MS);
      try {
        items.push(await scrapeListingPage(listingUrl));
      } catch {
        continue;
      }
    }
  }

  if (items.length === 0) {
    items.push(buildListingFromPage($, targetUrl.toString()));
  }

  return {
    mode: 'url',
    query: targetUrl.toString(),
    url: targetUrl.toString(),
    listingCount: items.length,
    listings: items,
    fetchedAt: new Date().toISOString(),
  };
}
