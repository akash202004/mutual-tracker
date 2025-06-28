import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import type { MutualFund } from "../types";
import { mutualFundsApi, savedFundsApi } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { ArrowLeft } from "lucide-react";

const FundDetail: React.FC = () => {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fund, setFund] = useState<MutualFund | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savingLoading, setSavingLoading] = useState(false);

  useEffect(() => {
    if (schemeCode) {
      fetchFundDetails();
      setIsSaved(savedFundsApi.isFundSaved(schemeCode));
    }
  });

  const fetchFundDetails = async () => {
    if (!schemeCode) return;

    setLoading(true);
    setError(null);

    try {
      const data = await mutualFundsApi.getFundDetails(schemeCode);
      setFund(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch fund details"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user || !fund || !schemeCode) {
      navigate("/login");
      return;
    }

    setSavingLoading(true);

    try {
      if (isSaved) {
        savedFundsApi.saveFund(schemeCode);
        setIsSaved(false);
      } else {
        savedFundsApi.saveFund({
          schemeCode: schemeCode,
          schemeName: fund.schemeName,
          userId: user.id,
        });
      }
      setIsSaved(true);
    } finally {
      setSavingLoading(false);
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
    return <ErrorMessage message={error} onRetry={fetchFundDetail} />;
  }

  if (!fund) {
    return <ErrorMessage message="Fund not found" />;
  }

  const currentNav = fund.data[0];
  const previousNav = fund.data[1];
  const navChange = previousNav
    ? parseFloat(currentNav.nav) - parseFloat(previousNav.nav)
    : 0;
  const navChangePercent = previousNav
    ? (navChange / parseFloat(previousNav.nav)) * 100
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-300 px-4 py-2 bg-black border-2 border-white/20 hover:border-white/40 rounded-xl backdrop-blur-sm"
        >
          {" "}
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-black border-2 border-white/20 roundex-xl p-8 backdrop-blur-sm shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-6 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {fund.schemeName}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundDetail;
