import { LetterTheme, LetterBackground } from "@/types/letter";

export interface ThemeConfig {
  id: LetterTheme;
  name: string;
  description: string;
  previewColor: string;
  textColor: string;
  titleColor: string;
  accentColor: string;
  borderColor: string;
  badgeBg: string;
}

export const THEME_OPTIONS: ThemeConfig[] = [
  {
    id: "classic",
    name: "Classic Love",
    description: "Timeless romantic crimson and ivory with warm vintage grace",
    previewColor: "#BE123C",
    textColor: "#1F1A1C",
    titleColor: "#9F1239",
    accentColor: "#BE123C",
    borderColor: "rgba(190, 18, 60, 0.25)",
    badgeBg: "bg-rose-50 border-rose-200 text-rose-800",
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft romantic blush with vibrant rose petals and delicate charm",
    previewColor: "#E11D48",
    textColor: "#27171C",
    titleColor: "#E11D48",
    accentColor: "#FB7185",
    borderColor: "rgba(225, 29, 72, 0.22)",
    badgeBg: "bg-pink-50 border-pink-200 text-pink-800",
  },
  {
    id: "midnight",
    name: "Midnight Love",
    description: "Intimate dark plum and midnight tones with glowing blush text",
    previewColor: "#111111",
    textColor: "#FCE7F3",
    titleColor: "#F43F5E",
    accentColor: "#FDA4AF",
    borderColor: "rgba(244, 63, 94, 0.35)",
    badgeBg: "bg-zinc-900 border-rose-900/50 text-rose-200",
  },
  {
    id: "blush",
    name: "Blush",
    description: "Gentle pastel powder pinks with soft, dreamy sweetness",
    previewColor: "#F9A8D4",
    textColor: "#3B1D28",
    titleColor: "#BE123C",
    accentColor: "#F472B6",
    borderColor: "rgba(249, 168, 212, 0.4)",
    badgeBg: "bg-pink-50/80 border-pink-300 text-pink-700",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Understated elegance, crisp typography, and serene white space",
    previewColor: "#FFFFFF",
    textColor: "#111111",
    titleColor: "#111111",
    accentColor: "#E11D48",
    borderColor: "rgba(17, 17, 17, 0.15)",
    badgeBg: "bg-neutral-50 border-neutral-300 text-neutral-800",
  },
  {
    id: "valentine",
    name: "Valentine's",
    description: "Vibrant passion reds and cheerful sweet love accents",
    previewColor: "#F43F5E",
    textColor: "#3F0A16",
    titleColor: "#BE123C",
    accentColor: "#E11D48",
    borderColor: "rgba(225, 29, 72, 0.3)",
    badgeBg: "bg-red-50 border-red-200 text-red-800",
  },
];

export interface BackgroundConfig {
  id: LetterBackground;
  name: string;
  cssClass: string;
  description: string;
}

export const BACKGROUND_OPTIONS: BackgroundConfig[] = [
  {
    id: "paper",
    name: "Parchment Paper",
    cssClass: "bg-[#FDFBF7] paper-texture",
    description: "Warm, textured natural stationery paper",
  },
  {
    id: "pink",
    name: "Soft Pink",
    cssClass: "bg-[#FFF1F2]",
    description: "A delicate, warm whisper of pink",
  },
  {
    id: "white",
    name: "Pure White",
    cssClass: "bg-[#FFFFFF]",
    description: "Clean, pristine premium bond paper",
  },
  {
    id: "gradient",
    name: "Romantic Sunset",
    cssClass: "bg-gradient-to-br from-[#FFF1F2] via-[#FCE7F3] to-[#FED7AA]/30",
    description: "Subtle sunset glow gradient",
  },
  {
    id: "hearts",
    name: "Floating Hearts",
    cssClass: "bg-[#FFF5F7] bg-hearts-pattern",
    description: "Subtle, ethereal watermark heart pattern",
  },
];

export const getThemeConfig = (themeId: LetterTheme): ThemeConfig => {
  return THEME_OPTIONS.find((t) => t.id === themeId) || THEME_OPTIONS[0];
};

export const getBackgroundConfig = (bgId: LetterBackground): BackgroundConfig => {
  return BACKGROUND_OPTIONS.find((b) => b.id === bgId) || BACKGROUND_OPTIONS[0];
};
