
import React from 'react';
import { User, ShieldCheck, Crown, MapPin, Phone, Store, User as UserIcon, Briefcase, Calendar, CreditCard, Mail } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        {/* Header Cover */}
        <div className="h-40 bg-indigo-600 relative">
          <div className="absolute -bottom-16 left-10 p-2 bg-white rounded-[2.5rem] shadow-2xl">
            <div className="w-32 h-32 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black">
              {user.name ? user.name.charAt(0) : <UserIcon size={48} />}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-24 pb-12 px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.shopName || "New Merchant"}</h1>
              <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-widest text-xs">
                <Store size={14} className="text-indigo-600" />
                {user.businessCategory} • {user.location}
              </div>
            </div>
            
            <div className={`px-6 py-4 rounded-[1.5rem] flex items-center gap-3 shadow-lg ${user.subscriptionType === 'yearly' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-slate-900 text-white'}`}>
              {user.subscriptionType === 'yearly' ? <Crown /> : <ShieldCheck />}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Account Status</p>
                <p className="text-sm font-black">{user.subscriptionType === 'yearly' ? 'Enterprise Elite' : 'Standard Pro'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Merchant Details</h3>
              <div className="space-y-4">
                <ProfileItem icon={<UserIcon size={20} />} label="Full Name" value={user.name} />
                <ProfileItem icon={<Phone size={20} />} label="Mobile Contact" value={user.mobile} />
                <ProfileItem icon={<MapPin size={20} />} label="Dispatch Address" value={user.address} />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.2em] ml-1">Subscription Analytics</h3>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <Calendar size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold">Renewal Date</span>
                  </div>
                  <span className="text-sm font-black text-slate-900">{user.expiryDate || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <CreditCard size={18} className="text-indigo-600" />
                    <span className="text-sm font-bold">Billing Cycle</span>
                  </div>
                  <span className="text-sm font-black text-slate-900 capitalize">{user.subscriptionType || 'Monthly'}</span>
                </div>
                <div className="pt-4 border-t border-slate-200">
                   <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-relaxed">
                     Your account is fully synced with RetailiQo Cloud Sourcing Hub for maximum priority dispatch.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-indigo-50 border border-indigo-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm">
            <Briefcase className="text-indigo-600" />
          </div>
          <div>
            <h4 className="font-black text-indigo-900">Enterprise Tax Identity</h4>
            <p className="text-indigo-700 text-xs font-medium">Add your GSTIN to claim corporate tax credits on all bulk orders.</p>
          </div>
        </div>
        <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-sm shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">Update GST</button>
      </div>
    </div>
  );
};

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm group hover:border-indigo-200 transition-colors">
    <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-indigo-600 transition-colors">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-black text-slate-800 leading-tight">{value || "Not Set"}</p>
    </div>
  </div>
);

export default Profile;
