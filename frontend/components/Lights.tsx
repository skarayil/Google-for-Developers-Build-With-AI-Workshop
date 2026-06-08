import React from 'react';
import { HomeState } from '../types';
import { Lightbulb, Power } from 'lucide-react';

interface LightsProps {
  state: HomeState;
  toggleLight: (room: keyof HomeState['lights']) => void;
}

const Lights: React.FC<LightsProps> = ({ state, toggleLight }) => {
  const rooms: { key: keyof HomeState['lights']; label: string }[] = [
    { key: 'salon', label: 'Salon' },
    { key: 'mutfak', label: 'Mutfak' },
    { key: 'yatakOdasi', label: 'Yatak Odası' },
    { key: 'banyo', label: 'Banyo' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Işık Kontrolü</h2>
        <p className="text-gray-400">Odaların aydınlatmasını açıp kapatın.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.map(({ key, label }) => {
          const isOn = state.lights[key];
          return (
            <div 
              key={key}
              className={`
                relative overflow-hidden rounded-3xl p-6 transition-all duration-300 border
                ${isOn 
                  ? 'bg-gradient-to-br from-yellow-900/40 to-gray-900 border-yellow-500/30 shadow-[0_0_30px_-10px_rgba(234,179,8,0.2)]' 
                  : 'bg-gray-900 border-gray-800'}
              `}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl transition-colors duration-300 ${isOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-800 text-gray-500'}`}>
                  <Lightbulb size={32} className={isOn ? 'drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]' : ''} />
                </div>
                
                <button
                  onClick={() => toggleLight(key)}
                  className={`
                    w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none
                    ${isOn ? 'bg-yellow-500' : 'bg-gray-700'}
                  `}
                >
                  <div className={`
                    w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center
                    ${isOn ? 'translate-x-6' : 'translate-x-0'}
                  `}>
                    <Power size={12} className={isOn ? 'text-yellow-500' : 'text-gray-400'} />
                  </div>
                </button>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{label}</h3>
                <p className={`text-sm font-medium ${isOn ? 'text-yellow-400/80' : 'text-gray-500'}`}>
                  {isOn ? 'Açık' : 'Kapalı'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lights;
