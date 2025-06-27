import React, { useState, useRef, useEffect } from 'react';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const popularSuggestions = [
    'SBI Bluechip Fund',
    'HDFC Top 100 Fund',
    'ICICI Prudential Equity',
    'Axis Bluechip Fund',
    'Kotak Standard Multicap',
    'Mirae Asset Large Cap',
    'Nippon India Growth Fund',
    'Franklin India Equity',
    'DSP Equity Fund',
    'Aditya Birla Sun Life Equity'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    if (value.trim().length > 0) {
      const filtered = popularSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions(popularSuggestions.slice(0, 6));
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (query.trim().length === 0) {
      setSuggestions(popularSuggestions.slice(0, 6));
    }
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
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

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-black border-2 border-white/20 rounded-xl shadow-2xl backdrop-blur-sm z-50 overflow-hidden">
          <div className="py-2">
            {query.trim().length === 0 && (
              <div className="px-4 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider border-b border-white/10">
                Popular Searches
              </div>
            )}
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left text-white hover:bg-white/5 transition-colors duration-200 flex items-center space-x-3 group"
              >
                <TrendingUp className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                <span className="group-hover:text-blue-400 transition-colors">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;