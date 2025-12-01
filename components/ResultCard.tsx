import React from 'react';
import { AnalysisResult, PurineLevel, Language } from '../types';
import { AlertTriangle, CheckCircle, XCircle, Info, ChevronRight } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  imageUrl: string;
  onReset: () => void;
  lang: Language;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, imageUrl, onReset, lang }) => {
  const t = {
    en: {
      purineLevel: "Purine Level",
      est: "Est.",
      calories: "Calories",
      safety: "Safety",
      safe: "Safe",
      caution: "Caution",
      assessment: "Assessment",
      recommendation: "Recommendation",
      alternatives: "Better Alternatives",
      scanAgain: "Scan Another Item"
    },
    zh: {
      purineLevel: "嘌呤等级",
      est: "预估",
      calories: "热量",
      safety: "安全性",
      safe: "安全",
      caution: "注意",
      assessment: "风险评估",
      recommendation: "饮食建议",
      alternatives: "推荐替代品",
      scanAgain: "扫描下一个"
    }
  };

  const text = t[lang];

  const getLevelColor = (level: PurineLevel) => {
    switch (level) {
      case PurineLevel.LOW:
        return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case PurineLevel.MODERATE:
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case PurineLevel.HIGH:
        return 'bg-rose-50 border-rose-200 text-rose-800';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-800';
    }
  };

  const getLevelIcon = (level: PurineLevel) => {
    switch (level) {
      case PurineLevel.LOW:
        return <CheckCircle className="w-6 h-6 text-emerald-600" />;
      case PurineLevel.MODERATE:
        return <Info className="w-6 h-6 text-amber-600" />;
      case PurineLevel.HIGH:
        return <XCircle className="w-6 h-6 text-rose-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in mb-8">
      {/* Image Header */}
      <div className="relative h-48 w-full bg-slate-100">
        <img 
          src={imageUrl} 
          alt="Analyzed food" 
          className="w-full h-full object-cover"
        />
        <div className={`absolute bottom-0 left-0 right-0 px-6 py-3 bg-gradient-to-t from-black/70 to-transparent text-white`}>
          <h2 className="text-2xl font-bold truncate">{result.foodName}</h2>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Status Badge */}
        <div className={`flex items-center p-4 rounded-2xl border ${getLevelColor(result.purineLevel)}`}>
          <div className="mr-4 bg-white p-2 rounded-full shadow-sm">
            {getLevelIcon(result.purineLevel)}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider opacity-70">{text.purineLevel}</p>
            <p className="text-xl font-bold">{result.purineLevel}</p>
          </div>
          <div className="ml-auto text-right">
             <p className="text-xs font-bold uppercase tracking-wider opacity-70">{text.est}</p>
             <p className="font-mono font-medium">{result.estimatedPurineContent}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">{text.calories}</span>
              <span className="text-slate-900 font-semibold">{result.calories}</span>
           </div>
           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium block mb-1">{text.safety}</span>
              <span className="text-slate-900 font-semibold">{result.purineLevel === PurineLevel.LOW ? text.safe : text.caution}</span>
           </div>
        </div>

        {/* Assessment */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 flex items-center">
            {text.assessment}
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            {result.riskAssessment}
          </p>
        </div>

        {/* Recommendation */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center text-sm">
            <Info className="w-4 h-4 mr-2" />
            {text.recommendation}
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">
            {result.recommendation}
          </p>
        </div>

        {/* Alternatives if High Risk */}
        {result.alternatives && result.alternatives.length > 0 && (
           <div className="pt-2">
            <h3 className="text-sm font-bold text-slate-900 mb-3">{text.alternatives}</h3>
            <ul className="space-y-2">
              {result.alternatives.map((alt, idx) => (
                <li key={idx} className="flex items-center text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                  <ChevronRight className="w-4 h-4 text-emerald-500 mr-2" />
                  {alt}
                </li>
              ))}
            </ul>
           </div>
        )}

        {/* Action Button */}
        <button 
          onClick={onReset}
          className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-colors active:scale-[0.98] transform duration-100"
        >
          {text.scanAgain}
        </button>
      </div>
    </div>
  );
};
