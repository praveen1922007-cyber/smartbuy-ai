export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: string;
  quality: string;
  stock: number;
  storeId: string;
  imageUrl?: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  city?: string;
  rating: number;
  distanceKm: number;
  open: boolean;
  offers: string[];
  description?: string;
  mapQuery?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AnalyticsSummary {
  totalProducts: number;
  averagePrice: number;
  openStores: number;
  suspiciousReviews: number;
  activeOffers: number;
}
