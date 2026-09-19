"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface LetterTitleInputProps {
  title: string;
  onChangeTitle: (val: string) => void;
}

export const LetterTitleInput: React.FC<LetterTitleInputProps> = ({
  title,
  onChangeTitle,
}) => {
  return (
    <div>
      <label
        htmlFor="title-input"
        className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5 flex items-center gap-1.5"
      >
        <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        <span>Letter Subtitle / Header</span>
      </label>
      <input
        id="title-input"
        type="text"
        placeholder="e.g. For the Person Who Makes My World Brighter"
        value={title}
        onChange={(e) => onChangeTitle(e.target.value)}
        maxLength={150}
        className="w-full px-4 py-2.5 bg-white border border-rose-200/80 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400/40 focus:border-rose-400 text-sm shadow-sm transition-all"
      />
    </div>
  );
};
