import { NextResponse } from 'next/server';

import { isValidSpeedhomeUrl, normalizeSpeedhomeUrl } from '@/lib/validators/speedhomeUrl';
import { scrapeSpeedhomePage } from '@/lib/scraping/speedhomeScraper';
import type { ScrapeRequest } from '@/types/scraping';

export async function POST(request: Request) {
  const payload = (await request.json()) as ScrapeRequest;
  const query = payload?.query?.toString().trim() ?? '';

  if (!query || payload.mode !== 'url') {
    return NextResponse.json(
      { error: 'Only URL scraping is supported in Phase 3. Please provide a valid SPEEDHOME URL.' },
      { status: 400 },
    );
  }

  if (!isValidSpeedhomeUrl(query)) {
    return NextResponse.json(
      { error: 'Please provide a valid SPEEDHOME URL from speedhome.com.my.' },
      { status: 400 },
    );
  }

  try {
    const normalizedUrl = normalizeSpeedhomeUrl(query);
    const result = await scrapeSpeedhomePage(normalizedUrl);
    return NextResponse.json(result);
  } catch (error) {
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
