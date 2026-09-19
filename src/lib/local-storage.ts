import { LoveLetter } from "@/types/letter";
import { isValidLetter, sanitizeLetter } from "./validation";

const DRAFT_KEY = "love-letter-draft";

export function saveDraft(letter: LoveLetter): void {
  if (typeof window === "undefined") return;
  try {
    const sanitized = sanitizeLetter(letter);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(sanitized));
  } catch (err) {
    console.error("Failed to save draft to localStorage:", err);
  }
}

export function loadDraft(): LoveLetter | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValidLetter(parsed)) {
      return sanitizeLetter(parsed);
    }
  } catch (err) {
    console.error("Failed to load draft from localStorage:", err);
  }
  return null;
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    console.error("Failed to clear draft from localStorage:", err);
  }
}

export function hasDraft(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(DRAFT_KEY) !== null;
}
