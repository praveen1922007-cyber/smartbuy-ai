import { Request, Response } from 'express';
import * as RouteService from '../services/route.service';

export async function optimize(req: Request, res: Response) {
  try {
    const { items, start } = req.body; // items: string[] product names, start: {lat, lon}
    if (!items || !Array.isArray(items) || !start) return res.status(400).json({ error: 'items and start required' });
    const result = await RouteService.optimizeShoppingRoute(items, start);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Optimization failed' });
  }
}
