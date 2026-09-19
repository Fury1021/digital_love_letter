"use client";

import React, { useState, useEffect } from "react";
import { LoveLetter } from "@/types/letter";
import { getFontClass } from "@/config/fonts";
import { getThemeConfig, getBackgroundConfig } from "@/config/themes";
import { LetterDecorationsOverlay } from "./Decorations";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";

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

  const [activePage, setActivePage] = useState(0);

  // Reset to first page if letter content changes
  useEffect(() => {
    setActivePage(0);
  }, [letter.content]);

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

  // Determine pages: explicit '---' page break, or substantial full-page grouping (1-4 pages)
  const rawContent = letter.content || "";
  let pages: string[][] = [];

  if (rawContent.includes("\n---\n") || rawContent.includes("\n---")) {
    const sections = rawContent.split(/\n---\n?/);
    pages = sections
      .map((sec) => sec.split(/\n\n+/).filter((p) => p.trim().length > 0))
      .filter((sec) => sec.length > 0);
  } else {
    const allParagraphs = rawContent
      .split(/\n\n+/)
      .filter((p) => p.trim().length > 0);

    // Keep moderate letters (< 1200 characters or <= 4 paragraphs) on 1 full stationery page
    if (rawContent.length < 1200 || allParagraphs.length <= 4) {
      pages = [allParagraphs];
    } else {
      // For longer letters, accumulate substantial content per page (~1000-1400 chars, 3-5 paragraphs)
      const chunked: string[][] = [];
      let currentPage: string[] = [];
      let currentChars = 0;

      for (const para of allParagraphs) {
        if (
          currentPage.length >= 3 &&
          currentChars + para.length > 1200 &&
          chunked.length < 3
        ) {
          chunked.push(currentPage);
          currentPage = [para];
          currentChars = para.length;
        } else {
          currentPage.push(para);
          currentChars += para.length;
        }
      }

      if (currentPage.length > 0) {
        chunked.push(currentPage);
      }
      pages = chunked;
    }
  }

  // Fallback for empty letter
  if (pages.length === 0) {
    pages = [[]];
  }

  const totalPages = pages.length;
  const isMultiPage = totalPages > 1;
  const currentPageParagraphs = isPrintMode
    ? rawContent.split(/\n\n+/).filter((p) => p.trim().length > 0)
    : pages[activePage] || [];

  const isFirstPage = activePage === 0;
  const isLastPage = activePage === totalPages - 1;

  return (
    <div
      id={id}
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      className={`protect-letter select-none relative w-full max-w-2xl mx-auto rounded-3xl p-8 sm:p-12 md:p-16 transition-all duration-300 ${
        background.cssClass
      } ${isPrintMode ? "shadow-none border border-zinc-200" : "shadow-paper-lg border"}`}
      style={{
        borderColor: theme.borderColor,
        color: theme.textColor,
        userSelect: "none",
        WebkitUserSelect: "none",
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

      {/* Letter Header Motif (always on page 1 or print mode) */}
      {(isFirstPage || isPrintMode) && (
        <div className="flex flex-col items-center justify-center mb-8 relative z-10 animate-in fade-in duration-300">
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
          <div
            className="w-24 h-[1px] my-5 opacity-40"
            style={{ backgroundColor: theme.accentColor }}
          />
        </div>
      )}

      {/* Subsequent pages header indicator */}
      {!isFirstPage && !isPrintMode && (
        <div className="flex items-center justify-between border-b border-dashed pb-3 mb-6 relative z-10 opacity-60 text-xs font-sans">
          <span>{letter.recipient || "My Dearest"}</span>
          <span>Page {activePage + 1} of {totalPages}</span>
        </div>
      )}

      {/* Letter Main Content Body */}
      <div
        className={`flex flex-col space-y-6 sm:space-y-8 relative z-10 transition-all min-h-[160px] ${
          alignmentClasses[letter.alignment || "center"]
        } ${fontSizeClasses[letter.fontSize || "base"]} ${fontClass}`}
      >
        {currentPageParagraphs.length > 0 ? (
          currentPageParagraphs.map((paragraph, index) => (
            <p
              key={index}
              className="max-w-prose whitespace-pre-line tracking-wide animate-in fade-in duration-300"
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

      {/* Letter Footer / Sender Signature (on last page or print mode) */}
      {(isLastPage || isPrintMode) && (
        <div
          className={`mt-12 sm:mt-16 pt-6 border-t border-dashed flex flex-col relative z-10 animate-in fade-in duration-300 ${
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
      )}

      {/* Interactive Page Navigation Bar (when letter has multiple pages) */}
      {isMultiPage && !isPrintMode && (
        <div className="mt-8 pt-4 border-t border-rose-100/60 flex items-center justify-between relative z-20 text-xs font-sans">
          <button
            type="button"
            onClick={() => setActivePage((p) => Math.max(0, p - 1))}
            disabled={isFirstPage}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${
              isFirstPage
                ? "opacity-30 cursor-not-allowed border-transparent text-zinc-400"
                : "bg-white/80 hover:bg-white text-zinc-700 hover:text-rose-700 border-rose-200 shadow-xs"
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous Page</span>
          </button>

          <span className="font-serif italic text-sm text-zinc-500">
            Page {activePage + 1} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setActivePage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={isLastPage}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border transition-all ${
              isLastPage
                ? "opacity-30 cursor-not-allowed border-transparent text-zinc-400"
                : "bg-white/80 hover:bg-white text-zinc-700 hover:text-rose-700 border-rose-200 shadow-xs"
            }`}
          >
            <span>Next Page</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
