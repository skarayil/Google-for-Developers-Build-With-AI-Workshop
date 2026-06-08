import React, { useState } from 'react';
import { HomeState, Room, Device } from '../types';
import { Plus, Trash2, Power, Settings } from 'lucide-react';

interface Props {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
}

const Rooms: React.FC<Props> = ({ state, setState }) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [isOutdoor, setIsOutdoor] = useState(false);

  const addRoom = () => {
    if (!newRoomName.trim()) return;
    
    const newRoom: Room = {
      id: `r${Date.now()}`,
      name: newRoomName,
      isOutdoor,
      devices: [
        { id: `d${Date.now()}1`, type: 'LIGHT', name: 'Işık', isOn: false, powerWatt: 20 },
        { id: `d${Date.now()}2`, type: 'BLIND', name: 'Panjur', isOn: true, value: 100, powerWatt: 5 },
        { id: `d${Date.now()}3`, type: 'THERMOSTAT', name: 'Sıcaklık', isOn: true, value: 22, powerWatt: 0 }
      ]
    };

    if (isOutdoor) {
      newRoom.devices.push({ id: `d${Date.now()}4`, type: 'IRRIGATION', name: 'Akıllı Sulama', isOn: false, value: 0, powerWatt: 10 });
    }

    setState(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    setNewRoomName('');
    setIsOutdoor(false);
  };

  const deleteRoom = (roomId: string) => {
    setState(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== roomId) }));
  };

  const toggleDevice = (roomId: string, deviceId: string) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            devices: r.devices.map(d => d.id === deviceId ? { ...d, isOn: !d.isOn } : d)
          };
        }
        return r;
      })
    }));
  };

  const changeDeviceValue = (roomId: string, deviceId: string, value: number) => {
    setState(prev => ({
      ...prev,
      rooms: prev.rooms.map(r => {
        if (r.id === roomId) {
          return {
            ...r,
            devices: r.devices.map(d => d.id === deviceId ? { ...d, value } : d)
          };
        }
        return r;
      })
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">Evim (Odalar)</h2>
        <p className="text-amber-700">Odalarınızı yönetin ve cihazları kontrol edin.</p>
      </header>

      {/* Add Room Form */}
      <div className="bg-white border-2 border-amber-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm font-bold text-amber-900 mb-2">Yeni Oda Adı</label>
          <input 
            type="text" 
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Örn: Çocuk Odası"
            className="w-full px-4 py-2 rounded-xl border-2 border-amber-200 focus:border-amber-500 focus:outline-none bg-amber-50 text-amber-900"
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input 
            type="checkbox" 
            id="outdoor"
            checked={isOutdoor}
            onChange={(e) => setIsOutdoor(e.target.checked)}
            className="w-5 h-5 accent-amber-600"
          />
          <label htmlFor="outdoor" className="text-sm font-bold text-amber-900">Dış Mekan (Bahçe)</label>
        </div>
        <button 
          onClick={addRoom}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Ekle
        </button>
      </div>

      {/* Rooms List */}
      <div className="space-y-6">
        {state.rooms.map(room => (
          <div key={room.id} className="bg-white border-2 border-amber-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-amber-100 px-6 py-4 border-b border-amber-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-amber-900">
                {room.name} {room.isOutdoor && <span className="text-sm font-medium text-amber-600 ml-2">(Dış Mekan)</span>}
              </h3>
              <button onClick={() => deleteRoom(room.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {room.devices.map(device => (
                <div key={device.id} className={`p-4 rounded-2xl border-2 transition-colors ${device.isOn ? 'bg-amber-50 border-amber-400' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-amber-900">{device.name}</span>
                    <button 
                      onClick={() => toggleDevice(room.id, device.id)}
                      className={`p-2 rounded-full transition-colors ${device.isOn ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                    >
                      <Power size={16} />
                    </button>
                  </div>
                  
                  {device.value !== undefined && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-bold text-amber-700 mb-2">
                        <span>Ayar</span>
                        <span>{device.value} {device.type === 'THERMOSTAT' || device.type === 'OVEN' || device.type === 'FRIDGE' ? '°C' : device.type === 'BLIND' ? '%' : ''}</span>
                      </div>
                      <input 
                        type="range" 
                        min={device.type === 'FRIDGE' ? -5 : device.type === 'THERMOSTAT' ? 10 : 0} 
                        max={device.type === 'FRIDGE' ? 8 : device.type === 'THERMOSTAT' ? 35 : 100} 
                        value={device.value as number}
                        onChange={(e) => changeDeviceValue(room.id, device.id, parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
