
import React from 'react';
import { CareerProfile } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Trophy, TrendingUp, Target, Flame, ChevronRight, Zap, ArrowUpRight } from 'lucide-react';

interface AnalyticsViewProps {
  profile: CareerProfile;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ profile }) => {
  const completedTasks = profile.roadmap?.reduce((acc, level) => 
    acc + level.tasks.filter(t => t.completed).length, 0) || 0;
  
  const totalTasks = profile.roadmap?.reduce((acc, level) => 
    acc + level.tasks.length, 0) || 1;

  const progress = Math.round((completedTasks / totalTasks) * 100);

  const weeklyData = [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 4.5 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 2.5 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 1 },
  ];

  const skillData = [
    { name: 'Technical', value: 65 },
    { name: 'Projects', value: 40 },
    { name: 'Soft Skills', value: 85 },
  ];

  const COLORS = ['#8b5cf6', '#d946ef', '#10b981'];

  return (
    <div className="space-y-8">
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Overall Progress', value: `${progress}%`, icon: Target, color: 'brand', trend: '+12%' },
          { label: 'Current Streak', value: `${profile.streak || 0} Days`, icon: Flame, color: 'orange', trend: 'Hot' },
          { label: 'Hiring Score', value: '78/100', icon: Trophy, color: 'purple', trend: '+5' },
          { label: 'Learning Velocity', value: 'Optimal', icon: Zap, color: 'emerald', trend: 'Active' },
        ].map((stat, i) => (
          <div key={i} className="glass p-7 rounded-[2.5rem] flex flex-col justify-between h-48 group hover:scale-[1.02] transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-4 rounded-2xl bg-${stat.color === 'brand' ? 'brand-500' : 
                                stat.color === 'orange' ? 'orange-500' : 
                                stat.color === 'purple' ? 'purple-500' : 
                                'emerald-500'} text-white shadow-lg shadow-${stat.color}-500/30 group-hover:rotate-6 transition-transform`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">{stat.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 glass p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Growth Intensity</h3>
              <p className="text-sm text-slate-400 font-medium">Weekly focused study hours</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> Current Sprint
            </div>
          </div>
          <div className="h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} 
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={5} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Readiness Index */}
        <div className="glass p-8 rounded-[2.5rem] flex flex-col">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Market Readiness</h3>
          <p className="text-sm text-slate-400 font-medium mb-8">Skill validation metrics</p>
          <div className="h-[220px] w-full relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 leading-none">63%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Average</span>
            </div>
          </div>
          <div className="mt-8 space-y-4 flex-1">
            {skillData.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/40 hover:bg-white transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: COLORS[i]}} />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{s.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Tasks Card */}
        <div className="glass p-8 rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp size={24} className="text-brand-600" /> Focus Zones
            </h3>
            <button className="text-xs font-bold text-brand-600 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {profile.roadmap?.[0]?.tasks.slice(0, 3).map((task, i) => (
              <div key={i} className="p-5 bg-white rounded-3xl flex items-center justify-between group cursor-pointer border border-slate-100/50 hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/5 transition-all">
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${task.type === 'project' ? 'bg-fuchsia-50 text-fuchsia-500' : 'bg-brand-50 text-brand-500'}`}>
                    {task.type === 'project' ? '🚀' : '🧠'}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">{task.type}</p>
                    <p className="font-bold text-slate-800 leading-tight">{task.title}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-brand-600 group-hover:text-white transition-all">
                  <ArrowUpRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Promo Card */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-brand-600 to-indigo-900 p-10 rounded-[2.5rem] text-white flex flex-col justify-between shadow-2xl shadow-brand-500/20">
           <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
           <div className="relative">
             <h3 className="text-3xl font-black tracking-tight mb-4">Master Your <br/>Next Big Jump.</h3>
             <p className="text-brand-100 font-medium mb-8 max-w-sm leading-relaxed">We've identified 3 emerging patterns in the {profile.selectedCareer} industry that could accelerate your path.</p>
           </div>
           <button className="relative w-fit bg-white text-brand-600 px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
             Explore Insights
           </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
