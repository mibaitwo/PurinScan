import React from 'react';
import { Loader2 } from 'lucide-react';
import { Language } from '../types';

interface LoadingOverlayProps {
  lang: Language;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ lang }) => {
  const t = {
    en: {
      title: "Analyzing Food...",
      desc: "Identifying ingredients and calculating purine estimates."
    },
    zh: {
      title: "正在分析食物...",
      desc: "正在识别成分并计算嘌呤含量。"
    }
  };

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full border border-slate-100">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-blue-600 p-4 rounded-full text-white">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{t[lang].title}</h3>
        <p className="text-slate-500 text-center text-sm">
          {t[lang].desc}
        </p>
      </div>
    </div>
  );
};
