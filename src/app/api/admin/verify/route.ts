import { NextResponse } from "next/server";
import crypto from "crypto";

const DEFAULT_ADMIN_PASSWORD = "loveadmin2026";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;

    if (!password || password !== correctPassword) {
      return NextResponse.json(
        { success: false, error: "Incorrect admin password" },
        { status: 401 }
      );
    }

    // Generate a simple deterministic session token based on the admin password
    const token = crypto
      .createHash("sha256")
      .update(`${correctPassword}_love_admin_salt`)
      .digest("hex");

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error("Admin verify error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
