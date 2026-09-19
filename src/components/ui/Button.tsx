"use client";

import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  icon,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs gap-1.5 shadow-sm",
    md: "px-5 py-2.5 text-sm gap-2 shadow-sm",
    lg: "px-7 py-3.5 text-base gap-2.5 shadow-md",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-500/25 hover:shadow-rose-500/35 hover:shadow-lg focus:ring-rose-500 border border-rose-500/30",
    secondary:
      "bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200/80 focus:ring-rose-400 hover:border-rose-300",
    outline:
      "bg-white/80 backdrop-blur-sm hover:bg-rose-50/60 text-zinc-700 hover:text-rose-700 border border-zinc-200 hover:border-rose-300 focus:ring-rose-300",
    ghost:
      "bg-transparent hover:bg-rose-50 text-zinc-600 hover:text-rose-700 focus:ring-rose-300",
    danger:
      "bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 focus:ring-red-400",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};
