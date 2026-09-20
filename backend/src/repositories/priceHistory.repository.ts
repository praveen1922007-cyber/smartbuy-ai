import { PriceHistory, IPriceHistory } from '../models/priceHistory.model';

export const PriceHistoryRepo = {
  create: async (data: Partial<IPriceHistory>) => PriceHistory.create(data),
  listByVendorProduct: async (vendorProductId: string) => PriceHistory.find({ vendorProductId }).sort({ recordedAt: -1 }).lean()
};
