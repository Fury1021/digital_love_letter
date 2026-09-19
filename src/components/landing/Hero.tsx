"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Sparkles, Mail, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

export const Hero: React.FC = () => {
  const router = useRouter();
  const [isOpenModalActive, setIsOpenModalActive] = useState(false);
  const [letterInput, setLetterInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenLetterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const trimmed = letterInput.trim();
    if (!trimmed) {
      setErrorMsg("Please enter a link or letter code");
      return;
    }

    // Check if user entered a full URL or just the encoded code
    if (trimmed.includes("/letter/")) {
      const parts = trimmed.split("/letter/");
      const code = parts[1]?.split("?")[0]?.split("#")[0];
      if (code) {
        router.push(`/letter/${code}`);
        return;
      }
    }

    // Direct code or hash
    const cleanCode = trimmed.replace(/^[#/]+/, "");
    router.push(`/letter/${cleanCode}`);
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200/80 text-rose-700 text-xs sm:text-sm font-medium mb-8 shadow-xs animate-in fade-in duration-500">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-heartbeat" />
          <span>A modern celebration of handwritten romance</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        </div>

        {/* Hero Quote */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-zinc-900 tracking-tight max-w-4xl mx-auto leading-[1.15] mb-6">
          &ldquo;A little piece of my heart,{" "}
          <span className="italic bg-gradient-to-r from-rose-600 via-rose-700 to-red-600 bg-clip-text text-transparent font-normal">
            written just for you.
          </span>
          &rdquo;
        </h1>

        {/* Subtext */}
        <p className="text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto font-sans leading-relaxed mb-10">
          Create an intimate, handwritten digital love letter presented as an
          unfolding vintage envelope. No accounts, no database—forever preserved in a shareable link.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <Link href="/create" className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="lg"
              className="w-full text-base sm:text-lg px-8 py-4 shadow-rose-500/25 shadow-lg group"
              icon={<Heart className="w-5 h-5 fill-white group-hover:scale-110 transition-transform" />}
            >
              Write a Love Letter
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto text-base px-7 py-4"
            icon={<Mail className="w-5 h-5 text-rose-600" />}
            onClick={() => setIsOpenModalActive(true)}
          >
            Open a Letter
          </Button>
        </div>

        {/* Romantic Stationery Card Teaser */}
        <div className="relative max-w-xl mx-auto">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 rounded-3xl blur-lg opacity-40 animate-pulse-subtle" />
          <div className="relative bg-[#FDFBF7] rounded-3xl p-6 sm:p-8 border border-rose-200/80 shadow-paper-lg text-left">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3 mb-4">
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-sans">
                Stationery Preview
              </span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                <span className="w-2 h-2 rounded-full bg-pink-300" />
                <span className="w-2 h-2 rounded-full bg-rose-200" />
              </div>
            </div>

            <p className="text-2xl sm:text-3xl font-great-vibes text-rose-900 mb-2">
              My Dearest,
            </p>
            <p className="text-sm sm:text-base text-zinc-700 font-sans leading-relaxed opacity-90 mb-4 line-clamp-3">
              I wanted to leave you with something that lasts longer than whispered words
              on a fleeting afternoon. You make every ordinary corner of my life feel magical...
            </p>
            <div className="flex items-center justify-between text-xs text-rose-700 font-medium">
              <span className="font-great-vibes text-xl">Forever yours ♥</span>
              <Link
                href="/create"
                className="inline-flex items-center gap-1 hover:underline text-rose-600"
              >
                <span>Compose your own</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Open Letter Modal */}
      <Modal
        isOpen={isOpenModalActive}
        onClose={() => setIsOpenModalActive(false)}
        title="Open Your Love Letter"
        maxWidth="md"
      >
        <form onSubmit={handleOpenLetterSubmit} className="space-y-4">
          <p className="text-sm text-zinc-600">
            Received a digital love letter? Paste the full link or the encoded code below
            to open and read it.
          </p>

          <div>
            <label
              htmlFor="letter-url-input"
              className="block text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-1.5"
            >
              Love Letter Link or Code
            </label>
            <input
              id="letter-url-input"
              type="text"
              placeholder="e.g. https://loveletter.app/letter/abc... or just abc..."
              value={letterInput}
              onChange={(e) => setLetterInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-rose-200 rounded-xl text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
              autoFocus
            />
            {errorMsg && (
              <p className="text-xs text-red-600 mt-1.5 font-medium">{errorMsg}</p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpenModalActive(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={<BookOpen className="w-4 h-4" />}
            >
              Read Letter
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
