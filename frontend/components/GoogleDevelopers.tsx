import React from 'react';
import { Cloud, Cpu, Code, Database, Zap, Sparkles, ExternalLink } from 'lucide-react';

const GoogleDevelopers: React.FC = () => {
  const apis = [
    {
      title: 'Google Cloud Platform (GCP)',
      description: 'Akıllı ev sisteminizin arka uç servislerini barındırmak, veritabanlarını yönetmek ve güvenli ölçeklendirme sağlamak için kapsamlı bulut çözümleri.',
      icon: <Cloud className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-50 border-blue-100',
      link: 'https://cloud.google.com'
    },
    {
      title: 'Vertex AI & Gemini',
      description: 'Gelişmiş makine öğrenimi modelleri ve Gemini API ile evinize insan benzeri kavrama ve akıllı analiz yetenekleri kazandırın.',
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-50 border-purple-100',
      link: 'https://cloud.google.com/vertex-ai'
    },
    {
      title: 'Firebase',
      description: 'Cihazlarınızın anlık durumunu izlemek için gerçek zamanlı veritabanı (Realtime Database) ve kullanıcı kimlik doğrulama işlemleri.',
      icon: <Database className="w-8 h-8 text-orange-500" />,
      color: 'bg-orange-50 border-orange-100',
      link: 'https://firebase.google.com'
    },
    {
      title: 'Google Home & Matter',
      description: 'Matter standartı ile cihaz entegrasyonu sağlayarak akıllı ev ekosisteminizi Google Home asistanına sorunsuzca bağlayın.',
      icon: <Cpu className="w-8 h-8 text-emerald-500" />,
      color: 'bg-emerald-50 border-emerald-100',
      link: 'https://developers.home.google.com'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="relative overflow-hidden rounded-3xl bg-amber-900 p-8 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-500 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              Google <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">for Developers</span>
            </h1>
            <p className="text-amber-100 text-lg sm:text-xl max-w-2xl leading-relaxed">
              Akıllı ev otomasyonunuzu Google'ın güçlü geliştirici araçları ile donatın. Ölçeklenebilir, güvenli ve yapay zeka destekli bir ekosistem kurun.
            </p>
          </div>
          <div className="hidden md:flex p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
            <Code className="w-20 h-20 text-amber-200" strokeWidth={1.5} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {apis.map((api, idx) => (
          <div 
            key={idx} 
            className="group relative bg-white rounded-3xl p-6 border border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-10 -mt-10 rounded-full ${api.color} opacity-50 transition-transform group-hover:scale-150 duration-500`}></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl ${api.color}`}>
                  {api.icon}
                </div>
                <h3 className="text-xl font-bold text-amber-950">{api.title}</h3>
              </div>
              
              <p className="text-amber-800 mb-6 flex-1 leading-relaxed">
                {api.description}
              </p>
              
              <a 
                href={api.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 hover:text-amber-900 transition-colors w-max"
              >
                Daha Fazla Bilgi <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-8 border border-amber-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-amber-600">
            <Zap size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-amber-900 mb-2">Hemen Başlayın</h3>
            <p className="text-amber-800">
              Bu projeyi kendi sisteminizde canlıya almak için <strong>Firebase Hosting</strong> veya <strong>Cloud Run</strong> kullanabilirsiniz. Gemini modelini bağlamak için ise <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline decoration-amber-500 hover:decoration-amber-600">Google AI Studio</a> üzerinden bir API anahtarı edinebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDevelopers;
