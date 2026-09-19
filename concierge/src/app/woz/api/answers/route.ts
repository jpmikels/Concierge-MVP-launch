import { NextRequest, NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import {
  createAnswer,
  updateAnswer,
  getAnswer,
  markAnswerSent,
  getAnswerByThread,
  CreateAnswerInput,
  UpdateAnswerInput,
} from "@/lib/woz";

export async function GET(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const threadId = searchParams.get("threadId");
  const answerId = searchParams.get("id");

  if (answerId) {
    const answer = getAnswer(answerId);
    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }
    return NextResponse.json(answer);
  }

  if (threadId) {
    const answer = getAnswerByThread(threadId);
    return NextResponse.json(answer);
  }

  return NextResponse.json({ error: "Thread ID or answer ID required" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const input: CreateAnswerInput = await request.json();

    if (!input.threadId || !input.theMove) {
      return NextResponse.json(
        { error: "Thread ID and the move are required" },
        { status: 400 }
      );
    }

    const answer = createAnswer(input);
    return NextResponse.json(answer, { status: 201 });
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
    const answerId = searchParams.get("id");

    if (!answerId) {
      return NextResponse.json({ error: "Answer ID required" }, { status: 400 });
    }

    const body = await request.json();

    if (body.markSent && body.finalText) {
      const answer = markAnswerSent(answerId, body.finalText);
      return NextResponse.json(answer);
    }

    const input: UpdateAnswerInput = body;
    const answer = updateAnswer(answerId, input);
    return NextResponse.json(answer);
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
