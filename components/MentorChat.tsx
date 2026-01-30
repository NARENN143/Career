
import React, { useState, useRef, useEffect } from 'react';
import { CareerProfile, ChatMessage } from '../types';
import { getMentorResponse, ApiError } from '../geminiService';
import { getLocalMentorResponse } from '../localStrategy';
import { 
  Send, 
  Loader2, 
  Sparkles, 
  User, 
  Copy, 
  Share2, 
  Check,
  TrendingUp,
  Target,
  BrainCircuit,
  Search,
  Zap,
  Briefcase,
  MessagesSquare,
  Database,
  Globe
} from 'lucide-react';

interface MentorChatProps {
  profile: CareerProfile;
  onUpdate: (updates: Partial<CareerProfile>) => void;
  onError?: (msg: string) => void;
}

const MentorChat: React.FC<MentorChatProps> = ({ profile, onUpdate, onError }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (profile.chatHistory && profile.chatHistory.length > 0) {
      return profile.chatHistory;
    }
    return [{ 
      role: 'model', 
      text: `Greetings, ${profile.name.split(' ')[0]}. I am your Master Strategist.\n\nI've synchronized your profile with current market demands for **${profile.selectedCareer}** roles. \n\nWhat high-impact objective can we tackle today?`,
      timestamp: new Date().toISOString()
    }];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLocalMode, setIsLocalMode] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    onUpdate({ chatHistory: messages });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const currentInput = input;
    const userMsg: ChatMessage = { 
      role: 'user', 
      text: currentInput, 
      timestamp: new Date().toISOString() 
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Primary attempt: Gemini Cloud
      const response = await getMentorResponse(currentInput, messages, profile);
      setIsLocalMode(false);
      const modelMsg: ChatMessage = { 
        role: 'model', 
        text: response, 
        timestamp: new Date().toISOString() 
      };
      setMessages(prev => [...prev, modelMsg]);
      setLoading(false);
    } catch (e) {
      // Immediate switch to local "Feed" strategy on any API failure
      setIsLocalMode(true);
      const localResponse = getLocalMentorResponse(currentInput, profile);
      
      setTimeout(() => {
        const modelMsg: ChatMessage = { 
          role: 'model', 
          text: localResponse, 
          timestamp: new Date().toISOString() 
        };
        setMessages(prev => [...prev, modelMsg]);
        setLoading(false);
      }, 600);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    }).toUpperCase();
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const suggestions = [
    { text: "How is my progress?", icon: Target },
    { text: "What is my next task?", icon: Zap },
    { text: "Skill gap analysis", icon: Search },
    { text: "Career advice", icon: Briefcase }
  ];

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex flex-col glass rounded-[3rem] border border-white/50 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="px-8 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/60 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
              <BrainCircuit size={24} strokeWidth={2} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none mb-1">Strategist Mentor</h3>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <Target size={10} className="text-brand-500" /> Goal: {profile.selectedCareer}
              </span>
              <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${isLocalMode ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'}`}>
                {isLocalMode ? <Database size={10} /> : <Globe size={10} />}
                {isLocalMode ? 'Local Feed Mode' : 'Cloud Optimized'}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-white/50 rounded-xl text-slate-400 hover:text-brand-600 transition-all border border-slate-200/50 hover:shadow-md">
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 bg-slate-50/10 scrollbar-hide">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div 
              key={i} 
              className={`flex items-start gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center text-white shadow-lg transform transition-transform hover:scale-110 ${
                isUser ? 'bg-slate-900 ring-4 ring-slate-100' : 'bg-gradient-to-br from-brand-600 to-fuchsia-600 ring-4 ring-brand-50'
              }`}>
                {isUser ? <User size={20} /> : <Sparkles size={20} fill="currentColor" />}
              </div>

              <div className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`
                  group relative px-7 py-6 rounded-[2.2rem] text-[15px] leading-[1.7] shadow-sm transition-all duration-300
                  ${isUser 
                    ? 'bg-slate-900 text-slate-50 rounded-tr-none hover:shadow-2xl hover:shadow-slate-900/10' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none hover:shadow-2xl hover:shadow-brand-500/10'}
                `}>
                  {!isUser && i === 0 && (
                    <div className="absolute -top-3 left-6 px-3 py-1 bg-brand-600 text-[8px] font-black text-white uppercase tracking-widest rounded-full shadow-lg">
                      STRATEGY NODE
                    </div>
                  )}

                  <div className="whitespace-pre-wrap font-medium">
                    {msg.text.split('\n\n').map((paragraph, pIdx) => (
                      <p key={pIdx} className={pIdx > 0 ? 'mt-4' : ''}>
                        {paragraph.split('**').map((part, partIdx) => 
                          partIdx % 2 === 1 ? <strong key={partIdx} className="font-extrabold text-brand-600 decoration-brand-200 decoration-2 underline-offset-4">{part}</strong> : part
                        )}
                      </p>
                    ))}
                  </div>

                  <div className={`flex items-center gap-4 mt-6 pt-4 border-t ${isUser ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {formatTime(msg.timestamp)}
                    </span>
                    
                    {!isUser && (
                      <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => copyToClipboard(msg.text, i)}
                          className="p-1.5 hover:bg-brand-50 rounded-lg text-slate-400 hover:text-brand-600 transition-colors"
                          title="Copy strategy"
                        >
                          {copiedId === i ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex items-start gap-5 animate-in fade-in duration-300">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-fuchsia-600 flex items-center justify-center text-white shadow-lg animate-pulse ring-4 ring-brand-50">
              <Loader2 className="animate-spin" size={20} strokeWidth={3} />
            </div>
            <div className="bg-white border border-slate-100 px-8 py-6 rounded-[2.2rem] rounded-tl-none shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '200ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-brand-600 animate-bounce" style={{ animationDelay: '400ms' }}></span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.25em]">Strategizing</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{isLocalMode ? 'Synchronizing with feed...' : 'Optimizing growth path...'}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 md:p-10 bg-white/80 backdrop-blur-3xl border-t border-slate-100 z-20">
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 py-1 mr-2">
            <TrendingUp size={14} className="text-brand-500" /> Quick Diagnostics:
          </span>
          {suggestions.map((s, i) => (
            <button 
              key={i} 
              onClick={() => handleSuggestionClick(s.text)}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 text-[11px] font-bold text-slate-600 hover:border-brand-500 hover:text-brand-600 hover:bg-brand-50 hover:shadow-lg hover:shadow-brand-500/5 transition-all flex items-center gap-2 active:scale-95"
            >
              <s.icon size={14} className="text-brand-400" />
              {s.text}
            </button>
          ))}
        </div>
        
        <div className="relative group max-w-4xl mx-auto">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-600 to-fuchsia-600 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
          <div className="relative flex items-end bg-white rounded-[2.2rem] border border-slate-200 focus-within:border-brand-500 p-2 pr-5 shadow-2xl transition-all">
            <textarea
              ref={textareaRef}
              className="flex-1 bg-transparent border-none focus:ring-0 p-5 text-base font-bold text-slate-700 resize-none scrollbar-hide min-h-[60px] max-h-40 placeholder:text-slate-300"
              placeholder="Inject a request into the strategy engine..."
              rows={1}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="mb-1 p-5 bg-brand-600 text-white rounded-[1.8rem] hover:bg-brand-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 shadow-xl shadow-brand-500/30 flex-shrink-0"
            >
              <Send size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorChat;
