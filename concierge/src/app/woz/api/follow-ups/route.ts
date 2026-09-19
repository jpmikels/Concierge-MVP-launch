import { NextRequest, NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import {
  createFollowUp,
  updateFollowUp,
  completeFollowUp,
  listOpenFollowUps,
  CreateFollowUpInput,
  UpdateFollowUpInput,
} from "@/lib/woz";

export async function GET() {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const followUps = listOpenFollowUps();
  return NextResponse.json(followUps);
}

export async function POST(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input: CreateFollowUpInput = await request.json();

    if (!input.threadId || !input.dueDate) {
      return NextResponse.json(
        { error: "Thread ID and due date are required" },
        { status: 400 }
      );
    }

    const followUp = createFollowUp(input);
    return NextResponse.json(followUp, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const followUpId = searchParams.get("id");

    if (!followUpId) {
      return NextResponse.json({ error: "Follow-up ID required" }, { status: 400 });
    }

    const body = await request.json();

    if (body.complete) {
      const followUp = completeFollowUp(followUpId);
      return NextResponse.json(followUp);
    }

    const input: UpdateFollowUpInput = body;
    const followUp = updateFollowUp(followUpId, input);
    return NextResponse.json(followUp);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
