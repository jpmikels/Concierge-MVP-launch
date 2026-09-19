import { NextRequest, NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import { listParticipants, createParticipant } from "@/lib/woz/repository";
import type { CreateParticipantInput } from "@/lib/woz/types";

export async function GET() {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const participants = listParticipants();
  return NextResponse.json(participants);
}

export async function POST(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input: CreateParticipantInput = await request.json();

    if (!input.name || !input.startDate) {
      return NextResponse.json(
        { error: "Name and start date are required" },
        { status: 400 }
      );
    }

    const participant = createParticipant(input);
    return NextResponse.json(participant, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
