import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { useParams } from 'react-router-dom';

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useQuery(['product', id], async () => {
    const res = await api.get('/products/' + id);
    return res.data;
  });

  const { data: comparisons } = useQuery(['compare', product?.name], async () => {
    if (!product?.name) return [];
    const res = await api.get('/products/compare?name=' + encodeURIComponent(product.name));
    return res.data;
  }, { enabled: Boolean(product?.name) });

  const { data: recommendation } = useQuery(['recommend', product?.name], async () => {
    if (!product?.name) return null;
    const res = await api.get(`/ai/recommend?product=${encodeURIComponent(product.name)}&lon=78.7047&lat=10.7905`);
    return res.data;
  }, { enabled: Boolean(product?.name) });

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">
        <h2 className="text-2xl font-semibold">{product.name}</h2>
        <p>Price: ₹{product.price} (MRP: ₹{product.mrp})</p>
        <p>Stock: {product.stock}</p>
        <p>Store: {product.storeId?.name}</p>
      </div>

      <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">
        <h3 className="font-semibold">Price comparison</h3>
        <div>
          {Array.isArray(comparisons) && comparisons.map((c: any) => (
            <div key={c._id} className="flex justify-between border-b py-2">
              <div>{c.storeId?.name}</div>
              <div>₹{c.price}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">
        <h3 className="font-semibold">AI Recommendation</h3>
        {recommendation ? (
          <div>
            <p>Recommended Store: {recommendation.store.name}</p>
            <p>Reason: {recommendation.reason}</p>
          </div>
        ) : <p>No recommendation yet</p>}
      </div>
    </div>
  );
}
