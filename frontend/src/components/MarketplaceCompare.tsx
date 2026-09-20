import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';

export interface MarketplaceResult {
  externalId: string;
  name: string;
  barcode?: string;
  price: number;
  mrp?: number;
  availability?: boolean;
  url?: string;
  vendor: string;
  vendorName?: string;
  distance?: number | null;
  score?: number;
}

interface Props {
  userLocation?: { lat: number; lng: number } | null;
}

  const vendorBadge = (vendor: string | undefined, vendorName?: string) => {
  const code = (vendor || vendorName || 'unk').toLowerCase();

  const imgSrc = `/vendors/${code}.svg`;

  // render image and fallback to initial badge on error
  return (
    <span className="inline-flex items-center gap-3">
      <img
        src={imgSrc}
        alt={vendorName || vendor || 'vendor'}
        className="h-8 w-8 rounded-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="sr-only">{vendorName || vendor}</span>
    </span>
  );
};

export const MarketplaceCompare: React.FC<Props> = ({ userLocation }) => {
  const [barcode, setBarcode] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const [sortBy, setSortBy] = useState<'score' | 'price' | 'distance' | 'vendor'>('score');
  const [filterVendor, setFilterVendor] = useState<string>('all');

  const { data, isFetching } = useQuery({
    queryKey: ['marketplace', lastQuery, userLocation?.lat, userLocation?.lng],
    queryFn: async () => {
      if (!lastQuery) return { results: [] };
      const params: Record<string, string | number> = { barcode: lastQuery };
      if (userLocation) {
        params.lat = userLocation.lat;
        params.lon = userLocation.lng;
      }
      const res = await api.get('/marketplace/compare', { params });
      return res.data as { results: MarketplaceResult[] };
    },
    enabled: !!lastQuery,
  });

  const ingest = async () => {
    if (!barcode) return;
    const body: any = { barcode };
    if (userLocation) {
      body.lat = userLocation.lat;
      body.lon = userLocation.lng;
    }
    const res = await api.post('/marketplace/ingest', body);
    return res.data;
  };

  const results: MarketplaceResult[] = data?.results || [];

  const vendors = useMemo(() => {
    const set = new Set<string>();
    results.forEach((r) => set.add(r.vendor || r.vendorName || 'unknown'));
    return Array.from(set);
  }, [results]);

  const bestPrice = useMemo(() => {
    if (!results.length) return null;
    return Math.min(...results.map((r) => r.price));
  }, [results]);

  const sorted = useMemo(() => {
    let arr = results.slice();
    if (filterVendor !== 'all') arr = arr.filter((r) => (r.vendor || r.vendorName || '').toLowerCase() === filterVendor.toLowerCase());

    switch (sortBy) {
      case 'price':
        arr.sort((a, b) => a.price - b.price);
        break;
      case 'distance':
        arr.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        break;
      case 'vendor':
        arr.sort((a, b) => (a.vendorName || a.vendor).localeCompare(b.vendorName || b.vendor));
        break;
      default:
        // score
        arr.sort((a, b) => (a.score || 0) - (b.score || 0));
    }
    return arr;
  }, [results, sortBy, filterVendor]);

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/70 p-4" role="region" aria-label="Marketplace comparison">
      <h2 className="text-lg font-semibold text-white">Marketplace comparison</h2>
      <p className="mt-1 text-sm text-slate-400">Compare prices across marketplaces (mock adapters)</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="sr-only" htmlFor="barcode-input">Barcode or SKU</label>
          <input
            id="barcode-input"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode or SKU"
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-white outline-none"
            aria-label="Barcode or SKU"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setLastQuery(barcode)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-white"
            aria-label="Search marketplaces"
          >
            Search
          </button>
          <button
            onClick={async () => {
              await ingest();
              setLastQuery(barcode);
            }}
            className="rounded-xl bg-blue-600 px-4 py-2 text-white"
            aria-label="Ingest and persist results"
          >
            Ingest
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-md bg-slate-900 px-2 py-1 text-white"
            aria-label="Sort results"
          >
            <option value="score">Smart score</option>
            <option value="price">Price</option>
            <option value="distance">Distance</option>
            <option value="vendor">Vendor</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Filter vendor</label>
          <select
            value={filterVendor}
            onChange={(e) => setFilterVendor(e.target.value)}
            className="rounded-md bg-slate-900 px-2 py-1 text-white"
            aria-label="Filter by vendor"
          >
            <option value="all">All</option>
            {vendors.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        {isFetching && (
          <div className="mb-4">
            <div className="h-2 w-32 animate-pulse rounded bg-slate-800" />
            <div className="mt-2 grid gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-8 w-full animate-pulse rounded bg-slate-800" />
              ))}
            </div>
          </div>
        )}
        <table className="w-full text-sm" role="table" aria-label="Marketplace results">
          <thead>
            <tr className="border-b border-white/10">
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Vendor</th>
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Product</th>
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Price</th>
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Distance</th>
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Availability</th>
              <th scope="col" className="px-4 py-3 text-left text-slate-300">Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.externalId}
                className={`border-b border-white/10 ${r.price === bestPrice ? 'bg-emerald-900/20' : ''}`}
              >
                <td className="px-4 py-3 align-middle">
                  <div className="flex items-center gap-3">
                    {vendorBadge(r.vendor, r.vendorName)}
                    <div>
                      <div className="font-semibold text-white">{r.vendorName || r.vendor}</div>
                      <div className="text-xs text-slate-400">{r.vendor}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300">{r.name}</td>
                <td className="px-4 py-3 text-white">₹{r.price} {r.price === bestPrice && <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-emerald-300 text-xs">Best</span>}</td>
                <td className="px-4 py-3 text-slate-300">{r.distance != null ? `${r.distance.toFixed(2)} km` : '—'}</td>
                <td className="px-4 py-3 text-slate-300">{r.availability ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-slate-300">
                  {r.url ? (
                    <a className="text-blue-300" href={r.url} target="_blank" rel="noreferrer">
                      View
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No results — try searching a different barcode or click Ingest to persist marketplace data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketplaceCompare;
