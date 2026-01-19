import React from 'react';
import { Star, Truck, MapPin, Plus, TrendingUp, Hash, Calendar, ShieldAlert, FileText, Phone, Mail } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onRequestQuote: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onRequestQuote }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {product.isTrending && (
          <div className="absolute top-4 left-4 glass-card bg-emerald-500/90 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border-emerald-400/30">
            <TrendingUp size={12} /> TRENDING SKU
          </div>
        )}
        <div className="absolute top-4 right-4 glass-card bg-white/90 px-3 py-1.5 rounded-full text-[10px] font-black text-indigo-700 shadow-sm">
          {product.discount}% OFF BULK
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">{product.category}</span>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
            <Star size={12} fill="currentColor" /> {product.rating}
          </div>
        </div>
        
        <h3 className="font-bold text-slate-800 line-clamp-2 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>

        <div className="bg-slate-50 rounded-2xl p-3 mb-4 space-y-2 border border-slate-100/50">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
            <div className="flex items-center gap-1.5">
              <Hash size={12} className="text-slate-400" />
              <span>SKU: <span className="text-slate-900">{product.sku}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-400" />
              <span>BATCH: <span className="text-slate-900">{product.mfgDate?.slice(2)}</span></span>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-end gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">₹{product.price}</span>
            <span className="text-xs text-slate-400 line-through mb-1">₹{product.mrp}</span>
            <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">/ Unit</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Truck size={12} />
              </div>
              <span>Min. Order: <span className="text-slate-900">{product.minOrderQty} Units</span></span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
              <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <MapPin size={12} />
              </div>
              <span className="truncate">{product.supplierName} • {product.distance}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
              onClick={() => onAddToCart(product)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 active:scale-95"
            >
              <Plus size={14} /> Add to Cart
            </button>
            <button 
              onClick={() => onRequestQuote(product)}
              className="bg-white hover:bg-slate-50 text-slate-800 py-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 border border-slate-200 active:scale-95"
            >
              <FileText size={14} /> Negotiation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;