import { products } from '../data/mockData.js';

export const listProducts = (req, res) => {
  const { query } = req.query;
  const filtered = query
    ? products.filter((product) => product.name.toLowerCase().includes(String(query).toLowerCase()))
    : products;

  res.json({ items: filtered });
};

export const getProductById = (req, res) => {
  const product = products.find((entry) => entry.id === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ product });
};
