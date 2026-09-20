import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

// Utility to generate demo stores and products centered around Tiruchirappalli (lat:10.7905, lon:78.7047)
const TRICHY = { lat: 10.7905, lon: 78.7047 };

function randomOffset(m = 0.01) {
  return (Math.random() - 0.5) * m;
}

export async function generateDemoStores(count = 10) {
  const stores: any[] = [];
  for (let i = 0; i < count; i++) {
    const s = new Store({
      name: `Demo Store ${i + 1}`,
      address: `Demo address ${i + 1}, Trichy`,
      phone: `+91-90000${1000 + i}`,
      rating: +(3.5 + Math.random() * 1.5).toFixed(1),
      isOnline: false,
      location: { type: 'Point', coordinates: [TRICHY.lon + randomOffset(0.03), TRICHY.lat + randomOffset(0.03)] }
    });
    await s.save();
    stores.push(s);
  }
  return stores;
}

export async function generateDemoProductsForStore(storeId: string, count = 20) {
  const names = ['Aavin Milk 1L', 'Idly Rice 5kg', 'Sona Masoori Rice 5kg', 'Cooking Oil 1L', 'Sugar 1kg', 'Salt 1kg', 'Tea 500g', 'Coffee 100g'];
  const products: any[] = [];
  for (let i = 0; i < count; i++) {
    const name = names[Math.floor(Math.random() * names.length)];
    const price = Math.round((30 + Math.random() * 500) * 100) / 100;
    const p = new Product({
      name: `${name} - pack ${i + 1}`,
      brand: 'Generic',
      description: `${name} from demo store`,
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
