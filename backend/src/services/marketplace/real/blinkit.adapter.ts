import { RealAdapterBase } from './adapter.base';
import { IAdapterProduct } from '../adapter.interface';

export class BlinkitRealAdapter extends RealAdapterBase {
  vendorCode = 'blinkit';

  constructor() {
    super('blinkit');
  }

  private mapBlinkitItem(item: any): IAdapterProduct {
    return {
      externalId: String(item.id || item.sku || ''),
      name: item.title || item.name || 'Unknown',
      barcode: item.barcode || undefined,
      price: Number(item.price?.value ?? item.price ?? 0),
      mrp: item.mrp ? Number(item.mrp) : undefined,
      availability: item.available !== undefined ? Boolean(item.available) : undefined,
      url: item.url || item.productUrl || undefined,
      vendor: this.vendorCode,
      vendorName: 'Blinkit',
      storeLocation: item.location ? { lat: Number(item.location.lat), lon: Number(item.location.lon) } : undefined
    };
  }

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_BLINKIT || 'blinkit_credentials');
      const baseUrl = creds?.baseUrl || process.env.BLINKIT_API_BASE;
      const apiKey = creds?.apiKey || process.env.BLINKIT_API_KEY;
      if (!baseUrl) return [];
      const res = await this.client.get(`${baseUrl}/products`, {
        params: { barcode },
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });
      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapBlinkitItem(it));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('Blinkit adapter error', err?.message || err);
      return [];
    }
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_BLINKIT || 'blinkit_credentials');
      const baseUrl = creds?.baseUrl || process.env.BLINKIT_API_BASE;
      const apiKey = creds?.apiKey || process.env.BLINKIT_API_KEY;
      if (!baseUrl) return [];
      const res = await this.client.get(`${baseUrl}/search`, {
        params: { q: query },
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined
      });
      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapBlinkitItem(it));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('Blinkit search error', err?.message || err);
      return [];
    }
  }
}
