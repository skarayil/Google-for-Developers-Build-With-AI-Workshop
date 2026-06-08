import React from 'react';
import { HomeState } from '../types';
import { Lightbulb, MessageSquare, LayoutGrid, Zap, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface DashboardProps {
  state: HomeState;
  setActiveTab: (tab: any) => void;
  fetchAiInsights?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setActiveTab, fetchAiInsights }) => {
  let activeLightsCount = 0;
  state.rooms.forEach(r => {
    r.devices.forEach(d => {
      if (d.type === 'LIGHT' && d.isOn) activeLightsCount++;
    });
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Durum Özeti</h2>
        <p className="text-amber-700">Evinizin genel durumu ve aktif sistemler.</p>
      </header>

      {/* Smart Assistant Section */}
      <div className="bg-white border-2 border-amber-400 rounded-2xl p-5 mb-6 shadow-lg shadow-amber-200/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MessageSquare size={20} className="text-amber-600" />
            <h3 className="text-lg font-bold text-amber-800">Akıllı Asistan Bildirimleri</h3>
          </div>
          <button 
            onClick={fetchAiInsights}
            disabled={state.isAiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm shadow-md"
          >
            {state.isAiLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Analiz Ediliyor...</>
            ) : (
              <><RefreshCw size={16} /> Asistana Sor</>
            )}
          </button>
        </div>

        {state.aiError ? (
          <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{state.aiError}</p>
          </div>
        ) : state.assistantMessages.length > 0 ? (
          <ul className="space-y-3">
            {state.assistantMessages.map((msg, idx) => (
              <li key={idx} className="text-amber-900 font-medium flex items-start gap-2 bg-amber-50 p-3 rounded-lg">
                <span className="text-amber-500 mt-0.5">✨</span> {msg}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-amber-700 text-sm italic">Henüz bir analiz yapılmadı. Durumu değerlendirmek için "Asistana Sor" butonuna tıklayın.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rooms Summary Card */}
        <div 
          onClick={() => setActiveTab('rooms')}
          className="bg-white border border-amber-200 rounded-2xl p-5 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-amber-400 text-white shadow-md shadow-amber-400/40">
              <LayoutGrid size={20} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">Odalar</h3>
          <p className="text-sm font-medium text-amber-700">
            Toplam {state.rooms.length} oda kayıtlı
          </p>
        </div>

        {/* Lights Summary Card */}
        <div 
          onClick={() => setActiveTab('rooms')}
          className="bg-white border border-amber-200 rounded-2xl p-5 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className={`p-2.5 rounded-xl ${activeLightsCount > 0 ? 'bg-amber-400 text-white shadow-md shadow-amber-400/40' : 'bg-amber-100 text-amber-500'}`}>
              <Lightbulb size={20} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">Aydınlatma</h3>
          <p className="text-sm font-medium text-amber-700">
            {activeLightsCount === 0 ? 'Tümü kapalı' : `${activeLightsCount} ışık açık`}
          </p>
        </div>

        {/* Energy Summary Card */}
        <div 
          onClick={() => setActiveTab('scenarios')}
          className="bg-white border border-amber-200 rounded-2xl p-5 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all group"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-2.5 rounded-xl bg-orange-500 text-white shadow-md shadow-orange-500/40">
              <Zap size={20} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">Enerji</h3>
          <p className="text-sm font-medium text-amber-700">
            Anlık: {state.energy.currentWatt} W
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
