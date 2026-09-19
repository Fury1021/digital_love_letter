import LZString from "lz-string";

// Replicate test letter
const sampleLetter = {
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

console.log("=== Testing Letter Compression & URL Encoding ===");

const jsonStr = JSON.stringify(sampleLetter);
console.log("Original JSON length:", jsonStr.length, "bytes");

const compressed = LZString.compressToEncodedURIComponent(jsonStr);
console.log("Compressed URL length:", compressed.length, "chars");
console.log("Compression ratio:", ((1 - compressed.length / jsonStr.length) * 100).toFixed(1) + "% reduction");

// Decompress
const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
const recovered = JSON.parse(decompressed);

if (recovered.recipient === sampleLetter.recipient && recovered.content === sampleLetter.content) {
  console.log("SUCCESS: Round-trip compression & decompression verified!");
} else {
  console.error("FAIL: Mismatch in recovered letter!");
  process.exit(1);
}

// Test malformed string
const badDecompress = LZString.decompressFromEncodedURIComponent("bad-random-string-xyz-12345");
console.log("Bad string handled gracefully (returns null or invalid):", badDecompress === null || !badDecompress);

console.log("=== All Encoder Tests Passed! ===");
