export interface IAdapterProduct {
  externalId: string;
  name: string;
  barcode?: string;
  price: number;
  mrp?: number;
  availability?: boolean;
  url?: string;
  vendor: string; // vendor code
  vendorName?: string;
  // optionally include a seller/store location for distance calc
  storeLocation?: { lat: number; lon: number } | null;
}

export interface IMarketplaceAdapter {
  vendorCode: string; // e.g. 'amazon'
  fetchByBarcode(barcode: string): Promise<IAdapterProduct[]>;
  search(query: string, location?: { lat: number; lon: number } | null): Promise<IAdapterProduct[]>;
}
