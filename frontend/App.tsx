import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Rooms from './components/Rooms';
import Scenarios from './components/Scenarios';
import GoogleDevelopers from './components/GoogleDevelopers';
import { HomeState, TabType, Room, Device } from './types';
import { Menu, Bell } from 'lucide-react';
import { getAiInsights } from './services/aiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initial dynamic state
  const [state, setState] = useState<HomeState>({
    rooms: [
      {
        id: 'r1', name: 'Salon', isOutdoor: false, devices: [
          { id: 'd1', type: 'LIGHT', name: 'Salon Işığı', isOn: false, powerWatt: 20 },
          { id: 'd2', type: 'BLIND', name: 'Panjur', isOn: true, value: 100, powerWatt: 5 },
          { id: 'd3', type: 'THERMOSTAT', name: 'Sıcaklık', isOn: true, value: 22, powerWatt: 0 },
          { id: 'd4', type: 'TV', name: 'Televizyon', isOn: false, powerWatt: 150 }
        ]
      },
      {
        id: 'r2', name: 'Mutfak', isOutdoor: false, devices: [
          { id: 'd5', type: 'LIGHT', name: 'Mutfak Işığı', isOn: false, powerWatt: 20 },
          { id: 'd6', type: 'BLIND', name: 'Panjur', isOn: true, value: 100, powerWatt: 5 },
          { id: 'd7', type: 'THERMOSTAT', name: 'Sıcaklık', isOn: true, value: 22, powerWatt: 0 },
          { id: 'd8', type: 'FRIDGE', name: 'Buzdolabı', isOn: true, value: 4, powerWatt: 150 },
          { id: 'd9', type: 'OVEN', name: 'Fırın', isOn: false, value: 180, powerWatt: 2000 }
        ]
      },
      {
        id: 'r3', name: 'Bahçe', isOutdoor: true, devices: [
          { id: 'd10', type: 'LIGHT', name: 'Bahçe Işığı', isOn: false, powerWatt: 20 },
          { id: 'd11', type: 'IRRIGATION', name: 'Akıllı Sulama', isOn: false, value: 0, powerWatt: 10 }
        ]
      }
    ],
    global: {
      waterTemp: 45,
      boilerTemp: 22,
      doorbellLastRing: null
    },
    energy: { currentWatt: 150, dailyKwh: 0 },
    assistantMessages: []
  });

  const fetchAiInsights = async () => {
    setState(prev => ({ ...prev, isAiLoading: true, aiError: null }));
    try {
      const insights = await getAiInsights(state);
      setState(prev => ({ ...prev, assistantMessages: insights, isAiLoading: false }));
    } catch (error: any) {
      setState(prev => ({ ...prev, isAiLoading: false, aiError: error.message }));
    }
  };

  const lastAnalyzedStateRef = React.useRef<string>('');
  const lastAnalyzedTimeRef = React.useRef<number>(0);

  // Akıllı Otomatik Analiz Tetikleyici
  useEffect(() => {
    const now = Date.now();
    // Throttle: En az 15 saniye geçmeden tekrar otomatik analiz yapma
    if (now - lastAnalyzedTimeRef.current < 15000) return;

    // Sadece önemli durumları izole et (açık/kapalı durumu ve yüksek güç tüketen cihazlar)
    const significantState = state.rooms.map(r => 
      r.devices.map(d => `${d.id}-${d.isOn}-${d.type === 'OVEN' ? d.value : ''}`)
    ).flat().join('|');

    if (lastAnalyzedStateRef.current !== '' && lastAnalyzedStateRef.current !== significantState) {
      // Önemli bir değişiklik oldu (cihaz açıldı/kapandı veya fırın ısısı değişti)
      fetchAiInsights();
      lastAnalyzedTimeRef.current = now;
    }
    
    lastAnalyzedStateRef.current = significantState;
  }, [state.rooms]);

  // Simülasyon Döngüsü
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const newState = { ...prev };
        
        // 1. Enerji Hesaplama
        let currentWatt = 0;
        newState.rooms.forEach(room => {
          room.devices.forEach(dev => {
            if (dev.isOn || dev.type === 'FRIDGE' || dev.type === 'FREEZER') {
              currentWatt += dev.powerWatt;
            }
          });
        });
        
        newState.energy.currentWatt = currentWatt;
        newState.energy.dailyKwh += (currentWatt * (15 / 60)) / 1000;

        return newState;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard state={state} setActiveTab={setActiveTab} fetchAiInsights={fetchAiInsights} />;
      case 'rooms': return <Rooms state={state} setState={setState} />;
      case 'scenarios': return <Scenarios state={state} setState={setState} />;
      case 'google-developers': return <GoogleDevelopers />;
      default: return <Dashboard state={state} setActiveTab={setActiveTab} fetchAiInsights={fetchAiInsights} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-50 font-sans overflow-hidden selection:bg-indigo-500/30">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md z-10">
          <h1 className="text-xl font-bold tracking-tight text-white">SmartHome</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Top bar for Desktop */}
        <div className="hidden md:flex items-center justify-end p-6 z-10">
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors border border-slate-700">
              <Bell size={20} />
              {state.assistantMessages.length > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-800"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 p-[2px]">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-sm font-bold">
                  SK
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-tight">Sudenaz K.</p>
                <p className="text-xs text-slate-400">Yönetici</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-8 md:px-8 z-10 relative">
          <div className="max-w-6xl mx-auto h-full pt-4 md:pt-0">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
