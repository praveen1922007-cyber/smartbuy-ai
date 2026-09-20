const bcrypt = require('bcryptjs');

const users = [];

const stores = [
  {
    id: 'store-1',
    name: 'ABC Super Market',
    address: '12, Bharathidasan Salai, Thillai Nagar, Tiruchirappalli',
    city: 'Trichy',
    rating: 4.8,
    distanceKm: 0.5,
    open: true,
    offers: ['10% off on milk', 'Free delivery above ₹500'],
    description: 'Premium grocery destination with fresh dairy, bakery and daily essentials.',
    mapQuery: '12 Bharathidasan Salai Thillai Nagar Tiruchirappalli',
    coordinates: { lat: 10.7905, lng: 78.7047 },
  },
  {
    id: 'store-2',
    name: 'Green Basket',
    address: '8, Market Street, Puthur, Tiruchirappalli',
    city: 'Trichy',
    rating: 4.6,
    distanceKm: 1.1,
    open: true,
    offers: ['Buy 2 get 1 on rice', '₹15 cashback on oils'],
    description: 'Budget-friendly neighborhood store with strong grain and pantry pricing.',
    mapQuery: '8 Market Street Puthur Tiruchirappalli',
    coordinates: { lat: 10.7823, lng: 78.7134 },
  },
  {
    id: 'store-3',
    name: 'Daily Needs Mart',
    address: '24, 3rd Cross, Srirangam, Tiruchirappalli',
    city: 'Trichy',
    rating: 4.4,
    distanceKm: 1.7,
    open: false,
    offers: ['Flat ₹20 off on oil', 'Free sampler on fresh bread'],
    description: 'Fast-moving convenience mart with evening stock replenishment.',
    mapQuery: '24 3rd Cross Srirangam Tiruchirappalli',
    coordinates: { lat: 10.8603, lng: 78.6949 },
  },
];

const products = [
  {
    id: 'prod-1',
    name: 'Milk',
    category: 'Dairy',
    price: 58,
    quantity: '1 L',
    quality: 'High',
    stock: 12,
    storeId: 'store-1',
    imageUrl: 'https://images.unsplash.com/photo-1580910051070-3f418c78b76f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-2',
    name: 'Rice',
    category: 'Grains',
    price: 112,
    quantity: '5 kg',
    quality: 'Premium',
    stock: 5,
    storeId: 'store-2',
    imageUrl: 'https://images.unsplash.com/photo-1506801310323-534be5e7bb13?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-3',
    name: 'Cooking Oil',
    category: 'Cooking',
    price: 145,
    quantity: '1 L',
    quality: 'Standard',
    stock: 8,
    storeId: 'store-3',
    imageUrl: 'https://images.unsplash.com/photo-1611599536371-8bd8071d675d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-4',
    name: 'Bread',
    category: 'Bakery',
    price: 45,
    quantity: '400 g',
    quality: 'Fresh',
    stock: 20,
    storeId: 'store-1',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-5',
    name: 'Milk',
    category: 'Dairy',
    price: 60,
    quantity: '1 L',
    quality: 'Standard',
    stock: 9,
    storeId: 'store-2',
    imageUrl: 'https://images.unsplash.com/photo-1580910051070-3f418c78b76f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-6',
    name: 'Rice',
    category: 'Grains',
    price: 106,
    quantity: '5 kg',
    quality: 'Standard',
    stock: 7,
    storeId: 'store-1',
    imageUrl: 'https://images.unsplash.com/photo-1506801310323-534be5e7bb13?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-7',
    name: 'Cooking Oil',
    category: 'Cooking',
    price: 138,
    quantity: '1 L',
    quality: 'Premium',
    stock: 6,
    storeId: 'store-2',
    imageUrl: 'https://images.unsplash.com/photo-1611599536371-8bd8071d675d?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'prod-8',
    name: 'Bread',
    category: 'Bakery',
    price: 42,
    quantity: '400 g',
    quality: 'Fresh',
    stock: 15,
    storeId: 'store-3',
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80',
  },
];

const wishlist = [];
const orders = [];
const reviews = [
  { id: 'rev-1', storeId: 'store-1', user: 'Arun', text: 'Great quality and fast service.', status: 'genuine' },
  { id: 'rev-2', storeId: 'store-2', user: 'Meera', text: 'The deal felt repetitive and promotional.', status: 'suspicious' },
];

const offers = [
  { id: 'offer-1', title: 'Weekend Grocery Deal', discount: 10, validUntil: '2026-07-31' },
];

const notifications = [
  { id: 'notif-1', title: 'Price alert', message: 'Milk dropped by ₹5 near you.', read: false },
];

const seedDemoUser = () => {
  if (users.length === 0) {
    users.push({
      id: 'user-1',
      name: 'Demo User',
      email: 'demo@smartbuy.ai',
      password: bcrypt.hashSync('password123', 10),
      role: 'customer',
    });
  }
};

seedDemoUser();

module.exports = {
  users,
  stores,
  products,
  wishlist,
  orders,
  reviews,
  offers,
  notifications,
  seedDemoUser,
};
