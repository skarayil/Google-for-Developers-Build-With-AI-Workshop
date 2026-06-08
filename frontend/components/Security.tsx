import React, { useState, useEffect } from 'react';
import { HomeState } from '../types';
import { Camera as CameraIcon, Video, Activity, DoorOpen, DoorClosed, Bell } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const Security: React.FC<Props> = ({ state, setState }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => setCurrentTime(new Date().toLocaleString('tr-TR'));
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleDoor = (door: keyof HomeState['security']['doors']) => {
    setState(prev => ({
      ...prev,
      security: { ...prev.security, doors: { ...prev.security.doors, [door]: !prev.security.doors[door] } }
    }));
  };

  const ringDoorbell = () => {
    setState(prev => ({
      ...prev,
      security: { ...prev.security, doorbellLastRing: new Date().toLocaleTimeString('tr-TR') }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-amber-900 mb-2">Güvenlik ve Sensörler</h2>
          <p className="text-amber-700">Kamera, kapı zili ve erişim kontrolü.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 bg-black border-4 border-amber-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <img 
              src="https://picsum.photos/1280/720?grayscale&blur=2" 
              alt="Camera Feed" 
              className={`absolute inset-0 w-full h-full object-cover mix-blend-luminosity transition-opacity duration-1000 ${state.security.motionDetected ? 'opacity-80' : 'opacity-40'}`}
            />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Video size={20} className="text-amber-400" />
              <span className="text-amber-400 font-mono font-bold text-sm tracking-wider">CAM-01 (SALON)</span>
            </div>

            {state.security.motionDetected && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded text-white text-xs font-bold animate-pulse">
                <Activity size={14} /> HAREKET ALGILANDI
              </div>
            )}

            <div className="absolute bottom-4 left-4">
              <span className="text-amber-400 font-mono font-bold text-sm bg-black/80 px-2 py-1 rounded">{currentTime}</span>
            </div>
          </div>
        </div>

        {/* Sensors Panel */}
        <div className="space-y-4">
          {/* Doorbell */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
              <Bell size={20} className="text-amber-600" /> Kapı Zili
            </h3>
            <div className="flex items-center justify-between bg-amber-50 p-4 rounded-xl border border-amber-200">
              <div>
                <p className="text-sm font-medium text-amber-700">Son Çalınma</p>
                <p className="text-amber-900 font-bold">{state.security.doorbellLastRing || 'Henüz çalınmadı'}</p>
              </div>
              <button onClick={ringDoorbell} className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 rounded-lg text-sm font-bold transition-colors shadow-md">
                Zili Çal
              </button>
            </div>
          </div>

          {/* Doors */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
              <DoorOpen size={20} className="text-amber-600" /> Kapı Sensörleri
            </h3>
            <div className="space-y-3">
              {Object.entries(state.security.doors).map(([key, isOpen]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    {isOpen ? <DoorOpen size={18} className="text-red-500" /> : <DoorClosed size={18} className="text-green-600" />}
                    <div>
                      <p className="text-sm font-bold text-amber-900">{key === 'anaKapi' ? 'Ana Kapı' : key === 'balkon' ? 'Balkon Kapısı' : 'Pencere'}</p>
                      <p className={`text-xs font-bold ${isOpen ? 'text-red-600' : 'text-green-600'}`}>{isOpen ? 'AÇIK' : 'KAPALI'}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleDoor(key as any)} className="px-3 py-1.5 text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 rounded-lg transition-colors">
                    Değiştir
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
