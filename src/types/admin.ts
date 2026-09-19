import { LetterFont, LetterTheme, LetterBackground, LetterDecorations, TextAlignment, TextFontSize } from "./letter";

export interface LetterRecord {
  id: string;
  encodedId: string;
  recipient: string;
  sender: string;
  title: string;
  theme: LetterTheme;
  font: LetterFont;
  background?: LetterBackground;
  content?: string;
  contentSnippet: string;
  decorations?: LetterDecorations;
  alignment?: TextAlignment;
  fontSize?: TextFontSize;
  createdAt: string;
}

export interface AdminStats {
  totalLetters: number;
  todayLetters: number;
  topTheme: string;
}
