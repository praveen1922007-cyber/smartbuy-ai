import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';
import type { Store } from '../types';

type StoreCardProps = {
  store: Store;
};

export const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{store.name}</h3>
        <div className="flex items-center gap-1 text-amber-400">
          <Star size={16} fill="currentColor" />
          <span className="text-sm">{store.rating}</span>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
        <MapPin size={16} />
        {store.address}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <span>{store.distanceKm} km away</span>
        <span className={store.open ? 'text-emerald-300' : 'text-rose-300'}>{store.open ? 'Open now' : 'Closed'}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {store.offers.map((offer) => (
          <span key={offer} className="rounded-full bg-blue-600/20 px-2.5 py-1 text-xs text-blue-300">
            {offer}
          </span>
        ))}
      </div>
      <Link to={`/stores/${store.id}`} className="mt-4 inline-flex text-sm font-medium text-blue-300">
        View prices & map →
      </Link>
    </div>
  );
};
