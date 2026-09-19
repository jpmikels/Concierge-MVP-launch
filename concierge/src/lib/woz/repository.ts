import db from "./db";
import { randomUUID } from "crypto";
import type {
  Participant,
  Thread,
  Answer,
  FollowUp,
  WozMetrics,
  CreateParticipantInput,
  CreateThreadInput,
  CreateAnswerInput,
  UpdateAnswerInput,
  CreateFollowUpInput,
  UpdateFollowUpInput,
  ThreadStatus,
} from "./types";

function rowToParticipant(row: Record<string, unknown>): Participant {
  return {
    id: row.id as string,
    name: row.name as string,
    alias: row.alias as string | undefined,
    phone: row.phone as string | undefined,
    intakeSource: row.intake_source as string | undefined,
    startDate: row.start_date as string,
    notes: row.notes as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToThread(row: Record<string, unknown>): Thread {
  return {
    id: row.id as string,
    participantId: row.participant_id as string,
    inboundText: row.inbound_text as string,
    status: row.status as ThreadStatus,
    isSecondAsk: Boolean(row.is_second_ask),
    relatedThreadId: row.related_thread_id as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToAnswer(row: Record<string, unknown>): Answer {
  const referralIdsRaw = row.referral_ids as string | null;
  return {
    id: row.id as string,
    threadId: row.thread_id as string,
    theMove: row.the_move as string,
    whatToSay: row.what_to_say as string | undefined,
    whomToSayItTo: row.whom_to_say_it_to as string | undefined,
    orderAndDeadline: row.order_and_deadline as string | undefined,
    whyItWorks: row.why_it_works as string | undefined,
    referralIds: referralIdsRaw ? JSON.parse(referralIdsRaw) : undefined,
    freeTextReferral: row.free_text_referral as string | undefined,
    reviewStatus: row.review_status as "verified" | "needs_review",
    prefilledFromSeed: row.prefilled_from_seed as string | undefined,
    finalSentText: row.final_sent_text as string | undefined,
    sentAt: row.sent_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToFollowUp(row: Record<string, unknown>): FollowUp {
  return {
    id: row.id as string,
    threadId: row.thread_id as string,
    dueDate: row.due_date as string,
    whatTheyDid: row.what_they_did as string | undefined,
    showedToSibling:
      row.showed_to_sibling !== null
        ? Boolean(row.showed_to_sibling)
        : undefined,
    couldNotAnswer: row.could_not_answer as string | undefined,
    notes: row.notes as string | undefined,
    completedAt: row.completed_at as string | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export function createParticipant(input: CreateParticipantInput): Participant {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO participants (id, name, alias, phone, intake_source, start_date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    input.name,
    input.alias || null,
    input.phone || null,
    input.intakeSource || null,
    input.startDate,
    input.notes || null
  );
  return getParticipant(id)!;
}

export function getParticipant(id: string): Participant | null {
  const row = db
    .prepare("SELECT * FROM participants WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToParticipant(row) : null;
}

export function listParticipants(): Participant[] {
  const rows = db
    .prepare("SELECT * FROM participants ORDER BY created_at DESC")
    .all() as Record<string, unknown>[];
  return rows.map(rowToParticipant);
}

export function createThread(input: CreateThreadInput): Thread {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO threads (id, participant_id, inbound_text, is_second_ask, related_thread_id)
    VALUES (?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    input.participantId,
    input.inboundText,
    input.isSecondAsk ? 1 : 0,
    input.relatedThreadId || null
  );
  return getThread(id)!;
}

export function getThread(id: string): Thread | null {
  const row = db
    .prepare("SELECT * FROM threads WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToThread(row) : null;
}

export function getThreadWithRelations(id: string): Thread | null {
  const thread = getThread(id);
  if (!thread) return null;

  thread.participant = getParticipant(thread.participantId) || undefined;
  thread.answer = getAnswerByThread(thread.id) || undefined;
  thread.followUp = getFollowUpByThread(thread.id) || undefined;

  return thread;
}

export function listThreads(status?: ThreadStatus): Thread[] {
  let query = `
    SELECT t.*, p.name as participant_name
    FROM threads t
    JOIN participants p ON t.participant_id = p.id
  `;
  const params: string[] = [];

  if (status) {
    query += " WHERE t.status = ?";
    params.push(status);
  }

  query += " ORDER BY t.created_at DESC";

  const rows = db.prepare(query).all(...params) as Record<string, unknown>[];
  return rows.map((row) => {
    const thread = rowToThread(row);
    thread.participant = {
      id: row.participant_id as string,
      name: row.participant_name as string,
      startDate: "",
      createdAt: "",
      updatedAt: "",
    };
    return thread;
  });
}

export function listThreadsByParticipant(participantId: string): Thread[] {
  const rows = db
    .prepare(
      "SELECT * FROM threads WHERE participant_id = ? ORDER BY created_at DESC"
    )
    .all(participantId) as Record<string, unknown>[];
  return rows.map(rowToThread);
}

export function updateThreadStatus(id: string, status: ThreadStatus): void {
  db.prepare(
    "UPDATE threads SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);
}

export function createAnswer(input: CreateAnswerInput): Answer {
  const id = randomUUID();
  const stmt = db.prepare(`
    INSERT INTO answers (
      id, thread_id, the_move, what_to_say, whom_to_say_it_to,
      order_and_deadline, why_it_works, referral_ids, free_text_referral,
      review_status, prefilled_from_seed
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  stmt.run(
    id,
    input.threadId,
    input.theMove,
    input.whatToSay || null,
    input.whomToSayItTo || null,
    input.orderAndDeadline || null,
    input.whyItWorks || null,
    input.referralIds ? JSON.stringify(input.referralIds) : null,
    input.freeTextReferral || null,
    input.reviewStatus || "needs_review",
    input.prefilledFromSeed || null
  );

  updateThreadStatus(input.threadId, "drafting");

  return getAnswer(id)!;
}

export function getAnswer(id: string): Answer | null {
  const row = db
    .prepare("SELECT * FROM answers WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToAnswer(row) : null;
}

export function getAnswerByThread(threadId: string): Answer | null {
  const row = db
    .prepare("SELECT * FROM answers WHERE thread_id = ?")
    .get(threadId) as Record<string, unknown> | undefined;
  return row ? rowToAnswer(row) : null;
}

export function updateAnswer(id: string, input: UpdateAnswerInput): Answer {
  const updates: string[] = [];
  const params: (string | null)[] = [];

  if (input.theMove !== undefined) {
    updates.push("the_move = ?");
    params.push(input.theMove);
  }
  if (input.whatToSay !== undefined) {
    updates.push("what_to_say = ?");
    params.push(input.whatToSay || null);
  }
  if (input.whomToSayItTo !== undefined) {
    updates.push("whom_to_say_it_to = ?");
    params.push(input.whomToSayItTo || null);
  }
  if (input.orderAndDeadline !== undefined) {
    updates.push("order_and_deadline = ?");
    params.push(input.orderAndDeadline || null);
  }
  if (input.whyItWorks !== undefined) {
    updates.push("why_it_works = ?");
    params.push(input.whyItWorks || null);
  }
  if (input.referralIds !== undefined) {
    updates.push("referral_ids = ?");
    params.push(input.referralIds ? JSON.stringify(input.referralIds) : null);
  }
  if (input.freeTextReferral !== undefined) {
    updates.push("free_text_referral = ?");
    params.push(input.freeTextReferral || null);
  }
  if (input.reviewStatus !== undefined) {
    updates.push("review_status = ?");
    params.push(input.reviewStatus);
  }
  if (input.finalSentText !== undefined) {
    updates.push("final_sent_text = ?");
    params.push(input.finalSentText || null);
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    params.push(id);

    db.prepare(
      `UPDATE answers SET ${updates.join(", ")} WHERE id = ?`
    ).run(...params);
  }

  return getAnswer(id)!;
}

export function markAnswerSent(id: string, finalText: string): Answer {
  const answer = getAnswer(id);
  if (!answer) throw new Error("Answer not found");

  db.prepare(`
    UPDATE answers 
    SET final_sent_text = ?, sent_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(finalText, id);

  updateThreadStatus(answer.threadId, "sent");

  return getAnswer(id)!;
}

export function createFollowUp(input: CreateFollowUpInput): FollowUp {
  const id = randomUUID();
  db.prepare(`
    INSERT INTO follow_ups (id, thread_id, due_date)
    VALUES (?, ?, ?)
  `).run(id, input.threadId, input.dueDate);

  updateThreadStatus(input.threadId, "follow_up_due");

  return getFollowUp(id)!;
}

export function getFollowUp(id: string): FollowUp | null {
  const row = db
    .prepare("SELECT * FROM follow_ups WHERE id = ?")
    .get(id) as Record<string, unknown> | undefined;
  return row ? rowToFollowUp(row) : null;
}

export function getFollowUpByThread(threadId: string): FollowUp | null {
  const row = db
    .prepare("SELECT * FROM follow_ups WHERE thread_id = ?")
    .get(threadId) as Record<string, unknown> | undefined;
  return row ? rowToFollowUp(row) : null;
}

export function updateFollowUp(id: string, input: UpdateFollowUpInput): FollowUp {
  const updates: string[] = [];
  const params: (string | number | null)[] = [];

  if (input.whatTheyDid !== undefined) {
    updates.push("what_they_did = ?");
    params.push(input.whatTheyDid || null);
  }
  if (input.showedToSibling !== undefined) {
    updates.push("showed_to_sibling = ?");
    params.push(input.showedToSibling ? 1 : 0);
  }
  if (input.couldNotAnswer !== undefined) {
    updates.push("could_not_answer = ?");
    params.push(input.couldNotAnswer || null);
  }
  if (input.notes !== undefined) {
    updates.push("notes = ?");
    params.push(input.notes || null);
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    params.push(id);

    db.prepare(
      `UPDATE follow_ups SET ${updates.join(", ")} WHERE id = ?`
    ).run(...params);
  }

  return getFollowUp(id)!;
}

export function completeFollowUp(id: string): FollowUp {
  db.prepare(`
    UPDATE follow_ups 
    SET completed_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(id);

  const followUp = getFollowUp(id)!;
  updateThreadStatus(followUp.threadId, "sent");

  return followUp;
}

export function getMetrics(): WozMetrics {
  const participantCount = (
    db.prepare("SELECT COUNT(*) as count FROM participants").get() as {
      count: number;
    }
  ).count;

  const questionCount = (
    db.prepare("SELECT COUNT(*) as count FROM threads").get() as {
      count: number;
    }
  ).count;

  const secondAskCount = (
    db
      .prepare("SELECT COUNT(*) as count FROM threads WHERE is_second_ask = 1")
      .get() as { count: number }
  ).count;

  const unresolvedCount = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM threads WHERE status IN ('new', 'drafting')"
      )
      .get() as { count: number }
  ).count;

  const openFollowUpCount = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM follow_ups WHERE completed_at IS NULL"
      )
      .get() as { count: number }
  ).count;

  const sentCount = (
    db
      .prepare(
        "SELECT COUNT(*) as count FROM threads WHERE status IN ('sent', 'follow_up_due')"
      )
      .get() as { count: number }
  ).count;

  const draftingCount = (
    db
      .prepare("SELECT COUNT(*) as count FROM threads WHERE status = 'drafting'")
      .get() as { count: number }
  ).count;

  return {
    participantCount,
    questionCount,
    secondAskCount,
    unresolvedCount,
    openFollowUpCount,
    sentCount,
    draftingCount,
  };
}

export function listOpenFollowUps(): (FollowUp & { thread: Thread })[] {
  const rows = db
    .prepare(`
      SELECT f.*, t.inbound_text, t.participant_id, p.name as participant_name
      FROM follow_ups f
      JOIN threads t ON f.thread_id = t.id
      JOIN participants p ON t.participant_id = p.id
      WHERE f.completed_at IS NULL
      ORDER BY f.due_date ASC
    `)
    .all() as Record<string, unknown>[];

  return rows.map((row) => {
    const followUp = rowToFollowUp(row);
    return {
      ...followUp,
      thread: {
        id: row.thread_id as string,
        participantId: row.participant_id as string,
        inboundText: row.inbound_text as string,
        status: "follow_up_due" as ThreadStatus,
        isSecondAsk: false,
        createdAt: "",
        updatedAt: "",
        participant: {
          id: row.participant_id as string,
          name: row.participant_name as string,
          startDate: "",
          createdAt: "",
          updatedAt: "",
        },
      },
    };
  });
}
