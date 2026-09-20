import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, X } from 'lucide-react';
import api from '../api/client';
import { Layout } from '../components/Layout';
import { calculateDistanceKm, formatDistance } from '../utils/location';
import type { Product, Store } from '../types';
import MarketplaceCompare from '../components/MarketplaceCompare';

export const ComparisonPage = () => {
  const [searchProduct, setSearchProduct] = useState('Milk');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => undefined
    );
  }, []);

  const { data: storesData } = useQuery({
    queryKey: ['stores-all'],
    queryFn: async () => (await api.get('/stores')).data,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products-all'],
    queryFn: async () => (await api.get('/products')).data,
  });

  const stores = (storesData?.items as Store[]) || [];
  const products = (productsData?.items as Product[]) || [];

  const storesWithDistance = useMemo(() => {
    if (!location) {
      return stores;
    }

    return stores
      .map((store) => {
        const coords = store.coordinates;
        const dynamicDistance = coords ? calculateDistanceKm(location.lat, location.lng, coords.lat, coords.lng) : store.distanceKm;
        return { ...store, distanceKm: dynamicDistance };
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [location, stores]);

  const comparisonData = useMemo(() => {
    const searchLower = searchProduct.toLowerCase();
    const matchingProducts = products.filter((p) => p.name.toLowerCase().includes(searchLower));

    return storesWithDistance.map((store) => {
      const storeProducts = matchingProducts.filter((p) => p.storeId === store.id);
      const bestPrice = storeProducts.length > 0 ? Math.min(...storeProducts.map((p) => p.price)) : null;

      return {
        store,
        products: storeProducts,
        bestPrice,
        hasProduct: storeProducts.length > 0,
      };
    });
  }, [searchProduct, storesWithDistance, products]);

  const bestPriceOverall = useMemo(
    () => Math.min(...comparisonData.map((d) => d.bestPrice || Infinity)),
    [comparisonData]
  );

  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Price & store comparison</h1>
        <p className="mt-2 text-slate-400">Compare real prices across nearby Trichy stores for the product you want.</p>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <label className="mb-3 block text-sm text-slate-300">Search product</label>
          <input
            value={searchProduct}
            onChange={(event) => setSearchProduct(event.target.value)}
            placeholder="Milk, Rice, Oil, Bread..."
            className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
          />
        </div>

        <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10 bg-slate-950/70">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Store</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Distance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Best Price</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Available</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Offers</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map(({ store, bestPrice, hasProduct, products: storeProducts }) => (
                <tr key={store.id} className="border-b border-white/10">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{store.name}</p>
                      <p className="text-xs text-slate-400">{store.address}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{formatDistance(store.distanceKm)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-amber-400">★ {store.rating}</span>
                  </td>
                  <td className="px-6 py-4">
                    {hasProduct ? (
                      <div>
                        <p className={`font-semibold ${bestPrice === bestPriceOverall ? 'text-emerald-400' : 'text-white'}`}>
                          ₹{bestPrice}
                        </p>
                        <p className="text-xs text-slate-400">{storeProducts.length} product(s)</p>
                      </div>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {hasProduct ? <Check size={18} className="text-emerald-400" /> : <X size={18} className="text-rose-400" />}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {store.offers.slice(0, 1).map((offer) => (
                        <span key={offer} className="rounded-full bg-blue-600/20 px-2 py-1 text-blue-300">
                          {offer}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
          <p className="text-sm text-slate-400">💡 Best deal</p>
          {comparisonData.find((d) => d.bestPrice === bestPriceOverall) ? (
            <div className="mt-2">
              <p className="text-lg font-semibold text-emerald-400">
                ₹{bestPriceOverall} at {comparisonData.find((d) => d.bestPrice === bestPriceOverall)?.store.name}
              </p>
              <p className="mt-1 text-xs text-slate-400">for {searchProduct}</p>
            </div>
          ) : (
            <p className="mt-2 text-slate-400">No results found for "{searchProduct}"</p>
          )}
        </div>
      </section>
      <section className="mt-8">
        <MarketplaceCompare userLocation={location} />
      </section>
    </Layout>
  );
};
