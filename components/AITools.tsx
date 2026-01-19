
import React, { useState, useRef } from 'react';
import { Sparkles, BarChart3, Map, Search, LayoutGrid, Loader2, Upload, Trash2, Send, MapPin, Info, ArrowRight, Store } from 'lucide-react';
import { getBusinessAdvice, getMarketIntelligence, identifyProductFromImage, getStoreLayoutOptimization } from '../services/geminiService';
import { User } from '../types';

interface AIToolsProps {
  user: User;
}

const AITools: React.FC<AIToolsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'advisor' | 'intel' | 'recognition' | 'layout'>('recognition');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [dimensions, setDimensions] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const merchantContext = `Shop: ${user.shopName}, Category: ${user.businessCategory}, Location: ${user.location}, Address: ${user.address}`;

  const handleVisionSearch = async () => {
    if (!previewImage) return;
    setLoading(true);
    try {
      const base64 = previewImage.split(',')[1];
      const res = await identifyProductFromImage(base64);
      setResult(res || "Analysis complete.");
    } catch (e) {
      setResult("Error identifying product. Ensure image is clear.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdvisorSearch = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await getBusinessAdvice(inputText, merchantContext);
      setResult(res || "Growth strategy generated.");
    } catch (e) {
      setResult("Error generating advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleIntelSearch = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await getMarketIntelligence(inputText, merchantContext);
      setResult(res || "Market intelligence report generated.");
    } catch (e) {
      setResult("Error gathering market intel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutSearch = async () => {
    if (!dimensions.trim()) return;
    setLoading(true);
    try {
      const res = await getStoreLayoutOptimization(dimensions, merchantContext);
      setResult(res || "Custom store layout generated.");
    } catch (e) {
      setResult("Error generating layout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const switchTab = (tab: any) => {
    setActiveTab(tab);
    setResult(null);
    setInputText('');
    setDimensions('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTab === 'recognition' ? 'Asanix AI Vision' : 
               activeTab === 'advisor' ? 'Growth Advisor' :
               activeTab === 'intel' ? 'Market Intel' : 'Layout Optimizer'}
            </h1>
            <p className="text-slate-500 text-sm font-medium">Precision AI for {user.shopName}</p>
          </div>
        </div>

        {/* Merchant Context Confirmation Bar */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-100 flex items-center gap-3 shadow-sm">
           <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
              <Store size={14} />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Merchant Identity</span>
              <span className="text-xs font-bold text-slate-700">{user.businessCategory} • {user.location}</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <ToolCard active={activeTab === 'recognition'} onClick={() => switchTab('recognition')} icon={<Search size={18} />} title="Vision Search" />
        <ToolCard active={activeTab === 'advisor'} onClick={() => switchTab('advisor')} icon={<BarChart3 size={18} />} title="Advisor" />
        <ToolCard active={activeTab === 'intel'} onClick={() => switchTab('intel')} icon={<Map size={18} />} title="Market Intel" />
        <ToolCard active={activeTab === 'layout'} onClick={() => switchTab('layout')} icon={<LayoutGrid size={18} />} title="Store Layout" />
      </div>

      <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm min-h-[550px] flex flex-col relative overflow-hidden">
        {activeTab === 'recognition' && (
          <div className="space-y-8 max-w-2xl mx-auto w-full py-6">
            {!previewImage ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-[3rem] p-16 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group bg-slate-50/30"
              >
                <div className="bg-white w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-sm group-hover:scale-110 transition-transform">
                   <Upload className="text-slate-300 group-hover:text-indigo-600" size={40} />
                </div>
                <h3 className="text-xl font-black text-slate-900">Scan Product SKU</h3>
                <p className="text-slate-500 text-sm mt-2 max-w-xs mx-auto">Upload a photo to see wholesale pricing and demand analysis.</p>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative rounded-[2.5rem] overflow-hidden aspect-video shadow-2xl border-4 border-white">
                   <img src={previewImage} className="w-full h-full object-cover" alt="Preview" />
                   <button onClick={() => setPreviewImage(null)} className="absolute top-6 right-6 bg-white/90 backdrop-blur p-4 rounded-full text-rose-600 shadow-xl hover:bg-rose-50 transition-colors">
                      <Trash2 size={24} />
                   </button>
                </div>
                <button 
                  onClick={handleVisionSearch} 
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={24}/> Run Visual Analysis</>}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'advisor' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full py-6">
             <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 mb-6 flex gap-4">
                <div className="bg-white p-3 rounded-2xl text-indigo-600 h-fit shadow-sm"><Info size={20} /></div>
                <div>
                  <h4 className="text-indigo-900 font-black text-sm mb-1 uppercase tracking-widest">Growth Engine</h4>
                  <p className="text-indigo-700 text-xs font-medium leading-relaxed">Tell Asanix about your current stock challenges or sales drops. We'll use your {user.businessCategory} profile to provide a recovery plan.</p>
                </div>
             </div>
             <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Describe your ${user.shopName} business state... (e.g., Sales are down in the afternoon, competition is selling snacks cheaper)`}
                className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 outline-none focus:border-indigo-600 text-sm font-bold h-48 resize-none shadow-inner"
             />
             <button 
                onClick={handleAdvisorSearch}
                disabled={loading || !inputText.trim()}
                className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 hover:bg-indigo-700 disabled:opacity-50 transition-all"
             >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={24}/> Analyze & Solve</>}
             </button>
          </div>
        )}

        {activeTab === 'intel' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full py-6">
             <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 mb-6 flex gap-4">
                <div className="bg-white p-3 rounded-2xl text-amber-600 h-fit shadow-sm"><MapPin size={20} /></div>
                <div>
                   <h4 className="text-amber-900 font-black text-sm mb-1 uppercase tracking-widest">Market Watch</h4>
                   <p className="text-amber-700 text-xs font-medium leading-relaxed">Target a specific area (or your current {user.location} location) to find trending wholesale items and competitor gaps.</p>
                </div>
             </div>
             <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500" size={20} />
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Enter target neighborhood or city..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-14 pr-6 py-5 outline-none focus:border-amber-500 text-sm font-black shadow-inner"
                />
             </div>
             <button 
                onClick={handleIntelSearch}
                disabled={loading || !inputText.trim()}
                className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-200 flex items-center justify-center gap-3 hover:bg-black disabled:opacity-50 transition-all"
             >
                {loading ? <Loader2 className="animate-spin" /> : <><Map size={24}/> Run Market Intel</>}
             </button>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-6 max-w-2xl mx-auto w-full py-6">
             <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 mb-6 flex gap-4">
                <div className="bg-white p-3 rounded-2xl text-emerald-600 h-fit shadow-sm"><LayoutGrid size={20} /></div>
                <div>
                   <h4 className="text-emerald-900 font-black text-sm mb-1 uppercase tracking-widest">Smart Floorplan</h4>
                   <p className="text-emerald-700 text-xs font-medium leading-relaxed">Optimization for your {user.shopName} footprint. Tell us your store dimensions to get a custom shelf strategy.</p>
                </div>
             </div>
             
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Shop Dimensions & Shelf Count</label>
                <input 
                  type="text"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  placeholder="e.g. 20ft x 40ft, 12 large shelves, 2 chillers"
                  className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 outline-none focus:border-emerald-600 text-sm font-black shadow-inner"
                />
             </div>

             <button 
                onClick={handleLayoutSearch}
                disabled={loading || !dimensions.trim()}
                className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 hover:bg-emerald-700 disabled:opacity-50 transition-all"
             >
                {loading ? <Loader2 className="animate-spin" /> : <><LayoutGrid size={24}/> Optimize My Layout</>}
             </button>
          </div>
        )}

        {result && (
          <div className="mt-8 p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] shadow-xl animate-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto w-full group relative">
             <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3 text-indigo-900 font-black text-xl">
                   <div className="p-2 bg-indigo-100 rounded-xl"><Sparkles size={20} /></div>
                   Asanix Intelligence
                </div>
                <button onClick={() => switchTab('recognition')} className="group/btn text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-2">
                   Try Vision Search <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
             </div>
             <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed text-sm whitespace-pre-line font-medium bg-white p-6 rounded-2xl border border-slate-200">
                  {result}
                </p>
             </div>
          </div>
        )}

        {!result && !loading && (
           <div className="mt-auto flex flex-col items-center gap-2 pt-12 pb-6">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Calibrating with Merchant Profile Data</p>
              {activeTab !== 'recognition' && (
                <button 
                  onClick={() => switchTab('recognition')} 
                  className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Search size={12}/> Switch to Vision Search
                </button>
              )}
           </div>
        )}
      </div>
    </div>
  );
};

const ToolCard = ({ active, onClick, icon, title }: any) => (
  <button onClick={onClick} className={`p-4 md:p-5 rounded-2xl border transition-all text-left space-y-3 ${active ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl scale-105' : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-100 shadow-sm'}`}>
    <div className={`${active ? 'text-white' : 'text-indigo-600'}`}>{icon}</div>
    <div className="font-black text-[10px] md:text-xs tracking-tight uppercase tracking-widest">{title}</div>
  </button>
);

export default AITools;
