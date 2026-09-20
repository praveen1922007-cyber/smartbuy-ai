import { IMarketplaceAdapter, IAdapterProduct } from '../adapter.interface';

export class AmazonAdapter implements IMarketplaceAdapter {
  vendorCode = 'amazon';

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    // Mocked response. Replace with real API integration.
    return [{
      externalId: `AMZ-${barcode}`,
      name: `Amazon Mock Product for ${barcode}`,
      barcode,
      price: 499,
      mrp: 599,
      availability: true,
      url: 'https://amazon.example/product/' + barcode,
      vendor: this.vendorCode,
      vendorName: 'Amazon'
    }];
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `AMZ-${query}-1`,
      name: `Amazon Mock ${query}`,
      price: 399,
      vendor: this.vendorCode,
      vendorName: 'Amazon'
    }];
  }
}
