
import React from 'react';
import { CareerProfile, RoadmapLevel } from '../types';
import { CheckCircle2, Circle, Clock, Briefcase, BookOpen, Terminal, Sparkles } from 'lucide-react';

interface RoadmapViewProps {
  profile: CareerProfile;
  onUpdate: (updates: Partial<CareerProfile>) => void;
}

const RoadmapView: React.FC<RoadmapViewProps> = ({ profile, onUpdate }) => {
  const toggleTask = (levelId: string, taskId: string) => {
    if (!profile.roadmap) return;
    
    const newRoadmap = profile.roadmap.map(level => {
      if (level.id === levelId) {
        return {
          ...level,
          tasks: level.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return level;
    });

    onUpdate({ roadmap: newRoadmap });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <div className="glass p-10 rounded-[3rem] border border-white/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-slate-200/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
            <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.3em]">Master Plan</span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{profile.selectedCareer} Path</h2>
          <p className="text-slate-500 font-medium mt-1">AI-synchronized progression for peak performance.</p>
        </div>
        <div className="bg-brand-600 text-white p-6 rounded-3xl text-center shadow-lg shadow-brand-500/20">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Active Stage</p>
          <p className="text-2xl font-black leading-none">Level 1</p>
        </div>
      </div>

      <div className="relative space-y-16 py-8">
        {/* Glow Line Connector */}
        <div className="absolute left-6 top-0 bottom-0 w-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="w-full bg-gradient-to-b from-brand-600 via-fuchsia-500 to-brand-400 h-2/3 shadow-[0_0_15px_rgba(139,92,246,0.5)]"></div>
        </div>

        {profile.roadmap?.map((level, idx) => (
          <div key={level.id} className="relative pl-20 animate-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${idx * 150}ms` }}>
            {/* Timeline Indicator */}
            <div className={`absolute left-0 w-14 h-14 rounded-[1.5rem] border-4 border-white shadow-xl flex items-center justify-center text-xl font-black z-10 transition-all ${idx === 0 ? 'bg-brand-600 text-white scale-110 shadow-brand-500/40' : 'bg-slate-100 text-slate-400'}`}>
              {idx + 1}
            </div>

            <div className="glass rounded-[2.5rem] overflow-hidden border border-white/40 shadow-xl shadow-slate-200/30">
              <div className="p-8 border-b border-slate-100 bg-white/40 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">{level.title}</h3>
                  <p className="text-sm text-slate-400 font-semibold">{level.description}</p>
                </div>
                {idx === 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-100">
                    <Sparkles size={12} /> In Focus
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3 bg-slate-50/30">
                {level.tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`group p-5 bg-white rounded-3xl flex items-center gap-5 transition-all hover:scale-[1.01] hover:shadow-lg border border-slate-100/50 cursor-pointer ${task.completed ? 'opacity-60 grayscale' : ''}`}
                    onClick={() => toggleTask(level.id, task.id)}
                  >
                    <div className="flex-shrink-0">
                      {task.completed 
                        ? <div className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20"><CheckCircle2 size={24} strokeWidth={3} /></div>
                        : <div className="p-2 bg-slate-100 text-slate-300 rounded-xl group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors"><Circle size={24} strokeWidth={2.5} /></div>
                      }
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg ${task.type === 'project' ? 'bg-fuchsia-50 text-fuchsia-600' : 'bg-brand-50 text-brand-600'}`}>
                          {task.type}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          <Clock size={12} strokeWidth={2.5} /> {task.duration}
                        </div>
                      </div>
                      <h4 className={`text-base font-bold text-slate-800 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                       {task.type === 'project' ? <Terminal size={20} /> : <BookOpen size={20} />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapView;
