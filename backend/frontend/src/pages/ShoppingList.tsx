import React, { useState } from 'react';
import api from '../api/axios';

export default function ShoppingList() {
  const [itemsText, setItemsText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const items = itemsText.split('\n').map(s => s.trim()).filter(Boolean);
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await api.post('/route/optimize', { items, start: { lat: 10.7905, lon: 78.7047 } });
      setResult(res.data);
    } catch (err: any) {
      console.error(err);
      alert('Failed to optimize route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-2">Shopping List - Route Optimizer</h2>
      <textarea value={itemsText} onChange={(e) => setItemsText(e.target.value)} rows={6} className="w-full border rounded p-2" placeholder="One product per line e.g. Aavin Milk 1L" />
      <div className="mt-2">
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Optimizing...' : 'Optimize Route'}</button>
      </div>

      {result && (
        <div className="mt-4">
          <h3 className="font-semibold">Summary</h3>
          <p>Total cost: ₹{result.totalCost}</p>
          <p>Total distance (km): {result.totalDistance.toFixed(2)}</p>
          <div className="mt-2">
            {result.route.map((r: any, idx: number) => (
              <div key={idx} className="p-2 border-b">
                <div className="font-semibold">{r.store.name}</div>
                <div>Distance from prev: {r.distanceFromPreviousKm.toFixed(2)} km</div>
                <div>Products:</div>
                <ul>
                  {r.products.map((p: any) => (<li key={p._id}>{p.name} - ₹{p.price}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
