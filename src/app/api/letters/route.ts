import { NextResponse } from "next/server";
import crypto from "crypto";
import { getAllLetters, saveLetter, deleteLetter } from "@/lib/storage";
import { LetterRecord } from "@/types/admin";

const DEFAULT_ADMIN_PASSWORD = "loveadmin2026";

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split(" ")[1];
  const correctPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
  const expectedToken = crypto
    .createHash("sha256")
    .update(`${correctPassword}_love_admin_salt`)
    .digest("hex");

  return token === expectedToken;
}

// POST /api/letters: Asynchronously records a created love letter
export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.encodedId || !body.recipient) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const record: LetterRecord = {
      id: body.id || `letter_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      encodedId: String(body.encodedId),
      recipient: String(body.recipient).slice(0, 100),
      sender: String(body.sender || "").slice(0, 100),
      title: String(body.title || "").slice(0, 150),
      theme: body.theme || "rose",
      font: body.font || "great-vibes",
      contentSnippet: String(body.content || "").slice(0, 200),
      createdAt: body.createdAt || new Date().toISOString(),
    };

    await saveLetter(record);
    return NextResponse.json({ success: true, id: record.id });
  } catch (err) {
    console.error("Failed to save letter record:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save record" },
      { status: 500 }
    );
  }
}

// GET /api/letters: Protected admin endpoint to fetch all created letters
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const letters = await getAllLetters();
    return NextResponse.json({ success: true, letters });
  } catch (err) {
    console.error("Failed to list letters:", err);
    return NextResponse.json(
      { success: false, error: "Failed to list letters" },
      { status: 500 }
    );
  }
}

// DELETE /api/letters: Protected admin endpoint to delete a letter record
export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing letter id" },
        { status: 400 }
      );
    }

    await deleteLetter(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete letter:", err);
    return NextResponse.json(
      { success: false, error: "Failed to delete letter" },
      { status: 500 }
    );
  }
}
