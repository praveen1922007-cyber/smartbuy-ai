import { stores, products, reviews } from '../data/mockData.js';

export const listStores = (req, res) => {
  const { query } = req.query;
  const filtered = query
    ? stores.filter((store) => store.name.toLowerCase().includes(String(query).toLowerCase()))
    : stores;

  res.json({ items: filtered });
};

export const getStoreById = (req, res) => {
  const store = stores.find((entry) => entry.id === req.params.id);
  if (!store) {
    return res.status(404).json({ message: 'Store not found' });
  }

  const storeProducts = products.filter((product) => product.storeId === store.id);
  const storeReviews = reviews.filter((review) => review.storeId === store.id);

  res.json({ store: { ...store, products: storeProducts, reviews: storeReviews } });
};
