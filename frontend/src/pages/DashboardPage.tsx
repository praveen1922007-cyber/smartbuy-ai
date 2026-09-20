import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Layout } from '../components/Layout';
import { ProductCard } from '../components/ProductCard';
import { StatCard } from '../components/StatCard';
import { useAuth } from '../contexts/AuthContext';
import type { AnalyticsSummary, Product, Store } from '../types';

export const DashboardPage = () => {
  const { user } = useAuth();

  const { data: analyticsData } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => (await api.get('/analytics/summary')).data,
  });

  const { data: productsData } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data,
  });

  const { data: recommendationData } = useQuery({
    queryKey: ['recommendation'],
    queryFn: async () => (await api.get('/ai/recommendation?productName=Milk')).data,
  });

  const summary = analyticsData?.summary as AnalyticsSummary | undefined;
  const products = (productsData?.items as Product[]) || [];
  const recommendation = recommendationData?.recommendation;
  const recommendedStore = recommendation?.recommendedStore as Store | undefined;

  return (
    <Layout>
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 p-6 sm:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">SmartBuy AI dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Hello, {user?.name || 'there'}.</h1>
            <p className="mt-2 max-w-2xl text-slate-400">Track the best prices, nearby stores and AI guidance in one premium experience.</p>
          </div>
          <Link to="/comparison" className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-600/20 px-4 py-2 text-sm text-blue-300">
            <Sparkles size={16} /> View AI comparison
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Products tracked" value={summary?.totalProducts?.toString() || '0'} />
          <StatCard title="Average price" value={`₹${summary?.averagePrice?.toFixed(2) || '0.00'}`} />
          <StatCard title="Open stores" value={summary?.openStores?.toString() || '0'} accent="from-emerald-600/20 to-emerald-500/10" />
          <StatCard title="Suspicious reviews" value={summary?.suspiciousReviews?.toString() || '0'} accent="from-amber-600/20 to-orange-500/10" />
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Top products</h2>
            <Link to="/search" className="text-sm text-blue-300">Open search</Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">AI recommendation</h2>
            <span className="rounded-full bg-blue-600/20 px-2.5 py-1 text-sm text-blue-300">Live</span>
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm text-slate-400">Best local choice</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{recommendedStore?.name || 'ABC Super Market'}</h3>
            <p className="mt-3 text-slate-400">{recommendation?.explanation || 'The selected recommendation is ready for your next shopping run.'}</p>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-slate-400">
              <span>Distance</span>
              <span>{recommendedStore?.distanceKm || 0.5} km</span>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-3 py-3 text-sm text-slate-400">
              <span>Rating</span>
              <span>{recommendedStore?.rating || 4.8}/5</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
