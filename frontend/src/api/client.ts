import axios from 'axios';
import { demoAnalytics, demoProducts, demoStores, demoStoreWithProducts } from '../data/demoData';

const isPublicDemo = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  adapter: isPublicDemo
    ? async (config) => {
        const url = config.url || '';
        const query = new URLSearchParams(url.split('?')[1] || '');
        let data: unknown = {};
        if (url.includes('/analytics/summary')) data = { summary: demoAnalytics };
        else if (url.includes('/products')) {
          const q = (query.get('query') || query.get('q') || '').toLowerCase();
          data = { items: demoProducts.filter((product) => !q || product.name.toLowerCase().includes(q)).slice(0, 60) };
        } else if (url.includes('/stores/')) data = demoStoreWithProducts(url.split('/stores/')[1].split('?')[0]);
        else if (url.includes('/stores')) data = { items: demoStores };
        else if (url.includes('/ai/recommendation')) data = { recommendation: { recommendedStore: demoStores[0], explanation: 'Closest highly rated Coimbatore store with strong availability.' } };
        return { data, status: 200, statusText: 'OK', headers: {}, config };
      }
    : undefined,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smartbuy-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
