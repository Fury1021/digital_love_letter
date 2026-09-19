import { NextResponse } from "next/server";
import { getAllLetters } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Missing id parameter" },
        { status: 400 }
      );
    }

    const all = await getAllLetters();
    const match = all.find(
      (item) =>
        item.id === id ||
        item.encodedId === id ||
        decodeURIComponent(item.encodedId) === decodeURIComponent(id)
    );

    if (!match) {
      return NextResponse.json(
        { success: false, error: "Letter not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      encodedId: match.encodedId,
      recipient: match.recipient,
      sender: match.sender,
      title: match.title,
      theme: match.theme,
      font: match.font,
      createdAt: match.createdAt,
    });
  } catch (err) {
    console.error("Public letter lookup error:", err);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}
