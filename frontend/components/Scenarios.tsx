import React from 'react';
import { HomeState } from '../types';
import { Zap, Play, Moon, Film, Plane } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const Scenarios: React.FC<Props> = ({ state, setState }) => {
  const applyScenario = (type: 'cinema' | 'sleep' | 'vacation') => {
    setState(prev => {
      const newState = { ...prev };
      newState.rooms = newState.rooms.map(room => {
        return {
          ...room,
          devices: room.devices.map(dev => {
            if (type === 'cinema' && room.name.toLowerCase().includes('salon')) {
              if (dev.type === 'LIGHT') return { ...dev, isOn: false };
              if (dev.type === 'BLIND') return { ...dev, value: 0 };
              if (dev.type === 'TV') return { ...dev, isOn: true };
            } else if (type === 'sleep') {
              if (dev.type === 'LIGHT' || dev.type === 'TV') return { ...dev, isOn: false };
              if (dev.type === 'BLIND') return { ...dev, value: 0 };
            } else if (type === 'vacation') {
              if (dev.type !== 'FRIDGE' && dev.type !== 'FREEZER') return { ...dev, isOn: false };
            }
            return dev;
          })
        };
      });
      return newState;
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Senaryolar ve Raporlar</h2>
        <p className="text-amber-700">Tek tuşla ev modunu değiştirin ve tüketimi izleyin.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenarios */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Play size={20} className="text-amber-600" /> Akıllı Senaryolar
          </h3>
          <div className="space-y-4">
            <button onClick={() => applyScenario('cinema')} className="w-full flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Film size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-amber-900">Sinema Modu</p>
                  <p className="text-xs font-medium text-amber-700">Salon ışıkları kapanır, panjur iner, TV açılır.</p>
                </div>
              </div>
              <span className="text-amber-600 font-bold text-sm">Uygula &rarr;</span>
            </button>

            <button onClick={() => applyScenario('sleep')} className="w-full flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Moon size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-amber-900">Uyku Modu</p>
                  <p className="text-xs font-medium text-amber-700">Tüm ışıklar ve panjurlar kapanır.</p>
                </div>
              </div>
              <span className="text-amber-600 font-bold text-sm">Uygula &rarr;</span>
            </button>

            <button onClick={() => applyScenario('vacation')} className="w-full flex items-center justify-between p-4 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-teal-100 text-teal-600 rounded-lg"><Plane size={20} /></div>
                <div className="text-left">
                  <p className="font-bold text-amber-900">Tatil Modu</p>
                  <p className="text-xs font-medium text-amber-700">Buzdolabı hariç tüm cihazlar kapanır.</p>
                </div>
              </div>
              <span className="text-amber-600 font-bold text-sm">Uygula &rarr;</span>
            </button>
          </div>
        </div>

        {/* Energy Report */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Zap size={20} className="text-amber-600" /> Tüketim Raporları
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <p className="text-amber-700 font-medium text-sm mb-1">Anlık Güç Çekimi</p>
              <p className="text-3xl font-bold text-amber-900 font-mono">{state.energy.currentWatt} <span className="text-lg text-amber-600">W</span></p>
            </div>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <p className="text-amber-700 font-medium text-sm mb-1">Günlük Enerji</p>
              <p className="text-3xl font-bold text-amber-900 font-mono">{state.energy.dailyKwh.toFixed(3)} <span className="text-lg text-amber-600">kWh</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scenarios;
