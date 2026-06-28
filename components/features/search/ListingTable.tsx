import type { ScrapedProperty } from '@/types/scraping';

function formatCurrency(value: number | null): string {
  return value !== null ? `RM ${value}` : 'N/A';
}

export function ListingTable({ listings }: { listings: ScrapedProperty[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-muted">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-muted text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <tr>
            <th className="px-4 py-3">Property</th>
            <th className="px-4 py-3">Area</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Bedrooms</th>
            <th className="px-4 py-3">Size</th>
            <th className="px-4 py-3">Type</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.listing_url} className="border-t border-muted/50 hover:bg-muted/50">
              <td className="px-4 py-3">
                <a
                  className="font-semibold text-foreground hover:underline"
                  href={listing.listing_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {listing.title}
                </a>
                <div className="text-xs text-muted-foreground">{listing.property_name}</div>
              </td>
              <td className="px-4 py-3">{listing.area}</td>
              <td className="px-4 py-3">{formatCurrency(listing.monthly_price)}</td>
              <td className="px-4 py-3">{listing.bedrooms}</td>
              <td className="px-4 py-3">{listing.property_size_sqft ?? 'N/A'}</td>
              <td className="px-4 py-3">{listing.property_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
