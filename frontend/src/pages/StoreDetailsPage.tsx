import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import { Layout } from '../components/Layout';
import type { Product, Store } from '../types';
import { calculateDistanceKm, formatDistance } from '../utils/location';

export const StoreDetailsPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => (await api.get(`/stores/${id}`)).data,
    enabled: Boolean(id),
  });

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

  const store = data?.store as Store | undefined;
  const products = (data?.store?.products as Product[]) || [];
  const mapQuery = store?.mapQuery || store?.address || 'Tiruchirappalli';
  const effectiveDistance = useMemo(() => {
    if (!location || !store?.coordinates) {
      return store?.distanceKm ?? 0;
    }

    return calculateDistanceKm(location.lat, location.lng, store.coordinates.lat, store.coordinates.lng);
  }, [location, store]);

  if (isLoading) {
    return (
      <Layout>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 text-slate-300">Loading store details…</div>
      </Layout>
    );
  }

  if (!store) {
    return (
      <Layout>
        <div className="rounded-[32px] border border-white/10 bg-slate-900/70 p-8 text-slate-300">Store not found.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-slate-900/70 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Store details</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{store.name}</h1>
            <p className="mt-3 max-w-2xl text-slate-400">{store.description || 'Reliable nearby store for groceries, pantry staples and fresh daily essentials.'}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-amber-400">
              <Star size={16} fill="currentColor" />
              <span>{store.rating}/5</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <MapPin size={16} className="text-blue-300" />
              <span>{store.city || 'Trichy'}</span>
            </div>
            <div className="mt-2 text-sm text-slate-400">{location ? `You are ${formatDistance(effectiveDistance)} away` : `Distance shown from the store base`}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Prices & availability</h2>
              <span className={store.open ? 'text-emerald-300' : 'text-rose-300'}>{store.open ? 'Open now' : 'Closed'}</span>
            </div>
            <div className="mt-4 space-y-3">
              {products.map((product) => (
                <div key={product.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-slate-400">{product.quantity} · {product.quality}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">₹{product.price}</p>
                      <p className="text-sm text-slate-400">{product.stock} in stock</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <h2 className="text-xl font-semibold text-white">Store information</h2>
              <p className="mt-3 text-sm text-slate-400">{store.address}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {store.offers.map((offer) => (
                  <span key={offer} className="rounded-full bg-blue-600/20 px-2.5 py-1 text-xs text-blue-300">{offer}</span>
                ))}
              </div>
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                Open in Google Maps <ArrowUpRight size={16} />
              </a>
              {location && store?.coordinates ? (
                <a href={`https://www.google.com/maps/dir/${location.lat},${location.lng}/${store.coordinates.lat},${store.coordinates.lng}`} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm text-blue-300">
                  Get directions from your location →
                </a>
              ) : null}
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/70">
              <iframe
                title={`${store.name} map`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`}
                className="h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
