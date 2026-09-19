import { NextRequest, NextResponse } from "next/server";
import { isWozAuthenticated } from "@/lib/woz/auth";
import { matchQuery, getAnswerById } from "@/lib/matcher";
import { getReferralsByIds } from "@/lib/referrals";

export async function POST(request: NextRequest) {
  if (!(await isWozAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const result = matchQuery(query);

    if (!result.answer) {
      return NextResponse.json({
        match: null,
        confidence: result.confidence,
        clarifyingQuestion: result.clarifyingQuestion,
      });
    }

    const referrals = getReferralsByIds(result.answer.referralIds || []);

    return NextResponse.json({
      match: {
        id: result.answer.id,
        theMove: result.answer.theMove,
        whatToSay: result.answer.whatToSay,
        whomToSayItTo: result.answer.whomToSayItTo,
        orderAndDeadline: result.answer.orderAndDeadline,
        whyItWorks: result.answer.whyItWorks,
        referralIds: result.answer.referralIds,
        reviewStatus: result.answer.reviewStatus,
      },
      referrals,
      confidence: result.confidence,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
