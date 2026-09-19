"use client";

import React from "react";
import { Palette, Layers } from "lucide-react";
import { LetterTheme, LetterBackground } from "@/types/letter";
import { THEME_OPTIONS, BACKGROUND_OPTIONS } from "@/config/themes";

interface ThemeSelectorProps {
  selectedTheme: LetterTheme;
  onChangeTheme: (theme: LetterTheme) => void;
  selectedBackground: LetterBackground;
  onChangeBackground: (bg: LetterBackground) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onChangeTheme,
  selectedBackground,
  onChangeBackground,
}) => {
  return (
    <div className="space-y-4">
      {/* Theme Choice */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-rose-500" />
          <span>Romantic Color Theme</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {THEME_OPTIONS.map((theme) => {
            const isSelected = selectedTheme === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChangeTheme(theme.id)}
                className={`p-2.5 text-left rounded-xl border transition-all flex items-center gap-2.5 min-w-0 overflow-hidden ${
                  isSelected
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-400/20 shadow-sm"
                    : "bg-white border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/30"
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                  style={{ backgroundColor: theme.previewColor }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-zinc-800 truncate">
                    {theme.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paper Background Choice */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-rose-500" />
          <span>Paper Stationery Texture</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {BACKGROUND_OPTIONS.map((bg) => {
            const isSelected = selectedBackground === bg.id;
            return (
              <button
                key={bg.id}
                type="button"
                onClick={() => onChangeBackground(bg.id)}
                className={`p-2.5 text-left rounded-xl border transition-all flex items-center gap-2.5 min-w-0 overflow-hidden ${
                  isSelected
                    ? "bg-rose-50 border-rose-500 ring-2 ring-rose-400/20 shadow-sm"
                    : "bg-white border-zinc-200/80 hover:border-rose-200 hover:bg-rose-50/30"
                }`}
              >
                <div className={`w-5 h-5 rounded-md border border-zinc-200 shrink-0 shadow-xs ${bg.cssClass}`} />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-zinc-800 truncate">
                    {bg.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
