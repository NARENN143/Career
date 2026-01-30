
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  Calendar, 
  Mail, 
  Briefcase,
  Menu,
  ChevronRight,
  LogOut,
  Flame,
  Bell
} from 'lucide-react';
import { CareerProfile } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: any) => void;
  profile: CareerProfile;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, setActiveTab, profile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'My Roadmap', icon: Map },
    { id: 'calendar', label: 'Smart Calendar', icon: Calendar },
    { id: 'mentor', label: 'AI Mentor', icon: MessageSquare },
    { id: 'newsletter', label: 'Daily Insights', icon: Mail },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-full glass border-r border-slate-200/50 flex flex-col m-2 md:m-4 rounded-[2rem] shadow-2xl shadow-slate-200/50">
          <div className="p-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-brand-600 to-fuchsia-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30">
              <span className="text-white font-extrabold text-2xl">E</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
                ElevateAI
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Career Pilot</span>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 relative group
                    ${isActive 
                      ? 'bg-brand-600 text-white shadow-xl shadow-brand-500/20' 
                      : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-lg hover:shadow-slate-100'}
                  `}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="font-semibold text-sm">{item.label}</span>
                  {isActive && <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></div>}
                </button>
              );
            })}
          </nav>

          <div className="p-6">
            <div className="bg-brand-50 rounded-3xl p-5 mb-4 border border-brand-100/50">
              <p className="text-[10px] text-brand-500 uppercase font-black tracking-widest mb-2">Target Career</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 truncate">{profile.selectedCareer}</span>
                <ChevronRight size={14} className="text-brand-400" />
              </div>
            </div>
            <button className="w-full flex items-center gap-3 px-5 py-3 text-slate-400 hover:text-red-500 rounded-2xl transition-all group">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-24 px-8 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-3 bg-white rounded-2xl shadow-sm text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
             <div>
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight capitalize">
                   {activeTab === 'dashboard' ? `Welcome, ${profile.name.split(' ')[0]}` : activeTab.replace(/([A-Z])/g, ' $1')}
                </h2>
                <p className="text-xs font-medium text-slate-400">Track your daily professional growth</p>
             </div>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            {/* Streak Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-2xl text-orange-600 shadow-sm shadow-orange-100/50">
              <Flame size={18} fill="currentColor" className="animate-pulse" />
              <span className="text-sm font-black">{profile.streak || 0} DAY STREAK</span>
            </div>

            <div className="flex items-center gap-5">
              <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-brand-600 transition-colors shadow-sm">
                <Bell size={20} />
              </button>
              <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
                <div className="hidden lg:block text-right">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{profile.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{profile.status}</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center text-brand-600 font-black border border-indigo-200/50 shadow-inner">
                  {profile.name.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto px-8 pb-8 scrollbar-hide">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
