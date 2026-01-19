
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  rating: number;
  reviews: number;
  image: string;
  supplierId: string;
  supplierName: string;
  supplierPhone?: string;
  supplierEmail?: string;
  minOrderQty: number;
  stock: number;
  description: string;
  distance: string;
  isTrending?: boolean;
  sku: string;
  mfgDate?: string;
  expiryDate?: string;
}

export interface Supplier {
  id: string;
  name: string;
  rating: number;
  verified: boolean;
  location: string;
  distance: string;
  categories: string[];
}

export interface User {
  name: string;
  mobile: string;
  shopName: string;
  address: string;
  location: string;
  businessCategory: string;
  isLoggedIn: boolean;
  isSubscribed: boolean;
  subscriptionType?: 'monthly' | 'yearly';
  expiryDate?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Dispatched' | 'Delivered';
  trackingNumber?: string;
}

export interface Quote {
  id: string;
  productId: string;
  productName: string;
  supplierName: string;
  requestedQty: number;
  status: 'Pending' | 'Accepted' | 'Negotiating' | 'Rejected';
  quotedPrice: number; // The current price in the negotiation
  originalPrice: number; // Marketplace baseline
  date: string;
  chatHistory: Message[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export enum AppView {
  HOME = 'home',
  AUTH = 'auth',
  SUBSCRIPTION = 'subscription',
  MARKETPLACE = 'marketplace',
  AI_TOOLS = 'ai_tools',
  ORDERS = 'orders',
  QUOTES = 'quotes',
  NEGOTIATION = 'negotiation',
  CART = 'cart',
  DASHBOARD = 'dashboard',
  PROFILE = 'profile',
  TRACKING = 'tracking',
  INVOICE = 'invoice'
}
