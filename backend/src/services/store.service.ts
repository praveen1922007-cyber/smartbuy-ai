import * as StoreRepo from '../repositories/store.repository';
import { IStore } from '../models/store.model';

export async function registerStore(payload: Partial<IStore>) {
  if (!payload.name) throw new Error('Store name is required');
  return StoreRepo.createStore(payload);
}

export async function getStore(id: string) {
  return StoreRepo.findStoreById(id);
}

export async function nearbyStores(lon: number, lat: number, radiusMeters = 5000) {
  return StoreRepo.searchNearbyStores(lon, lat, radiusMeters);
}

export async function listAll(filter = {}, limit = 50, skip = 0) {
  return StoreRepo.listStores(filter, limit, skip);
}
