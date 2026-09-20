import { IAdapterProduct, IMarketplaceAdapter } from './adapter.interface';
import { AmazonAdapter } from './mockAdapters/amazon.adapter';
import { FlipkartAdapter } from './mockAdapters/flipkart.adapter';
import { BlinkitAdapter } from './mockAdapters/blinkit.adapter';
import { MeeshoAdapter } from './mockAdapters/meesho.adapter';
// real adapters
import { AmazonRealAdapter } from './real/amazon.adapter';
import { DistanceService } from '../distance.service';

const useReal = process.env.USE_REAL_ADAPTERS === 'true';

const adapters: IMarketplaceAdapter[] = [];

// register mock adapters by default
adapters.push(new AmazonAdapter());
adapters.push(new FlipkartAdapter());
adapters.push(new BlinkitAdapter());
adapters.push(new MeeshoAdapter());

// optionally register real adapters (scaffolded)
if (useReal) {
  try {
    adapters.unshift(new AmazonRealAdapter());
  } catch (err) {
    console.warn('Failed to initialize real adapters', err);
  }
}

export const AggregatorService = {
  async compareByBarcode(barcode: string, userLocation?: { lat: number; lon: number }) {
    const results: Array<any> = [];

    for (const adapter of adapters) {
      try {
        const items = await adapter.fetchByBarcode(barcode);
        for (const it of items) {
          const distance = it.storeLocation && userLocation ?
            DistanceService.distanceBetween(userLocation.lat, userLocation.lon, it.storeLocation.lat, it.storeLocation.lon) : null;

          const score = computeScore(it.price, distance, 4.0, it.availability);
          results.push({ ...it, distance, score });
        }
      } catch (err) {
        // adapter-level failure should not break aggregator
        console.warn(`Adapter ${adapter.vendorCode} failed`, err);
      }
    }

    results.sort((a, b) => a.score - b.score);
    return results;
  }
};

function computeScore(price: number, distance: number | null, rating = 4.0, availability = true) {
  // lower is better
  const priceFactor = price;
  const distanceFactor = distance != null ? distance : 0;
  const availabilityFactor = availability ? 0 : 10000;
  const ratingFactor = (5 - rating) * 100;

  return priceFactor + distanceFactor + availabilityFactor + ratingFactor;
}
