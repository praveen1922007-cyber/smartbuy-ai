import { Request, Response } from 'express';
import { AggregatorService } from '../services/marketplace/aggregator.service';
import { MarketplacePersistence } from '../services/marketplace/persistence.service';
import { VendorProduct } from '../models/vendorProduct.model';
import { PriceHistory } from '../models/priceHistory.model';

export const compareByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode, lat, lon } = req.query as any;
    if (!barcode) return res.status(400).json({ message: 'barcode is required' });

    const userLocation = lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
    const results = await AggregatorService.compareByBarcode(String(barcode), userLocation);
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
};

export const ingestAndPersist = async (req: Request, res: Response) => {
  try {
    const { barcode, lat, lon } = req.body as any;
    if (!barcode) return res.status(400).json({ message: 'barcode is required' });

    const userLocation = lat && lon ? { lat: Number(lat), lon: Number(lon) } : undefined;
    const results = await AggregatorService.compareByBarcode(String(barcode), userLocation);

    // persist the adapter-level products and price history
    const adapterItems = results.map((r: any) => ({
      externalId: r.externalId,
      name: r.name,
      barcode: r.barcode,
      price: r.price,
      mrp: r.mrp,
      availability: r.availability,
      url: r.url,
      vendor: r.vendor
    }));

    const saved = await MarketplacePersistence.persistAdapterProducts(adapterItems);
    res.json({ results, saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
};

export const getHistoryByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.query as any;
    if (!barcode) return res.status(400).json({ message: 'barcode is required' });

    const vendorProducts = await VendorProduct.find({ barcode }).lean();

    const items = await Promise.all(
      vendorProducts.map(async (vp: any) => {
        const history = await PriceHistory.find({ vendorProductId: vp._id }).sort({ recordedAt: -1 }).lean();
        return { vendorProduct: vp, priceHistory: history };
      })
    );

    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
};
