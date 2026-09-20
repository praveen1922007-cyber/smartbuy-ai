import { Store, IStore } from '../models/store.model';
import { Types } from 'mongoose';

export async function createStore(payload: Partial<IStore>) {
  const s = new Store(payload);
  return s.save();
}

export async function findStoreById(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  return Store.findById(id).lean();
}

export async function searchNearbyStores(lon: number, lat: number, radiusMeters = 5000, limit = 20) {
  return Store.find({
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
        $maxDistance: radiusMeters
      }
    }
  }).limit(limit).lean();
}

export async function listStores(filter = {}, limit = 50, skip = 0) {
  return Store.find(filter).limit(limit).skip(skip).lean();
}
