"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { LetterDecorations } from "@/types/letter";

interface DecorationSelectorProps {
  decorations: LetterDecorations;
  onChangeDecorations: (decorations: LetterDecorations) => void;
}

export const DecorationSelector: React.FC<DecorationSelectorProps> = ({
  decorations,
  onChangeDecorations,
}) => {
  const toggleDecoration = (key: keyof LetterDecorations) => {
    onChangeDecorations({
      ...decorations,
      [key]: !decorations[key],
    });
  };

  const options: {
    key: keyof LetterDecorations;
    label: string;
    icon: React.ReactNode;
    desc: string;
  }[] = [
    {
      key: "hearts",
      label: "Hearts",
      icon: <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />,
      desc: "Watermark motifs",
    },
    {
      key: "roses",
      label: "Roses",
      icon: <span className="text-base leading-none">🌹</span>,
      desc: "Corner flourish",
    },
    {
      key: "sparkles",
      label: "Sparkles",
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
      desc: "Subtle shimmer",
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>Decorative Flourishes</span>
      </label>

      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {options.map((opt) => {
          const isActive = decorations[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggleDecoration(opt.key)}
              className={`p-2.5 sm:p-3 text-left rounded-xl border transition-all flex flex-col justify-between min-w-0 overflow-hidden relative ${
                isActive
                  ? "bg-rose-50/80 border-rose-400 ring-2 ring-rose-400/20 shadow-xs"
                  : "bg-white border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/30 opacity-70"
              }`}
            >
              {/* Top Row: Icon & Checkmark indicator */}
              <div className="flex items-center justify-between w-full mb-2">
                <div className="shrink-0 flex items-center justify-center">
                  {opt.icon}
                </div>

                {/* Checkbox Badge */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? "bg-rose-600 border-rose-600 text-white"
                      : "border-zinc-300 bg-white"
                  }`}
                >
                  {isActive && (
                    <svg
                      className="w-2.5 h-2.5 text-white stroke-[3]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>

              {/* Bottom Row: Label & Description */}
              <div className="min-w-0 w-full">
                <div className="text-xs font-medium text-zinc-800 truncate">
                  {opt.label}
                </div>
                <div className="text-[10px] sm:text-[11px] text-zinc-500 truncate mt-0.5">
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
