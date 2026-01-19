
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// Fix: Added Sparkles to the imported icons from lucide-react
import { TrendingUp, AlertTriangle, Package, DollarSign, ArrowUpRight, Loader2, Sparkles } from 'lucide-react';
import { User } from '../types';

const DATA = [
  { name: 'Mon', sales: 4000, prediction: 4200 },
  { name: 'Tue', sales: 3000, prediction: 3100 },
  { name: 'Wed', sales: 2000, prediction: 2400 },
  { name: 'Thu', sales: 2780, prediction: 2900 },
  { name: 'Fri', sales: 1890, prediction: 3000 },
  { name: 'Sat', sales: 2390, prediction: 4000 },
  { name: 'Sun', sales: 3490, prediction: 4200 },
];

const STOCK = [
  { name: 'Headphones', level: 12, min: 20 },
  { name: 'LED Bulbs', level: 85, min: 50 },
  { name: 'Rice Bags', level: 5, min: 10 },
  { name: 'Vases', level: 44, min: 10 },
];

interface DashboardProps {
  user: User;
  onAutoRestock: () => void;
  isRestocking: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onAutoRestock, isRestocking }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Enterprise Dashboard</h1>
          <p className="text-slate-500 font-medium">Welcome back, {user.name} | <span className="text-indigo-600">{user.shopName}</span></p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 flex items-center gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">Asanix AI System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<DollarSign />} label="Estimated Revenue" value="₹4.2L" growth="+12%" />
        <StatCard icon={<TrendingUp />} label="Market Demand" value="High" growth="+5%" />
        <StatCard icon={<Package />} label="Low Stock Alerts" value="3 SKU" growth="Action Required" color="text-rose-600" />
        <StatCard icon={<AlertTriangle />} label="Expiry Risk" value="₹12.5k" growth="Near Date" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black tracking-tight">AI Sales Prediction</h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Weekly Cycle</span>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis hide />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="prediction" stroke="#4f46e5" strokeDasharray="5 5" fill="transparent" />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
           <h3 className="text-xl font-black">Stock Health</h3>
           <div className="space-y-6">
              {STOCK.map(item => (
                <div key={item.name} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                      <span>{item.name}</span>
                      <span className={item.level < item.min ? 'text-rose-400' : 'text-emerald-400'}>{item.level}/{item.min} Units</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${item.level < item.min ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{width: `${Math.min(100, (item.level / item.min) * 100)}%`}}></div>
                   </div>
                </div>
              ))}
           </div>
           <button 
             onClick={onAutoRestock}
             disabled={isRestocking}
             className="w-full bg-indigo-600 py-4 rounded-2xl font-black mt-4 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
           >
              {isRestocking ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Auto-Restock AI <ArrowUpRight size={18} /></>}
           </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, growth, color = 'text-indigo-600' }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
    <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        <span className={`text-[10px] font-bold ${color.includes('rose') || color.includes('amber') ? color : 'text-emerald-500'}`}>{growth}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
