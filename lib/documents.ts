import { promises as fs } from "fs";
import path from "path";
import { Document, DocumentSummary } from "./types";
import { countWords } from "./parse-text";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function filePath(id: string): string {
  return path.join(DATA_DIR, `${id}.json`);
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  await ensureDataDir();
  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json"));

  const summaries: DocumentSummary[] = [];
  for (const file of jsonFiles) {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf-8");
    const doc: Document = JSON.parse(raw);
    const totalWords = countWords(doc.text);
    summaries.push({
      id: doc.id,
      title: doc.title,
      totalWords,
      blackedOutCount: doc.blackedOutWordIndices.length,
      progress: totalWords > 0 ? (doc.blackedOutWordIndices.length / totalWords) * 100 : 0,
      createdAt: doc.createdAt,
    });
  }

  summaries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return summaries;
}

export async function getDocument(id: string): Promise<Document | null> {
  try {
    const raw = await fs.readFile(filePath(id), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function createDocument(title: string, text: string): Promise<Document> {
  await ensureDataDir();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const doc: Document = {
    id,
    title,
    text,
    blackedOutWordIndices: [],
    createdAt: now,
    updatedAt: now,
  };
  await fs.writeFile(filePath(id), JSON.stringify(doc, null, 2));
  return doc;
}

export async function updateDocument(
  id: string,
  update: { toggleWordIndex?: number; blackedOutWordIndices?: number[] }
): Promise<Document | null> {
  const doc = await getDocument(id);
  if (!doc) return null;

  if (update.blackedOutWordIndices !== undefined) {
    doc.blackedOutWordIndices = update.blackedOutWordIndices;
  } else if (update.toggleWordIndex !== undefined) {
    const idx = update.toggleWordIndex;
    const pos = doc.blackedOutWordIndices.indexOf(idx);
    if (pos === -1) {
      doc.blackedOutWordIndices.push(idx);
    } else {
      doc.blackedOutWordIndices.splice(pos, 1);
    }
  }

  doc.updatedAt = new Date().toISOString();
  await fs.writeFile(filePath(id), JSON.stringify(doc, null, 2));
  return doc;
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    await fs.unlink(filePath(id));
    return true;
  } catch {
    return false;
  }
}
