import { Request, Response } from 'express';
import * as StoreService from '../services/store.service';

export async function createStore(req: Request, res: Response) {
  try {
    const payload = req.body;
    const store = await StoreService.registerStore(payload);
    res.status(201).json(store);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not create store' });
  }
}

export async function getStore(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const store = await StoreService.getStore(id);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    res.json(store);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not fetch store' });
  }
}

export async function nearby(req: Request, res: Response) {
  try {
    const lon = Number(req.query.lon || req.body.lon);
    const lat = Number(req.query.lat || req.body.lat);
    const radius = Number(req.query.radius || 5000);
    if (!lon || !lat) return res.status(400).json({ error: 'lon and lat are required' });
    const list = await StoreService.nearbyStores(lon, lat, radius);
    res.json(list);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not fetch nearby stores' });
  }
}

export async function listStores(req: Request, res: Response) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 50);
    const skip = (page - 1) * limit;
    const list = await StoreService.listAll({}, limit, skip);
    res.json(list);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Could not list stores' });
  }
}
