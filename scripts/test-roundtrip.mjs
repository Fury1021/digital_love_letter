import LZString from "lz-string";

const DEFAULT_LETTER = {
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

function isValidLetter(obj) {
  if (!obj || typeof obj !== "object") return false;
  const candidate = obj;
  if (typeof candidate.recipient !== "string" || candidate.recipient.trim().length === 0) return false;
  if (typeof candidate.sender !== "string") return false;
  if (typeof candidate.title !== "string") return false;
  if (typeof candidate.content !== "string" || candidate.content.trim().length === 0) return false;
  return true;
}

function decodeLetter(encodedStr) {
  if (!encodedStr || typeof encodedStr !== "string") return null;

  // Try directly
  try {
    const decompressed = LZString.decompressFromEncodedURIComponent(encodedStr);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      if (isValidLetter(parsed)) return parsed;
    }
  } catch (e) {}

  // Try replacing spaces with +
  try {
    const fixedPlus = encodedStr.replace(/ /g, "+");
    const decompressed = LZString.decompressFromEncodedURIComponent(fixedPlus);
    if (decompressed) {
      const parsed = JSON.parse(decompressed);
      if (isValidLetter(parsed)) return parsed;
    }
  } catch (e) {}

  return null;
}

const json = JSON.stringify(DEFAULT_LETTER);
const encoded = LZString.compressToEncodedURIComponent(json);
console.log("Encoded length:", encoded.length);
console.log("Direct decode:", decodeLetter(encoded) !== null);

const nextjsParam = decodeURIComponent(encoded);
console.log("After decodeURIComponent:", decodeLetter(nextjsParam) !== null);

const withSpace = nextjsParam.replace(/\+/g, " ");
console.log("If + becomes space (direct):", LZString.decompressFromEncodedURIComponent(withSpace) !== null);
console.log("If + becomes space (our decodeLetter with fix):", decodeLetter(withSpace) !== null);
