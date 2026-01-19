
import React, { useState } from 'react';
import { ShoppingCart, Trash2, ChevronRight, CheckCircle2, CreditCard, Wallet, Truck, Package } from 'lucide-react';
import { CartItem, Order, AppView } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  onOrderPlaced: (order: Order) => void;
  setView: (view: AppView) => void;
}

const Cart: React.FC<CartProps> = ({ items, onRemove, onUpdateQty, onOrderPlaced, setView }) => {
  const [step, setStep] = useState<'cart' | 'payment' | 'success'>('cart');
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const gst = subtotal * 0.18;
  const shipping = subtotal > 5000 ? 0 : 500;
  const total = subtotal + gst + shipping;

  const handleCheckout = () => {
    const newOrder: Order = {
      id: `RT-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toLocaleDateString(),
      items: [...items],
      total: total,
      status: 'Pending',
      trackingNumber: `TXN${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
    onOrderPlaced(newOrder);
    setStep('success');
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in duration-1000">
        <div className="bg-slate-100 p-8 rounded-full mb-6">
          <ShoppingCart size={64} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-black text-slate-900">Your Basket is Empty</h2>
        <p className="text-slate-500 max-w-xs mt-2 font-medium">The marketplace has thousands of verified bulk deals waiting for you.</p>
        <button onClick={() => setView(AppView.MARKETPLACE)} className="mt-8 bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-indigo-100">Explore Marketplace</button>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in duration-700">
        <div className="bg-emerald-50 w-28 h-28 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100 shadow-2xl">
          <CheckCircle2 size={56} className="text-emerald-500" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter">Order Successfully Placed!</h2>
        <p className="text-slate-500 text-lg mb-10 font-medium">Your request has been broadcast to verified suppliers. They will begin dispatch within 12 hours.</p>
        
        <div className="bg-white border border-slate-100 rounded-3xl p-8 text-left space-y-4 mb-10 shadow-sm">
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-400 font-bold uppercase tracking-widest">Shipment Status</span>
             <span className="bg-amber-50 text-amber-600 font-black px-4 py-1.5 rounded-full text-[10px] uppercase">Processing</span>
           </div>
           <div className="flex justify-between items-center text-sm">
             <span className="text-slate-400 font-bold uppercase tracking-widest">Est. Delivery</span>
             <span className="font-black text-slate-900">Next 48 Hours</span>
           </div>
        </div>

        <button 
          onClick={() => setView(AppView.DASHBOARD)}
          className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-12 animate-in fade-in duration-700">
      <div className="md:col-span-2 space-y-8">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {step === 'cart' ? 'Order Review' : 'Enterprise Checkout'}
        </h1>

        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="bg-white border border-slate-100 rounded-[2rem] p-6 flex gap-6 shadow-sm hover:shadow-md transition-shadow">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  <h3 className="font-black text-slate-900 text-lg line-clamp-1 leading-tight">{item.name}</h3>
                  <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-1">{item.supplierName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1.5 border border-slate-200">
                    <button onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-slate-600 hover:text-indigo-600">-</button>
                    <span className="text-sm font-black w-8 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQty(item.id, Math.min(item.stock, item.quantity + 1))} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm font-black text-slate-600 hover:text-indigo-600">+</button>
                  </div>
                  <span className="text-xl font-black text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-rose-500 self-start p-2 transition-colors">
                <Trash2 size={24} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-10 shadow-2xl sticky top-8">
          <h2 className="font-black text-2xl mb-8 tracking-tight">Summary</h2>
          
          <div className="space-y-4 pb-8 border-b border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-widest">Subtotal</span>
              <span className="font-black">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-widest">GST (18%)</span>
              <span className="font-black">₹{gst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-bold uppercase tracking-widest">Shipment Fee</span>
              <span className={shipping === 0 ? 'text-emerald-400 font-black' : 'font-black'}>
                {shipping === 0 ? 'COMPLIMENTARY' : `₹${shipping}`}
              </span>
            </div>
          </div>

          <div className="py-10 space-y-8">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Grand Total</span>
              <span className="text-4xl font-black text-white">₹{total.toLocaleString()}</span>
            </div>
            <button 
              onClick={step === 'cart' ? () => setStep('payment') : handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-900 group"
            >
              {step === 'cart' ? 'Proceed to Pay' : 'Confirm Order'}
              <ChevronRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-white/5 p-4 rounded-2xl border border-white/10">
             <Package className="text-indigo-400" size={20} />
             <p className="text-[10px] text-slate-400 font-bold leading-tight">Secured Bulk Order via <span className="text-white">Asanix Direct Sourcing</span> protocol.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
