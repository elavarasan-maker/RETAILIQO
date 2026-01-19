
import React from 'react';
import { ShoppingCart, LayoutDashboard, Store, Sparkles, Package, Search, User as UserIcon, MapPin, LogOut, ShieldCheck, FileText, Crown } from 'lucide-react';
import { AppView, User } from '../types';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ 
  currentView, 
  setView, 
  cartCount, 
  searchQuery, 
  setSearchQuery, 
  user,
  onLogout,
  children 
}) => {
  if (currentView === AppView.HOME || currentView === AppView.AUTH || currentView === AppView.SUBSCRIPTION) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-100 sticky top-0 h-screen p-6">
        <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => setView(AppView.DASHBOARD)}>
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-indigo-200 shadow-xl">
            <Store className="text-white w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black text-slate-900 tracking-tighter">RetailiQo</span>
            <span className="text-[10px] text-indigo-600 font-black tracking-widest uppercase">Smart Merchant</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <NavItem active={currentView === AppView.DASHBOARD} onClick={() => setView(AppView.DASHBOARD)} icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem active={currentView === AppView.MARKETPLACE} onClick={() => setView(AppView.MARKETPLACE)} icon={<Store size={20} />} label="Sourcing" />
          <NavItem active={currentView === AppView.QUOTES} onClick={() => setView(AppView.QUOTES)} icon={<FileText size={20} />} label="Price Quotes" />
          <NavItem active={currentView === AppView.ORDERS} onClick={() => setView(AppView.ORDERS)} icon={<Package size={20} />} label="Dispatch" />
          <NavItem active={currentView === AppView.AI_TOOLS} onClick={() => setView(AppView.AI_TOOLS)} icon={<Sparkles size={20} />} label="Asanix AI" />
          <NavItem active={currentView === AppView.PROFILE} onClick={() => setView(AppView.PROFILE)} icon={<UserIcon size={20} />} label="My Profile" />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100 space-y-4">
           {/* Subscription Status Badge */}
           <div className={`p-4 rounded-3xl flex flex-col gap-2 ${user.subscriptionType === 'yearly' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'bg-slate-900 text-white'}`}>
              <div className="flex items-center gap-2">
                {user.subscriptionType === 'yearly' ? <Crown size={16} /> : <ShieldCheck size={16} />}
                <p className="text-[10px] font-black uppercase tracking-widest leading-none">
                  {user.subscriptionType === 'yearly' ? 'Yearly Premium' : 'Monthly Basic'}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">Status: Verified & Paid</p>
                <p className="text-[9px] font-bold opacity-60 uppercase tracking-tighter">Expires: {user.expiryDate}</p>
              </div>
           </div>

           <button onClick={() => setView(AppView.CART)} className={`flex items-center justify-between w-full p-4 rounded-2xl transition-all ${currentView === AppView.CART ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}>
            <div className="flex items-center gap-3">
              <ShoppingCart size={22} />
              <span className="font-bold">Cart</span>
            </div>
            {cartCount > 0 && (
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${currentView === AppView.CART ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>{cartCount}</span>
            )}
           </button>
           
           <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setView(AppView.PROFILE)}
              >
                 {user.name ? user.name.charAt(0) : <UserIcon size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-black text-slate-900 truncate leading-none mb-1">{user.shopName || "Store Account"}</p>
                 <p className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tighter">{user.mobile}</p>
              </div>
              <button onClick={onLogout} title="Logout" className="text-slate-300 hover:text-rose-500 transition-colors">
                 <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-100 p-4 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => setView(AppView.DASHBOARD)}>
          <Store className="text-indigo-600 w-6 h-6" />
          <span className="text-xl font-black tracking-tighter">RetailiQo</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setView(AppView.PROFILE)} className="p-2 bg-slate-50 rounded-xl">
            <UserIcon size={22} className="text-slate-600" />
          </button>
          <button onClick={() => setView(AppView.CART)} className="relative p-2 bg-slate-50 rounded-xl">
            <ShoppingCart size={22} className="text-slate-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-white">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex-1 max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search SKUs, Wholesalers..." 
              className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-sm shadow-sm focus:border-indigo-600 outline-none transition-all font-medium" 
            />
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white border border-slate-100 px-4 py-2.5 rounded-2xl shadow-sm">
                <MapPin size={14} className="text-indigo-600" />
                {user.location || "Default Location"}
             </div>
             <button onClick={() => setView(AppView.AI_TOOLS)} className="bg-slate-900 text-white p-3 rounded-2xl shadow-xl hover:scale-105 transition-transform active:scale-95">
                <Sparkles size={20} />
             </button>
          </div>
        </div>
        {children}
        <div className="mt-20 pt-10 border-t border-slate-100 text-center">
           <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2025 Asanix Developers • RetailiQo OS</p>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 w-full p-4 rounded-2xl transition-all duration-300 ${
      active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
    <span className="font-black text-sm tracking-tight">{label}</span>
  </button>
);

export default Layout;
