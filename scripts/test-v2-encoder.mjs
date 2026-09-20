import LZString from "lz-string";

const FONTS = ["dancing-script", "caveat", "great-vibes", "pacifico", "playfair"];
const THEMES = ["classic", "rose", "midnight", "blush", "minimal", "valentine"];
const BACKGROUNDS = ["paper", "pink", "white", "gradient", "hearts"];
const ALIGNMENTS = ["left", "center", "right"];
const FONT_SIZES = ["sm", "base", "lg", "xl"];

function sanitizeLetter(letter) {
  return {
    recipient: typeof letter.recipient === "string" ? letter.recipient.slice(0, 100).trim() : "",
    sender: typeof letter.sender === "string" ? letter.sender.slice(0, 100).trim() : "",
    title: typeof letter.title === "string" ? letter.title.slice(0, 150).trim() : "",
    content: typeof letter.content === "string" ? letter.content.slice(0, 10000).trim() : "",
    font: letter.font && FONTS.includes(letter.font) ? letter.font : "great-vibes",
    theme: letter.theme && THEMES.includes(letter.theme) ? letter.theme : "rose",
    background: letter.background && BACKGROUNDS.includes(letter.background) ? letter.background : "paper",
    decorations: {
      hearts: Boolean(letter.decorations?.hearts ?? true),
      roses: Boolean(letter.decorations?.roses ?? true),
      sparkles: Boolean(letter.decorations?.sparkles ?? true),
    },
    alignment: letter.alignment && ALIGNMENTS.includes(letter.alignment) ? letter.alignment : "center",
    fontSize: letter.fontSize && FONT_SIZES.includes(letter.fontSize) ? letter.fontSize : "base",
    createdAt: typeof letter.createdAt === "string" ? letter.createdAt : new Date().toISOString(),
  };
}

function isValidLetter(obj) {
  if (!obj || typeof obj !== "object") return false;
  const c = obj;
  return Boolean(
    (c.content && c.content.trim().length > 0) ||
    (c.recipient && c.recipient.trim().length > 0) ||
    (c.title && c.title.trim().length > 0)
  );
}

function encodeLetter(letter) {
  const sanitized = sanitizeLetter(letter);

  const fontIdx = Math.max(0, FONTS.indexOf(sanitized.font));
  const themeIdx = Math.max(0, THEMES.indexOf(sanitized.theme));
  const bgIdx = Math.max(0, BACKGROUNDS.indexOf(sanitized.background));
  const alignIdx = Math.max(0, ALIGNMENTS.indexOf(sanitized.alignment));
  const sizeIdx = Math.max(0, FONT_SIZES.indexOf(sanitized.fontSize));
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

  return "2_" + LZString.compressToEncodedURIComponent(JSON.stringify(compactTuple));
}

function tryParseLetter(jsonStr) {
  try {
    const parsed = JSON.parse(jsonStr);
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
      const createdAt = parsed[10] ? new Date(parsed[10] * 1000).toISOString() : new Date().toISOString();

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

    if (isValidLetter(parsed)) {
      return sanitizeLetter(parsed);
    }
  } catch {}
  return null;
}

function decodeLetter(encodedStr) {
  if (!encodedStr || typeof encodedStr !== "string") return null;

  let clean = encodedStr.trim();
  if (clean.startsWith("#")) clean = clean.slice(1);
  if (clean.startsWith("/")) clean = clean.slice(1);
  if (clean.endsWith("/")) clean = clean.slice(0, -1);

  const candidates = [
    clean,
    clean.replace(/ /g, "+"),
  ];

  try {
    const uriDecoded = decodeURIComponent(clean);
    candidates.push(uriDecoded);
    candidates.push(uriDecoded.replace(/ /g, "+"));
  } catch {}

  // Check each candidate
  for (const c of candidates) {
    // If v2 prefix
    if (c.startsWith("2_")) {
      const payload = c.slice(2);
      const decompressed =
        LZString.decompressFromEncodedURIComponent(payload) ||
        LZString.decompressFromEncodedURIComponent(payload.replace(/ /g, "+")) ||
        LZString.decompressFromBase64(payload);
      if (decompressed) {
        const letter = tryParseLetter(decompressed);
        if (letter) return letter;
      }
    }

    // Standard / legacy v1 decompression
    const decompressed =
      LZString.decompressFromEncodedURIComponent(c) ||
      LZString.decompressFromBase64(c) ||
      LZString.decompress(c);
    if (decompressed) {
      const letter = tryParseLetter(decompressed);
      if (letter) return letter;
    }
  }

  return null;
}

// Test 1: V2 Compact Roundtrip
const testLetter = {
  recipient: "My Dearest Maria ❤️",
  sender: "Forever yours, John",
  title: "For the Person Who Makes My World Brighter",
  content: "There are some things that are difficult to say out loud, but become effortless when I think of you.\n\nToday, tomorrow, and every day after—I choose you.",
  font: "dancing-script",
  theme: "midnight",
  background: "hearts",
  decorations: { hearts: true, roses: false, sparkles: true },
  alignment: "center",
  fontSize: "lg",
  createdAt: "2026-09-20T01:23:45.000Z",
};

const v2Slug = encodeLetter(testLetter);
console.log("V2 Slug length:", v2Slug.length);
console.log("V2 Slug:", v2Slug);

const decoded = decodeLetter(v2Slug);
console.log("Decoded successfully:", Boolean(decoded));
console.log("Recipient matches:", decoded?.recipient === testLetter.recipient);
console.log("Theme matches:", decoded?.theme === testLetter.theme);
console.log("Content matches:", decoded?.content === testLetter.content);
console.log("Decorations match:", JSON.stringify(decoded?.decorations) === JSON.stringify(testLetter.decorations));

// Test 2: Space mangling
const mangledSpace = v2Slug.replace(/\+/g, " ");
const decodedMangled = decodeLetter(mangledSpace);
console.log("Decoded with spaces instead of +:", Boolean(decodedMangled));

// Test 3: Legacy V1 string decode
const v1Json = JSON.stringify(sanitizeLetter(testLetter));
const v1Slug = LZString.compressToEncodedURIComponent(v1Json);
const decodedV1 = decodeLetter(v1Slug);
console.log("Decoded Legacy V1 successfully:", Boolean(decodedV1));
console.log("Legacy recipient matches:", decodedV1?.recipient === testLetter.recipient);
