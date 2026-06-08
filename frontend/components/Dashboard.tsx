import React from 'react';
import { HomeState } from '../types';
import { Lightbulb, MessageSquare, LayoutGrid, Zap, Loader2, AlertCircle, RefreshCw, Thermometer, Droplets, Wind, Activity } from 'lucide-react';

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
        <h2 className="text-3xl font-extrabold text-amber-900 tracking-tight mb-2">Evinize Hoş Geldiniz</h2>
        <p className="text-amber-700">Tüm sistemler çevrimiçi ve stabil çalışıyor.</p>
      </header>

      {/* Main Grid for Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Assistant & Quick Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Smart Assistant Section */}
          <div className="bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none transition-all group-hover:bg-amber-500/20"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30">
                    <MessageSquare size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-amber-900">Akıllı Asistan</h3>
                    <p className="text-sm text-amber-600">Gemini Destekli Analiz</p>
                  </div>
                </div>
                <button 
                  onClick={fetchAiInsights}
                  disabled={state.isAiLoading}
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold text-sm shadow-sm"
                >
                  {state.isAiLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Analiz Ediliyor...</>
                  ) : (
                    <><RefreshCw size={18} /> Asistana Sor</>
                  )}
                </button>
              </div>

              {state.aiError ? (
                <div className="flex items-start gap-3 p-4 bg-red-50 text-red-700 rounded-2xl border border-red-200">
                  <AlertCircle size={22} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{state.aiError}</p>
                </div>
              ) : state.assistantMessages.length > 0 ? (
                <ul className="space-y-3">
                  {state.assistantMessages.map((msg, idx) => (
                    <li key={idx} className="text-amber-900 font-medium flex items-start gap-3 bg-amber-50/50 p-4 rounded-2xl border border-amber-100 hover:border-amber-300 transition-colors">
                      <span className="text-amber-500 mt-0.5"><SparkleIcon /></span> 
                      <span className="leading-relaxed">{msg}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100 text-center">
                  <p className="text-amber-700 text-sm">Durumu değerlendirmek ve öneriler almak için "Asistana Sor" butonuna tıklayın.</p>
                </div>
              )}
            </div>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rooms Card */}
            <div 
              onClick={() => setActiveTab('rooms')}
              className="bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl p-6 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <LayoutGrid size={24} />
                </div>
                <span className="text-2xl font-bold text-amber-900">{state.rooms.length}</span>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Odalar</h3>
              <p className="text-sm text-amber-700">
                {activeDevicesCount} cihaz şu an aktif
              </p>
            </div>

            {/* Lights Card */}
            <div 
              onClick={() => setActiveTab('rooms')}
              className="bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl p-6 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl transition-colors ${activeLightsCount > 0 ? 'bg-amber-400 text-white shadow-md shadow-amber-400/40' : 'bg-amber-50 text-amber-500'}`}>
                  <Lightbulb size={24} />
                </div>
                <span className="text-2xl font-bold text-amber-900">{activeLightsCount}</span>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-1">Aydınlatma</h3>
              <p className="text-sm text-amber-700">
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
            className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-600">
                <Zap size={24} />
              </div>
              <div className="flex items-center gap-1 text-orange-600 text-sm font-semibold bg-orange-500/10 px-3 py-1 rounded-full">
                <Activity size={14} /> Stabil
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-amber-800 text-sm font-medium mb-1">Anlık Tüketim</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold text-amber-950">{state.energy.currentWatt}</span>
                <span className="text-orange-600 font-semibold">W</span>
              </div>
              
              <div className="h-2 w-full bg-amber-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((state.energy.currentWatt / 5000) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-amber-700 mt-3 flex justify-between">
                <span>Günlük Toplam</span>
                <span className="font-semibold text-amber-900">{state.energy.dailyKwh.toFixed(2)} kWh</span>
              </p>
            </div>
          </div>

          {/* Environment Widget */}
          <div className="bg-white/80 backdrop-blur-xl border border-amber-200 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-4">Ev Ortamı</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/20 text-orange-600 rounded-xl"><Thermometer size={18} /></div>
                  <span className="text-amber-800 font-medium">Genel Sıcaklık</span>
                </div>
                <span className="text-amber-950 font-bold">{state.global.boilerTemp}°C</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 text-blue-600 rounded-xl"><Droplets size={18} /></div>
                  <span className="text-amber-800 font-medium">Su Sıcaklığı</span>
                </div>
                <span className="text-amber-950 font-bold">{state.global.waterTemp}°C</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 border border-amber-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-500/20 text-teal-600 rounded-xl"><Wind size={18} /></div>
                  <span className="text-amber-800 font-medium">Hava Kalitesi</span>
                </div>
                <span className="text-teal-600 font-bold">İyi (42 AQI)</span>
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
