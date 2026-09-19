import React from "react";
import { LetterEditor } from "@/components/editor/LetterEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Write a Love Letter — LoveLetter",
  description: "Compose, customize, and share your personal digital love letter.",
};

export default function CreateLetterPage() {
  return (
    <div className="py-4">
      <LetterEditor />
    </div>
  );
}
