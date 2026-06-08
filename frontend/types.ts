export interface Device {
  id: string;
  type: string;
  name: string;
  isOn: boolean;
  value?: number | string;
  powerWatt: number;
}

export interface Room {
  id: string;
  name: string;
  isOutdoor: boolean;
  devices: Device[];
}

export interface GlobalSystems {
  waterTemp: number;
  boilerTemp: number;
  doorbellLastRing: string | null;
}

export interface EnergyState {
  currentWatt: number;
  dailyKwh: number;
}

export interface HomeState {
  rooms: Room[];
  global: GlobalSystems;
  energy: EnergyState;
  assistantMessages: string[];
  isAiLoading?: boolean;
  aiError?: string | null;
}

export type TabType = 'dashboard' | 'rooms' | 'scenarios' | 'cpp-code';

export interface AppContextType {
  state: HomeState;
  setState: React.Dispatch<React.SetStateAction<HomeState>>;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}
