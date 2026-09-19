export type ThreadStatus = "new" | "drafting" | "sent" | "follow_up_due";

export type ReviewStatus = "verified" | "needs_review";

export interface Participant {
  id: string;
  name: string;
  alias?: string;
  phone?: string;
  intakeSource?: string;
  startDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Thread {
  id: string;
  participantId: string;
  inboundText: string;
  status: ThreadStatus;
  isSecondAsk: boolean;
  relatedThreadId?: string;
  createdAt: string;
  updatedAt: string;
  participant?: Participant;
  answer?: Answer;
  followUp?: FollowUp;
}

export interface Answer {
  id: string;
  threadId: string;
  theMove: string;
  whatToSay?: string;
  whomToSayItTo?: string;
  orderAndDeadline?: string;
  whyItWorks?: string;
  referralIds?: string[];
  freeTextReferral?: string;
  reviewStatus: ReviewStatus;
  prefilledFromSeed?: string;
  finalSentText?: string;
  sentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FollowUp {
  id: string;
  threadId: string;
  dueDate: string;
  whatTheyDid?: string;
  showedToSibling?: boolean;
  couldNotAnswer?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WozMetrics {
  participantCount: number;
  questionCount: number;
  secondAskCount: number;
  unresolvedCount: number;
  openFollowUpCount: number;
  sentCount: number;
  draftingCount: number;
}

export interface CreateParticipantInput {
  name: string;
  alias?: string;
  phone?: string;
  intakeSource?: string;
  startDate: string;
  notes?: string;
}

export interface CreateThreadInput {
  participantId: string;
  inboundText: string;
  isSecondAsk?: boolean;
  relatedThreadId?: string;
}

export interface CreateAnswerInput {
  threadId: string;
  theMove: string;
  whatToSay?: string;
  whomToSayItTo?: string;
  orderAndDeadline?: string;
  whyItWorks?: string;
  referralIds?: string[];
  freeTextReferral?: string;
  reviewStatus?: ReviewStatus;
  prefilledFromSeed?: string;
}

export interface UpdateAnswerInput {
  theMove?: string;
  whatToSay?: string;
  whomToSayItTo?: string;
  orderAndDeadline?: string;
  whyItWorks?: string;
  referralIds?: string[];
  freeTextReferral?: string;
  reviewStatus?: ReviewStatus;
  finalSentText?: string;
}

export interface CreateFollowUpInput {
  threadId: string;
  dueDate: string;
}

export interface UpdateFollowUpInput {
  whatTheyDid?: string;
  showedToSibling?: boolean;
  couldNotAnswer?: string;
  notes?: string;
}
