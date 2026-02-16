"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, EyeOff, Trash2, Pencil, X, Check } from "lucide-react";
import { Document } from "@/lib/types";
import { parseText, countWords } from "@/lib/parse-text";
import { useAuth } from "@/components/auth-provider";
import { useStorage } from "@/lib/use-storage";
import { WordGrid } from "@/components/word-grid";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";

export function MemorizationView({ id }: { id: string }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const storage = useStorage();
  const [doc, setDoc] = useState<Document | null>(null);
  const [blackedOut, setBlackedOut] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    storage.getDocument(id).then((data) => {
      if (!data) {
        router.push("/");
        return;
      }
      setDoc(data);
      setBlackedOut(new Set(data.blackedOutWordIndices));
      setLoading(false);
    });
  }, [id, router, authLoading, storage]);

  const toggleWord = useCallback(
    (index: number) => {
      setBlackedOut((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        storage.updateDocument(id, { blackedOutWordIndices: Array.from(next) });
        return next;
      });
    },
    [id, storage]
  );

  const resetAll = useCallback(() => {
    setBlackedOut(new Set());
    storage.updateDocument(id, { blackedOutWordIndices: [] });
  }, [id, storage]);

  const blackOutAll = useCallback(() => {
    if (!doc) return;
    const total = countWords(doc.text);
    const allIndices = Array.from({ length: total }, (_, i) => i);
    setBlackedOut(new Set(allIndices));
    storage.updateDocument(id, { blackedOutWordIndices: allIndices });
  }, [id, doc, storage]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    await storage.deleteDocument(id);
    router.push("/");
  }, [id, router, storage]);

  const startEditing = useCallback(() => {
    if (!doc) return;
    setEditTitle(doc.title);
    setEditText(doc.text);
    setEditing(true);
  }, [doc]);

  const cancelEditing = useCallback(() => {
    setEditing(false);
  }, []);

  const saveEdit = useCallback(async () => {
    if (!doc || !editTitle.trim() || !editText.trim()) return;
    setSaving(true);
    const textChanged = editText.trim() !== doc.text;
    const updated = await storage.updateDocument(id, {
      title: editTitle.trim(),
      text: editText.trim(),
      ...(textChanged ? { blackedOutWordIndices: [] } : {}),
    });
    if (updated) {
      setDoc(updated);
      if (textChanged) setBlackedOut(new Set());
      else setBlackedOut(new Set(updated.blackedOutWordIndices));
    }
    setSaving(false);
    setEditing(false);
  }, [id, doc, editTitle, editText, storage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!doc) return null;

  const tokens = parseText(doc.text);
  const totalWords = countWords(doc.text);
  const progress = totalWords > 0 ? (blackedOut.size / totalWords) * 100 : 0;

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </Link>

      {editing ? (
        <div className="space-y-5">
          <div>
            <label htmlFor="edit-title" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>
          <div>
            <label htmlFor="edit-text" className="mb-1.5 block text-sm font-medium text-zinc-300">
              Text
            </label>
            <textarea
              id="edit-text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={12}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y"
              required
            />
            {editText.trim() !== doc.text && (
              <p className="mt-1.5 text-xs text-amber-400">
                Changing the text will reset your memorization progress.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={saveEdit} disabled={saving || !editTitle.trim() || !editText.trim()}>
              <Check className="h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button variant="secondary" onClick={cancelEditing} disabled={saving}>
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <h1 className="mb-3 text-2xl font-bold text-zinc-100">{doc.title}</h1>
            <div className="flex items-center gap-3">
              <ProgressBar value={progress} className="flex-1" />
              <span className="text-sm font-medium text-zinc-400 whitespace-nowrap">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={resetAll}>
              <RotateCcw className="h-4 w-4" />
              Reset All
            </Button>
            <Button variant="secondary" onClick={blackOutAll}>
              <EyeOff className="h-4 w-4" />
              Black Out All
            </Button>
            {user && (
              <Button variant="secondary" onClick={startEditing}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <WordGrid
              tokens={tokens}
              blackedOutIndices={blackedOut}
              onToggleWord={toggleWord}
            />
          </div>
        </>
      )}
    </div>
  );
}
