
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Loader2, Bot, User } from 'lucide-react';
import { getChatAssistantResponse } from '../services/geminiService';
import { Message } from '../types';

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hello! I am your RetailiQo AI Assistant. How can I help you grow your retail business today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getChatAssistantResponse(messages, input);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an issue. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-all z-40 hover:scale-110 active:scale-95"
      >
        <MessageSquare size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-10 duration-300">
          <div className="bg-indigo-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-1.5 rounded-lg">
                <Bot size={20} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm">RetailiQo Assistant</span>
                <span className="text-[10px] text-indigo-100 flex items-center gap-1">
                   <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div> Online 24/7
                </span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 h-80 md:h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  <div className="flex items-center gap-1.5 mb-1 opacity-60 text-[10px] uppercase font-bold tracking-widest">
                    {m.role === 'user' ? <User size={10} /> : <Bot size={10} />}
                    {m.role === 'user' ? 'You' : 'RetailiQo AI'}
                  </div>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="animate-spin w-4 h-4 text-indigo-600" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-slate-200 focus-within:border-indigo-400 transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about bulk quotes, suppliers..." 
                className="bg-transparent border-none outline-none flex-1 text-sm text-slate-800"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="text-indigo-600 hover:text-indigo-800 disabled:opacity-30 transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">RetailiQo AI can make mistakes. Verify important info.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
