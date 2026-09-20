import axios, { AxiosInstance } from 'axios';
import { IMarketplaceAdapter, IAdapterProduct } from '../adapter.interface';
import { getSecret } from '../secretsManager';

export abstract class RealAdapterBase implements IMarketplaceAdapter {
  vendorCode: string;
  protected client: AxiosInstance;

  constructor(vendorCode: string, baseURL?: string) {
    this.vendorCode = vendorCode;
    this.client = axios.create({ baseURL });
  }

  // concrete adapters should implement these
  abstract fetchByBarcode(barcode: string): Promise<IAdapterProduct[]>;
  abstract search(query: string): Promise<IAdapterProduct[]>;

  protected async loadCredentials(secretName?: string) {
    if (!secretName) return null;
    return getSecret(secretName);
  }
}
