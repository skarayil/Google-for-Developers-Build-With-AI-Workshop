# 🏠 Akıllı Ev Otomasyonu — AI Destekli Smart Home Simülasyonu

<div align="center">

<img src="https://readme-typing-svg.herokuapp.com?font=Inter&size=20&pause=1000&color=F59E0B&center=true&vCenter=true&width=700&lines=Google+for+Developers+Workshop+Projesi;AI+Destekli+Akıllı+Ev+Simülasyonu;React+%2B+Vertex+AI+%2B+Node.js+Backend" alt="Typing SVG" />

<br/>

[![React](https://img.shields.io/badge/React-Latest-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-Latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Google Cloud](https://img.shields.io/badge/Google-Cloud-4285F4?style=for-the-badge&logo=googlecloud&logoColor=white)](https://cloud.google.com)
[![Vertex AI](https://img.shields.io/badge/Vertex-AI-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://cloud.google.com/vertex-ai)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)

<br/>

> **Google for Developers Workshop'unda geliştirilen, yapay zeka destekli akıllı ev simülasyon platformu.**
> Gerçek zamanlı cihaz kontrolü, enerji takibi, akıllı senaryolar ve Vertex AI (Gemini) entegrasyonuyla ev otomasyonunu deneyimleyin.

<br/>

### 🌐 [Canlı Demo →](https://skarayil.github.io/smart-home)

<br/>

[🎓 Workshop Hakkında](#-google-for-developers-workshop) • [✨ Özellikler](#-özellikler) • [🏗️ Mimari](#️-teknik-mimari) • [🤖 AI Entegrasyonu](#-ai-entegrasyonu) • [🚀 Kurulum](#-kurulum)

</div>

---

## 🎓 Google for Developers Workshop

Bu proje, **Google for Developers** tarafından düzenlenen yapay zeka odaklı workshop kapsamında geliştirilmiştir. Workshop boyunca katılımcılar şu konularda uygulamalı deneyim edindi:

- **Google Cloud & Vertex AI** ile üretken yapay zeka uygulamaları geliştirme
- **Gemini** modelini bir React frontend'e entegre etme
- Node.js ile **güvenli API proxy** mimarisi kurma
- Gerçek dünya kullanım senaryosu olarak **akıllı ev otomasyonu** geliştirme

Workshop sürecinde sıfırdan üretim seviyesi bir uygulama oluşturuldu; AI asistan, enerji simülasyonu ve dinamik oda yönetimi bu süreçte hayata geçirildi.

---

## 🔍 Proje Hakkında

**Akıllı Ev Otomasyonu**, evinizin tüm cihazlarını tek bir arayüzden yönetmenizi sağlayan interaktif bir simülasyon platformudur. Uygulama; dinamik oda yapısı, cihaz kontrolü, enerji tüketimi takibi ve Vertex AI (Gemini) tabanlı akıllı asistan bildirimleriyle tam bir IoT deneyimi sunar.

Proje aynı zamanda **Nesne Yönelimli C++ konsol uygulaması** olarak da yazılmıştır — kaynak kod uygulama içinde görüntülenebilir ve kopyalanabilir.

---

## ✨ Özellikler

### 🏡 Dinamik Oda Yönetimi
- Yeni oda ekleme / silme (İç mekan & Dış mekan desteği)
- Her odaya otomatik atanan temel cihazlar: **Işık, Panjur, Termostat**
- Dış mekan odalarına özel **Akıllı Sulama** sistemi

### 💡 Cihaz Kontrolü
Her oda şu cihazları destekler:

| Cihaz | Kontrol |
|-------|---------|
| 💡 Işık | Açma / Kapama |
| 🪟 Panjur | %0–100 seviye ayarı |
| 🌡️ Termostat | 10–35°C sıcaklık ayarı |
| 📺 Televizyon | Açma / Kapama |
| ❄️ Buzdolabı | Sıcaklık kontrolü |
| 🔥 Fırın | Açma / Kapama + sıcaklık ayarı |
| 💧 Akıllı Sulama | Süre ve çalışma kontrolü |

### ⚡ Enerji Simülasyonu
- **Anlık güç çekimi** (Watt) gerçek zamanlı hesaplanır
- Her cihazın tanımlı `powerWatt` değeri üzerinden toplam tüketim izlenir
- **Günlük kWh** birikimli olarak takip edilir (15 saniyelik simülasyon döngüsü)

### 🎬 Akıllı Senaryolar
Tek tuşla tüm evi bir moda alın:

| Senaryo | Eylemler |
|---------|---------|
| 🎥 **Sinema Modu** | Salon ışıkları kapanır, panjur iner, TV açılır |
| 🌙 **Uyku Modu** | Tüm ışıklar ve panjurlar kapanır |
| ✈️ **Tatil Modu** | Buzdolabı hariç tüm cihazlar kapanır |

### 🤖 AI Akıllı Asistan
- **Vertex AI (Gemini 1.5 Flash)** ile enerji ve cihaz durumunu analiz eder
- Türkçe öneriler ve uyarılar üretir
- Önemli cihaz değişikliklerinde **otomatik analiz** tetiklenir (15s throttle)
- Exponential backoff ile **retry mekanizması** ve timeout yönetimi

### 💻 C++ Kaynak Kodu Görüntüleyici
- Workshop için yazılan **tam özellikli C++ konsol uygulaması** görüntülenebilir
- Kod panelinden tek tıkla kopyalanabilir

---

## 🏗️ Teknik Mimari

```
┌─────────────────────────────────────────────┐
│              Frontend (React + Vite)        │
│  ┌──────────┐ ┌───────────┐ ┌───────────┐  │
│  │Dashboard │ │  Rooms    │ │ Scenarios │  │
│  └──────────┘ └───────────┘ └───────────┘  │
│                    │                        │
│     vertex-ai-proxy-interceptor.js          │
│     (fetch & WebSocket interceptor)         │
└──────────────────┬──────────────────────────┘
                   │ /api-proxy
┌──────────────────▼──────────────────────────┐
│         Node.js Backend (Express)           │
│  • Google ADC ile kimlik doğrulama          │
│  • Rate limiting (100 req / 15 dk)          │
│  • WebSocket proxy (/ws-proxy)              │
│  • Streaming & non-streaming yanıtlar       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│         Google Cloud Vertex AI              │
│  • Gemini 1.5 Flash (generateContent)       │
│  • streamGenerateContent                   │
│  • LlmBidiService (WebSocket / Live API)    │
└─────────────────────────────────────────────┘
```

### Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **İkonlar** | Lucide React |
| **Backend** | Node.js, Express 5, CORS, express-rate-limit |
| **AI** | Google Vertex AI — Gemini 1.5 Flash |
| **Auth** | Google Application Default Credentials (ADC) |
| **Gerçek Zamanlı** | WebSocket proxy (ws) |
| **Deploy** | GitHub Pages (frontend) + Cloud Run (backend) |

---

## 🤖 AI Entegrasyonu

Uygulama, **Vertex AI Gemini 1.5 Flash** modelini şu şekilde kullanır:

```typescript
// Ev durumuna göre prompt oluşturulur
const prompt = `
  Aktif cihazlar: ${activeDevices.join(', ')}
  Anlık tüketim: ${state.energy.currentWatt} W
  Uyarılar: ${highTempOvens.join(', ')}
  → 1-3 kısa Türkçe öneri üret (JSON array)
`;
```

**Güvenlik:** Tüm Vertex AI istekleri, tarayıcıdan doğrudan değil; Node.js backend üzerindeki proxy aracılığıyla gönderilir. API anahtarı veya kimlik bilgisi hiçbir zaman tarayıcıya açılmaz.

**Otomatik Tetikleme:** Cihaz durumlarında önemli bir değişiklik (açma/kapama) olduğunda AI analizi minimum 15 saniye aralıkla otomatik olarak çalıştırılır.

---

## 📁 Proje Yapısı

```
akilli-ev-otomasyonu/
├── frontend/
│   ├── App.tsx                          # Ana uygulama, state yönetimi, simülasyon döngüsü
│   ├── index.tsx                        # Giriş noktası
│   ├── vertex-ai-proxy-interceptor.js   # fetch & WebSocket yakalayıcı
│   ├── types.ts                         # TypeScript tip tanımları
│   ├── constants.ts                     # C++ kaynak kodu sabiti
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigasyon yan paneli
│   │   ├── Dashboard.tsx    # Durum özeti + AI asistan
│   │   ├── Rooms.tsx        # Dinamik oda ve cihaz yönetimi
│   │   ├── Scenarios.tsx    # Senaryolar + enerji raporu
│   └── services/
│       └── aiService.ts     # Vertex AI entegrasyonu
├── backend/
│   └── server.js            # Express proxy sunucusu
├── CHANGELOG.md
├── CONTRIBUTING.md
├── SECURITY.md
└── README.md
```

---

## 🚀 Kurulum

### Gereksinimler

- Node.js ve npm
- [Google Cloud SDK (gcloud CLI)](https://cloud.google.com/sdk/docs/install)
- Vertex AI API etkin bir Google Cloud projesi

### 1. Kimlik Doğrulama

```bash
gcloud init
gcloud auth application-default login
```

### 2. Repoyu Klonla ve Bağımlılıkları Yükle

```bash
git clone https://github.com/skarayil/akilli-ev-otomasyonu.git
cd akilli-ev-otomasyonu
npm install
```

### 3. Backend Ortam Değişkenlerini Ayarla

`backend/.env.local` dosyasını oluştur:

```env
API_BACKEND_PORT=5000
API_PAYLOAD_MAX_SIZE=5mb
GOOGLE_CLOUD_LOCATION=us-central1
GOOGLE_CLOUD_PROJECT=your-project-id
PROXY_HEADER=your-secret-header-value
```

### 4. Uygulamayı Başlat

```bash
npm run dev
```

Frontend `http://localhost:5173`, backend ise `http://localhost:5000` adresinde çalışır.

---

## ⚙️ Ortam Değişkenleri

| Değişken | Açıklama |
|----------|----------|
| `VITE_API_URL` | Cloud Run backend URL'i (production için) |
| `GOOGLE_CLOUD_PROJECT` | GCP proje ID'si |
| `GOOGLE_CLOUD_LOCATION` | GCP bölgesi (örn. `us-central1`) |
| `API_BACKEND_PORT` | Backend port numarası |
| `PROXY_HEADER` | Proxy güvenlik başlık değeri |

---

## 🔒 Güvenlik

- Vertex AI kimlik bilgileri hiçbir zaman tarayıcıya gönderilmez
- Tüm API istekleri `X-App-Proxy` başlığıyla doğrulanır
- Rate limiting: IP başına 15 dakikada 100 istek
- `API_KEY` ve `GOOGLE_APPLICATION_CREDENTIALS` asla kod tabanında bulundurulmamalıdır

Güvenlik açığı bildirmek için [SECURITY.md](./SECURITY.md) dosyasına bakınız.

---

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Detaylar için [CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakınız.

1. Repoyu fork'layın
2. Feature branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit'leyin
4. Branch'inizi push'layın
5. Pull Request açın

---

## 📄 Lisans

Bu proje [MIT Lisansı](./LICENSE) altında dağıtılmaktadır.

---

<div align="center">

**Google for Developers Workshop — AI ile Uygulama Geliştirme**

*Vertex AI · Gemini · React · Node.js · TypeScript*

<br/>

### 👩‍💻 Created by Sude Naz Karayıldırım

[![GitHub](https://img.shields.io/badge/GitHub-skarayil-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/skarayil)
[![42 Profile](https://img.shields.io/badge/42%20Profile-skarayil-black?style=flat-square&logo=42&logoColor=white)](https://profile.intra.42.fr/users/skarayil)

**⭐ Beğendiyseniz repo'ya star vermeyi unutmayın!**

</div>