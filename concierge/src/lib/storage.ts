import { InsiderMove } from "./answers";

export interface SavedRecord {
  id: string;
  question: string;
  answer: InsiderMove;
  savedAt: string;
  notes?: string;
}

export interface FamilyRecord {
  records: SavedRecord[];
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "concierge_family_record";

export function getFamilyRecord(): FamilyRecord | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as FamilyRecord;
  } catch {
    return null;
  }
}

export function saveToFamilyRecord(
  question: string,
  answer: InsiderMove
): SavedRecord {
  const existingRecord = getFamilyRecord() || {
    records: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newRecord: SavedRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    question,
    answer,
    savedAt: new Date().toISOString(),
  };

  existingRecord.records.push(newRecord);
  existingRecord.updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRecord));

  return newRecord;
}

export function removeFromFamilyRecord(recordId: string): void {
  const existingRecord = getFamilyRecord();
  if (!existingRecord) return;

  existingRecord.records = existingRecord.records.filter(
    (r) => r.id !== recordId
  );
  existingRecord.updatedAt = new Date().toISOString();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingRecord));
}

export function clearFamilyRecord(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportFamilyRecord(): string {
  const record = getFamilyRecord();
  if (!record || record.records.length === 0) {
    return "No records saved yet.";
  }

  const lines: string[] = [
    "# Mom's Care File",
    `Last updated: ${new Date(record.updatedAt).toLocaleDateString()}`,
    "",
    "---",
    "",
  ];

  for (const item of record.records) {
    lines.push(`## ${item.question}`);
    lines.push(`*Saved ${new Date(item.savedAt).toLocaleDateString()}*`);
    lines.push("");
    lines.push("### The Move");
    lines.push(item.answer.theMove);
    lines.push("");

    if (item.answer.whatToSay) {
      lines.push("### What to Say");
      lines.push(item.answer.whatToSay);
      lines.push("");
    }

    lines.push("### Who to Talk To");
    lines.push(item.answer.whomToSayItTo);
    lines.push("");

    lines.push("### Timing");
    lines.push(item.answer.orderAndDeadline);
    lines.push("");

    if (item.answer.resourcePointer) {
      lines.push("### Resource");
      lines.push(item.answer.resourcePointer);
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  lines.push("");
  lines.push(
    "*This is a personal care reference, not medical, legal, or financial advice.*"
  );

  return lines.join("\n");
}
