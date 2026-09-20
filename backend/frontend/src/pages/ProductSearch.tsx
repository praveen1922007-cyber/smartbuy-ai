import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function ProductSearch() {
  const [q, setQ] = useState('');
  const { data, refetch, isFetching } = useQuery(['search', q], async () => {
    const res = await api.get('/products?q=' + encodeURIComponent(q));
    return res.data;
  }, { enabled: false });

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="flex-1 px-3 py-2 rounded border" />
        <button onClick={() => refetch()} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>
      {isFetching ? <div>Loading...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.isArray(data) && data.map((p: any) => (
            <div key={p._id} className="p-4 bg-white/60 dark:bg-slate-800/60 rounded">
              <h3 className="font-semibold">{p.name}</h3>
              <p>Price: ₹{p.price}</p>
              <p>Store: {p.storeId?.name}</p>
              <Link to={`/product/${p._id}`} className="inline-block mt-2 text-blue-600">View</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
