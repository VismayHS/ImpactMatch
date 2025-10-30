import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ icon: Icon, label, value, change, changeType, color = 'blue' }) => {
  const colorClasses = {
    blue: 'from-blue-500/20 to-blue-600/20 border-blue-400/30',
    teal: 'from-teal-500/20 to-teal-600/20 border-teal-400/30',
    violet: 'from-violet-500/20 to-violet-600/20 border-violet-400/30',
    orange: 'from-orange-500/20 to-orange-600/20 border-orange-400/30'
  };

  return (
    <div className={`backdrop-blur-xl bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 hover:scale-105 transition-transform duration-300`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} border flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
            changeType === 'up' 
              ? 'bg-green-500/20 text-green-300' 
              : 'bg-red-500/20 text-red-300'
          }`}>
            {changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>
      
      <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
      <p className="text-white/70 text-sm">{label}</p>
    </div>
  );
};

export default StatsCard;
