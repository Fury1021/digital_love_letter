import {
  Dancing_Script,
  Caveat,
  Great_Vibes,
  Pacifico,
  Playfair_Display,
  Inter,
} from "next/font/google";
import { LetterFont } from "@/types/letter";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

export const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-great-vibes",
  display: "swap",
});

export const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export interface FontOption {
  id: LetterFont;
  name: string;
  className: string;
  sampleText: string;
}

export const FONT_OPTIONS: FontOption[] = [
  {
    id: "great-vibes",
    name: "Great Vibes",
    className: "font-great-vibes",
    sampleText: "My Dearest Maria",
  },
  {
    id: "dancing-script",
    name: "Dancing Script",
    className: "font-dancing",
    sampleText: "Forever and Always",
  },
  {
    id: "caveat",
    name: "Caveat",
    className: "font-caveat",
    sampleText: "From the bottom of my heart",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    className: "font-pacifico",
    sampleText: "You are my sunshine",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    className: "font-playfair",
    sampleText: "Eternal Romance",
  },
];

export const getFontClass = (fontId: LetterFont): string => {
  const match = FONT_OPTIONS.find((f) => f.id === fontId);
  return match ? match.className : "font-great-vibes";
};
