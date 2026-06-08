import React, { useState, useEffect } from 'react';
import { HomeState } from '../types';
import { Camera as CameraIcon, Video, AlertTriangle, Activity, DoorOpen, DoorClosed } from 'lucide-react';

interface CameraProps {
  state: HomeState;
  toggleDoor: (door: keyof HomeState['doors']) => void;
}

const Camera: React.FC<CameraProps> = ({ state, toggleDoor }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('tr-TR'));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Güvenlik Sistemi</h2>
          <p className="text-gray-400">Kamera, hareket ve kapı sensörleri.</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          CANLI
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
            <img 
              src="https://picsum.photos/1280/720?grayscale&blur=2" 
              alt="Camera Feed" 
              className={`absolute inset-0 w-full h-full object-cover mix-blend-luminosity transition-opacity duration-1000 ${state.motionDetected ? 'opacity-80' : 'opacity-40'}`}
            />
            
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] pointer-events-none" />

            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Video size={20} className="text-white/70" />
              <span className="text-white/70 font-mono text-sm tracking-wider">CAM-01 (SALON)</span>
            </div>

            {state.motionDetected && (
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/80 backdrop-blur-sm rounded text-white text-xs font-bold animate-pulse">
                <Activity size={14} />
                HAREKET ALGILANDI
              </div>
            )}

            <div className="absolute bottom-4 left-4">
              <span className="text-white/80 font-mono text-sm bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                {currentTime}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className={`w-32 h-32 border rounded-full flex items-center justify-center transition-colors duration-500 ${state.motionDetected ? 'border-red-500' : 'border-white/50'}`}>
                <div className={`w-1 h-4 absolute top-0 ${state.motionDetected ? 'bg-red-500' : 'bg-white/50'}`} />
                <div className={`w-1 h-4 absolute bottom-0 ${state.motionDetected ? 'bg-red-500' : 'bg-white/50'}`} />
                <div className={`w-4 h-1 absolute left-0 ${state.motionDetected ? 'bg-red-500' : 'bg-white/50'}`} />
                <div className={`w-4 h-1 absolute right-0 ${state.motionDetected ? 'bg-red-500' : 'bg-white/50'}`} />
                <div className={`w-1 h-1 rounded-full ${state.motionDetected ? 'bg-red-500' : 'bg-white/50'}`} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-900 flex items-center justify-between border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${state.motionDetected ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                <CameraIcon size={20} className={state.motionDetected ? 'text-red-400' : 'text-emerald-400'} />
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Kamera Durumu</h3>
                <p className={`text-xs ${state.motionDetected ? 'text-red-400' : 'text-emerald-400'}`}>
                  {state.motionDetected ? 'Kayıt alınıyor...' : 'Normal'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sensors Panel */}
        <div className="space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={20} className="text-blue-400" />
              Hareket Sensörü
            </h3>
            <div className={`p-4 rounded-xl border flex items-center gap-4 ${state.motionDetected ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-800 border-gray-700'}`}>
              <div className={`w-3 h-3 rounded-full ${state.motionDetected ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`} />
              <div>
                <p className={`font-medium ${state.motionDetected ? 'text-red-400' : 'text-gray-300'}`}>
                  {state.motionDetected ? 'Hareket Algılandı!' : 'Hareket Yok'}
                </p>
                <p className="text-xs text-gray-500 mt-1">Salon Bölgesi</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DoorOpen size={20} className="text-orange-400" />
              Kapı / Pencere
            </h3>
            <div className="space-y-3">
              {/* Ana Kapı */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3">
                  {state.doors.anaKapi ? <DoorOpen size={18} className="text-red-400" /> : <DoorClosed size={18} className="text-emerald-400" />}
                  <div>
                    <p className="text-sm font-medium text-gray-200">Ana Kapı</p>
                    <p className={`text-xs ${state.doors.anaKapi ? 'text-red-400' : 'text-emerald-400'}`}>
                      {state.doors.anaKapi ? 'AÇIK' : 'KAPALI'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleDoor('anaKapi')}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Değiştir
                </button>
              </div>

              {/* Arka Pencere */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3">
                  {state.doors.arkaPencere ? <DoorOpen size={18} className="text-red-400" /> : <DoorClosed size={18} className="text-emerald-400" />}
                  <div>
                    <p className="text-sm font-medium text-gray-200">Arka Pencere</p>
                    <p className={`text-xs ${state.doors.arkaPencere ? 'text-red-400' : 'text-emerald-400'}`}>
                      {state.doors.arkaPencere ? 'AÇIK' : 'KAPALI'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleDoor('arkaPencere')}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Değiştir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
