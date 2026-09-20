import { Request, Response } from 'express';
import * as AIService from '../services/ai.service';

export async function recommend(req: Request, res: Response) {
  try {
    const { product, lon, lat } = req.query;
    if (!product || !lon || !lat) return res.status(400).json({ error: 'product, lon and lat required' });
    const rec = await AIService.recommendStoreForProduct(String(product), Number(lon), Number(lat));
    if (!rec) return res.status(404).json({ error: 'No recommendation found' });
    res.json(rec);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Recommendation failed' });
  }
}

export async function detectFakeReview(req: Request, res: Response) {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    // Placeholder: simple heuristic (too short or too generic) — replace with Bedrock model integration
    const suspicious = text.length < 20 || /best|cheapest|amazing/gi.test(text);
    res.json({ text, verdict: suspicious ? 'suspicious' : 'genuine' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to analyze review' });
  }
}
