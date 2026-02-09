import React, { useState, useMemo, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import AITools from './components/AITools';
import Cart from './components/Cart';
import ChatAssistant from './components/ChatAssistant';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { MOCK_PRODUCTS, CATEGORIES } from './constants';
import { AppView, Product, CartItem, User, Order, Quote, Message } from './types';
import { getChatAssistantResponse } from './services/geminiService';
import { dataService } from './services/dataService';
import { 
  ArrowRight, 
  Package, 
  Clock, 
  Phone, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  ArrowLeft, 
  Send, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Truck,
  ShieldCheck,
  Crown
} from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState(AppView.HOME);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRestocking, setIsRestocking] = useState(false);
  const [counterOffer, setCounterOffer] = useState('');
  const [isSupplierTyping, setIsSupplierTyping] = useState(false);
  const [isLoadingSync, setIsLoadingSync] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('retailiqo_user');
    if (saved) return JSON.parse(saved);
    return {
      name: '',
      mobile: '',
      shopName: '',
      address: '',
      location: '', 
      businessCategory: 'Supermarkets/Grocery Stores',
      isLoggedIn: false,
      isSubscribed: false
    };
  });

  const syncWithCloud = async (mobile: string) => {
    if (!mobile) return;
    setIsLoadingSync(true);
    try {
      const profile = await dataService.getProfile(mobile);
      if (profile) {
        setUser(prev => ({
          ...prev,
          name: profile.name,
          shopName: profile.shop_name,
          address: profile.address,
          location: profile.location,
          businessCategory: profile.business_category || prev.businessCategory,
          isSubscribed: profile.is_subscribed,
          subscriptionType: profile.subscription_type,
          expiryDate: profile.expiry_date
        }));
      }

      const { data: qData } = await dataService.getQuotes(mobile);
      if (qData) {
        setQuotes(qData.map((q: any) => ({
          id: q.id,
          productId: q.product_id,
          productName: q.product_name,
          supplierName: q.supplier_name,
          requestedQty: q.requested_qty,
          status: q.status,
          quotedPrice: q.quoted_price,
          originalPrice: q.original_price,
          date: q.date,
          chatHistory: q.chat_history
        })));
      }

      const { data: oData } = await dataService.getOrders(mobile);
      if (oData) setOrders(oData);
    } catch (err) {
      console.error("Cloud sync failed", err);
    } finally {
      setIsLoadingSync(false);
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      syncWithCloud(user.mobile);
    }
  }, [user.isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('retailiqo_user', JSON.stringify(user));
    if (user.isLoggedIn && !user.isSubscribed && currentView !== AppView.SUBSCRIPTION) {
      setCurrentView(AppView.SUBSCRIPTION);
    }
  }, [user, currentView]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedQuote?.chatHistory, isSupplierTyping]);

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.supplierName.toLowerCase().includes(q));
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.name || !user.mobile || !user.shopName || !user.address || !user.location) {
      alert("Please fill in all details.");
      return;
    }
    const loginUser = { ...user, isLoggedIn: true };
    await dataService.upsertProfile(loginUser);
    setUser(loginUser);
    setCurrentView(AppView.SUBSCRIPTION);
  };

  const handleSubscriptionPayment = async (type: 'monthly' | 'yearly') => {
    const expiry = new Date();
    if (type === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
    else expiry.setFullYear(expiry.getFullYear() + 1);

    const updatedUser: User = { 
      ...user, 
      isSubscribed: true, 
      subscriptionType: type,
      expiryDate: expiry.toLocaleDateString()
    };
    await dataService.upsertProfile(updatedUser);
    setUser(updatedUser);
    setCurrentView(AppView.DASHBOARD);
  };

const handleRequestQuote = (product: Product) => {
  const newQuote: Quote = {
    id: Date.now().toString(),
    productName: product.name,
    supplierName: product.supplier || "Supplier",
    quotedPrice: product.price,
    status: "Pending",
    date: new Date().toLocaleDateString(),
    chatHistory: [],
  };

  setQuotes(prev => [...prev, newQuote]);
  setCurrentView(AppView.QUOTES);
};

    await dataService.createQuote(newQuote, user.mobile);
    setQuotes(prev => [newQuote, ...prev]);
    alert("Quote request sent!");
  };

  const handlePlaceOrder = async (order: Order) => {
    try {
      await dataService.createOrder(order, user.mobile);
      setOrders(prev => [order, ...prev]);
      setCart([]);
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  const handleAutoRestock = () => {
    setIsRestocking(true);
    setTimeout(() => {
      const lowStockItems = MOCK_PRODUCTS.filter(p => p.stock < 100 || p.isTrending);
      setCart(prev => {
        let newCart = [...prev];
        lowStockItems.slice(0, 3).forEach(p => {
          const existing = newCart.find(item => item.id === p.id);
          if (!existing) {
            newCart.push({ ...p, quantity: p.minOrderQty * 2 });
          }
        });
        return newCart;
      });
      setIsRestocking(false);
      setCurrentView(AppView.CART);
      alert("AI has identified stock gaps and populated your cart!");
    }, 1500);
  };

  const handleCounterOffer = async () => {
    if (!counterOffer || !selectedQuote) return;
    const offerValue = parseFloat(counterOffer);
    const userMsg: Message = { role: 'user', text: `Can we do ₹${offerValue} per unit?` };
    const updatedHistory = [...selectedQuote.chatHistory, userMsg];
    const updatedQuote: Quote = {
      ...selectedQuote,
      status: 'Negotiating',
      quotedPrice: offerValue,
      chatHistory: updatedHistory
    };
    setSelectedQuote(updatedQuote);
    setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? updatedQuote : q));
    setCounterOffer('');
    setIsSupplierTyping(true);
    try {
      const reply = await getChatAssistantResponse(selectedQuote.chatHistory, `Wholesale negotiation for ${selectedQuote.productName}. Merchant offered ₹${offerValue}. Respond as supplier.`);
      const supplierMsg: Message = { role: 'model', text: reply || "We can't go that low. How about a mid-point?" };
      const finalQuote: Quote = { ...updatedQuote, chatHistory: [...updatedQuote.chatHistory, supplierMsg] };
      await dataService.updateQuote(selectedQuote.id, finalQuote);
      setSelectedQuote(finalQuote);
      setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? finalQuote : q));
    } catch (e) {
      console.error(e);
    } finally {
      setIsSupplierTyping(false);
    }
  };

  const handleAcceptDeal = async () => {
    if (!selectedQuote) return;
    const product = MOCK_PRODUCTS.find(p => p.id === selectedQuote.productId);
    if (!product) return;
    const newItem: CartItem = { ...product, price: selectedQuote.quotedPrice, quantity: selectedQuote.requestedQty };
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString(),
      items: [newItem],
      total: selectedQuote.quotedPrice * selectedQuote.requestedQty,
      status: 'Pending',
      trackingNumber: `TXN${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    await dataService.updateQuote(selectedQuote.id, { status: 'Accepted' });
    await dataService.createOrder(newOrder, user.mobile);
    setOrders(prev => [newOrder, ...prev]);
    setQuotes(prev => prev.map(q => q.id === selectedQuote.id ? { ...q, status: 'Accepted' } : q));
    alert("Deal Accepted! Checkout generated.");
    setCurrentView(AppView.ORDERS);
    setSelectedQuote(null);
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      cartCount={cart.length}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      user={user}
      onLogout={() => {
        localStorage.removeItem('retailiqo_user');
        window.location.reload();
      }}
    >
      {isLoadingSync && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-[999] flex items-center justify-center">
          <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col items-center gap-4 shadow-2xl">
            <Loader2 className="animate-spin text-indigo-400" size={40} />
            <p className="font-black text-xs uppercase tracking-widest">Syncing Cloud...</p>
          </div>
        </div>
      )}

      {currentView === AppView.HOME && (
         <div className="py-20 text-center animate-in fade-in duration-1000 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 mb-6">
              <Sparkles size={14} /> AI-Powered Wholesale Hub
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter leading-[0.9]">
              Retail Sourcing <br/><span className="text-indigo-600">Reinvented.</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Connect directly with verified suppliers, negotiate prices with Asanix AI, and manage your bulk inventory in one unified platform.
            </p>
            <button onClick={() => setCurrentView(AppView.AUTH)} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg shadow-2xl shadow-indigo-200 hover:scale-105 transition-all flex items-center gap-2">
              Merchant Portal <ArrowRight size={22} />
            </button>
         </div>
      )}

      {currentView === AppView.AUTH && (
        <div className="max-w-md mx-auto py-10">
          <form onSubmit={handleAuthSubmit} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Onboarding</h2>
            <div className="space-y-4">
              <InputField label="Full Name" value={user.name} onChange={(v: string) => setUser({...user, name: v})} placeholder="Enter name" />
              <InputField label="Mobile Number" value={user.mobile} onChange={(v: string) => setUser({...user, mobile: v})} placeholder="+91" />
              <InputField label="Shop Identity" value={user.shopName} onChange={(v: string) => setUser({...user, shopName: v})} placeholder="Store name" />
              <InputField label="Location" value={user.location} onChange={(v: string) => setUser({...user, location: v})} placeholder="City" />
              <select 
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none focus:border-indigo-600 text-sm font-bold"
                value={user.businessCategory}
                onChange={e => setUser({...user, businessCategory: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none h-24 text-sm font-bold" placeholder="Store address..." value={user.address} onChange={e => setUser({...user, address: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black">Complete Setup</button>
          </form>
        </div>
      )}

      {currentView === AppView.SUBSCRIPTION && (
         <div className="max-w-4xl mx-auto py-10 space-y-10">
            <h2 className="text-4xl font-black text-slate-900 text-center">Activate License</h2>
            <div className="grid md:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 flex flex-col shadow-sm">
                  <ShieldCheck className="mb-6 text-slate-900" size={32} />
                  <h3 className="text-2xl font-black mb-1">Standard Pro</h3>
                  <p className="text-6xl font-black mb-8">₹100<span className="text-sm">/mo</span></p>
                  <button onClick={() => handleSubscriptionPayment('monthly')} className="mt-auto w-full bg-slate-900 text-white py-4 rounded-2xl font-black">Activate</button>
               </div>
               <div className="bg-indigo-600 p-10 rounded-[3rem] text-white flex flex-col shadow-2xl scale-105">
                  <Crown className="mb-6 text-white" size={32} />
                  <h3 className="text-2xl font-black mb-1">Enterprise Elite</h3>
                  <p className="text-6xl font-black mb-8">₹1000<span className="text-sm">/yr</span></p>
                  <button onClick={() => handleSubscriptionPayment('yearly')} className="mt-auto w-full bg-white text-indigo-600 py-4 rounded-2xl font-black">Go Enterprise</button>
               </div>
            </div>
         </div>
      )}

      {currentView === AppView.DASHBOARD && <Dashboard user={user} onAutoRestock={handleAutoRestock} isRestocking={isRestocking} />}
      {currentView === AppView.MARKETPLACE && (
        <div className="space-y-8">
           <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black">Marketplace</h2>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['All', ...CATEGORIES].map(c => (
                  <button key={c} onClick={() => setSelectedCategory(c === 'All' ? null : c)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${ (selectedCategory === c || (c === 'All' && !selectedCategory)) ? 'bg-indigo-600 text-white' : 'bg-white text-slate-500' }`}> {c} </button>
                ))}
              </div>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {filteredProducts.map(p => (
               <ProductCard key={p.id} product={p} onAddToCart={(product) => { setCart(prev => [...prev, { ...product, quantity: product.minOrderQty }]); }} onRequestQuote={handleRequestQuote} />
             ))}
           </div>
        </div>
      )}
      {currentView === AppView.PROFILE && <Profile user={user} />}
      {currentView === AppView.CART && <Cart items={cart} onRemove={id => setCart(prev => prev.filter(i => i.id !== id))} onUpdateQty={(id, qty) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: qty} : i))} onOrderPlaced={handlePlaceOrder} setView={setCurrentView} />}
      {currentView === AppView.AI_TOOLS && <AITools user={user} />}
      <ChatAssistant />
    </Layout>
  );
};

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const InputField = ({ label, value, onChange, placeholder }: InputFieldProps) => (
  <div className="space-y-1">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</label>
    <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-sm font-bold" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} />
  </div>
);
export default App;
