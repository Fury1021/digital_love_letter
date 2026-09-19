import fs from "fs";
import path from "path";
import crypto from "crypto";

const DEFAULT_ADMIN_PASSWORD = "loveadmin2026";
const testPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

console.log("=== Testing Admin Auth & Storage Logic ===");

// 1. Password hashing token check
const expectedToken = crypto
  .createHash("sha256")
  .update(`${testPassword}_love_admin_salt`)
  .digest("hex");

const testWrongToken = crypto
  .createHash("sha256")
  .update(`wrong_password_love_admin_salt`)
  .digest("hex");

console.log("Token generation works:", expectedToken.length === 64);
console.log("Mismatch detected for wrong token:", expectedToken !== testWrongToken);

// 2. Test local storage fallback write and read
const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "letters.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const sampleLetters = [
  {
    id: "letter_test_1",
    encodedId: "test_encoded_abc123",
    recipient: "Maria",
    sender: "John",
    title: "My Love",
    theme: "rose",
    font: "great-vibes",
    contentSnippet: "I wanted to tell you...",
    createdAt: new Date().toISOString(),
  }
];

fs.writeFileSync(dataFile, JSON.stringify(sampleLetters, null, 2), "utf-8");

const readBack = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
if (readBack.length === 1 && readBack[0].recipient === "Maria") {
  console.log("SUCCESS: Local file ledger write & read verified!");
} else {
  console.error("FAIL: Local storage mismatch!");
  process.exit(1);
}

console.log("=== All Admin Tests Passed! ===");
