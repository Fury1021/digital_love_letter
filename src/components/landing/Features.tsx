"use client";

import React from "react";
import { Mail, ShieldCheck, Download, Sparkles, Feather, Heart } from "lucide-react";

export const Features: React.FC = () => {
  const features = [
    {
      icon: <Mail className="w-6 h-6 text-rose-600" />,
      title: "Interactive Wax Seal & Envelope",
      description:
        "Your recipient experiences the suspense and joy of opening an elegant folded envelope that slides out their letter with floating hearts.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-rose-600" />,
      title: "100% Serverless & Private",
      description:
        "No database, no accounts, and no personal logs. Your letter is compressed directly into the shareable link. You hold complete ownership.",
    },
    {
      icon: <Feather className="w-6 h-6 text-rose-600" />,
      title: "Handwritten Script Calligraphy",
      description:
        "Choose between delicate Google cursive fonts like Great Vibes, Dancing Script, and Caveat paired with luxurious stationery parchment.",
    },
    {
      icon: <Download className="w-6 h-6 text-rose-600" />,
      title: "Printable Keepsake PDF",
      description:
        "Generate a high-resolution, portrait A4 PDF letter on-the-fly directly in your browser to print, frame, or tuck into a real gift.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 border-t border-rose-100/60 bg-white/50 backdrop-blur-sm relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
            <span>The Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-zinc-900 tracking-tight">
            How Digital Love Letters Work
          </h2>
          <p className="text-zinc-600 mt-3 text-sm sm:text-base">
            Simple, timeless, and thoughtfully crafted for heartfelt moments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white/80 rounded-3xl p-6 border border-rose-100/80 shadow-sm hover:shadow-md hover:border-rose-300/80 transition-all duration-300 flex flex-col group"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-rose-100 transition-transform">
                {feat.icon}
              </div>
              <h3 className="text-lg font-serif font-medium text-zinc-900 mb-2">
                {feat.title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Romantic Steps Banner */}
        <div className="mt-16 bg-gradient-to-r from-rose-500 via-rose-600 to-red-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl shadow-rose-500/20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Heart className="w-48 h-48 fill-white" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3.5 py-1 rounded-full text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Journey</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif mb-4">
              Write → Customize → Share → Cherish
            </h3>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              Whether celebrating an anniversary, Valentine’s Day, or simply saying
              what is difficult to speak aloud, make your message unforgettable.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
