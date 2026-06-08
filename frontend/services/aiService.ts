import { HomeState } from '../types';

export class AiServiceError extends Error {
  constructor(message: string, public readonly isTimeout: boolean = false) {
    super(message);
    this.name = 'AiServiceError';
  }
}

/**
 * Mocks an AI Assistant analyzing the home state and providing insights.
 */
export async function getAiInsights(state: HomeState): Promise<string[]> {
  // Simulate network delay for realism
  await new Promise(resolve => setTimeout(resolve, 1500));

  const insights: string[] = [];

  // Energy & Devices
  if (state.energy.currentWatt > 2500) {
    insights.push(`Şu anda enerji tüketiminiz oldukça yüksek (${state.energy.currentWatt} W). Gereksiz çalışan yüksek güçlü cihazları kapatabilirsiniz.`);
  }

  // Check Ovens
  const activeOvens = state.rooms.flatMap(room => 
    room.devices.filter(d => d.type === 'OVEN' && d.isOn)
  );
  if (activeOvens.length > 0) {
    const oven = activeOvens[0];
    if ((oven.value as number) > 200) {
      insights.push(`Uyarı: ${oven.name} çok yüksek sıcaklıkta (${oven.value}°C) çalışıyor. Yemeklerinizi kontrol etmeyi unutmayın.`);
    } else {
      insights.push(`${oven.name} çalışıyor. Pişirme bitince fırını kapatmayı ve havalandırmayı açmayı düşünebilirsiniz.`);
    }
  }

  // Check Irrigations
  const activeIrrigations = state.rooms.flatMap(room =>
    room.devices.filter(d => d.type === 'IRRIGATION' && d.isOn)
  );
  if (activeIrrigations.length > 0) {
    insights.push('Bahçe sulama sistemi aktif. Toprak nemi yeterli seviyeye ulaştığında sistem otomatik kapanacaktır.');
  }

  // Check Lights in Empty (?) or general recommendation
  let activeLights = 0;
  state.rooms.forEach(room => {
    room.devices.forEach(d => {
      if (d.type === 'LIGHT' && d.isOn) activeLights++;
    });
  });

  if (activeLights > 3) {
    insights.push(`Evinizde şu an ${activeLights} farklı ışık açık. Enerji tasarrufu için kullanmadığınız odaların ışıklarını kapatabilirsiniz.`);
  }

  // Thermostat recommendations
  const activeThermostats = state.rooms.flatMap(room =>
    room.devices.filter(d => d.type === 'THERMOSTAT' && d.isOn)
  );
  let averageTemp = 0;
  if (activeThermostats.length > 0) {
    averageTemp = activeThermostats.reduce((acc, t) => acc + (t.value as number), 0) / activeThermostats.length;
    if (averageTemp > 25) {
      insights.push(`Ev sıcaklığı ortalama ${Math.round(averageTemp)}°C seviyesinde. Daha rahat bir ortam için klimaları serinletme moduna alabilirsiniz.`);
    } else if (averageTemp < 18) {
      insights.push(`Ev sıcaklığı ortalama ${Math.round(averageTemp)}°C seviyesinde. Kombi hedef sıcaklığını biraz artırarak ortamı ısıtabilirsiniz.`);
    }
  }

  // General fallback
  if (insights.length === 0) {
    insights.push('Evinizdeki tüm sistemler ideal değerlerde çalışıyor. Şu an için herhangi bir uyarı veya önerim bulunmuyor. Harika!');
    insights.push('Sistem optimizasyonu için Akıllı Asistan arka planda verilerinizi izlemeye devam ediyor.');
  }

  // Return up to 3 insights
  return insights.slice(0, 3);
}
