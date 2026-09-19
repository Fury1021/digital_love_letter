import React from "react";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
    </div>
  );
}
