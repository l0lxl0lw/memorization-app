import { supabase } from "./supabase";
import { Document, DocumentSummary } from "./types";
import { countWords } from "./parse-text";

export async function listDocuments(): Promise<DocumentSummary[]> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map((row) => {
    const totalWords = countWords(row.text);
    const indices: number[] = row.blacked_out_word_indices || [];
    return {
      id: row.id,
      title: row.title,
      totalWords,
      blackedOutCount: indices.length,
      progress: totalWords > 0 ? (indices.length / totalWords) * 100 : 0,
      createdAt: row.created_at,
    };
  });
}

export async function getDocument(id: string): Promise<Document | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    text: data.text,
    blackedOutWordIndices: data.blacked_out_word_indices || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function createDocument(
  userId: string,
  title: string,
  text: string
): Promise<Document> {
  const { data, error } = await supabase
    .from("documents")
    .insert({
      user_id: userId,
      title,
      text,
      blacked_out_word_indices: [],
    })
    .select()
    .single();

  if (error || !data) throw error || new Error("Failed to create document");

  return {
    id: data.id,
    title: data.title,
    text: data.text,
    blackedOutWordIndices: data.blacked_out_word_indices || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateDocument(
  id: string,
  update: { toggleWordIndex?: number; blackedOutWordIndices?: number[]; title?: string; text?: string }
): Promise<Document | null> {
  const patch: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (update.title !== undefined) patch.title = update.title;
  if (update.text !== undefined) {
    patch.text = update.text;
    patch.blacked_out_word_indices = [];
  }

  if (update.blackedOutWordIndices !== undefined) {
    patch.blacked_out_word_indices = update.blackedOutWordIndices;
  } else if (update.toggleWordIndex !== undefined) {
    const doc = await getDocument(id);
    if (!doc) return null;
    const newIndices = [...doc.blackedOutWordIndices];
    const pos = newIndices.indexOf(update.toggleWordIndex);
    if (pos === -1) newIndices.push(update.toggleWordIndex);
    else newIndices.splice(pos, 1);
    patch.blacked_out_word_indices = newIndices;
  }

  if (Object.keys(patch).length === 1) return null; // only updated_at, nothing to do

  const { data, error } = await supabase
    .from("documents")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    title: data.title,
    text: data.text,
    blackedOutWordIndices: data.blacked_out_word_indices || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteDocument(id: string): Promise<boolean> {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  return !error;
}
