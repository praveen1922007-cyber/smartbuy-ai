import { connectDB } from '../config/db';
import { MarketplacePersistence } from '../services/marketplace/persistence.service';
import { VendorProduct } from '../models/vendorProduct.model';
import { PriceHistory } from '../models/priceHistory.model';

async function run() {
  try {
    await connectDB();

    // cleanup test artifacts for a clean run
    await VendorProduct.deleteMany({ name: /Mock/ }).exec();
    await PriceHistory.deleteMany({}).exec();

    const items = [
      {
        externalId: 'TEST-1',
        name: 'Test Mock Product 1',
        barcode: '12345',
        price: 199,
        mrp: 249,
        availability: true,
        url: 'https://example/test/1',
        vendor: 'amazon'
      },
      {
        externalId: 'TEST-2',
        name: 'Test Mock Product 2',
        barcode: '12345',
        price: 189,
        mrp: 239,
        availability: true,
        url: 'https://example/test/2',
        vendor: 'flipkart'
      }
    ];

    const saved = await MarketplacePersistence.persistAdapterProducts(items as any);
    console.log('Saved vendor products:', saved.length);

    const ph = await PriceHistory.find({}).lean();
    console.log('PriceHistory count:', ph.length);

    if (saved.length !== items.length || ph.length < items.length) {
      console.error('Persistence test failed');
      process.exit(2);
    }

    console.log('Persistence test passed');
    process.exit(0);
  } catch (err) {
    console.error('Test error', err);
    process.exit(3);
  }
}

run();
