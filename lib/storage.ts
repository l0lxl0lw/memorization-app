import { Document, DocumentSummary } from "./types";
import { countWords } from "./parse-text";

const STORAGE_KEY = "memorize-documents";

function getAll(): Document[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveAll(docs: Document[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

export function listDocuments(): DocumentSummary[] {
  const docs = getAll();
  return docs
    .map((doc) => {
      const totalWords = countWords(doc.text);
      return {
        id: doc.id,
        title: doc.title,
        totalWords,
        blackedOutCount: doc.blackedOutWordIndices.length,
        progress: totalWords > 0 ? (doc.blackedOutWordIndices.length / totalWords) * 100 : 0,
        createdAt: doc.createdAt,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getDocument(id: string): Document | null {
  return getAll().find((d) => d.id === id) ?? null;
}

export function createDocument(title: string, text: string): Document {
  const docs = getAll();
  const now = new Date().toISOString();
  const doc: Document = {
    id: crypto.randomUUID(),
    title,
    text,
    blackedOutWordIndices: [],
    createdAt: now,
    updatedAt: now,
  };
  docs.push(doc);
  saveAll(docs);
  return doc;
}

export function updateDocument(
  id: string,
  update: { toggleWordIndex?: number; blackedOutWordIndices?: number[] }
): Document | null {
  const docs = getAll();
  const doc = docs.find((d) => d.id === id);
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
  saveAll(docs);
  return doc;
}

export function deleteDocument(id: string): boolean {
  const docs = getAll();
  const filtered = docs.filter((d) => d.id !== id);
  if (filtered.length === docs.length) return false;
  saveAll(filtered);
  return true;
}
