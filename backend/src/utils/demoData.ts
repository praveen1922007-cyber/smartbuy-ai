import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

// Demo catalog centered around Coimbatore (lat: 11.0168, lon: 76.9558).
const COIMBATORE = { lat: 11.0168, lon: 76.9558 };

const COIMBATORE_AREAS = [
  'Gandhipuram',
  'RS Puram',
  'Saibaba Colony',
  'Peelamedu',
  'Singanallur',
  'Race Course',
  'Vadavalli',
  'Kovaipudur',
  'Ramanathapuram',
  'Ukkadam',
  'Town Hall',
  'Ganapathy',
  'Saravanampatti',
  'Kalapatti',
  'Sundarapuram',
  'Kuniyamuthur',
  'Podanur',
  'Thudiyalur',
  'Ondipudur',
  'Vilankurichi'
];

const PRODUCT_CATALOG = [
  ['Aavin Milk', 'Dairy'], ['Idly Rice', 'Staples'], ['Sona Masoori Rice', 'Staples'],
  ['Basmati Rice', 'Staples'], ['Toor Dal', 'Staples'], ['Chana Dal', 'Staples'],
  ['Cooking Oil', 'Grocery'], ['Groundnut Oil', 'Grocery'], ['Sugar', 'Grocery'],
  ['Iodized Salt', 'Grocery'], ['Tata Tea', 'Beverages'], ['Filter Coffee', 'Beverages'],
  ['Wheat Flour', 'Staples'], ['Ragi Flour', 'Staples'], ['Corn Flakes', 'Breakfast'],
  ['Oats', 'Breakfast'], ['Bread', 'Bakery'], ['Eggs', 'Dairy'],
  ['Curd', 'Dairy'], ['Paneer', 'Dairy'], ['Tomato', 'Vegetables'],
  ['Potato', 'Vegetables'], ['Onion', 'Vegetables'], ['Apple', 'Fruits'],
  ['Banana', 'Fruits'], ['Orange', 'Fruits'], ['Detergent Powder', 'Cleaning'],
  ['Dish Wash', 'Cleaning'], ['Shampoo', 'Personal Care'], ['Bath Soap', 'Personal Care'],
  ['Toothpaste', 'Personal Care'], ['Toilet Cleaner', 'Cleaning'], ['Biscuits', 'Snacks'],
  ['Potato Chips', 'Snacks'], ['Chocolate', 'Snacks'], ['Mineral Water', 'Beverages'],
  ['Notebook', 'Stationery'], ['Ball Pen', 'Stationery'], ['LED Bulb', 'Home'],
  ['Extension Board', 'Electronics'], ['Cotton T-Shirt', 'Clothing'], ['Jeans', 'Clothing'],
  ['School Bag', 'Accessories'], ['Kitchen Container', 'Home'], ['Steel Bottle', 'Home'],
  ['Mobile Charger', 'Electronics'], ['Earphones', 'Electronics'], ['Face Wash', 'Personal Care'],
  ['Hand Wash', 'Personal Care'], ['Mosquito Repellent', 'Home']
] as const;

function randomOffset(m = 0.01) {
  return (Math.random() - 0.5) * m;
}

export async function generateDemoStores(count = 10) {
  const stores: any[] = [];
  for (let i = 0; i < count; i++) {
    const s = new Store({
      name: `Coimbatore Smart Mart ${i + 1}`,
      address: `${COIMBATORE_AREAS[i % COIMBATORE_AREAS.length]}, Coimbatore, Tamil Nadu`,
      phone: `+91-90000${1000 + i}`,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      isOnline: false,
      location: { type: 'Point', coordinates: [COIMBATORE.lon + randomOffset(0.12), COIMBATORE.lat + randomOffset(0.12)] }
    });
    await s.save();
    stores.push(s);
  }
  return stores;
}

export async function generateDemoProductsForStore(storeId: string, count = 20) {
  const products: any[] = [];
  for (let i = 0; i < count; i++) {
    const [name] = PRODUCT_CATALOG[i % PRODUCT_CATALOG.length];
    const price = Math.round((35 + ((i * 17) % 450) + Math.random() * 25) * 100) / 100;
    const p = new Product({
      name: `${name} ${i + 1}`,
      brand: 'Coimbatore Local',
      description: `${name} available at a mapped Coimbatore store`,
      barcode: `890COIM${storeId.slice(-6)}${String(i).padStart(3, '0')}`,
      category: undefined,
      price,
      mrp: price + Math.round(Math.random() * 20),
      discount: Math.round(Math.random() * 10),
      stock: Math.floor(Math.random() * 50),
      rating: +(3 + Math.random() * 2).toFixed(1),
      images: [],
      storeId
    });
    await p.save();
    products.push(p);
  }
  return products;
}

export async function generateCoimbatoreCatalog(storeCount = 20, productsPerStore = 50) {
  const stores = await generateDemoStores(storeCount);
  const products: any[] = [];
  for (const store of stores) {
    products.push(...await generateDemoProductsForStore(store._id.toString(), productsPerStore));
  }
  return { stores, products };
}
