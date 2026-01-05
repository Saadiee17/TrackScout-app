import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';

interface UploadAreaProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-3xl p-10 sm:p-16 transition-all duration-300 ease-in-out text-center cursor-pointer group shadow-sm hover:shadow-md
        ${isDragging 
          ? 'border-emerald-500 bg-emerald-50 scale-[1.02]' 
          : 'border-gray-200 hover:border-emerald-400 hover:bg-white bg-white/50'
        }
        ${isLoading ? 'opacity-50 pointer-events-none' : ''}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
        onChange={handleInputChange} 
        accept="image/*"
        disabled={isLoading}
      />
      
      <div className="flex flex-col items-center justify-center space-y-5">
        <div className={`p-5 rounded-2xl transition-all duration-300 ${isDragging ? 'bg-emerald-100 shadow-inner' : 'bg-gray-100 group-hover:bg-emerald-50 group-hover:scale-110'}`}>
          {isLoading ? (
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          ) : (
            <UploadCloud className={`w-12 h-12 ${isDragging ? 'text-emerald-600' : 'text-gray-400 group-hover:text-emerald-600'}`} />
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-xl font-bold text-gray-800">
            {isLoading ? 'Analyzing Track...' : 'Upload a photo of the track'}
          </p>
          <p className="text-base text-gray-500 max-w-sm mx-auto">
            Drag and drop your image here, or click to browse files
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs font-medium text-gray-400 pt-2 uppercase tracking-wide">
          <ImageIcon className="w-4 h-4" />
          <span>Supports JPG, PNG, WEBP</span>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;