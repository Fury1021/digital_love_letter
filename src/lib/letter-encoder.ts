import LZString from "lz-string";
import { LoveLetter } from "@/types/letter";
import { isValidLetter, sanitizeLetter } from "./validation";

/**
 * Encodes a LoveLetter object into a compact, URL-safe string.
 * Uses lz-string compression to reduce URL length significantly.
 */
export function encodeLetter(letter: LoveLetter): string {
  const sanitized = sanitizeLetter(letter);
  const jsonStr = JSON.stringify(sanitized);
  return LZString.compressToEncodedURIComponent(jsonStr);
}

/**
 * Helper to parse a JSON string into a validated letter
 */
function tryParseJson(jsonStr: string): LoveLetter | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (isValidLetter(parsed)) {
      return sanitizeLetter(parsed);
    }
  } catch {
    // Not valid JSON
  }
  return null;
}

/**
 * Decodes a URL-safe string back into a verified LoveLetter object.
 * Resilient against browser URL mangling, spaces (+ to space), and multiple encodings.
 */
export function decodeLetter(encodedStr: string): LoveLetter | null {
  if (!encodedStr || typeof encodedStr !== "string") {
    return null;
  }

  // Clean the input: trim whitespace, remove trailing slashes or hash prefix
  let clean = encodedStr.trim();
  if (clean.startsWith("#")) clean = clean.slice(1);
  if (clean.startsWith("/")) clean = clean.slice(1);
  if (clean.endsWith("/")) clean = clean.slice(0, -1);

  // List of variations to attempt decompressing
  const candidates: string[] = [
    clean,
    clean.replace(/ /g, "+"), // If '+' was decoded to space
  ];

  try {
    const uriDecoded = decodeURIComponent(clean);
    candidates.push(uriDecoded);
    candidates.push(uriDecoded.replace(/ /g, "+"));
  } catch {
    // Ignore URI decode errors
  }

  try {
    const uriEncoded = encodeURIComponent(clean);
    candidates.push(uriEncoded);
  } catch {
    // Ignore
  }

  // 1. Try LZString decompress across all variations
  for (const candidate of candidates) {
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(candidate);
      if (decompressed) {
        const letter = tryParseJson(decompressed);
        if (letter) return letter;
      }
    } catch {
      // Try next candidate
    }

    try {
      const decompressedBase64 = LZString.decompressFromBase64(candidate);
      if (decompressedBase64) {
        const letter = tryParseJson(decompressedBase64);
        if (letter) return letter;
      }
    } catch {
      // Try next
    }

    try {
      const decompressedRaw = LZString.decompress(candidate);
      if (decompressedRaw) {
        const letter = tryParseJson(decompressedRaw);
        if (letter) return letter;
      }
    } catch {
      // Try next
    }
  }

  // 2. Fallback: Base64 / URI encoded JSON
  for (const candidate of candidates) {
    try {
      const base64Decoded = decodeURIComponent(escape(atob(candidate)));
      const letter = tryParseJson(base64Decoded);
      if (letter) return letter;
    } catch {
      // Continue
    }

    try {
      const letter = tryParseJson(candidate);
      if (letter) return letter;
    } catch {
      // Continue
    }
  }

  return null;
}
