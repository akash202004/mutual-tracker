import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, X, AlertCircle, Info } from "lucide-react";
import type { ToastType } from "../types";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 5000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getToastStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500/30",
          text: "text-green-400",
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        };
      case "error":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          text: "text-red-400",
          icon: <XCircle className="w-5 h-5 text-red-400" />,
        };
      case "warning":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          text: "text-yellow-400",
          icon: <AlertCircle className="w-5 h-5 text-yellow-400" />,
        };
      case "info":
        return {
          bg: "bg-blue-500/20",
          border: "border-blue-500/30",
          text: "text-blue-400",
          icon: <Info className="w-5 h-5 text-blue-400" />,
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className={`${styles.bg} ${styles.border} border-2 rounded-xl p-4 backdrop-blur-sm shadow-2xl max-w-sm`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="flex-1">
            <p className={`${styles.text} text-sm font-medium`}>{message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
