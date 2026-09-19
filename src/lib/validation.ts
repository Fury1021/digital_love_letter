import { LoveLetter, LetterFont, LetterTheme, LetterBackground, TextAlignment, TextFontSize } from "@/types/letter";

const VALID_FONTS: LetterFont[] = ["dancing-script", "caveat", "great-vibes", "pacifico", "playfair"];
const VALID_THEMES: LetterTheme[] = ["classic", "rose", "midnight", "blush", "minimal", "valentine"];
const VALID_BACKGROUNDS: LetterBackground[] = ["paper", "pink", "white", "gradient", "hearts"];
const VALID_ALIGNMENTS: TextAlignment[] = ["left", "center", "right"];
const VALID_FONT_SIZES: TextFontSize[] = ["sm", "base", "lg", "xl"];

export function isValidLetter(obj: unknown): obj is LoveLetter {
  if (!obj || typeof obj !== "object") return false;

  const candidate = obj as Record<string, unknown>;

  if (typeof candidate.recipient !== "string" || candidate.recipient.trim().length === 0) return false;
  if (typeof candidate.sender !== "string") return false;
  if (typeof candidate.title !== "string") return false;
  if (typeof candidate.content !== "string" || candidate.content.trim().length === 0) return false;

  if (typeof candidate.font !== "string" || !VALID_FONTS.includes(candidate.font as LetterFont)) return false;
  if (typeof candidate.theme !== "string" || !VALID_THEMES.includes(candidate.theme as LetterTheme)) return false;
  if (typeof candidate.background !== "string" || !VALID_BACKGROUNDS.includes(candidate.background as LetterBackground)) return false;

  if (!candidate.decorations || typeof candidate.decorations !== "object") return false;
  const dec = candidate.decorations as Record<string, unknown>;
  if (typeof dec.hearts !== "boolean" || typeof dec.roses !== "boolean" || typeof dec.sparkles !== "boolean") return false;

  if (candidate.alignment !== undefined && (!VALID_ALIGNMENTS.includes(candidate.alignment as TextAlignment))) return false;
  if (candidate.fontSize !== undefined && (!VALID_FONT_SIZES.includes(candidate.fontSize as TextFontSize))) return false;

  return true;
}

export function sanitizeLetter(letter: LoveLetter): LoveLetter {
  return {
    recipient: letter.recipient.slice(0, 100).trim(),
    sender: letter.sender.slice(0, 100).trim(),
    title: letter.title.slice(0, 150).trim(),
    content: letter.content.slice(0, 10000).trim(),
    font: VALID_FONTS.includes(letter.font) ? letter.font : "great-vibes",
    theme: VALID_THEMES.includes(letter.theme) ? letter.theme : "rose",
    background: VALID_BACKGROUNDS.includes(letter.background) ? letter.background : "paper",
    decorations: {
      hearts: Boolean(letter.decorations?.hearts),
      roses: Boolean(letter.decorations?.roses),
      sparkles: Boolean(letter.decorations?.sparkles),
    },
    alignment: VALID_ALIGNMENTS.includes(letter.alignment || "center") ? letter.alignment : "center",
    fontSize: VALID_FONT_SIZES.includes(letter.fontSize || "base") ? letter.fontSize : "base",
    createdAt: typeof letter.createdAt === "string" ? letter.createdAt : new Date().toISOString(),
  };
}
