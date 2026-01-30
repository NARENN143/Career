
import React, { useState, useEffect } from 'react';
import { CareerProfile, Newsletter } from '../types';
import { generateDailyNewsletter, ApiError } from '../geminiService';
import { Mail, Sparkles, BookOpen, TrendingUp, Quote, Loader2, Calendar, AlertCircle } from 'lucide-react';

interface NewsletterViewProps {
  profile: CareerProfile;
  onError?: (msg: string) => void;
}

const NewsletterView: React.FC<NewsletterViewProps> = ({ profile, onError }) => {
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const fetchMail = async () => {
      setLoading(true);
      setFailed(false);
      try {
        const data = await generateDailyNewsletter(profile);
        setNewsletter(data);
      } catch (err) {
        setFailed(true);
        if (err instanceof ApiError && err.status === 429) {
          onError?.(err.message);
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMail();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">Brewing your daily career wisdom...</p>
      </div>
    );
  }

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-6 text-center">
        <div className="p-6 bg-red-50 text-red-500 rounded-full">
          <AlertCircle size={48} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Wisdom Hub Unavailable</h3>
          <p className="text-slate-500 mt-2 max-w-sm">We couldn't generate your insights due to system constraints. This usually happens when the API quota is reached.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-4">
          <Calendar size={16} /> Daily Edition: {newsletter?.date || new Date().toLocaleDateString()}
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Personalized Growth Insights</h1>
        <p className="text-slate-500 mt-2">Curated for your {profile.selectedCareer} journey.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors" />
          <div className="flex items-start gap-6 relative">
            <div className="p-4 bg-indigo-600 rounded-2xl text-white">
              <BookOpen size={28} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-1">Today's Focus</h3>
              <p className="text-xl font-bold text-slate-800 mb-2">{newsletter?.learningFocus}</p>
              <p className="text-slate-600 leading-relaxed">Concentrate on mastering this concept today to stay aligned with your roadmap goals.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                 <TrendingUp size={20} />
               </div>
               <h3 className="font-bold text-slate-800">Industry Trend</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed">{newsletter?.industryTrend}</p>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                 <Sparkles size={20} />
               </div>
               <h3 className="font-bold text-slate-800">Career Tip</h3>
             </div>
             <p className="text-slate-600 text-sm leading-relaxed">{newsletter?.careerTip}</p>
          </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-3xl text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-slate-800 opacity-50">
            <Quote size={64} />
          </div>
          <div className="relative">
            <p className="text-xl md:text-2xl font-medium text-slate-200 italic mb-4">"{newsletter?.motivation}"</p>
            <div className="h-0.5 w-12 bg-indigo-500 mx-auto rounded-full" />
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-6 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Mail className="text-indigo-600" />
          <span className="text-sm font-semibold text-slate-700">Want this in your inbox daily?</span>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors">
          Enable Notifications
        </button>
      </div>
    </div>
  );
};

export default NewsletterView;
