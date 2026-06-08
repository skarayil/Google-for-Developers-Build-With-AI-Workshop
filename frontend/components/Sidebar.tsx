import React from 'react';
import { Home, LayoutGrid, Code, Menu, Zap } from 'lucide-react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode } = [
    { id: 'dashboard', label: 'Durum Özeti', icon: <Home size={20} /> },
    { id: 'rooms', label: 'Evim (Odalar)', icon: <LayoutGrid size={20} /> },
    { id: 'scenarios', label: 'Senaryolar & Raporlar', icon: <Zap size={20} /> },
    { id: 'cpp-code', label: 'C++ Kaynak Kodu', icon: <Code size={20} /> },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-amber-950/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-amber-200 border-r border-amber-300 
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col shadow-xl md:shadow-none
      `}>
        <div className="p-6 flex items-center gap-3 border-b border-amber-300 bg-amber-300/30">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center shadow-md">
            <Home size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-amber-900">
            SmartHome
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                ${activeTab === item.id 
                  ? 'bg-amber-500 text-white shadow-md' 
                  : 'text-amber-800 hover:bg-amber-300/50 border border-transparent'}
              `}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-amber-300 bg-amber-300/20">
          <div className="bg-amber-100 rounded-xl p-4 border border-amber-300 shadow-sm">
            <p className="text-xs text-amber-800 leading-relaxed">
              İstediğiniz C++ konsol uygulaması kodunu <strong className="text-amber-600">C++ Kaynak Kodu</strong> sekmesinde bulabilirsiniz.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
