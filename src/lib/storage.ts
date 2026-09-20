import fs from "fs";
import path from "path";
import { LetterRecord } from "@/types/admin";

const KV_URL =
  process.env.KV_REST_API_URL ||
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.VERCEL_KV_REST_API_URL ||
  process.env.REDIS_REST_API_URL;
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN ||
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.VERCEL_KV_REST_API_TOKEN ||
  process.env.REDIS_REST_API_TOKEN;
const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, "letters.json");

// In-memory fallback if disk and KV are unavailable
let memoryStore: LetterRecord[] = [];

/**
 * Ensures the local data directory exists for local development.
 */
function ensureLocalDir() {
  try {
    if (!fs.existsSync(LOCAL_DATA_DIR)) {
      fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(LOCAL_DATA_FILE)) {
      fs.writeFileSync(LOCAL_DATA_FILE, "[]", "utf-8");
    }
  } catch {
    // Read-only filesystem in some cloud environments
  }
}

/**
 * Fetches all letter records from Upstash/KV, local file, or memory fallback.
 */
export async function getAllLetters(): Promise<LetterRecord[]> {
  // 1. Try Upstash / Vercel KV REST API if configured
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/get/love_letters_data`, {
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
        },
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.result) {
          const parsed = typeof data.result === "string" ? JSON.parse(data.result) : data.result;
          return Array.isArray(parsed) ? parsed : [];
        }
      }
    } catch (err) {
      console.error("Failed to read from KV storage:", err);
    }
  }

  // 2. Try local filesystem (development)
  try {
    ensureLocalDir();
    if (fs.existsSync(LOCAL_DATA_FILE)) {
      const raw = fs.readFileSync(LOCAL_DATA_FILE, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Ignore and fallback to memoryStore
  }

  // 3. Fallback to in-memory store
  return memoryStore;
}

/**
 * Saves a new letter record to Upstash/KV or local file.
 */
export async function saveLetter(record: LetterRecord): Promise<boolean> {
  const current = await getAllLetters();

  // Deduplicate by encodedId if already recorded
  const filtered = current.filter((item) => item.encodedId !== record.encodedId);
  const updated = [record, ...filtered];

  // 1. Upstash / Vercel KV REST API
  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/love_letters_data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(updated)),
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error("Failed to save to KV storage:", err);
    }
  }

  // 2. Local filesystem
  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch {
    // Fallback to memory
  }

  // 3. In-memory store
  memoryStore = updated;
  return true;
}

/**
 * Deletes a letter record by ID.
 */
export async function deleteLetter(id: string): Promise<boolean> {
  const current = await getAllLetters();
  const updated = current.filter((item) => item.id !== id && item.encodedId !== id);

  if (KV_URL && KV_TOKEN) {
    try {
      const res = await fetch(`${KV_URL}/set/love_letters_data`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${KV_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(JSON.stringify(updated)),
      });
      if (res.ok) {
        return true;
      }
    } catch (err) {
      console.error("Failed to delete from KV storage:", err);
    }
  }

  try {
    ensureLocalDir();
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(updated, null, 2), "utf-8");
    return true;
  } catch {
    // Fallback
  }

  memoryStore = updated;
  return true;
}
