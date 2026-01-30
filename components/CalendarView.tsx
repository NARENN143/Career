
import React, { useState } from 'react';
import { CareerProfile } from '../types';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Clock, Info } from 'lucide-react';

interface CalendarViewProps {
  profile: CareerProfile;
}

const CalendarView: React.FC<CalendarViewProps> = ({ profile }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth(currentMonth) }, (_, i) => i);

  // Simulated scheduled tasks for the day
  const dailyTasks = profile.roadmap?.[0]?.tasks.slice(0, 2) || [];

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Calendar Grid */}
      <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-b border-slate-100">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-r border-slate-50 last:border-0">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 h-[500px]">
          {padding.map(p => <div key={`p-${p}`} className="border-r border-b border-slate-50 bg-slate-50/30" />)}
          {days.map(day => {
            const isToday = day === new Date().getDate();
            const hasTask = day % 3 === 0;
            return (
              <div key={day} className={`
                relative p-2 border-r border-b border-slate-50 transition-colors hover:bg-slate-50 cursor-pointer
                ${isToday ? 'bg-indigo-50/30' : ''}
              `}>
                <span className={`
                  inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm font-semibold
                  ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-600'}
                `}>
                  {day}
                </span>
                {hasTask && (
                  <div className="absolute bottom-2 left-2 right-2">
                     <div className="h-1 bg-indigo-300 rounded-full" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Tasks Sidebar */}
      <div className="space-y-6">
        <div className="bg-slate-900 rounded-3xl p-6 text-white">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold">Today's Schedule</h4>
            <span className="text-xs font-bold text-slate-400">{new Date().toDateString()}</span>
          </div>

          <div className="space-y-4">
            {dailyTasks.map((task, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex gap-4 items-start">
                  <div className="mt-1">
                    <Circle size={20} className="text-indigo-400 group-hover:text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <Clock size={12} /> {task.duration}
                      <span className="w-1 h-1 bg-slate-600 rounded-full" />
                      <span className="uppercase tracking-widest">{task.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <CheckCircle2 size={20} />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                 <p className="text-lg font-bold">12 / 48 Tasks</p>
               </div>
             </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
           <div className="flex items-start gap-3">
             <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
               <Info size={20} />
             </div>
             <div>
               <h5 className="font-bold text-slate-800 text-sm mb-1">Adaptive Scheduling</h5>
               <p className="text-xs text-slate-500 leading-relaxed">ElevateAI automatically shifts tasks if you miss a day to maintain your streak without burnout.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
