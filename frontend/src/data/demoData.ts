import type { AnalyticsSummary, Product, Store } from '../types';

const areas = ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Race Course', 'Vadavalli', 'Saravanampatti', 'Kalapatti', 'Ukkadam', 'Town Hall'];
const names = ['Aavin Milk', 'Idly Rice', 'Sona Masoori Rice', 'Cooking Oil', 'Sugar', 'Iodized Salt', 'Filter Coffee', 'Wheat Flour', 'Bread', 'Eggs', 'Tomato', 'Potato', 'Onion', 'Apple', 'Detergent', 'Shampoo', 'Biscuits', 'Mineral Water', 'Notebook', 'Mobile Charger'];
const categories = ['Dairy', 'Staples', 'Grocery', 'Beverages', 'Bakery', 'Vegetables', 'Fruits', 'Cleaning', 'Personal Care', 'Electronics'];

export const demoStores: Store[] = Array.from({ length: 20 }, (_, index) => ({
  id: `coimbatore-store-${index + 1}`,
  name: `Coimbatore Smart Mart ${index + 1}`,
  address: `${areas[index % areas.length]}, Coimbatore, Tamil Nadu`,
  city: 'Coimbatore',
  rating: Number((4 + (index % 10) / 10).toFixed(1)),
  distanceKm: Number((0.6 + index * 0.35).toFixed(1)),
  open: index % 5 !== 0,
  offers: [`₹${10 + index * 2} off on essentials`],
  description: 'Local Coimbatore store with daily essentials and fresh products.',
  mapQuery: `${areas[index % areas.length]}, Coimbatore`,
  coordinates: { lat: 11.0168 + ((index % 5) - 2) * 0.012, lng: 76.9558 + (Math.floor(index / 5) - 2) * 0.014 },
}));

export const demoProducts: Product[] = Array.from({ length: 1000 }, (_, index) => {
  const productIndex = index % names.length;
  const storeIndex = index % demoStores.length;
  const price = Number((35 + ((index * 17) % 450) + (index % 7) * 2.5).toFixed(2));
  return {
    id: `coimbatore-product-${index + 1}`,
    name: `${names[productIndex]} ${Math.floor(index / names.length) + 1}`,
    category: categories[productIndex % categories.length],
    price,
    quantity: productIndex % 3 === 0 ? '1 kg' : '1 pack',
    quality: 'Premium',
    stock: 8 + (index % 48),
    storeId: demoStores[storeIndex].id,
  };
});

export const demoAnalytics: AnalyticsSummary = {
  totalProducts: demoProducts.length,
  averagePrice: Number((demoProducts.reduce((sum, product) => sum + product.price, 0) / demoProducts.length).toFixed(2)),
  openStores: demoStores.filter((store) => store.open).length,
  suspiciousReviews: 0,
  activeOffers: demoStores.length,
};

export function demoStoreWithProducts(id: string) {
  const store = demoStores.find((item) => item.id === id);
  return store ? { store: { ...store, products: demoProducts.filter((product) => product.storeId === id) } } : undefined;
}
