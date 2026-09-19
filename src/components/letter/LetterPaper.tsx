"use client";

import React from "react";
import { LoveLetter } from "@/types/letter";
import { getFontClass } from "@/config/fonts";
import { getThemeConfig, getBackgroundConfig } from "@/config/themes";
import { LetterDecorationsOverlay } from "./Decorations";
import { Heart } from "lucide-react";

interface LetterPaperProps {
  letter: LoveLetter;
  id?: string;
  isPrintMode?: boolean;
}

export const LetterPaper: React.FC<LetterPaperProps> = ({
  letter,
  id = "love-letter-paper",
  isPrintMode = false,
}) => {
  const theme = getThemeConfig(letter.theme);
  const background = getBackgroundConfig(letter.background);
  const fontClass = getFontClass(letter.font);

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const fontSizeClasses = {
    sm: "text-lg sm:text-xl md:text-2xl leading-relaxed",
    base: "text-xl sm:text-2xl md:text-3xl leading-relaxed",
    lg: "text-2xl sm:text-3xl md:text-4xl leading-relaxed",
    xl: "text-3xl sm:text-4xl md:text-5xl leading-relaxed",
  };

  const paragraphs = (letter.content || "")
    .split(/\n\n+/)
    .filter((p) => p.trim().length > 0);

  return (
    <div
      id={id}
      className={`relative w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 md:p-16 transition-all duration-300 ${
        background.cssClass
      } ${isPrintMode ? "shadow-none border border-zinc-200" : "shadow-paper-lg border"}`}
      style={{
        borderColor: theme.borderColor,
        color: theme.textColor,
      }}
    >
      {/* Subtle Inner Framing Border */}
      <div
        className="pointer-events-none absolute inset-3 sm:inset-4 rounded-2xl border border-dashed opacity-40 transition-colors"
        style={{ borderColor: theme.accentColor }}
      />

      {/* Decorative overlays */}
      <LetterDecorationsOverlay
        decorations={letter.decorations}
        themeAccentColor={theme.accentColor}
      />

      {/* Letter Header Motif */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-3 shadow-inner"
          style={{
            backgroundColor: `${theme.accentColor}18`,
            border: `1px solid ${theme.borderColor}`,
          }}
        >
          <Heart
            className="w-5 h-5 transition-transform hover:scale-110"
            style={{ color: theme.titleColor, fill: `${theme.titleColor}33` }}
          />
        </div>

        {/* Recipient Greeting */}
        {letter.recipient && (
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide transition-colors mb-2 ${fontClass}`}
            style={{ color: theme.titleColor }}
          >
            {letter.recipient}
          </h2>
        )}

        {/* Letter Title */}
        {letter.title && (
          <p
            className="text-xs sm:text-sm font-sans uppercase tracking-widest opacity-70 mt-1 font-medium text-center px-4"
            style={{ color: theme.textColor }}
          >
            {letter.title}
          </p>
        )}

        {/* Elegant divider */}
        <div className="w-24 h-[1px] my-5 opacity-40" style={{ backgroundColor: theme.accentColor }} />
      </div>

      {/* Letter Main Content Body */}
      <div
        className={`flex flex-col space-y-6 sm:space-y-8 relative z-10 transition-all ${
          alignmentClasses[letter.alignment || "center"]
        } ${fontSizeClasses[letter.fontSize || "base"]} ${fontClass}`}
      >
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-prose whitespace-pre-line tracking-wide"
              style={{
                textShadow:
                  letter.theme === "midnight"
                    ? "0 0 1px rgba(254, 205, 211, 0.2)"
                    : "none",
              }}
            >
              {paragraph}
            </p>
          ))
        ) : (
          <p className="opacity-40 italic font-sans text-base">
            Your heartfelt words will appear here...
          </p>
        )}
      </div>

      {/* Letter Footer / Sender Signature */}
      <div
        className={`mt-12 sm:mt-16 pt-6 border-t border-dashed flex flex-col relative z-10 ${
          letter.alignment === "left"
            ? "items-start"
            : letter.alignment === "right"
            ? "items-end"
            : "items-center"
        }`}
        style={{ borderColor: `${theme.accentColor}35` }}
      >
        {letter.sender && (
          <div
            className={`text-2xl sm:text-3xl md:text-4xl tracking-wide ${fontClass}`}
            style={{ color: theme.titleColor }}
          >
            {letter.sender}
          </div>
        )}

        {/* Subtle Creation Date */}
        <p
          className="text-[11px] font-sans opacity-50 mt-3 uppercase tracking-wider"
          style={{ color: theme.textColor }}
        >
          {new Date(letter.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};
