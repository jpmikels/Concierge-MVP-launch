import { NextRequest, NextResponse } from "next/server";
import { validateWozKey, WOZ_COOKIE_NAME } from "@/lib/woz/auth";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();

    if (!validateWozKey(key)) {
      return NextResponse.json({ error: "Invalid access key" }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(WOZ_COOKIE_NAME, key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/woz",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(WOZ_COOKIE_NAME);
  return response;
}
