"use client";

import React from "react";
import { AlignLeft, AlignCenter, AlignRight, FileText, Lightbulb } from "lucide-react";
import { TextAlignment, TextFontSize } from "@/types/letter";

interface LetterContentEditorProps {
  content: string;
  onChangeContent: (val: string) => void;
  alignment: TextAlignment;
  onChangeAlignment: (val: TextAlignment) => void;
  fontSize: TextFontSize;
  onChangeFontSize: (val: TextFontSize) => void;
}

const INSPIRATION_PROMPTS = [
  "From the moment I met you, my world felt a little softer and a lot brighter...",
  "There is no one else in this world who understands my heart quite the way you do...",
  "If I had to live this life a thousand times over, I would still find my way to you...",
  "Thank you for making ordinary days feel extraordinary simply by being in them...",
];

export const LetterContentEditor: React.FC<LetterContentEditorProps> = ({
  content,
  onChangeContent,
  alignment,
  onChangeAlignment,
  fontSize,
  onChangeFontSize,
}) => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  const insertPrompt = (prompt: string) => {
    if (!content.trim()) {
      onChangeContent(prompt);
    } else {
      onChangeContent(`${content}\n\n${prompt}`);
    }
  };

  return (
    <div className="space-y-3">
      {/* Editor Header & Formatting Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
        <label
          htmlFor="content-textarea"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-600 flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-rose-500" />
          <span>Your Letter Content</span>
        </label>

        {/* Alignment & Font Size Controls */}
        <div className="flex items-center gap-2 bg-rose-50/70 p-1 rounded-lg border border-rose-200/60">
          {/* Alignment */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => onChangeAlignment("left")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                alignment === "left"
                  ? "bg-white text-rose-700 shadow-xs font-medium"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Align Left"
              aria-label="Align left"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChangeAlignment("center")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                alignment === "center"
                  ? "bg-white text-rose-700 shadow-xs font-medium"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Align Center"
              aria-label="Align center"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChangeAlignment("right")}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                alignment === "right"
                  ? "bg-white text-rose-700 shadow-xs font-medium"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
              title="Align Right"
              aria-label="Align right"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-3.5 w-[1px] bg-rose-200" />

          {/* Font Size */}
          <div className="flex items-center gap-0.5">
            {(["sm", "base", "lg", "xl"] as TextFontSize[]).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChangeFontSize(size)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  fontSize === size
                    ? "bg-white text-rose-700 shadow-xs font-semibold"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
                title={`Text size ${size}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="content-textarea"
          rows={10}
          value={content}
          onChange={(e) => onChangeContent(e.target.value)}
          placeholder="Write your heart out here... Multiple paragraphs are supported."
          className="w-full px-4 py-3 bg-white border border-rose-200/80 rounded-2xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 text-sm sm:text-base leading-relaxed shadow-sm transition-all resize-y min-h-[220px]"
        />
        <div className="absolute bottom-2.5 right-3 text-[11px] text-zinc-400 bg-white/90 px-2 py-0.5 rounded-md backdrop-blur-xs font-mono">
          {wordCount} words • {charCount} chars
        </div>
      </div>

      {/* Romantic inspiration pills */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2 font-medium">
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Need inspiration? Click a prompt to insert:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {INSPIRATION_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => insertPrompt(prompt)}
              className="text-left text-xs bg-rose-50/60 hover:bg-rose-100/80 text-rose-800 px-2.5 py-1 rounded-full border border-rose-200/60 transition-colors"
            >
              &ldquo;{prompt.slice(0, 42)}...&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
