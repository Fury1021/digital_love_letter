import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-rose-100 bg-white/60 backdrop-blur-xs py-8 relative z-10 text-center text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
          <span>Created by</span>
          <strong className="font-semibold text-rose-700">DIO</strong>
          <span className="text-zinc-300 hidden sm:inline">•</span>
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline animate-heartbeat" />
          <span>for lovers & dreamers everywhere</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
          <Link href="/create" className="hover:text-rose-600 transition-colors">
            Write Letter
          </Link>
          <span className="text-zinc-400">100% Client-Side Privacy</span>
        </div>
      </div>
    </footer>
  );
};
