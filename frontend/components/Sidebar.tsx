import React from 'react';
import { Home, LayoutGrid, Menu, Zap, Code, LayoutDashboard } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode } = [
    { id: 'dashboard', label: 'Durum Özeti', icon: <LayoutDashboard size={20} /> },
    { id: 'rooms', label: 'Evim (Odalar)', icon: <LayoutGrid size={20} /> },
    { id: 'scenarios', label: 'Senaryolar & Raporlar', icon: <Zap size={20} /> },
    { id: 'google-developers', label: 'Google for Developers', icon: <Code size={20} /> },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl md:shadow-none
      `}>
        <div className="p-6 flex items-center gap-4 border-b border-slate-800/60 bg-slate-900/50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Home size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SmartHome</h1>
            <p className="text-xs font-medium text-indigo-400">by Google Cloud</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group relative overflow-hidden
                  ${isActive 
                    ? 'text-white shadow-lg shadow-indigo-500/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-blue-500/20" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                )}
                
                <div className={`relative z-10 flex items-center gap-3 transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                  <span className={`${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-800/60 bg-gradient-to-b from-slate-900 to-slate-950">
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50 backdrop-blur-md relative overflow-hidden group hover:border-indigo-500/30 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-colors duration-500"></div>
            <div className="relative z-10 flex items-start gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 mt-0.5">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 mb-1">Sistem Aktif</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tüm sensörler ve cihazlar senkronize.
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
