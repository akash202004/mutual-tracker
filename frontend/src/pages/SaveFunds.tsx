import React, { useState, useEffect } from "react";
import { Heart, Trash2, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { savedFundsApi } from "../utils/api";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { SavedFund } from "../types";

const SavedFunds: React.FC = () => {
  const [savedFunds, setSavedFunds] = useState<SavedFund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedFunds();
  }, []);

  const loadSavedFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const funds = await savedFundsApi.getSavedFunds();
      setSavedFunds(funds);
    } catch (err) {
      console.error("Error loading saved funds:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load saved funds";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFund = async (schemeCode: string) => {
    setRemoving(schemeCode);
    try {
      await savedFundsApi.removeFund(schemeCode);
      setSavedFunds((prev) =>
        prev.filter((fund) => fund.schemeCode !== schemeCode)
      );
      showToast("success", "Fund removed from saved list successfully");
    } catch (err) {
      console.error("Error removing fund:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove fund";
      showToast("error", errorMessage);
    } finally {
      setRemoving(null);
    }
  };

  const handleFundClick = (schemeCode: string) => {
    navigate(`/fund/${schemeCode}`);
  };

  const handleRetry = () => {
    setError(null);
    loadSavedFunds();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" text="Loading saved funds..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4 bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="p-3 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-xl border border-red-500/30">
            <Heart className="w-8 h-8 text-red-400 fill-current" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Saved Mutual Funds
          </h1>
        </div>
        <ErrorMessage message={error} onRetry={handleRetry} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4 bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="p-3 bg-gradient-to-br from-blue-500/20 to-pink-500/20 rounded-xl border border-blue-500/30">
          <Heart className="w-8 h-8 text-blue-400 fill-current" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Saved Mutual Funds
        </h1>
      </div>

      {savedFunds.length === 0 ? (
        <div className="text-center py-16 bg-black border-2 border-white/20 rounded-xl backdrop-blur-sm shadow-2xl">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 inline-block mb-6">
            <Heart className="w-20 h-20 text-gray-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-300 mb-4">
            No saved funds yet
          </h2>
          <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-md mx-auto">
            Start by searching and saving mutual funds you're interested in
            tracking.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 border border-blue-500/30 shadow-lg hover:shadow-xl"
          >
            Search Mutual Funds
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
            <p className="text-gray-400 text-lg">
              {savedFunds.length} fund{savedFunds.length !== 1 ? "s" : ""} saved
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {savedFunds.map((fund) => (
              <div
                key={fund.schemeCode}
                className="bg-black border-2 border-white/20 rounded-xl p-6 hover:border-white/40 transition-all duration-300 group backdrop-blur-sm shadow-lg hover:shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <h3
                    onClick={() => handleFundClick(fund.schemeCode)}
                    className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300 cursor-pointer line-clamp-2 flex-1 mr-4 leading-tight"
                  >
                    {fund.schemeName}
                  </h3>
                  <button
                    onClick={() => handleRemoveFund(fund.schemeCode)}
                    disabled={removing === fund.schemeCode}
                    className="text-gray-400 hover:text-red-400 transition-colors duration-300 p-2 hover:bg-red-500/10 rounded-lg border border-white/10 hover:border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Remove from saved"
                  >
                    {removing === fund.schemeCode ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  {fund.currentNav && (
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                      <span className="text-gray-400 text-sm flex items-center space-x-2 font-medium">
                        <TrendingUp className="w-4 h-4" />
                        <span>Current NAV</span>
                      </span>
                      <span className="text-xl font-bold text-green-400 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        ₹{fund.currentNav}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                    <span className="text-gray-400 text-sm flex items-center space-x-2 font-medium">
                      <Calendar className="w-4 h-4" />
                      <span>Saved on</span>
                    </span>
                    <span className="text-sm text-gray-300 font-medium">
                      {fund.savedAt ? new Date(fund.savedAt).toLocaleDateString() : "Unknown"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t-2 border-white/10">
                  <button
                    onClick={() => handleFundClick(fund.schemeCode)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 border border-white/20 hover:border-white/30"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedFunds;
