import LZString from "lz-string";
import { LoveLetter } from "@/types/letter";
import { isValidLetter, sanitizeLetter } from "./validation";

/**
 * Encodes a LoveLetter object into a compact, URL-safe string.
 * Uses lz-string compression to reduce URL length significantly for long letters.
 */
export function encodeLetter(letter: LoveLetter): string {
  const sanitized = sanitizeLetter(letter);
  const jsonStr = JSON.stringify(sanitized);
  return LZString.compressToEncodedURIComponent(jsonStr);
}

/**
 * Decodes a URL-safe string back into a verified LoveLetter object.
 * Supports LZString and standard base64/URI encoded JSON fallback.
 */
export function decodeLetter(encodedStr: string): LoveLetter | null {
  if (!encodedStr || typeof encodedStr !== "string") {
    return null;
  }

  // 1. Try LZString decompress
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      if (isValidLetter(parsed)) {
        return sanitizeLetter(parsed);
      }
    }
  } catch {
    // Continue to fallbacks
  }

  // 2. Fallback: Base64 / URI encoded JSON
  try {
    const base64Decoded = decodeURIComponent(escape(atob(encodedStr)));
    const parsed = JSON.parse(base64Decoded);
    if (isValidLetter(parsed)) {
      return sanitizeLetter(parsed);
    }
  } catch {
    // Continue
  }

  // 3. Fallback: Direct URI encoded JSON
  try {
    const uriDecoded = decodeURIComponent(encodedStr);
    const parsed = JSON.parse(uriDecoded);
    if (isValidLetter(parsed)) {
      return sanitizeLetter(parsed);
    }
  } catch {
    // Decoding failed
  }

  return null;
}
