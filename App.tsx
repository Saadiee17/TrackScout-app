import React, { useState } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import AnalysisResult from './components/AnalysisResult';
import { analyzeTrackImage } from './services/geminiService';
import { AnalysisState } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    result: null,
    error: null,
    imagePreview: null,
  });

  const handleFileSelect = async (file: File) => {
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    setState({
      isLoading: true,
      error: null,
      result: null,
      imagePreview: previewUrl,
    });

    try {
      const result = await analyzeTrackImage(file);
      setState(prev => ({
        ...prev,
        isLoading: false,
        result: result,
      }));
    } catch (error) {
      console.error(error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to analyze the image. Please try again with a clearer photo or check your internet connection.",
      }));
    }
  };

  const handleReset = () => {
    // Cleanup old object URL to avoid memory leaks
    if (state.imagePreview) {
      URL.revokeObjectURL(state.imagePreview);
    }
    
    setState({
      isLoading: false,
      result: null,
      error: null,
      imagePreview: null,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        <div className="space-y-8">
          
          {/* Introduction Text - Only show when no result/loading */}
          {!state.result && !state.isLoading && (
            <div className="text-center space-y-4 mb-12 animate-in fade-in duration-700 slide-in-from-bottom-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                Identify Animal Tracks <span className="text-emerald-700">Instantly</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Found a mysterious footprint in the mud or snow? Upload a photo and our AI scout will analyze the track pattern, toes, and shape to help you identify the animal.
              </p>
            </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Analysis Error</h3>
                <p className="text-sm text-red-700 mt-1">{state.error}</p>
                <button 
                  onClick={() => setState(s => ({...s, error: null, isLoading: false, imagePreview: null}))}
                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-800 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="transition-all duration-500 ease-in-out">
            {state.result ? (
              <AnalysisResult 
                result={state.result} 
                imagePreview={state.imagePreview!} 
                onReset={handleReset} 
              />
            ) : (
              <div className="max-w-2xl mx-auto">
                <UploadArea 
                  onFileSelect={handleFileSelect} 
                  isLoading={state.isLoading} 
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="font-medium text-gray-900">TrackScout</p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} Identifying nature's mysteries.</p>
          <p className="mt-4 text-xs text-gray-400 max-w-md mx-auto">
            Note: AI identification is not 100% accurate. Always exercise caution around wild animals and do not rely solely on this tool for safety.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;