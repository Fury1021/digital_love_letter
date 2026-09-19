import { LetterFont, LetterTheme } from "./letter";

export interface LetterRecord {
  id: string;
  encodedId: string;
  recipient: string;
  sender: string;
  title: string;
  theme: LetterTheme;
  font: LetterFont;
  contentSnippet: string;
  createdAt: string;
}

export interface AdminStats {
  totalLetters: number;
  todayLetters: number;
  topTheme: string;
}
