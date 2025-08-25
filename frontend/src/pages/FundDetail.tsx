import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Heart,
  TrendingUp,
  TrendingDown,
  Calendar,
  ArrowLeft,
  Save,
} from "lucide-react";
import { mutualFundsApi, savedFundsApi } from "../utils/api";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import type { MutualFundDetail, SavedFund } from "../types";

// ✅ Recharts imports
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

// Chart data type
interface ChartDataPoint {
  date: string;
  nav: number;
}

// Performance metrics type
interface PerformanceMetrics {
  current: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  isPositive: boolean;
}

// ...existing code...
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-600 shadow-lg">
        <p className="text-gray-300 text-sm">{parseDate(label)}</p>
        <p className="text-green-400 font-semibold">
          NAV: ₹{payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

const parseDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  try {
    if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
      const [day, month, year] = dateString.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString();
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString();
  } catch {
    return "Invalid Date";
  }
};

const FundDetail: React.FC = () => {
  const { schemeCode } = useParams<{ schemeCode: string }>();
  const [fundDetail, setFundDetail] = useState<MutualFundDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [chartPeriod, setChartPeriod] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d"
  );
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Calculate performance metrics
  const calculateMetrics = (
    data: ChartDataPoint[]
  ): PerformanceMetrics | null => {
    if (data.length === 0) return null;

    const current = data[data.length - 1].nav;
    const previous = data[0].nav;
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    const high = Math.max(...data.map((d) => d.nav));
    const low = Math.min(...data.map((d) => d.nav));

    return {
      current,
      change,
      changePercent,
      high,
      low,
      isPositive: change >= 0,
    };
  };

  // Prepare chart data based on period with smart sampling
  const prepareChartData = (
    fundData: { date: string; nav: string | number }[],
    period: string
  ): ChartDataPoint[] => {
    if (!fundData || fundData.length === 0) return [];

    let filteredData = [...fundData];
    let sampleRate = 1; // How many days to skip between data points

    // Filter data based on period and set appropriate sampling
    switch (period) {
      case "7d":
        filteredData = fundData.slice(0, 7);
        sampleRate = 1; // Show every day
        break;
      case "30d":
        filteredData = fundData.slice(0, 30);
        sampleRate = 1; // Show every day
        break;
      case "90d":
        filteredData = fundData.slice(0, 90);
        sampleRate = 2; // Show every 2nd day
        break;
      case "1y":
        filteredData = fundData.slice(0, 365);
        sampleRate = 7; // Show weekly data points (every 7th day)
        break;
      default:
        filteredData = fundData.slice(0, 30);
        sampleRate = 1;
    }

    // Apply sampling to reduce data points for better readability
    const sampledData = filteredData.filter(
      (_, index) => index % sampleRate === 0
    );

    return sampledData
      .map((item) => ({
        date: item.date,
        nav:
          typeof item.nav === "string" ? parseFloat(item.nav) || 0 : item.nav,
      }))
      .reverse(); // Reverse to show chronological order
  };

  // Load fund details
  const loadFundDetail = React.useCallback(async () => {
    if (!schemeCode) return;
    setLoading(true);
    setError(null);

    try {
      const detail = await mutualFundsApi.getFundDetails(schemeCode);
      setFundDetail(detail);

      // Prepare chart data and metrics
      if (detail.data && detail.data.length > 0) {
        const chartData = prepareChartData(detail.data, chartPeriod);
        setChartData(chartData);
        setMetrics(calculateMetrics(chartData));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load fund details";
      setError(errorMessage);
      showToast("error", errorMessage);
    } finally {
      setLoading(false);
    }
  }, [schemeCode, showToast, chartPeriod]);

  // Check if fund is saved
  const checkIfSaved = React.useCallback(async () => {
    if (!schemeCode) return;
    try {
      const saved = await savedFundsApi.isFundSaved(schemeCode);
      setIsSaved(saved);
    } catch (err) {
      console.error("Error checking if fund is saved:", err);
    }
  }, [schemeCode]);

  // Update chart data when period changes
  useEffect(() => {
    if (fundDetail?.data && fundDetail.data.length > 0) {
      const newChartData = prepareChartData(fundDetail.data, chartPeriod);
      setChartData(newChartData);
      setMetrics(calculateMetrics(newChartData));
    }
  }, [chartPeriod, fundDetail]);

  // Load data on mount
  useEffect(() => {
    if (schemeCode) {
      loadFundDetail();
      checkIfSaved();
    }
  }, [schemeCode, loadFundDetail, checkIfSaved]);

  const handleSaveFund = async () => {
    if (!fundDetail || !schemeCode) return;
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("error", "Please login to save funds");
        navigate("/login");
        return;
      }

      const latestNav = fundDetail.data?.[0]?.nav || fundDetail.nav || "0";
      const fundSchemeCode =
        fundDetail.schemeCode || fundDetail.meta?.scheme_code || schemeCode;
      const fundSchemeName =
        fundDetail.schemeName || fundDetail.meta?.scheme_name || "Unknown Fund";

      const fundToSave: SavedFund = {
        schemeCode: fundSchemeCode,
        schemeName: fundSchemeName,
        currentNav: String(latestNav),
        savedAt: new Date().toISOString(),
      };

      await savedFundsApi.saveFund(fundToSave);

      setIsSaved(true);
      showToast("success", "Fund saved successfully!");
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
              As of {parseDate(navDate)}
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
                  ? parseDate(fundDetail.meta.scheme_start_date.date)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-black border-2 border-white/20 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-4xl font-bold text-white">
                ₹{latestNav}
              </span>
              {metrics && (
                <div
                  className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                    metrics.isPositive
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {metrics.isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-semibold">
                    {metrics.isPositive ? "+" : ""}₹{metrics.change.toFixed(2)}{" "}
                    ({metrics.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
            <p className="text-gray-400 mt-2">As of {parseDate(navDate)}</p>
          </div>

          {/* Period Selector */}
          <div className="flex space-x-2">
            {(["7d", "30d", "90d", "1y"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setChartPeriod(period)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  chartPeriod === period
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {period.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Professional Chart */}
        {chartData.length > 0 && (
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="navGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = parseDate(value);
                    return date.split("/").slice(0, 2).join("/");
                  }}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <YAxis
                  domain={["dataMin - 1", "dataMax + 1"]}
                  tickFormatter={(value) => `₹${value.toFixed(0)}`}
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#4B5563" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="nav"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#navGradient)"
                  dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{
                    r: 6,
                    fill: "#10B981",
                    stroke: "#065F46",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance Metrics */}
        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">Current NAV</div>
              <div className="text-xl font-bold text-green-400">
                ₹{metrics.current.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">
                {chartPeriod.toUpperCase()} Change
              </div>
              <div
                className={`text-xl font-bold ${
                  metrics.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {metrics.isPositive ? "+" : ""}₹{metrics.change.toFixed(2)}
              </div>
              <div
                className={`text-sm ${
                  metrics.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                ({metrics.changePercent.toFixed(2)}%)
              </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">High</div>
              <div className="text-xl font-bold text-blue-400">
                ₹{metrics.high.toFixed(2)}
              </div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50">
              <div className="text-sm text-gray-400 mb-1">Low</div>
              <div className="text-xl font-bold text-orange-400">
                ₹{metrics.low.toFixed(2)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Data Table */}
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
                    {parseDate(item.date)}
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
