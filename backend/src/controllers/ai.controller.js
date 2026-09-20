import { products, stores } from '../data/mockData.js';
import { buildRecommendation } from '../services/recommendation.service.js';

export const getRecommendation = (req, res) => {
  const { productName } = req.query;
  const selectedProduct = products.find((item) => item.name.toLowerCase() === String(productName || '').toLowerCase()) || products[0];
  const recommendation = buildRecommendation(productName || selectedProduct.name, stores, selectedProduct);

  res.json({ recommendation });
};
