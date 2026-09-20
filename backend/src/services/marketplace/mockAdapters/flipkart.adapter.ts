import { IMarketplaceAdapter, IAdapterProduct } from '../adapter.interface';

export class FlipkartAdapter implements IMarketplaceAdapter {
  vendorCode = 'flipkart';

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `FK-${barcode}`,
      name: `Flipkart Mock Product for ${barcode}`,
      barcode,
      price: 479,
      mrp: 579,
      availability: true,
      url: 'https://flipkart.example/product/' + barcode,
      vendor: this.vendorCode,
      vendorName: 'Flipkart'
    }];
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `FK-${query}-1`,
      name: `Flipkart Mock ${query}`,
      price: 359,
      vendor: this.vendorCode,
      vendorName: 'Flipkart'
    }];
  }
}
