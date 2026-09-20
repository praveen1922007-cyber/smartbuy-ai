import { IMarketplaceAdapter, IAdapterProduct } from '../adapter.interface';

export class MeeshoAdapter implements IMarketplaceAdapter {
  vendorCode = 'meesho';

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `MS-${barcode}`,
      name: `Meesho Mock Product for ${barcode}`,
      barcode,
      price: 459,
      mrp: 559,
      availability: true,
      url: 'https://meesho.example/product/' + barcode,
      vendor: this.vendorCode,
      vendorName: 'Meesho'
    }];
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    return [{
      externalId: `MS-${query}-1`,
      name: `Meesho Mock ${query}`,
      price: 349,
      vendor: this.vendorCode,
      vendorName: 'Meesho'
    }];
  }
}
