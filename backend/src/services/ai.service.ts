import { Product } from '../models/product.model';
import { Store } from '../models/store.model';
import { Review } from '../models/review.model';

// Simple weighted recommendation engine as a placeholder for Bedrock
// Weights: Price 40%, Distance 20%, Quality 20%, Store Rating 10%, Availability 10%

export async function recommendStoreForProduct(productName: string, lon: number, lat: number) {
  // Find all products with similar name (text search)
  const products = await Product.find({ $text: { $search: productName } }).populate('storeId').lean();
  if (!products || products.length === 0) return null;

  // Map store candidates
  const candidates: any = {};
  for (const p of products) {
    const s: any = p.storeId;
    if (!s) continue;
    const id = s._id.toString();
    const distance = haversineDistance(lat, lon, s.location?.coordinates[1] || lat, s.location?.coordinates[0] || lon);
    candidates[id] = candidates[id] || { store: s, products: [] };
    candidates[id].products.push({ product: p, distance });
  }

  // Score candidates
  const scored: any[] = [];
  for (const id of Object.keys(candidates)) {
    const c = candidates[id];
    // pick lowest price among candidate products
    const bestProduct = c.products.reduce((a: any, b: any) => (a.product.price < b.product.price ? a : b));
    const priceScore = 1 / (1 + bestProduct.product.price); // lower price -> higher score
    const distanceScore = 1 / (1 + Math.max(0.1, bestProduct.distance));
    const qualityScore = bestProduct.product.rating ? bestProduct.product.rating / 5 : 0.5;
    const storeRating = c.store.rating ? c.store.rating / 5 : 0.5;
    const availability = bestProduct.product.stock && bestProduct.product.stock > 0 ? 1 : 0;

    const score = priceScore * 0.4 + distanceScore * 0.2 + qualityScore * 0.2 + storeRating * 0.1 + availability * 0.1;
    scored.push({ store: c.store, product: bestProduct.product, score, reason: `price ${bestProduct.product.price}` });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored[0] || null;
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
