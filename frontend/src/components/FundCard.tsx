import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Calendar } from 'lucide-react';
import type { MutualFund } from '../types';

interface FundCardProps {
  fund: MutualFund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/fund/${fund.schemeCode}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-black border-2 border-white/20 rounded-xl p-6 hover:border-white/40 hover:bg-white/5 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-tight">
          {fund.schemeName}
        </h3>
        <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
          <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0" />
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          
        </div>
        
        <div className="flex items-center space-x-2 text-gray-400 text-sm pt-2 border-t border-white/10">
          <Calendar className="w-4 h-4" />
          <span>Updated: {fund.date}</span>
        </div>
      </div>
    </div>
  );
};

export default FundCard;