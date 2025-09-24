import React from 'react';
import { Map, MapPin, Trophy, Star } from 'lucide-react';

interface QuestMapProps {
  className?: string;
}

export const QuestMap: React.FC<QuestMapProps> = ({ className = '' }) => {
  return (
    <div className={`relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <Map className="w-6 h-6 text-indigo-600" />
        <h3 className="text-lg font-semibold text-gray-800">Quest Map</h3>
      </div>
      
      <div className="relative h-64 bg-gradient-to-b from-sky-200 to-green-200 rounded-lg overflow-hidden">
        {/* Quest locations */}
        <div className="absolute top-4 left-8">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium">Math Kingdom</span>
          </div>
        </div>
        
        <div className="absolute top-16 right-12">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Science Lab</span>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
            <Star className="w-4 h-4 text-purple-500" />
            <span className="text-sm font-medium">Adventure Hub</span>
          </div>
        </div>
        
        {/* Decorative path */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200">
          <path
            d="M 50 50 Q 150 100 250 50 Q 200 120 100 150"
            stroke="#4f46e5"
            strokeWidth="3"
            strokeDasharray="5,5"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Explore different learning realms and complete quests to unlock new adventures!
      </div>
    </div>
  );
};