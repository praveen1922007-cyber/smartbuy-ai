import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Sparkles } from 'lucide-react';
import { Layout } from '../components/Layout';
import { calculateDistanceKm, formatDistance } from '../utils/location';

const features = [
  {
    title: 'Smart price comparison',
    description: 'Compare real prices across nearby Trichy stores for every product you want.',
    icon: '💰',
  },
  {
    title: 'Location-aware search',
    description: 'Find the best deals based on your exact location and store proximity.',
    icon: '📍',
  },
  {
    title: 'AI recommendations',
    description: 'Get intelligent store suggestions tailored to your shopping needs.',
    icon: '✨',
  },
];

export const LandingPage = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  const recommendation = useMemo(() => {
    const store = {
      name: 'ABC Super Market',
      distanceKm: location ? calculateDistanceKm(location.lat, location.lng, 10.7905, 78.7047) : 0.5,
      rating: 4.8,
      priceDelta: 8,
    };

    return {
      title: searchTerm ? `Best deal for ${searchTerm}` : 'Find the best prices',
      description: searchTerm
        ? `Compare ${searchTerm} across nearby stores and save smart.`
        : `Search for any product to see real prices from Trichy stores.`,
      distance: formatDistance(store.distanceKm),
      rating: `${store.rating}/5`,
    };
  }, [location, searchTerm]);

  return (
    <Layout>
      <section className="space-y-16">
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <Sparkles size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-slate-600">Smart local shopping</span>
          </div>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
            Find the best prices near you
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-slate-600">
            Compare real prices across nearby Trichy stores. Get AI suggestions and never overpay again.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Get started <ArrowRight size={18} />
            </Link>
            <Link to="/search" className="rounded-lg px-6 py-3 font-medium text-slate-600 transition-colors hover:bg-slate-100">
              Explore search
            </Link>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-6 transition-all hover:border-slate-300 hover:bg-slate-100">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="font-semibold text-slate-900">{feature.title}</h3>
              <p className="text-sm text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6 rounded-xl border border-slate-200 bg-slate-50 p-8 sm:p-12">
          <div className="space-y-2">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">AI suggestion</p>
            <h2 className="text-3xl font-semibold text-slate-900">{recommendation.title}</h2>
            <p className="text-lg text-slate-600">{recommendation.description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">Search a product</label>
              <div className="relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Milk, Rice, Oil, Bread..."
                  className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {searchTerm && (
              <div className="space-y-2 rounded-lg bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Store comparison</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-medium text-slate-900">ABC Super Market</p>
                    <p className="text-xs text-slate-500">{recommendation.distance} away</p>
                    <p className="mt-1 font-semibold text-slate-900">✓ In stock</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-sm font-medium text-slate-900">Green Basket</p>
                    <p className="text-xs text-slate-500">1.1 km away</p>
                    <p className="mt-1 font-semibold text-slate-900">✓ In stock</p>
                  </div>
                </div>
              </div>
            )}

            {searchTerm && (
              <Link to="/comparison" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
                Compare all stores <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};
