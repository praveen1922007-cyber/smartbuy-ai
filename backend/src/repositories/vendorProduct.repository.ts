import { VendorProduct, IVendorProduct } from '../models/vendorProduct.model';

export const VendorProductRepo = {
  create: async (data: Partial<IVendorProduct>) => VendorProduct.create(data),
  findByBarcode: async (barcode: string) => VendorProduct.find({ barcode }).lean(),
  listByVendor: async (vendorId: string) => VendorProduct.find({ vendorId }).lean(),

  // upsert by vendorId + externalId
  upsertByExternalId: async (vendorId: string, externalId: string, data: Partial<IVendorProduct>) => {
    return VendorProduct.findOneAndUpdate({ vendorId, externalId }, { $set: data }, { upsert: true, new: true }).exec();
  }
};
