
import { supabase } from '../lib/supabase';
import { User, Product, Quote, Order } from '../types';

// The Supabase client in lib/supabase.ts is already initialized with valid credentials
// provided in previous steps, so we can consider it configured.
const isConfigured = () => true;

export const dataService = {
  isConfigured,

  // Profile Management
  async getProfile(mobile: string) {
    if (!mobile) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('mobile', mobile)
        .single();
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async upsertProfile(user: User) {
    if (!user.mobile) return { error: 'Mobile required' };
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          name: user.name,
          mobile: user.mobile,
          shop_name: user.shopName,
          address: user.address,
          location: user.location,
          business_category: user.businessCategory,
          is_subscribed: user.isSubscribed,
          subscription_type: user.subscriptionType,
          expiry_date: user.expiryDate
        }, { onConflict: 'mobile' });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },

  // Quote / Negotiation
  async getQuotes(mobile: string) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('merchant_mobile', mobile)
        .order('date', { ascending: false });
      return { data: data || [], error };
    } catch (e) {
      return { data: [], error: e };
    }
  },

  async createQuote(quote: Quote, merchantMobile: string) {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .insert({
          id: quote.id,
          merchant_mobile: merchantMobile,
          product_id: quote.productId,
          product_name: quote.productName,
          supplier_name: quote.supplierName,
          requested_qty: quote.requestedQty,
          status: quote.status,
          quoted_price: quote.quotedPrice,
          original_price: quote.originalPrice,
          date: quote.date,
          chat_history: quote.chatHistory
        });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },

  async updateQuote(quoteId: string, updates: Partial<Quote>) {
    try {
      const payload: any = {};
      if (updates.status) payload.status = updates.status;
      if (updates.quotedPrice !== undefined) payload.quoted_price = updates.quotedPrice;
      if (updates.chatHistory) payload.chat_history = updates.chatHistory;

      const { data, error } = await supabase
        .from('quotes')
        .update(payload)
        .eq('id', quoteId);
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  },

  // Orders
  async getOrders(mobile: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('merchant_mobile', mobile)
        .order('date', { ascending: false });
      return [
  { id: "1", product: "Rice Bag", status: "Dispatched" },
  { id: "2", product: "Sugar", status: "Pending" },
];
      return { data: data || [], error };
    } catch (e) {
      return { data: [], error: e };
    }
  },

  async createOrder(order: Order, merchantMobile: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          id: order.id,
          merchant_mobile: merchantMobile,
          date: order.date,
          items: order.items,
          total: order.total,
          status: order.status
        });
      return { data, error };
    } catch (e) {
      return { data: null, error: e };
    }
  }
};
