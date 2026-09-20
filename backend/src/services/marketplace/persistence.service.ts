import { IAdapterProduct } from './adapter.interface';
import { VendorRepo } from '../../repositories/vendor.repository';
import { VendorProductRepo } from '../../repositories/vendorProduct.repository';
import { PriceHistoryRepo } from '../../repositories/priceHistory.repository';

export const MarketplacePersistence = {
  // ensure vendor exists and upsert vendor products and price history
  async persistAdapterProducts(items: IAdapterProduct[]) {
    const saved: any[] = [];

    for (const it of items) {
      // ensure vendor
      let vendor = await VendorRepo.findByCode(it.vendor);
      if (!vendor) {
        vendor = (await VendorRepo.create({ code: it.vendor, name: it.vendor })) as any;
      }

      // upsert vendor product
      const vp = await VendorProductRepo.upsertByExternalId(String((vendor as any)._id), it.externalId, {
        vendorId: (vendor as any)._id,
        externalId: it.externalId,
        name: it.name,
        barcode: it.barcode,
        price: it.price,
        mrp: it.mrp,
        availability: it.availability,
        url: it.url
      });

      // write price history
      await PriceHistoryRepo.create({ vendorProductId: (vp as any)._id, price: it.price });

      saved.push(vp);
    }

    return saved;
  }
};
