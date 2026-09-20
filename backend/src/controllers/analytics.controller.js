import { products, stores, reviews, offers } from '../data/mockData.js';

export const getAnalytics = (_req, res) => {
  const totalProducts = products.length;
  const averagePrice = products.reduce((sum, product) => sum + product.price, 0) / totalProducts;
  const openStores = stores.filter((store) => store.open).length;
  const suspiciousReviews = reviews.filter((review) => review.status === 'suspicious').length;

  res.json({
    summary: {
      totalProducts,
      averagePrice: Number(averagePrice.toFixed(2)),
      openStores,
      suspiciousReviews,
      activeOffers: offers.length,
    },
    stores,
    reviews,
  });
};
