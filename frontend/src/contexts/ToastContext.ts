import { createContext } from "react";
import type { ToastType } from "../types";

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
