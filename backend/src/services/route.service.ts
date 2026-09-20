import { Product } from '../models/product.model';
import { Store } from '../models/store.model';

// Simple route optimizer: for given product names, pick cheapest store per product then order by nearest-neighbor
export async function optimizeShoppingRoute(productNames: string[], start: { lat: number; lon: number }) {
  // For each product name, find candidate products and choose cheapest
  const chosen: any[] = [];
  for (const name of productNames) {
    const prods = await Product.find({ $text: { $search: name } }).populate('storeId').lean();
    if (!prods || prods.length === 0) continue;
    const best = prods.reduce((a: any, b: any) => (a.price < b.price ? a : b));
    chosen.push({ product: best, store: best.storeId });
  }

  // Group by store
  const byStore: { [key: string]: any } = {};
  for (const c of chosen) {
    const sid = c.store?._id?.toString() || c.product.storeId?.toString();
    if (!sid) continue;
    byStore[sid] = byStore[sid] || { store: c.store || c.product.storeId, products: [], total: 0 };
    byStore[sid].products.push(c.product);
    byStore[sid].total += c.product.price || 0;
  }

  const stores = Object.values(byStore);
  // Build a route starting from start using nearest neighbor
  const route: any[] = [];
  let current = { lat: start.lat, lon: start.lon };
  const remaining = [...stores];
  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Number.POSITIVE_INFINITY;
    for (let i = 0; i < remaining.length; i++) {
      const s = remaining[i].store;
      const dist = haversineDistance(current.lat, current.lon, s.location?.coordinates[1] || current.lat, s.location?.coordinates[0] || current.lon);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    }
    const next = remaining.splice(bestIdx, 1)[0];
    route.push({ store: next.store, products: next.products, distanceFromPreviousKm: bestDist, subtotal: next.total });
    current = { lat: next.store.location?.coordinates[1] || current.lat, lon: next.store.location?.coordinates[0] || current.lon };
  }

  const totalCost = route.reduce((s: number, r: any) => s + (r.subtotal || 0), 0);
  const totalDistance = route.reduce((s: number, r: any) => s + (r.distanceFromPreviousKm || 0), 0);

  return { route, totalCost, totalDistance };
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // km
}
