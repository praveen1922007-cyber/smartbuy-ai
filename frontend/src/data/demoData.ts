import type { AnalyticsSummary, Product, Store } from '../types';

const areas = ['Gandhipuram', 'RS Puram', 'Peelamedu', 'Singanallur', 'Race Course', 'Vadavalli', 'Saravanampatti', 'Kalapatti', 'Ukkadam', 'Town Hall'];
const names = ['Aavin Milk', 'Idly Rice', 'Sona Masoori Rice', 'Cooking Oil', 'Sugar', 'Iodized Salt', 'Filter Coffee', 'Wheat Flour', 'Bread', 'Eggs', 'Tomato', 'Potato', 'Onion', 'Apple', 'Detergent', 'Soap', 'Chips', 'Banana', 'Orange', 'Toothpaste'];
const categories = ['Dairy', 'Staples', 'Staples', 'Grocery', 'Grocery', 'Grocery', 'Beverages', 'Bakery', 'Bakery', 'Vegetables', 'Vegetables', 'Vegetables', 'Fruits', 'Fruits', 'Cleaning', 'Personal Care', 'Snacks', 'Fruits', 'Fruits', 'Personal Care'];

const categoryImageMap: Record<string, string> = {
  Dairy: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
  Staples: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  Grocery: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  Beverages: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=80',
  Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  Vegetables: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
  Fruits: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80',
  Cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  'Personal Care': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
  Snacks: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  Electronics: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
};

const productImageMap: Record<string, string> = {
  'Aavin Milk 1': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80',
  'Idly Rice 1': 'https://images.unsplash.com/photo-1586201375761-83865001b7c9?auto=format&fit=crop&w=900&q=80',
  'Sona Masoori Rice 1': 'https://images.unsplash.com/photo-1586201375761-83865001b7c9?auto=format&fit=crop&w=900&q=80',
  'Cooking Oil 1': 'https://images.unsplash.com/photo-1474979266404-7bd703582d17?auto=format&fit=crop&w=900&q=80',
  'Sugar 1': 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=900&q=80',
  'Iodized Salt 1': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80',
  'Filter Coffee 1': 'https://images.unsplash.com/photo-1498804103079-a4f1e95f1f4c?auto=format&fit=crop&w=900&q=80',
  'Wheat Flour 1': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'Bread 1': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80',
  'Eggs 1': 'https://images.unsplash.com/photo-1506975094-7d3b6b887f51?auto=format&fit=crop&w=900&q=80',
  'Tomato 1': 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80',
  'Potato 1': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80',
  'Onion 1': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=900&q=80',
  'Apple 1': 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=900&q=80',
  'Detergent 1': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80',
  'Soap 1': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80',
  'Chips 1': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
  'Banana 1': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=900&q=80',
  'Orange 1': 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=80',
  'Toothpaste 1': 'https://images.unsplash.com/photo-1607613009820-a29e7b81c0a5?auto=format&fit=crop&w=900&q=80',
};

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
  const productName = `${names[productIndex]} ${Math.floor(index / names.length) + 1}`;
  const category = categories[productIndex % categories.length];
  const price = Number((35 + ((index * 17) % 450) + (index % 7) * 2.5).toFixed(2));

  return {
    id: `coimbatore-product-${index + 1}`,
    name: productName,
    category,
    price,
    quantity: productIndex % 3 === 0 ? '1 kg' : '1 pack',
    quality: 'Premium',
    stock: 8 + (index % 48),
    storeId: demoStores[storeIndex].id,
    imageUrl: productImageMap[productName] ?? categoryImageMap[category] ?? 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80',
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
