import React, { useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { ResultCard } from './components/ResultCard';
import { LoadingOverlay } from './components/LoadingOverlay';
import { analyzeFoodImage } from './services/geminiService';
import { AnalysisResult, Language } from './types';
import { ShieldCheck, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Default to Chinese as per user request context, but could be detected from browser
  const [language, setLanguage] = useState<Language>('zh');

  const handleImageSelect = async (file: File) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      // 1. Create Preview URL
      const url = URL.createObjectURL(file);
      setImageUrl(url);

      // 2. Convert to Base64 for API
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            // Remove data:image/png;base64, prefix
            const base64Content = base64String.split(',')[1];
            resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // 3. Call API with language
      const analysis = await analyzeFoodImage(base64Data, file.type, language);
      setResult(analysis);

    } catch (err) {
      console.error(err);
      setError(language === 'zh' ? "无法分析图片，请确保图片清晰且为食物。" : "Unable to analyze the image. Please ensure it's a clear photo of food and try again.");
      setImageUrl(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setImageUrl(null);
    setError(null);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = {
    en: {
      newScan: "New Scan",
      errorTitle: "Oops! Something went wrong.",
      tryAgain: "Try Again",
      disclaimer: "Disclaimer: This app provides estimates based on AI analysis. It is not a medical diagnostic tool. Always consult a healthcare professional for dietary advice specific to your condition."
    },
    zh: {
      newScan: "重新扫描",
      errorTitle: "出错了！",
      tryAgain: "重试",
      disclaimer: "免责声明：本应用基于AI分析提供估算值，仅供参考。它不是医疗诊断工具。关于具体的饮食建议，请咨询专业医疗人员。"
    }
  };

  const text = t[language];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 pb-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100">
        <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">PurineLens</span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-slate-100 px-3 py-1.5 rounded-full"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'EN' : '中文'}</span>
              </button>

            {result && (
              <button 
                onClick={handleReset} 
                className="text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                {text.newScan}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-6 pt-6">
        {isAnalyzing && <LoadingOverlay lang={language} />}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-red-700 text-sm flex flex-col gap-2">
            <p className="font-bold">{text.errorTitle}</p>
            <p>{error}</p>
            <button 
              onClick={() => setError(null)}
              className="text-red-800 font-semibold underline self-start mt-1"
            >
              {text.tryAgain}
            </button>
          </div>
        )}

        {!result && !isAnalyzing && (
          <EmptyState onImageSelect={handleImageSelect} lang={language} />
        )}

        {result && imageUrl && (
          <ResultCard 
            result={result} 
            imageUrl={imageUrl} 
            onReset={handleReset}
            lang={language}
          />
        )}
      </main>

      {/* Footer / Disclaimer */}
      {!isAnalyzing && (
        <footer className="max-w-md mx-auto px-6 mt-8 text-center pb-6">
          <p className="text-[10px] text-slate-400 leading-tight">
            {text.disclaimer}
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
