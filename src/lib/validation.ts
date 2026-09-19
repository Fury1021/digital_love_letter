import { LoveLetter, LetterFont, LetterTheme, LetterBackground, TextAlignment, TextFontSize } from "@/types/letter";

const VALID_FONTS: LetterFont[] = ["dancing-script", "caveat", "great-vibes", "pacifico", "playfair"];
const VALID_THEMES: LetterTheme[] = ["classic", "rose", "midnight", "blush", "minimal", "valentine"];
const VALID_BACKGROUNDS: LetterBackground[] = ["paper", "pink", "white", "gradient", "hearts"];
const VALID_ALIGNMENTS: TextAlignment[] = ["left", "center", "right"];
const VALID_FONT_SIZES: TextFontSize[] = ["sm", "base", "lg", "xl"];

export function isValidLetter(obj: unknown): obj is LoveLetter {
  if (!obj || typeof obj !== "object") return false;

  const candidate = obj as Record<string, unknown>;

  // At least one piece of letter text should exist
  const hasContent = typeof candidate.content === "string" && candidate.content.trim().length > 0;
  const hasRecipient = typeof candidate.recipient === "string" && candidate.recipient.trim().length > 0;
  const hasTitle = typeof candidate.title === "string" && candidate.title.trim().length > 0;

  if (!hasContent && !hasRecipient && !hasTitle) {
    return false;
  }

  return true;
}

export function sanitizeLetter(letter: Partial<LoveLetter>): LoveLetter {
  return {
    recipient: typeof letter.recipient === "string" ? letter.recipient.slice(0, 100).trim() : "",
    sender: typeof letter.sender === "string" ? letter.sender.slice(0, 100).trim() : "",
    title: typeof letter.title === "string" ? letter.title.slice(0, 150).trim() : "",
    content: typeof letter.content === "string" ? letter.content.slice(0, 10000).trim() : "",
    font: letter.font && VALID_FONTS.includes(letter.font) ? letter.font : "great-vibes",
    theme: letter.theme && VALID_THEMES.includes(letter.theme) ? letter.theme : "rose",
    background: letter.background && VALID_BACKGROUNDS.includes(letter.background) ? letter.background : "paper",
    decorations: {
      hearts: Boolean(letter.decorations?.hearts ?? true),
      roses: Boolean(letter.decorations?.roses ?? true),
      sparkles: Boolean(letter.decorations?.sparkles ?? true),
    },
    alignment: letter.alignment && VALID_ALIGNMENTS.includes(letter.alignment) ? letter.alignment : "center",
    fontSize: letter.fontSize && VALID_FONT_SIZES.includes(letter.fontSize) ? letter.fontSize : "base",
    createdAt: typeof letter.createdAt === "string" ? letter.createdAt : new Date().toISOString(),
  };
}
