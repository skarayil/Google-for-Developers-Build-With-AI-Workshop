import { HomeState } from '../types';

const VERTEX_AI_URL = 'https://aiplatform.googleapis.com/v1/publishers/google/models/gemini-1.5-flash:generateContent';
const TIMEOUT_MS = 15000;
const MAX_RETRIES = 2;

export class AiServiceError extends Error {
  constructor(message: string, public readonly isTimeout: boolean = false) {
    super(message);
    this.name = 'AiServiceError';
  }
}

/**
 * Builds the prompt based on the current home state.
 */
function buildPrompt(state: HomeState): string {
  const activeDevices = state.rooms.flatMap(room => 
    room.devices.filter(d => d.isOn).map(d => `${d.name} in ${room.name}`)
  );
  
  const highTempOvens = state.rooms.flatMap(room => 
    room.devices.filter(d => d.type === 'OVEN' && d.isOn && (d.value as number) > 200).map(d => `${d.name} in ${room.name} is very hot (${d.value}°C)`)
  );

  return `
You are a Smart Home Assistant for "Akıllı Ev Otomasyonu".
Analyze the current state of the house and provide 1-3 short, actionable, and friendly recommendations or alerts in Turkish.
Keep your response concise. Do not use markdown bullet points, return a JSON array of strings.

Current State:
- Energy Consumption: ${state.energy.currentWatt} Watts
- Daily Energy Used: ${state.energy.dailyKwh.toFixed(2)} kWh
- General Water Temp: ${state.global.waterTemp}°C
- Boiler Target Temp: ${state.global.boilerTemp}°C
- Active Devices: ${activeDevices.length > 0 ? activeDevices.join(', ') : 'None'}
- Warnings: ${highTempOvens.length > 0 ? highTempOvens.join(', ') : 'None'}
`;
}

/**
 * Performs a fetch with timeout and retries.
 */
async function fetchWithRetry(url: string, options: RequestInit, retries: number = MAX_RETRIES): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (err: any) {
      clearTimeout(id);
      lastError = err;
      
      // If it's the last attempt or an abort error (timeout), don't retry.
      if (attempt === retries) break;
      
      // Exponential backoff
      await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
    }
  }

  const isTimeout = lastError?.name === 'AbortError';
  throw new AiServiceError(
    isTimeout ? 'Yapay zeka yanıt vermedi (Zaman Aşımı).' : `Bağlantı hatası: ${lastError?.message}`,
    isTimeout
  );
}

/**
 * Fetches insights from the Vertex AI backend.
 */
export async function getAiInsights(state: HomeState): Promise<string[]> {
  const prompt = buildPrompt(state);

  const payload = {
    contents: [{
      role: 'user',
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 256,
      responseMimeType: 'application/json',
    }
  };

  try {
    const response = await fetchWithRetry(VERTEX_AI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      const textResponse = data.candidates[0].content.parts[0].text;
      try {
        const parsed = JSON.parse(textResponse);
        if (Array.isArray(parsed)) return parsed;
        return ["Yanıt anlaşılamadı."];
      } catch (e) {
        // Fallback if not valid JSON
        return [textResponse.trim()];
      }
    }

    return ["Her şey yolunda."];
  } catch (error: any) {
    throw new AiServiceError(error.message, error instanceof AiServiceError ? error.isTimeout : false);
  }
}
