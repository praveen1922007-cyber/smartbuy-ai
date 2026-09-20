import { Vendor, IVendor } from '../models/vendor.model';

export const VendorRepo = {
  create: async (data: Partial<IVendor>) => Vendor.create(data),
  findByCode: async (code: string) => Vendor.findOne({ code }).lean(),
  list: async (filter = {}) => Vendor.find(filter).lean()
};
