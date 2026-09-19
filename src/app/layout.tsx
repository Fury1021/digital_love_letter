import type { Metadata } from "next";
import {
  inter,
  dancingScript,
  caveat,
  greatVibes,
  pacifico,
  playfairDisplay,
} from "@/config/fonts";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingBackgroundHearts } from "@/components/letter/Decorations";
import "./globals.css";

export const metadata: Metadata = {
  title: "LoveLetter — A Little Piece of My Heart, Written Just for You",
  description:
    "Write, customize, and share beautiful digital handwritten love letters. Encoded safely in URLs without databases or accounts. Printable as keepsake A4 PDFs.",
  keywords: [
    "love letter",
    "digital love letter",
    "romantic letter generator",
    "valentine letter",
    "anniversary letter",
    "handwritten letter online",
  ],
  authors: [{ name: "DIO" }],
  creator: "DIO",
  openGraph: {
    title: "LoveLetter — A Little Piece of My Heart, Written Just for You",
    description:
      "Create and send personalized digital love letters with animated envelopes and vintage script calligraphy.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${dancingScript.variable} ${caveat.variable} ${greatVibes.variable} ${pacifico.variable} ${playfairDisplay.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-[#fff5f5] via-[#fff0f2] to-[#fffdfc] text-zinc-900 selection:bg-rose-200 selection:text-rose-900 antialiased relative">
        <FloatingBackgroundHearts />
        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
