import { NextResponse } from 'next/server';

import { isValidSpeedhomeUrl, normalizeSpeedhomeUrl } from '@/lib/validators/speedhomeUrl';
import { buildSpeedhomeSearchUrl, scrapeSpeedhomePage } from '@/lib/scraping/speedhomeScraper';
import { buildGroupedScrapeStatistics } from '@/lib/analytics/statistics';
import { createSearchSession, persistScrapeResult, updateSearchSession } from '@/lib/supabase/search';
import type { ScrapeRequest } from '@/types/scraping';

export async function POST(request: Request) {
  const payload = (await request.json()) as ScrapeRequest;
  const query = payload?.query?.toString().trim() ?? '';

  if (!query || (payload.mode !== 'url' && payload.mode !== 'area')) {
    return NextResponse.json(
      {
        error:
          'Please provide a valid search query. URL search and area search are supported.',
      },
      { status: 400 },
    );
  }

  let sessionId: string | undefined;
  let targetUrl: string;

  if (payload.mode === 'url') {
    if (!isValidSpeedhomeUrl(query)) {
      return NextResponse.json(
        { error: 'Please provide a valid SPEEDHOME URL from speedhome.com.my.' },
        { status: 400 },
      );
    }

    targetUrl = normalizeSpeedhomeUrl(query);
  } else {
    targetUrl = buildSpeedhomeSearchUrl(query);
  }

  try {
    sessionId = await createSearchSession(payload.mode === 'url' ? 'url' : 'area', query);
    const result = await scrapeSpeedhomePage(targetUrl, payload.mode);
    const statistics = buildGroupedScrapeStatistics(result.listings);
    await persistScrapeResult(sessionId, result, statistics);
    return NextResponse.json({ ...result, statistics });
  } catch (error) {
    if (sessionId) {
      await updateSearchSession(
        sessionId,
        'failed',
        undefined,
        error instanceof Error ? error.message : 'Scrape failed.',
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to scrape the provided SPEEDHOME URL.',
      },
      { status: 500 },
    );
  }
}
