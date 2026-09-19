"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, MailOpen } from "lucide-react";
import { LoveLetter } from "@/types/letter";
import { LetterPaper } from "./LetterPaper";

interface EnvelopeProps {
  letter: LoveLetter;
  onOpen?: () => void;
}

export const Envelope: React.FC<EnvelopeProps> = ({ letter, onOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    // Trigger romantic confetti burst
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E11D48", "#FB7185", "#FDA4AF", "#FFF1F2"],
        shapes: ["circle"],
      });
    } catch {
      // Confetti optional
    }

    // Sequence the envelope opening
    setTimeout(() => {
      setIsOpen(true);
      setIsOpening(false);
      if (onOpen) onOpen();
    }, 900);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[520px] transition-all duration-700">
      {!isOpen ? (
        <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 max-w-md w-full px-4">
          {/* Header teaser */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium tracking-wide mb-6 shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-heartbeat" />
            <span>A digital love letter for you</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-serif text-zinc-900 mb-3 tracking-tight">
            You received a letter
          </h1>
          <p className="text-zinc-600 text-sm sm:text-base mb-8">
            Someone special has something to tell you.
          </p>

          {/* Interactive Envelope Container */}
          <div
            onClick={handleOpen}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Open your love letter"
            className="group relative w-72 sm:w-80 h-48 sm:h-52 bg-rose-100 rounded-2xl shadow-envelope cursor-pointer border border-rose-200/80 transition-all duration-500 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-rose-400/40"
          >
            {/* Envelope Back / Interior Pocket */}
            <div className="absolute inset-0 bg-gradient-to-b from-rose-200/70 to-rose-300/80 rounded-2xl overflow-hidden flex items-center justify-center">
              {/* Peek of letter inside */}
              <div
                className={`w-[86%] h-[75%] bg-white/95 rounded-lg shadow-sm border border-rose-100 transition-transform duration-700 ${
                  isOpening ? "-translate-y-12 opacity-80" : "translate-y-2 opacity-90"
                }`}
              >
                <div className="p-3 opacity-30 space-y-2">
                  <div className="w-1/2 h-2 bg-rose-300 rounded" />
                  <div className="w-4/5 h-1.5 bg-rose-200 rounded" />
                  <div className="w-3/5 h-1.5 bg-rose-200 rounded" />
                </div>
              </div>
            </div>

            {/* Left & Right Envelope folds */}
            <div className="absolute inset-0 pointer-events-none">
              <svg
                viewBox="0 0 320 208"
                className="w-full h-full drop-shadow-sm"
                preserveAspectRatio="none"
              >
                {/* Bottom flap */}
                <polygon
                  points="0,208 160,110 320,208"
                  fill="#fecdd3"
                  stroke="#fda4af"
                  strokeWidth="0.5"
                />
                {/* Left flap */}
                <polygon
                  points="0,0 0,208 160,110"
                  fill="#fecdd3"
                  opacity="0.85"
                />
                {/* Right flap */}
                <polygon
                  points="320,0 320,208 160,110"
                  fill="#fda4af"
                  opacity="0.75"
                />
              </svg>
            </div>

            {/* Top Flap with Wax Seal */}
            <div
              className={`absolute top-0 left-0 right-0 h-1/2 origin-top transition-all duration-700 pointer-events-none z-20 ${
                isOpening ? "-rotate-180 opacity-40" : "rotate-0"
              }`}
              style={{ transformStyle: "preserve-3d" }}
            >
              <svg
                viewBox="0 0 320 104"
                className="w-full h-full drop-shadow-md"
                preserveAspectRatio="none"
              >
                <polygon
                  points="0,0 320,0 160,104"
                  fill="#fb7185"
                  stroke="#f43f5e"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Wax Seal */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 shadow-lg border-2 border-rose-400 flex items-center justify-center transition-transform group-hover:scale-110">
                <Heart className="w-5 h-5 text-rose-100 fill-rose-100 drop-shadow-sm" />
              </div>
            </div>
          </div>

          {/* Call to action button */}
          <div className="mt-10">
            <button
              onClick={handleOpen}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-medium shadow-lg shadow-rose-500/30 hover:shadow-rose-500/40 transition-all duration-200 active:scale-95 group focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
            >
              <MailOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Open Letter</span>
              <Sparkles className="w-4 h-4 text-rose-200 animate-pulse-subtle" />
            </button>
          </div>

          <p className="mt-4 text-xs text-zinc-400">
            Click the envelope or button above to read
          </p>
        </div>
      ) : (
        /* Revealed letter */
        <div className="w-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">
          <LetterPaper letter={letter} />
        </div>
      )}
    </div>
  );
};
