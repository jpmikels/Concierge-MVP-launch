import { NextRequest, NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import {
  listThreads,
  createThread,
  getThreadWithRelations,
  CreateThreadInput,
  ThreadStatus,
} from "@/lib/woz";

export async function GET(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as ThreadStatus | null;
  const threadId = searchParams.get("id");

  if (threadId) {
    const thread = getThreadWithRelations(threadId);
    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    return NextResponse.json(thread);
  }

  const threads = listThreads(status || undefined);
  return NextResponse.json(threads);
}

export async function POST(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input: CreateThreadInput = await request.json();

    if (!input.participantId || !input.inboundText) {
      return NextResponse.json(
        { error: "Participant ID and inbound text are required" },
        { status: 400 }
      );
    }

    const thread = createThread(input);
    return NextResponse.json(thread, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
