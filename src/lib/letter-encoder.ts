import LZString from "lz-string";
import {
  LoveLetter,
  LetterFont,
  LetterTheme,
  LetterBackground,
  TextAlignment,
  TextFontSize,
} from "@/types/letter";
import { isValidLetter, sanitizeLetter } from "./validation";

const FONTS: LetterFont[] = [
  "dancing-script",
  "caveat",
  "great-vibes",
  "pacifico",
  "playfair",
];
const THEMES: LetterTheme[] = [
  "classic",
  "rose",
  "midnight",
  "blush",
  "minimal",
  "valentine",
];
const BACKGROUNDS: LetterBackground[] = [
  "paper",
  "pink",
  "white",
  "gradient",
  "hearts",
];
const ALIGNMENTS: TextAlignment[] = ["left", "center", "right"];
const FONT_SIZES: TextFontSize[] = ["sm", "base", "lg", "xl"];

/**
 * Encodes a LoveLetter object into a compact, URL-safe string.
 * Uses v2 compact positional tuple + lz-string compression to cut URL size by >50%.
 * This ensures letters are 100% self-contained, never expire, and can NEVER be deleted.
 */
export function encodeLetter(letter: LoveLetter): string {
  const sanitized = sanitizeLetter(letter);

  const fontIdx = Math.max(0, FONTS.indexOf(sanitized.font));
  const themeIdx = Math.max(0, THEMES.indexOf(sanitized.theme));
  const bgIdx = Math.max(0, BACKGROUNDS.indexOf(sanitized.background));
  const alignIdx = Math.max(0, ALIGNMENTS.indexOf(sanitized.alignment || "center"));
  const sizeIdx = Math.max(0, FONT_SIZES.indexOf(sanitized.fontSize || "base"));
  const decoMask =
    (sanitized.decorations.hearts ? 1 : 0) |
    (sanitized.decorations.roses ? 2 : 0) |
    (sanitized.decorations.sparkles ? 4 : 0);
  const timeSec = Math.floor(new Date(sanitized.createdAt).getTime() / 1000);

  const compactTuple = [
    sanitized.recipient,
    sanitized.sender,
    sanitized.title,
    sanitized.content,
    fontIdx,
    themeIdx,
    bgIdx,
    alignIdx,
    sizeIdx,
    decoMask,
    timeSec,
  ];

  const compressed = LZString.compressToEncodedURIComponent(
    JSON.stringify(compactTuple)
  );
  return `2_${compressed}`;
}

/**
 * Helper to parse a JSON string (v2 tuple or legacy v1 object) into a validated letter
 */
function tryParseJson(jsonStr: string): LoveLetter | null {
  try {
    const parsed = JSON.parse(jsonStr);

    // Case A: Compact v2 tuple array
    if (Array.isArray(parsed) && parsed.length >= 4) {
      const recipient = typeof parsed[0] === "string" ? parsed[0] : "";
      const sender = typeof parsed[1] === "string" ? parsed[1] : "";
      const title = typeof parsed[2] === "string" ? parsed[2] : "";
      const content = typeof parsed[3] === "string" ? parsed[3] : "";
      const font = FONTS[parsed[4]] || "great-vibes";
      const theme = THEMES[parsed[5]] || "rose";
      const background = BACKGROUNDS[parsed[6]] || "paper";
      const alignment = ALIGNMENTS[parsed[7]] || "center";
      const fontSize = FONT_SIZES[parsed[8]] || "base";
      const decoMask = typeof parsed[9] === "number" ? parsed[9] : 7;
      const createdAt = parsed[10]
        ? new Date(parsed[10] * 1000).toISOString()
        : new Date().toISOString();

      return sanitizeLetter({
        recipient,
        sender,
        title,
        content,
        font,
        theme,
        background,
        alignment,
        fontSize,
        decorations: {
          hearts: Boolean(decoMask & 1),
          roses: Boolean(decoMask & 2),
          sparkles: Boolean(decoMask & 4),
        },
        createdAt,
      });
    }

    // Case B: Legacy v1 full JSON object
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
 * Fully backwards-compatible with both v2 (`2_...`) and legacy v1 letters.
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

  // 1. Try V2 and LZString decompress across all variations
  for (const candidate of candidates) {
    // Check if candidate starts with v2 prefix '2_'
    if (candidate.startsWith("2_")) {
      const payload = candidate.slice(2);
      const payloadVariations = [payload, payload.replace(/ /g, "+")];
      for (const p of payloadVariations) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(p);
          if (decompressed) {
            const letter = tryParseJson(decompressed);
            if (letter) return letter;
          }
        } catch {}

        try {
          const decompressedBase64 = LZString.decompressFromBase64(p);
          if (decompressedBase64) {
            const letter = tryParseJson(decompressedBase64);
            if (letter) return letter;
          }
        } catch {}
      }
    }

    // Standard / legacy decompression
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
