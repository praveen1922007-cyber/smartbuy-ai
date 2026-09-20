import { RealAdapterBase } from './adapter.base';
import { IAdapterProduct } from '../adapter.interface';

export class MeeshoRealAdapter extends RealAdapterBase {
  vendorCode = 'meesho';

  constructor() {
    super('meesho');
  }

  private mapMeeshoItem(item: any): IAdapterProduct {
    return {
      externalId: String(item.id || item.sku || ''),
      name: item.title || item.name || 'Unknown',
      barcode: item.barcode || undefined,
      price: Number(item.price?.value ?? item.price ?? 0),
      mrp: item.mrp ? Number(item.mrp) : undefined,
      availability: item.available !== undefined ? Boolean(item.available) : undefined,
      url: item.url || item.productUrl || undefined,
      vendor: this.vendorCode,
      vendorName: 'Meesho',
      storeLocation: undefined
    };
  }

  async fetchByBarcode(barcode: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_MEESHO || 'meesho_credentials');
      const baseUrl = creds?.baseUrl || process.env.MEESHO_API_BASE;
      const token = creds?.token || process.env.MEESHO_API_TOKEN;
      if (!baseUrl) return [];
      const res = await this.client.get(`${baseUrl}/products`, {
        params: { barcode },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapMeeshoItem(it));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('Meesho adapter error', err?.message || err);
      return [];
    }
  }

  async search(query: string): Promise<IAdapterProduct[]> {
    try {
      const creds = await this.loadCredentials(process.env.AWS_SECRET_NAME_MEESHO || 'meesho_credentials');
      const baseUrl = creds?.baseUrl || process.env.MEESHO_API_BASE;
      const token = creds?.token || process.env.MEESHO_API_TOKEN;
      if (!baseUrl) return [];
      const res = await this.client.get(`${baseUrl}/search`, {
        params: { q: query },
        headers: token ? { Authorization: `Bearer ${token}` } : undefined
      });
      const items = res.data?.items || res.data?.products || [];
      return items.map((it: any) => this.mapMeeshoItem(it));
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.warn('Meesho search error', err?.message || err);
      return [];
    }
  }
}
