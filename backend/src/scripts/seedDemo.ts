import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db';
import { generateDemoStores, generateDemoProductsForStore } from '../utils/demoData';

async function seed() {
  await connectDB();
  console.log('Generating demo stores...');
  const stores = await generateDemoStores(8);
  for (const s of stores) {
    console.log('Adding products for', s._id.toString());
    await generateDemoProductsForStore(s._id.toString(), 25);
  }
  console.log('Done');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
