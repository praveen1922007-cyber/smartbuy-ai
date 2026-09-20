import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export default function Home() {
  const { data, isLoading, error } = useQuery(['health'], async () => {
    const res = await api.get('/health');
    return res.data;
  });

  return (
    <div className="space-y-6">
      <section className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-lg shadow">
        <h2 className="text-2xl font-bold">Welcome to SmartBuy AI</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          Find the best nearby stores, compare prices and get AI recommendations.
        </p>
        <div className="mt-4">
          <strong>API status:</strong>{' '}
          {isLoading ? 'Checking...' : error ? 'Unavailable' : data?.status}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">Search Products</div>
        <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">Nearby Stores</div>
        <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">Wishlist</div>
      </section>
    </div>
  );
}
