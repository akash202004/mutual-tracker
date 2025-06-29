import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Heart, Save } from "lucide-react";
import { savedFundsApi } from "../utils/api";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../contexts/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import type { MutualFund } from "../types";

interface FundCardProps {
  fund: MutualFund;
}

const FundCard: React.FC<FundCardProps> = ({ fund }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingSaved, setCheckingSaved] = useState(true);

  // Check if fund is already saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (!user) {
        setCheckingSaved(false);
        return;
      }

      try {
        const saved = await savedFundsApi.isFundSaved(fund.schemeCode);
        setIsSaved(saved);
      } catch (error) {
        console.error("Error checking if fund is saved:", error);
      } finally {
        setCheckingSaved(false);
      }
    };

    checkIfSaved();
  }, [fund.schemeCode, user]);

  const handleClick = () => {
    navigate(`/fund/${fund.schemeCode}`);
  };

  const handleSaveFund = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking save button

    // Check if user is authenticated
    if (!user) {
      showToast("error", "Please login to save funds");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      const fundToSave = {
        schemeCode: fund.schemeCode,
        schemeName: fund.schemeName,
        savedAt: new Date().toISOString(),
        currentNav: fund.nav,
      };

      await savedFundsApi.saveFund(fundToSave);
      setIsSaved(true);
      showToast("success", "Fund saved successfully!");
    } catch (err) {
      console.error("Error saving fund:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save fund";

      // Handle authentication errors
      if (
        errorMessage.includes("not authenticated") ||
        errorMessage.includes("401")
      ) {
        showToast("error", "Please login to save funds");
        navigate("/login");
      } else {
        showToast("error", errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-black border-2 border-white/20 rounded-xl p-6 hover:border-white/40 hover:bg-white/5 transition-all duration-300 cursor-pointer group backdrop-blur-sm shadow-lg hover:shadow-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white group-hover:text-blue-200 transition-colors duration-300 line-clamp-2 leading-tight">
          {fund.schemeName}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSaveFund}
            disabled={saving || isSaved || checkingSaved}
            className={`p-2 rounded-lg border transition-all duration-300 ${
              isSaved
                ? "bg-red-500/20 border-red-500/30 text-red-400"
                : "bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isSaved ? "Fund already saved" : "Save fund"}
          >
            {saving || checkingSaved ? (
              <LoadingSpinner size="sm" />
            ) : isSaved ? (
              <Heart className="w-4 h-4 fill-current" />
            ) : (
              <Save className="w-4 h-4" />
            )}
          </button>
          <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30 group-hover:scale-110 transition-transform duration-300">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0" />
          </div>
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
            className="w-full px-3 py-1 bg-gradient-to-r from-white to-blue-400 hover:from-white/90 hover:to-blue-500 rounded-lg text-black font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 border border-white"
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
