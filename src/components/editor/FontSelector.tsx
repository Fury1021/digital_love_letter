"use client";

import React from "react";
import { Type } from "lucide-react";
import { LetterFont } from "@/types/letter";
import { FONT_OPTIONS } from "@/config/fonts";

interface FontSelectorProps {
  selectedFont: LetterFont;
  onChangeFont: (font: LetterFont) => void;
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFont,
  onChangeFont,
}) => {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5">
        <Type className="w-3.5 h-3.5 text-rose-500" />
        <span>Handwritten & Heading Font</span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {FONT_OPTIONS.map((option) => {
          const isSelected = selectedFont === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeFont(option.id)}
              className={`p-3 text-left rounded-xl border transition-all relative group ${
                isSelected
                  ? "bg-rose-50/80 border-rose-500 ring-2 ring-rose-400/20 shadow-sm"
                  : "bg-white border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/30"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-sans font-medium text-zinc-700">
                  {option.name}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                )}
              </div>
              <p
                className={`text-xl text-zinc-900 truncate leading-snug ${option.className}`}
              >
                {option.sampleText}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
