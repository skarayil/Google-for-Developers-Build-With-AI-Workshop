import React from 'react';
import { HomeState } from '../types';
import { Lightbulb, MessageSquare, LayoutGrid, Zap, Loader2, AlertCircle, RefreshCw, Thermostat, Droplets, Wind, Activity } from 'lucide-react';

interface DashboardProps {
  state: HomeState;
  setActiveTab: (tab: any) => void;
  fetchAiInsights?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setActiveTab, fetchAiInsights }) => {
  let activeLightsCount = 0;
  let activeDevicesCount = 0;
  
  state.rooms.forEach(r => {
    r.devices.forEach(d => {
      if (d.isOn) activeDevicesCount++;
      if (d.type === 'LIGHT' && d.isOn) activeLightsCount++;
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <header className="mb-6">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Evinize Hoş Geldiniz</h2>
        <p className="text-slate-400">Tüm sistemler çevrimiçi ve stabil çalışıyor.</p>
      </header>

      {/* Main Grid for Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assistant & Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Assistant Section */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-indigo-500/20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30">
                    <MessageSquare size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Akıllı Asistan</h3>
                    <p className="text-sm text-indigo-300">Gemini Destekli Analiz</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAiInsights}
                  disabled={state.isAiLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl hover:bg-indigo-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-sm"
                >
                  {state.isAiLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Analiz Ediliyor...</>
                  ) : (
                    <><RefreshCw size={18} /> Asistana Sor</>
                  )}
                </button>
              </div>

              {state.aiError ? (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 text-red-400 rounded-2xl border border-red-500/20">
                  <AlertCircle size={22} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{state.aiError}</p>
                </div>
              ) : state.assistantMessages.length > 0 ? (
                <ul className="space-y-3">
                  {state.assistantMessages.map((msg, idx) => (
                    <li key={idx} className="text-slate-300 font-medium flex items-start gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
                      <span className="text-indigo-400 mt-0.5"><SparkleIcon /></span> 
                      <span className="leading-relaxed">{msg}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50 text-center">
                  <p className="text-slate-400 text-sm">Durumu değerlendirmek ve öneriler almak için "Asistana Sor" butonuna tıklayın.</p>
                </div>
              )}
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rooms Card */}
            <div 
              onClick={() => setActiveTab('rooms')}
              className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer hover:border-indigo-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <LayoutGrid size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{state.rooms.length}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Odalar</h3>
              <p className="text-sm text-slate-400">
                {activeDevicesCount} cihaz şu an aktif
              </p>
            </div>

            {/* Lights Card */}
            <div 
              onClick={() => setActiveTab('rooms')}
              className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 cursor-pointer hover:border-yellow-500/50 hover:bg-slate-800 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl transition-colors ${activeLightsCount > 0 ? 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500 group-hover:text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600'}`}>
                  <Lightbulb size={24} />
                </div>
                <span className="text-2xl font-bold text-white">{activeLightsCount}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Aydınlatma</h3>
              <p className="text-sm text-slate-400">
                {activeLightsCount === 0 ? 'Tüm ışıklar kapalı' : 'Açık ışıklar var'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Environment & Energy */}
        <div className="space-y-6">
          
          {/* Energy Summary Card */}
          <div 
            onClick={() => setActiveTab('scenarios')}
            className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/20 rounded-3xl p-6 cursor-pointer hover:border-emerald-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Zap size={24} />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-sm font-semibold bg-emerald-500/10 px-3 py-1 rounded-full">
                <Activity size={14} /> Stabil
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-medium mb-1">Anlık Tüketim</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold text-white">{state.energy.currentWatt}</span>
                <span className="text-emerald-400 font-semibold">W</span>
              </div>
              
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((state.energy.currentWatt / 5000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex justify-between">
                <span>Günlük Toplam</span>
                <span className="font-semibold text-slate-300">{state.energy.dailyKwh.toFixed(2)} kWh</span>
              </p>
            </div>
          </div>

          {/* Environment Widget (Mock Feature) */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Ev Ortamı</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl"><Thermostat size={18} /></div>
                  <span className="text-slate-300 font-medium">Genel Sıcaklık</span>
                </div>
                <span className="text-white font-bold">{state.global.boilerTemp}°C</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl"><Droplets size={18} /></div>
                  <span className="text-slate-300 font-medium">Su Sıcaklığı</span>
                </div>
                <span className="text-white font-bold">{state.global.waterTemp}°C</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/50 border border-slate-700/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl"><Wind size={18} /></div>
                  <span className="text-slate-300 font-medium">Hava Kalitesi</span>
                </div>
                <span className="text-teal-400 font-bold">İyi (42 AQI)</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Mini helper component for sparkle icon
const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
  </svg>
);

export default Dashboard;
