import { ArrowRight } from 'lucide-react';
import type { Product } from '../types';

type ProductCardProps = {
  product: Product;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-blue-950/20">
      <div className="relative overflow-hidden rounded-3xl bg-slate-950/70">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="h-44 w-full object-cover" />
        ) : (
          <div className="flex h-44 items-center justify-center bg-slate-900 text-slate-500">No image</div>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
        <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs text-emerald-300">{product.category}</span>
      </div>
      <p className="mt-2 text-sm text-slate-400">{product.quantity} · Quality {product.quality}</p>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-2xl font-semibold text-white">₹{product.price}</p>
          <p className="text-sm text-slate-400">{product.stock} in stock</p>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-slate-300">
          Compare <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
