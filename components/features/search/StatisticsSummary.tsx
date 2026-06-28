import type { ScrapeStatistics } from '@/types/analytics';

function formatCurrency(value: number | null): string {
  return value !== null ? `RM ${value}` : 'N/A';
}

function formatSize(value: number | null): string {
  return value !== null ? `${value} sqft` : 'N/A';
}

export function StatisticsSummary({ statistics }: { statistics: ScrapeStatistics[] }) {
  const summary = statistics.find((stat) => stat.propertyType === 'all');

  if (!summary) {
    return null;
  }

  return (
    <div className="rounded-lg border border-muted p-4">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold">Price Summary</p>
          <p className="text-muted-foreground text-xs">Overall statistics for the scraped listings.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-muted">
        <table className="min-w-full text-left text-sm">
          <tbody>
            <tr className="border-b border-muted/50 bg-background">
              <th className="px-4 py-3 font-medium">Metric</th>
              <th className="px-4 py-3 font-medium">Value</th>
            </tr>
            <tr className="border-b border-muted/50">
              <td className="px-4 py-3 text-muted-foreground">Listings</td>
              <td className="px-4 py-3">{summary.listingCount}</td>
            </tr>
            <tr className="border-b border-muted/50">
              <td className="px-4 py-3 text-muted-foreground">Average price</td>
              <td className="px-4 py-3">{formatCurrency(summary.averagePrice)}</td>
            </tr>
            <tr className="border-b border-muted/50">
              <td className="px-4 py-3 text-muted-foreground">Median price</td>
              <td className="px-4 py-3">{formatCurrency(summary.medianPrice)}</td>
            </tr>
            <tr className="border-b border-muted/50">
              <td className="px-4 py-3 text-muted-foreground">Mode price</td>
              <td className="px-4 py-3">{formatCurrency(summary.modePrice)}</td>
            </tr>
            <tr className="border-b border-muted/50">
              <td className="px-4 py-3 text-muted-foreground">Fair price</td>
              <td className="px-4 py-3">{formatCurrency(summary.fairPrice)}</td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-muted-foreground">Average size</td>
              <td className="px-4 py-3">{formatSize(summary.averageSizeSqft)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
