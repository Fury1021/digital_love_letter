"use client";

import React from "react";
import Link from "next/link";
import { Heart, PenLine } from "lucide-react";
import { Button } from "../ui/Button";

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/75 backdrop-blur-md border-b border-rose-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-rose-400 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 fill-white" />
          </div>
          <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-zinc-900 group-hover:text-rose-700 transition-colors">
            LoveLetter<span className="text-rose-600">.</span>
          </span>
        </Link>

        {/* Right action button */}
        <div className="flex items-center gap-3">
          <Link href="/create">
            <Button
              variant="primary"
              size="sm"
              icon={<PenLine className="w-3.5 h-3.5" />}
              className="text-xs sm:text-sm shadow-sm"
            >
              Write a Letter
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
