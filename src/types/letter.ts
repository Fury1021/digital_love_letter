export type LetterFont = 
  | "dancing-script" 
  | "caveat" 
  | "great-vibes" 
  | "pacifico" 
  | "playfair";

export type LetterTheme =
  | "classic"
  | "rose"
  | "midnight"
  | "blush"
  | "minimal"
  | "valentine";

export type LetterBackground =
  | "paper"
  | "pink"
  | "white"
  | "gradient"
  | "hearts";

export type TextAlignment = "left" | "center" | "right";
export type TextFontSize = "sm" | "base" | "lg" | "xl";

export interface LetterDecorations {
  hearts: boolean;
  roses: boolean;
  sparkles: boolean;
}

export interface LoveLetter {
  recipient: string;
  sender: string;
  title: string;
  content: string;
  font: LetterFont;
  theme: LetterTheme;
  background: LetterBackground;
  decorations: LetterDecorations;
  alignment?: TextAlignment;
  fontSize?: TextFontSize;
  createdAt: string;
}

export const DEFAULT_LETTER: LoveLetter = {
  recipient: "My Dearest Maria",
  sender: "Forever yours, John",
  title: "For the Person Who Makes My World Brighter",
  content: `There are some things that are difficult to say out loud, but become effortless when I think of you.

You make ordinary days feel extraordinary simply by being in them. Your smile is the gentle warmth I look forward to, and your laughter is my favorite melody.

Thank you for being my anchor, my confidante, and the sweetest part of my story. No distance or time could ever diminish what you mean to me.

Today, tomorrow, and every day after—I choose you.`,
  font: "great-vibes",
  theme: "rose",
  background: "paper",
  decorations: {
    hearts: true,
    roses: true,
    sparkles: true,
  },
  alignment: "center",
  fontSize: "base",
  createdAt: new Date().toISOString(),
};
