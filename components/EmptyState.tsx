import React, { useRef } from 'react';
import { Camera, Upload, Utensils } from 'lucide-react';
import { Language } from '../types';

interface EmptyStateProps {
  onImageSelect: (file: File) => void;
  lang: Language;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onImageSelect, lang }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const t = {
    en: {
      title: "Check Your Food",
      subtitle: "Upload or take a photo of your meal to instantly check purine levels and reduce gout risk.",
      takePhoto: "Take Photo",
      uploadImage: "Upload Image",
      safe: "Safe",
      moderate: "Moderate",
      highRisk: "High Risk"
    },
    zh: {
      title: "检测食物嘌呤",
      subtitle: "上传或拍摄食物照片，即刻查询嘌呤含量，降低痛风风险。",
      takePhoto: "拍摄照片",
      uploadImage: "上传图片",
      safe: "安全",
      moderate: "适量",
      highRisk: "高风险"
    }
  };

  const text = t[lang];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-fade-in">
      <div className="bg-gradient-to-tr from-blue-100 to-emerald-100 p-6 rounded-full mb-8 shadow-inner">
        <div className="bg-white p-4 rounded-full shadow-lg">
           <Utensils className="w-12 h-12 text-blue-600" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
        {text.title}
      </h1>
      <p className="text-slate-500 mb-10 max-w-xs mx-auto leading-relaxed">
        {text.subtitle}
      </p>

      <div className="w-full max-w-xs space-y-4">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Camera Button */}
        <button 
          onClick={triggerUpload}
          className="group w-full relative flex items-center justify-center p-5 bg-blue-600 text-white rounded-2xl shadow-blue-200 shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98]"
        >
          <div className="absolute left-5 bg-blue-500 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
            <Camera className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg">{text.takePhoto}</span>
        </button>

        <button 
          onClick={triggerUpload}
          className="group w-full relative flex items-center justify-center p-5 bg-white text-slate-700 border border-slate-200 rounded-2xl shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]"
        >
          <div className="absolute left-5 bg-slate-100 p-2 rounded-lg text-slate-500 group-hover:text-slate-700">
            <Upload className="w-6 h-6" />
          </div>
          <span className="font-bold text-lg">{text.uploadImage}</span>
        </button>
      </div>

      <div className="mt-12 flex gap-4 text-xs text-slate-400">
         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-emerald-400 mr-1"></div> {text.safe}</span>
         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-amber-400 mr-1"></div> {text.moderate}</span>
         <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-rose-400 mr-1"></div> {text.highRisk}</span>
      </div>
    </div>
  );
};
