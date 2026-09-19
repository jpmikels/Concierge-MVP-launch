import { NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import { getMetrics } from "@/lib/woz";

export async function GET() {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const metrics = getMetrics();
  return NextResponse.json(metrics);
}
