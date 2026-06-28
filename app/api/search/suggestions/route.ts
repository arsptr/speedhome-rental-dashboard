import { NextResponse } from 'next/server';

import { filterAreaSuggestions } from '@/lib/search/areaSuggestions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') ?? '';

  return NextResponse.json({
    suggestions: filterAreaSuggestions(query),
  });
}
