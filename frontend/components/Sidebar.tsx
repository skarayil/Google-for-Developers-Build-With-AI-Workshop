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
          className="fixed inset-0 bg-amber-950/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-72 bg-amber-200 border-r border-amber-300 
        transform transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-2xl md:shadow-none
      `}>
        <div className="p-6 flex items-center gap-4 border-b border-amber-300 bg-amber-300/30">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Home size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-amber-900 tracking-tight">SmartHome</h1>
            <p className="text-xs font-medium text-amber-700">by Google Cloud</p>
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
                    ? 'text-white shadow-lg shadow-amber-500/30' 
                    : 'text-amber-800 hover:bg-amber-300/50 border border-transparent'}
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500" />
                )}
                
                <div className={`relative z-10 flex items-center gap-3 transition-transform duration-300 ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
                  <span className={`${isActive ? 'text-white' : 'text-amber-700 group-hover:text-amber-900'} transition-colors duration-300`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-amber-300 bg-amber-300/20">
          <div className="bg-amber-100 rounded-2xl p-5 border border-amber-300 shadow-sm relative overflow-hidden group hover:border-amber-400 transition-colors duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors duration-500"></div>
            <div className="relative z-10 flex items-start gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600 mt-0.5">
                <Zap size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900 mb-1">Sistem Aktif</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
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
