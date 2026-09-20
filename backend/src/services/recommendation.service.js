export const buildRecommendation = (productName, stores, product) => {
  const normalizedProduct = productName?.toLowerCase() || '';
  const candidates = stores.map((store) => {
    const priceDelta = product ? Math.abs(store.distanceKm * 10 - product.price) : 0;
    const score =
      (product?.price ? 0.4 * (1 / (1 + priceDelta / 100)) : 0.4) +
      (store.distanceKm ? 0.2 * (1 / (1 + store.distanceKm)) : 0.2) +
      (store.rating ? 0.2 * (store.rating / 5) : 0.2) +
      (store.open ? 0.1 : 0) +
      (store.offers?.length ? 0.1 : 0);

    return { ...store, score, reason: `Best for ${normalizedProduct || 'your need'} with value and convenience.` };
  });

  candidates.sort((a, b) => b.score - a.score);
  const [best] = candidates;

  return {
    productName: productName || 'Selected item',
    recommendedStore: best,
    explanation: `${best.name} is recommended because it offers better value while staying only ${best.distanceKm} km away.`,
    candidates,
  };
};
