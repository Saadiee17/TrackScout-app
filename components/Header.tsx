import React from 'react';
import { Footprints, Binoculars } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-emerald-900 text-white shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-700 p-2 rounded-lg">
            <Footprints className="w-8 h-8 text-emerald-100" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TrackScout</h1>
            <p className="text-emerald-300 text-sm font-medium">AI-Powered Animal Tracking</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-2 text-emerald-200">
          <Binoculars className="w-5 h-5" />
          <span className="text-sm">Explore Nature Safely</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
