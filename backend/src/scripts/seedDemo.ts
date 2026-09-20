import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db';
import { generateCoimbatoreCatalog } from '../utils/demoData';
import { Store } from '../models/store.model';
import { Product } from '../models/product.model';

async function seed() {
  await connectDB();
  await Store.deleteMany({ name: /^Coimbatore Smart Mart / });
  await Product.deleteMany({ brand: 'Coimbatore Local' });
  const { stores, products } = await generateCoimbatoreCatalog(20, 50);
  console.log(`Seeded ${stores.length} Coimbatore stores and ${products.length} products.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
