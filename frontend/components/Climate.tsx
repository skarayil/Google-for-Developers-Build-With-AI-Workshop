import React from 'react';
import { HomeState } from '../types';
import { Thermometer, Droplets, Flame } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const Climate: React.FC<Props> = ({ state, setState }) => {
  const setTemp = (key: keyof HomeState['climate'], value: number | boolean) => {
    setState(prev => ({
      ...prev,
      climate: { ...prev.climate, [key]: value }
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">İklimlendirme ve Su</h2>
        <p className="text-amber-700">Oda sıcaklıkları, kombi ve genel su sıcaklığı ayarları.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Salon Temp */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <Thermometer size={32} className="mb-4 text-orange-500" />
          <h3 className="text-xl font-bold text-amber-900 mb-6">Salon</h3>
          <div className="text-5xl font-bold mb-6 font-mono text-amber-900">
            {state.climate.salonTemp}<span className="text-2xl text-amber-500">°C</span>
          </div>
          <input 
            type="range" min="10" max="35" 
            value={state.climate.salonTemp}
            onChange={(e) => setTemp('salonTemp', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Yatak Odası Temp */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <Thermometer size={32} className="mb-4 text-orange-500" />
          <h3 className="text-xl font-bold text-amber-900 mb-6">Yatak Odası</h3>
          <div className="text-5xl font-bold mb-6 font-mono text-amber-900">
            {state.climate.yatakOdasiTemp}<span className="text-2xl text-amber-500">°C</span>
          </div>
          <input 
            type="range" min="10" max="35" 
            value={state.climate.yatakOdasiTemp}
            onChange={(e) => setTemp('yatakOdasiTemp', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Çalışma Odası Temp */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <Thermometer size={32} className="mb-4 text-orange-500" />
          <h3 className="text-xl font-bold text-amber-900 mb-6">Çalışma Odası</h3>
          <div className="text-5xl font-bold mb-6 font-mono text-amber-900">
            {state.climate.calismaOdasiTemp}<span className="text-2xl text-amber-500">°C</span>
          </div>
          <input 
            type="range" min="10" max="35" 
            value={state.climate.calismaOdasiTemp}
            onChange={(e) => setTemp('calismaOdasiTemp', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
        </div>

        {/* Water Temp */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <Droplets size={32} className="mb-4 text-blue-500" />
          <h3 className="text-xl font-bold text-amber-900 mb-6">Genel Su Sıcaklığı</h3>
          <div className="text-5xl font-bold mb-6 font-mono text-amber-900">
            {state.climate.waterTemp}<span className="text-2xl text-amber-500">°C</span>
          </div>
          <input 
            type="range" min="20" max="60" 
            value={state.climate.waterTemp}
            onChange={(e) => setTemp('waterTemp', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Boiler Temp */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-8 flex flex-col items-center shadow-sm">
          <Flame size={32} className="mb-4 text-red-500" />
          <h3 className="text-xl font-bold text-amber-900 mb-6">Kombi Hedef</h3>
          <div className="text-5xl font-bold mb-6 font-mono text-amber-900">
            {state.climate.boilerTemp}<span className="text-2xl text-amber-500">°C</span>
          </div>
          <input 
            type="range" min="15" max="30" 
            value={state.climate.boilerTemp}
            onChange={(e) => setTemp('boilerTemp', parseInt(e.target.value, 10))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default Climate;
