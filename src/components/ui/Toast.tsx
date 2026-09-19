"use client";

import React, { useEffect } from "react";
import { CheckCircle2, Heart, Info, AlertCircle } from "lucide-react";

export interface ToastProps {
  message: string;
  type?: "success" | "love" | "info" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "love",
  isVisible,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    love: <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-heartbeat" />,
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    info: <Info className="w-4 h-4 text-blue-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  const bgStyles = {
    love: "bg-white/95 text-zinc-800 border-rose-200 shadow-rose-500/10",
    success: "bg-white/95 text-zinc-800 border-emerald-200 shadow-emerald-500/10",
    info: "bg-white/95 text-zinc-800 border-blue-200 shadow-blue-500/10",
    error: "bg-white/95 text-zinc-800 border-red-200 shadow-red-500/10",
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto flex items-center gap-2.5 px-5 py-3 rounded-full border shadow-xl backdrop-blur-md text-sm font-medium ${bgStyles[type]} animate-in fade-in slide-in-from-bottom-4 duration-300`}
        role="status"
        aria-live="polite"
      >
        {icons[type]}
        <span>{message}</span>
      </div>
    </div>
  );
};
