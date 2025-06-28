import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, TrendingUp, Calendar, ArrowLeft, Save } from "lucide-react";
import { mutualFundsApi, savedFundsApi } from "../utils/api";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { MutualFundDetail, SavedFund } from "../types";

const FundDetail: React.FC = () => {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const [fundDetail, setFundDetail] = useState<MutualFundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (schemeCode) {
      loadFundDetail();
      checkIfSaved();
    }
  }, [schemeCode]);

  const loadFundDetail = async () => {
    if (!schemeCode) return;

    setLoading(true);
    setError(null);

    try {
      const detail = await mutualFundsApi.getFundDetails(schemeCode);
      setFundDetail(detail);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load fund details";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!schemeCode) return;

    try {
      const saved = await savedFundsApi.isFundSaved(schemeCode);
      setIsSaved(saved);
    } catch (err) {
      console.error("Error checking if fund is saved:", err);
    }
  };

  const handleSaveFund = async () => {
    if (!fundDetail || !schemeCode) return;

    setSaving(true);
    try {
      const fundToSave: SavedFund = {
        schemeCode: fundDetail.schemeCode,
        schemeName: fundDetail.schemeName,
        savedAt: new Date().toISOString(),
        currentNav: fundDetail.nav,
      };

      await savedFundsApi.saveFund(fundToSave);
      setIsSaved(true);
      showToast(
        "success",
        "Fund saved successfully! You can view it in your saved funds."
      );
    } catch (err) {
      console.error("Error saving fund:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save fund";
      showToast("error", errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFund = async () => {
    if (!schemeCode) return;

    try {
      await savedFundsApi.removeFund(schemeCode);
      setIsSaved(false);
      showToast("success", "Fund removed from saved list successfully");
    } catch (err) {
      console.error("Error removing fund:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove fund";
      showToast("error", errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" text="Loading fund details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-white">Fund Details</h1>
        </div>
        <ErrorMessage message={error} onRetry={loadFundDetail} />
      </div>
    );
  }

  if (!fundDetail) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 text-xl">Fund not found</p>
      </div>
    );
  }

  const latestNav = fundDetail.data?.[0]?.nav || fundDetail.nav;
  const navDate = fundDetail.data?.[0]?.date || fundDetail.date;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-colors duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white line-clamp-2">
              {fundDetail.schemeName}
            </h1>
            <p className="text-gray-400 text-sm">
              Scheme Code: {fundDetail.schemeCode}
            </p>
          </div>
        </div>

        <button
          onClick={isSaved ? handleRemoveFund : handleSaveFund}
          disabled={saving}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 border ${
            isSaved
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 hover:border-red-500/50"
              : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 hover:border-blue-500/50"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? (
            <LoadingSpinner size="sm" />
          ) : isSaved ? (
            <>
              <Heart className="w-4 h-4 fill-current" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Fund</span>
            </>
          )}
        </button>
      </div>

      {/* Fund Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current NAV */}
        <div className="bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Current NAV</h2>
          </div>
          <div className="space-y-4">
            <div className="text-3xl font-bold text-green-400 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              ₹{latestNav}
            </div>
            <div className="text-sm text-gray-400">
              As of {new Date(navDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Fund Information */}
        <div className="bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Fund Information
            </h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Fund House</span>
              <span className="text-white font-medium">
                {fundDetail.meta?.fund_house || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Scheme Type</span>
              <span className="text-white font-medium">
                {fundDetail.meta?.scheme_type || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Category</span>
              <span className="text-white font-medium">
                {fundDetail.meta?.scheme_category || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Start Date</span>
              <span className="text-white font-medium">
                {fundDetail.meta?.scheme_start_date?.date
                  ? new Date(
                      fundDetail.meta.scheme_start_date.date
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Data */}
      {fundDetail.data && fundDetail.data.length > 0 && (
        <div className="bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-white mb-6">
            Recent NAV History
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {fundDetail.data.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-gray-300 font-medium">
                    {new Date(item.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-400">
                  ₹{item.nav}
                </span>
              </div>
            ))}
          </div>
          {fundDetail.data.length > 10 && (
            <p className="text-gray-400 text-sm mt-4 text-center">
              Showing last 10 entries of {fundDetail.data.length} total entries
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FundDetail;
