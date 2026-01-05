import React from 'react';
import { TrackAnalysis } from '../types';
import { AlertTriangle, CheckCircle, Info, MapPin, PawPrint, Globe, ShieldAlert, Activity } from 'lucide-react';

interface AnalysisResultProps {
  result: TrackAnalysis;
  imagePreview: string;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, imagePreview, onReset }) => {
  const isUnknown = result.animalName.toLowerCase().includes('unknown');
  const showMap = result.habitatRegion && result.habitatRegion !== 'Global' && !isUnknown;
  
  const confidenceColor = result.confidence === 'High' ? 'emerald' : result.confidence === 'Medium' ? 'yellow' : 'red';
  const confidenceBg = result.confidence === 'High' ? 'bg-emerald-50' : result.confidence === 'Medium' ? 'bg-yellow-50' : 'bg-red-50';
  const confidenceText = result.confidence === 'High' ? 'text-emerald-700' : result.confidence === 'Medium' ? 'text-yellow-700' : 'text-red-700';
  const confidenceBorder = result.confidence === 'High' ? 'border-emerald-200' : result.confidence === 'Medium' ? 'border-yellow-200' : 'border-red-200';

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-700 ring-1 ring-black/5">
      <div className="flex flex-col lg:flex-row">
        
        {/* Image Sidebar */}
        <div className="w-full lg:w-2/5 bg-gray-100 relative h-72 lg:h-auto group">
          <img 
            src={imagePreview} 
            alt="Uploaded track" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent lg:bg-gradient-to-r" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md mb-3 border border-white/20`}>
              {isUnknown ? 'Analysis Result' : 'Match Found'}
            </div>
            {isUnknown && <p className="text-white/80 text-sm">We couldn't confidently identify this track.</p>}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-6 lg:p-10 flex flex-col">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                  {result.animalName}
                </h2>
                <p className="text-xl text-emerald-600 font-serif italic mt-1">{result.scientificName}</p>
              </div>
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${confidenceBorder} ${confidenceBg} ${confidenceText}`}>
                {result.confidence === 'High' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-80">Confidence</span>
                  <span className="font-bold leading-none">{result.confidence}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-8 flex-grow">
            
            {/* Characteristics Tags */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">
                <Info className="w-4 h-4" />
                Visual Identifiers
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.characteristics.map((char, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Habitat Section */}
              <div className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <MapPin className="w-4 h-4" />
                  Habitat & Range
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {result.habitat}
                </p>
                
                {showMap && (
                  <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-sm group relative">
                     <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold shadow-sm flex items-center gap-1 text-gray-700">
                        <Globe className="w-3 h-3 text-emerald-600" />
                        {result.habitatRegion}
                     </div>
                    <iframe
                      width="100%"
                      height="160"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(result.habitatRegion)}&t=p&z=4&ie=UTF8&iwloc=&output=embed`}
                      title={`Map of ${result.habitatRegion}`}
                      className="w-full grayscale hover:grayscale-0 transition-all duration-500 opacity-90 hover:opacity-100"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>

              {/* Behavior Section */}
              <div className="space-y-3">
                 <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest">
                  <Activity className="w-4 h-4" />
                  Behavior Patterns
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {result.behaviorNote}
                </p>
              </div>
            </div>

            {/* Safety Alert */}
            {result.safetyTip && !isUnknown && (
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex gap-4 items-start">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Safety Advisory</h4>
                  <p className="text-amber-800/80 text-sm leading-relaxed">{result.safetyTip}</p>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
             <button 
              onClick={onReset}
              className="group flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <PawPrint className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
              Analyze Another Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;