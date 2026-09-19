"use client";

import React, { useState } from "react";
import { LoveLetter } from "@/types/letter";
import { LetterPaper } from "./LetterPaper";
import { Button } from "../ui/Button";
import { Download, Share2, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { generateLetterPDF } from "@/lib/pdf-generator";

interface LetterPreviewProps {
  letter: LoveLetter;
  onShareClick?: () => void;
  showActions?: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  letter,
  onShareClick,
  showActions = true,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateLetterPDF("love-letter-preview-paper", {
        title: letter.title || "digital-love-letter",
      });
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 120));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 80));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Preview Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-md rounded-2xl border border-rose-100 mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
            Live Preview
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom controls */}
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-zinc-400 font-mono w-10 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-rose-100">
              <Button
                variant="outline"
                size="sm"
                icon={<Download className="w-3.5 h-3.5" />}
                onClick={handleDownloadPDF}
                isLoading={isDownloading}
              >
                PDF
              </Button>
              {onShareClick && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Share2 className="w-3.5 h-3.5" />}
                  onClick={onShareClick}
                >
                  Share
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Canvas Container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 rounded-2xl bg-rose-50/50 border border-rose-100/60 flex items-start justify-center">
        <div
          className="w-full transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          <LetterPaper letter={letter} id="love-letter-preview-paper" />
        </div>
      </div>

      {/* Mobile action bar */}
      {showActions && (
        <div className="sm:hidden flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="md"
            className="flex-1"
            icon={<Download className="w-4 h-4" />}
            onClick={handleDownloadPDF}
            isLoading={isDownloading}
          >
            Download PDF
          </Button>
          {onShareClick && (
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={onShareClick}
            >
              Share Letter
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
