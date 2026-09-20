import { IMarketplaceAdapter, IAdapterProduct } from '../adapter.interface';

export class BlinkitAdapter implements IMarketplaceAdapter {
  vendorCode = 'blinkit';

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `BL-${barcode}`,
      name: `Blinkit Mock Product for ${barcode}`,
      barcode,
      price: 529,
      mrp: 629,
      availability: true,
      url: 'https://blinkit.example/product/' + barcode,
      vendor: this.vendorCode,
      vendorName: 'Blinkit'
    }];
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `BL-${query}-1`,
      name: `Blinkit Mock ${query}`,
      price: 299,
      vendor: this.vendorCode,
      vendorName: 'Blinkit'
    }];
  }
}
