import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 bg-black rounded-xl border-2 border-red-500/30 backdrop-blur-sm shadow-2xl">
      <div className="flex items-center space-x-3 text-red-400">
        <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/30">
          <AlertCircle className="w-8 h-8" />
        </div>
        <span className="text-xl font-semibold">Error</span>
      </div>
      <p className="text-gray-300 text-center text-lg leading-relaxed max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium transition-all duration-300 border border-red-500/30 shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;