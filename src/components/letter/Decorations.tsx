"use client";

import React from "react";
import { Heart, Sparkles } from "lucide-react";
import { LetterDecorations } from "@/types/letter";

interface DecorationsProps {
  decorations: LetterDecorations;
  themeAccentColor?: string;
  className?: string;
}

export const LetterDecorationsOverlay: React.FC<DecorationsProps> = ({
  decorations,
  themeAccentColor = "#E11D48",
  className = "",
}) => {
  const { hearts, roses, sparkles } = decorations;

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* Top Left Corner Flourish */}
      <div className="absolute top-4 left-4 opacity-40 transition-opacity">
        {hearts && (
          <Heart
            className="w-5 h-5"
            style={{ color: themeAccentColor, fill: `${themeAccentColor}33` }}
          />
        )}
      </div>

      {/* Top Right Corner Flourish */}
      <div className="absolute top-4 right-4 opacity-40 transition-opacity">
        {sparkles && (
          <Sparkles
            className="w-5 h-5 text-amber-400"
            style={{ color: themeAccentColor }}
          />
        )}
      </div>

      {/* Bottom Left Corner Rose/Heart */}
      <div className="absolute bottom-4 left-4 opacity-40 transition-opacity">
        {roses ? (
          <span className="text-base" role="img" aria-label="rose">
            🌹
          </span>
        ) : hearts ? (
          <Heart
            className="w-4 h-4"
            style={{ color: themeAccentColor, fill: `${themeAccentColor}22` }}
          />
        ) : null}
      </div>

      {/* Bottom Right Corner */}
      <div className="absolute bottom-4 right-4 opacity-40 transition-opacity">
        {sparkles && (
          <Sparkles
            className="w-4 h-4"
            style={{ color: themeAccentColor }}
          />
        )}
      </div>

      {/* Subtle floating background elements */}
      {hearts && (
        <>
          <div
            className="absolute top-1/4 -left-2 opacity-20 transform -rotate-12 motion-safe:animate-float-slow"
            style={{ color: themeAccentColor }}
          >
            <Heart className="w-8 h-8 fill-current" />
          </div>
          <div
            className="absolute bottom-1/3 -right-2 opacity-15 transform rotate-12 motion-safe:animate-float-reverse"
            style={{ color: themeAccentColor }}
          >
            <Heart className="w-10 h-10 fill-current" />
          </div>
        </>
      )}

      {roses && (
        <div className="absolute top-1/3 right-3 opacity-25 text-sm motion-safe:animate-float-slow">
          🥀
        </div>
      )}
    </div>
  );
};

export const FloatingBackgroundHearts: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none opacity-40"
      aria-hidden="true"
    >
      <div className="absolute top-12 left-[10%] text-rose-300 motion-safe:animate-float-slow">
        <Heart className="w-6 h-6 fill-rose-200/50" />
      </div>
      <div className="absolute top-1/3 right-[12%] text-pink-300 motion-safe:animate-float-reverse" style={{ animationDelay: "1s" }}>
        <Heart className="w-8 h-8 fill-pink-100/60" />
      </div>
      <div className="absolute bottom-1/4 left-[15%] text-rose-200 motion-safe:animate-float-slow" style={{ animationDelay: "2s" }}>
        <Heart className="w-5 h-5 fill-rose-100" />
      </div>
      <div className="absolute bottom-16 right-[20%] text-rose-300 motion-safe:animate-float-reverse" style={{ animationDelay: "3s" }}>
        <Heart className="w-7 h-7 fill-pink-200/40" />
      </div>
      <div className="absolute top-1/2 left-[5%] text-amber-200 motion-safe:animate-float-slow" style={{ animationDelay: "1.5s" }}>
        <Sparkles className="w-5 h-5 text-rose-300/60" />
      </div>
    </div>
  );
};
