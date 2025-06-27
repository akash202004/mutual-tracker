import React from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import type { MutualFund } from "../types";

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
          <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-sm font-medium">Current NAV</span>
          <span className="text-2xl font-bold text-green-400 bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent">
            ₹{fund.nav}
          </span>
        </div>

        <div className="pt-2 border-t border-white/10 flex justify-center w-full">
          <button
            type="button"
            className="w-full px-3 py-1 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            tabIndex={0}
            aria-label="Click to get more details"
          >
            Click to get more details
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundCard;
