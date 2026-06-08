import React from 'react';
import { HomeState } from '../types';
import { Lightbulb, Power, AlignJustify } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const LightsAndBlinds: React.FC<Props> = ({ state, setState }) => {
  const toggleLight = (room: keyof HomeState['lights']) => {
    setState(prev => ({
      ...prev,
      lights: { ...prev.lights, [room]: !prev.lights[room] }
    }));
  };

  const setBlindLevel = (room: keyof HomeState['blinds'], level: number) => {
    setState(prev => ({
      ...prev,
      blinds: { ...prev.blinds, [room]: level }
    }));
  };

  const lightRooms: { key: keyof HomeState['lights']; label: string }[] = [
    { key: 'salon', label: 'Salon' },
    { key: 'mutfak', label: 'Mutfak' },
    { key: 'yatakOdasi', label: 'Yatak Odası' },
    { key: 'banyo', label: 'Banyo' },
  ];

  const blindRooms: { key: keyof HomeState['blinds']; label: string }[] = [
    { key: 'salon', label: 'Salon Panjuru' },
    { key: 'yatakOdasi', label: 'Yatak Odası Panjuru' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Işıklar ve Panjurlar</h2>
        <p className="text-gray-400">Aydınlatma ve gün ışığı kontrolü.</p>
      </header>

      {/* Lights Section */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-yellow-400" /> Aydınlatma
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {lightRooms.map(({ key, label }) => {
            const isOn = state.lights[key];
            return (
              <div key={key} className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 border ${isOn ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-gray-900 border-gray-800'}`}>
                <div className="flex justify-between items-center mb-4">
                  <div className={`p-3 rounded-xl ${isOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}>
                    <Lightbulb size={24} />
                  </div>
                  <button
                    onClick={() => toggleLight(key)}
                    className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none ${isOn ? 'bg-yellow-500' : 'bg-gray-700'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
                <h4 className="text-lg font-medium text-white">{label}</h4>
                <p className={`text-sm ${isOn ? 'text-yellow-400' : 'text-gray-500'}`}>{isOn ? 'Açık' : 'Kapalı'}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Blinds Section */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <AlignJustify size={20} className="text-orange-400" /> Panjurlar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blindRooms.map(({ key, label }) => {
            const level = state.blinds[key];
            return (
              <div key={key} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-lg font-medium text-white">{label}</h4>
                  <span className="text-orange-400 font-mono bg-orange-500/10 px-3 py-1 rounded-lg">%{level} Açık</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={level}
                  onChange={(e) => setBlindLevel(key, parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Kapalı</span>
                  <span>Tam Açık</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default LightsAndBlinds;
