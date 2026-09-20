import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { StoreCard } from '../components/StoreCard';
import type { Product, Store } from '../types';
import { calculateDistanceKm } from '../utils/location';

export const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');

  const { data: productsData } = useQuery({
    queryKey: ['products-search', search],
    queryFn: async () => (await api.get(`/products?query=${search}`)).data,
  });

  const { data: storesData } = useQuery({
    queryKey: ['stores-search', search],
    queryFn: async () => (await api.get(`/stores?query=${search}`)).data,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => {
        setLocationError('Location access was denied. Stores will show their base distance.');
      }
    );
  }, []);

  const products = (productsData?.items as Product[]) || [];
  const stores = (storesData?.items as Store[]) || [];
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

  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
        <h1 className="text-3xl font-semibold text-white">Search products and nearby stores</h1>
        <p className="mt-2 text-slate-400">Use SmartBuy AI to compare local deals in seconds.</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none" placeholder="Search milk, rice or bread" />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <h2 className="text-xl font-semibold text-white">Products</h2>
            <div className="mt-4 grid gap-4">
              {products.length > 0 ? products.map((product) => <ProductCard key={product.id} product={product} />) : <p className="text-slate-400">No products found</p>}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">Nearby stores</h2>
            {locationError ? <p className="mt-2 text-sm text-slate-400">{locationError}</p> : location ? <p className="mt-2 text-sm text-blue-300">Using your live location to rank nearby stores.</p> : null}
            <div className="mt-4 grid gap-4">
              {storesWithDistance.length > 0 ? storesWithDistance.map((store) => <StoreCard key={store.id} store={store} />) : <p className="text-slate-400">No stores found</p>}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
