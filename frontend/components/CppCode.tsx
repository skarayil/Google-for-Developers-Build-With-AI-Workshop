import React, { useState } from 'react';
import { CPP_SOURCE_CODE } from '../constants';
import { Copy, Check, Terminal } from 'lucide-react';

const CppCode: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CPP_SOURCE_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <header className="mb-2">
        <h2 className="text-3xl font-bold text-white mb-2">C++ Kaynak Kodu</h2>
        <p className="text-gray-400">İstediğiniz konsol tabanlı akıllı ev otomasyonu programı.</p>
      </header>

      <div className="flex-1 bg-[#0d1117] border border-gray-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-800">
          <div className="flex items-center gap-2 text-gray-400">
            <Terminal size={18} />
            <span className="text-sm font-mono">main.cpp</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'Kopyalandı' : 'Kodu Kopyala'}
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          <pre className="text-sm font-mono text-gray-300 leading-relaxed">
            <code>{CPP_SOURCE_CODE}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CppCode;
