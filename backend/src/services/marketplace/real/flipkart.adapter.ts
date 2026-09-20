import { RealAdapterBase } from './adapter.base';
import { IAdapterProduct } from '../adapter.interface';

export class FlipkartRealAdapter extends RealAdapterBase {
  vendorCode = 'flipkart';

  constructor() {
    super('flipkart');
  }

  private mapFlipkartItem(item: any): IAdapterProduct {
    return {
      externalId: String(item.id || item.sku || item.productId || ''),
      name: item.title || item.name || item.productName || 'Unknown',
      barcode: item.barcode || item.upc || undefined,
      price: Number(item.price?.value ?? item.price ?? 0),
      mrp: item.mrp ? Number(item.mrp) : undefined,
      availability: item.inStock !== undefined ? Boolean(item.inStock) : undefined,
      url: item.url || item.productUrl || undefined,
      vendor: this.vendorCode,
      vendorName: 'Flipkart',
      storeLocation: undefined
    };
  }

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_FLIPKART || 'flipkart_credentials');
      const baseUrl = creds?.baseUrl || process.env.FLIPKART_API_BASE;
      const apiKey = creds?.apiKey || process.env.FLIPKART_API_KEY;

      if (!baseUrl) return [];

      const res = await this.client.get(`${baseUrl}/products`, {
        params: { barcode },
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });

      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapFlipkartItem(it));
    } catch (err: any) {
      // fail gracefully when credentials or network unavailable
      // eslint-disable-next-line no-console
      console.warn('Flipkart adapter error', err?.message || err);
      return [];
    }
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_FLIPKART || 'flipkart_credentials');
      const baseUrl = creds?.baseUrl || process.env.FLIPKART_API_BASE;
      const apiKey = creds?.apiKey || process.env.FLIPKART_API_KEY;
      if (!baseUrl) return [];
      const res = await this.client.get(`${baseUrl}/search`, {
        params: { q: query },
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });
      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapFlipkartItem(it));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('Flipkart search error', err?.message || err);
      return [];
    }
  }
}
