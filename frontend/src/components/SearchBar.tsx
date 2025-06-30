import React, { useState, useRef, useEffect } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import type { MutualFund } from "../types";
import { mutualFundsApi } from "../utils/api";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onClear, loading }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MutualFund[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<number | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = window.setTimeout(async () => {
      if (value.trim().length > 0) {
        try {
          const results = await mutualFundsApi.searchFunds(value);
          setSuggestions(results.slice(0, 10));
          setShowSuggestions(true);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);

    setTypingTimeout(timeout);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (fundName: string) => {
    setQuery(fundName);
    onSearch(fundName);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    if (onClear) onClear();
  };

  return (
    <div ref={searchRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          <span className="absolute left-0 pl-4 flex items-center h-full">
            <Search className="w-10 h-10 text-gray-400 mr-2" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search mutual funds..."
            className="w-full pl-12 pr-12 py-4 bg-black border-2 border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all duration-300 text-lg backdrop-blur-sm"
            disabled={loading}
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-white/20 rounded-xl shadow-2xl backdrop-blur-sm z-50 overflow-hidden">
          <div className="py-2">
            {suggestions.map((fund, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(fund.schemeName)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors duration-200 flex items-center space-x-3 group"
              >
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-blue-400 transition-colors">
                  {fund.schemeName}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
