
import React, { useState, useEffect } from 'react';
import { CareerProfile, Opportunity } from '../types';
import { fetchOpportunities } from '../geminiService';
import { Briefcase, MapPin, Star, Search, Filter, ExternalLink, Loader2 } from 'lucide-react';

interface OpportunityDiscoveryProps {
  profile: CareerProfile;
}

const OpportunityDiscovery: React.FC<OpportunityDiscoveryProps> = ({ profile }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchOpportunities(profile.selectedCareer || 'Technology');
        setOpportunities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [profile]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
        <p className="text-slate-500 font-medium">Scanning for the best opportunities...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder={`Search ${profile.selectedCareer} roles, competitions...`}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <Filter size={18} /> Filters
          </button>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100">
            Search
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opp) => (
          <div key={opp.id} className="bg-white rounded-3xl border border-slate-200 p-6 hover:shadow-md transition-shadow group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-2xl text-slate-600">
                <Briefcase size={24} />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                <Star size={12} /> {opp.matchScore}% Match
              </div>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-xl font-bold text-slate-900 mb-1">{opp.title}</h3>
              <p className="text-slate-600 font-medium mb-2">{opp.company}</p>
              <div className="flex items-center gap-4 text-slate-400 text-sm font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} /> {opp.location}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>{opp.type}</span>
              </div>
            </div>

            <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
              <p className="text-xs font-bold text-indigo-700 uppercase tracking-widest mb-1">Why this matches</p>
              <p className="text-sm text-slate-700 leading-relaxed line-clamp-2">{opp.whyMatch}</p>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all">
              Apply Now <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpportunityDiscovery;
