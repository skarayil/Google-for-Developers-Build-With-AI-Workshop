import React from 'react';
import { HomeState } from '../types';
import { Refrigerator, Flame, Waves, Power, Tv, Printer, Snowflake } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const Appliances: React.FC<Props> = ({ state, setState }) => {
  const toggleAppliance = (category: keyof HomeState['appliances'], field: string = 'isOn') => {
    setState(prev => ({
      ...prev,
      appliances: {
        ...prev.appliances,
        [category]: {
          ...(prev.appliances[category as keyof typeof prev.appliances] as any),
          [field]: !(prev.appliances[category as keyof typeof prev.appliances] as any)[field]
        }
      }
    }));
  };

  const setApplianceValue = (category: keyof HomeState['appliances'], field: string, value: any) => {
    setState(prev => ({
      ...prev,
      appliances: {
        ...prev.appliances,
        [category]: {
          ...(prev.appliances[category as keyof typeof prev.appliances] as any),
          [field]: value
        }
      }
    }));
  };

  const toggleDishwasher = () => {
    setState(prev => {
      const dw = prev.appliances.dishwasher;
      if (dw.state === 'Boş' || dw.state === 'Bitti') {
        return { ...prev, appliances: { ...prev.appliances, dishwasher: { ...dw, state: 'Yıkama' } } };
      } else {
        return { ...prev, appliances: { ...prev.appliances, dishwasher: { ...dw, state: 'Boş' } } };
      }
    });
  };

  const toggleWashingMachine = () => {
    setState(prev => {
      const wm = prev.appliances.washingMachine;
      if (wm.state === 'Boş' || wm.state === 'Bitti') {
        return { ...prev, appliances: { ...prev.appliances, washingMachine: { ...wm, state: 'Yıkama' } } };
      } else {
        return { ...prev, appliances: { ...prev.appliances, washingMachine: { ...wm, state: 'Boş' } } };
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Ev Aletleri</h2>
        <p className="text-amber-700">Mutfak, salon ve diğer odalardaki cihazların kontrolü.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fridge */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Refrigerator size={24} /></div>
            <h3 className="text-xl font-bold text-amber-900">Buzdolabı</h3>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl font-bold text-amber-900 font-mono mb-2">{state.appliances.fridgeTemp}°C</div>
            <p className="text-sm font-medium text-amber-600">Hedef Sıcaklık</p>
          </div>
          <input 
            type="range" min="-5" max="8" 
            value={state.appliances.fridgeTemp}
            onChange={(e) => setState(prev => ({ ...prev, appliances: { ...prev.appliances, fridgeTemp: parseInt(e.target.value, 10) } }))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Freezer */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-100 text-cyan-600 rounded-xl"><Snowflake size={24} /></div>
            <h3 className="text-xl font-bold text-amber-900">Derin Dondurucu</h3>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl font-bold text-amber-900 font-mono mb-2">{state.appliances.freezerTemp}°C</div>
            <p className="text-sm font-medium text-amber-600">Hedef Sıcaklık</p>
          </div>
          <input 
            type="range" min="-20" max="-5" 
            value={state.appliances.freezerTemp}
            onChange={(e) => setState(prev => ({ ...prev, appliances: { ...prev.appliances, freezerTemp: parseInt(e.target.value, 10) } }))}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Oven */}
        <div className={`bg-white border-2 rounded-3xl p-6 transition-colors shadow-sm ${state.appliances.oven.isOn ? 'border-red-400' : 'border-amber-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${state.appliances.oven.isOn ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-500'}`}><Flame size={24} /></div>
              <h3 className="text-xl font-bold text-amber-900">Fırın</h3>
            </div>
            <button onClick={() => toggleAppliance('oven')} className={`p-2 rounded-full ${state.appliances.oven.isOn ? 'bg-red-500 text-white' : 'bg-amber-200 text-amber-600'}`}>
              <Power size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className={`text-4xl font-bold font-mono mb-2 ${state.appliances.oven.isOn ? 'text-red-600' : 'text-amber-900'}`}>{state.appliances.oven.temp}°C</div>
            <p className="text-sm font-medium text-amber-600">{state.appliances.oven.isOn ? 'Isıtılıyor...' : 'Kapalı'}</p>
          </div>
          <input 
            type="range" min="50" max="250" step="10"
            value={state.appliances.oven.temp}
            onChange={(e) => setApplianceValue('oven', 'temp', parseInt(e.target.value, 10))}
            disabled={!state.appliances.oven.isOn}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
          />
        </div>

        {/* Dishwasher */}
        <div className={`bg-white border-2 rounded-3xl p-6 transition-colors shadow-sm ${state.appliances.dishwasher.state !== 'Boş' && state.appliances.dishwasher.state !== 'Bitti' ? 'border-blue-400' : 'border-amber-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${state.appliances.dishwasher.state !== 'Boş' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-500'}`}><Waves size={24} /></div>
              <h3 className="text-xl font-bold text-amber-900">Bulaşık Mak.</h3>
            </div>
            <button onClick={toggleDishwasher} className={`px-4 py-2 rounded-lg text-sm font-bold ${state.appliances.dishwasher.state === 'Boş' || state.appliances.dishwasher.state === 'Bitti' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
              {state.appliances.dishwasher.state === 'Boş' || state.appliances.dishwasher.state === 'Bitti' ? 'Başlat' : 'Durdur'}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-24 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-2xl font-bold text-amber-900 mb-1">{state.appliances.dishwasher.state}</div>
            <div className="text-sm font-medium text-amber-600">Program: {state.appliances.dishwasher.program}</div>
          </div>
        </div>

        {/* Washing Machine */}
        <div className={`bg-white border-2 rounded-3xl p-6 transition-colors shadow-sm ${state.appliances.washingMachine.state !== 'Boş' && state.appliances.washingMachine.state !== 'Bitti' ? 'border-teal-400' : 'border-amber-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${state.appliances.washingMachine.state !== 'Boş' ? 'bg-teal-100 text-teal-600' : 'bg-amber-100 text-amber-500'}`}><Waves size={24} /></div>
              <h3 className="text-xl font-bold text-amber-900">Çamaşır Mak.</h3>
            </div>
            <button onClick={toggleWashingMachine} className={`px-4 py-2 rounded-lg text-sm font-bold ${state.appliances.washingMachine.state === 'Boş' || state.appliances.washingMachine.state === 'Bitti' ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}>
              {state.appliances.washingMachine.state === 'Boş' || state.appliances.washingMachine.state === 'Bitti' ? 'Başlat' : 'Durdur'}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center h-24 bg-amber-50 rounded-2xl border border-amber-200">
            <div className="text-2xl font-bold text-amber-900 mb-1">{state.appliances.washingMachine.state}</div>
            <div className="text-sm font-medium text-amber-600">Program: {state.appliances.washingMachine.program}</div>
          </div>
        </div>

        {/* TV */}
        <div className={`bg-white border-2 rounded-3xl p-6 transition-colors shadow-sm ${state.appliances.tv.isOn ? 'border-amber-400' : 'border-amber-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${state.appliances.tv.isOn ? 'bg-amber-400 text-white' : 'bg-amber-100 text-amber-500'}`}><Tv size={24} /></div>
              <h3 className="text-xl font-bold text-amber-900">Televizyon</h3>
            </div>
            <button onClick={() => toggleAppliance('tv')} className={`p-2 rounded-full ${state.appliances.tv.isOn ? 'bg-amber-500 text-white' : 'bg-amber-200 text-amber-600'}`}>
              <Power size={20} />
            </button>
          </div>
          <div className="flex flex-col items-center mb-6">
            <div className={`text-4xl font-bold font-mono mb-2 ${state.appliances.tv.isOn ? 'text-amber-600' : 'text-amber-900'}`}>CH {state.appliances.tv.channel}</div>
            <p className="text-sm font-medium text-amber-600">Ses: {state.appliances.tv.volume}</p>
          </div>
          <input 
            type="range" min="0" max="100"
            value={state.appliances.tv.volume}
            onChange={(e) => setApplianceValue('tv', 'volume', parseInt(e.target.value, 10))}
            disabled={!state.appliances.tv.isOn}
            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500 disabled:opacity-50"
          />
        </div>
      </div>
    </div>
  );
};

export default Appliances;
