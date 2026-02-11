"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCcw, EyeOff, Trash2 } from "lucide-react";
import { Document } from "@/lib/types";
import { parseText, countWords } from "@/lib/parse-text";
import { WordGrid } from "@/components/word-grid";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Button } from "@/components/ui/button";

export default function MemorizationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [doc, setDoc] = useState<Document | null>(null);
  const [blackedOut, setBlackedOut] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Document) => {
        setDoc(data);
        setBlackedOut(new Set(data.blackedOutWordIndices));
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const toggleWord = useCallback(
    (index: number) => {
      setBlackedOut((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        // Persist in background
        fetch(`/api/documents/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toggleWordIndex: index }),
        });
        return next;
      });
    },
    [id]
  );

  const resetAll = useCallback(() => {
    setBlackedOut(new Set());
    fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blackedOutWordIndices: [] }),
    });
  }, [id]);

  const blackOutAll = useCallback(() => {
    if (!doc) return;
    const total = countWords(doc.text);
    const allIndices = Array.from({ length: total }, (_, i) => i);
    setBlackedOut(new Set(allIndices));
    fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blackedOutWordIndices: allIndices }),
    });
  }, [id, doc]);

  const handleDelete = useCallback(async () => {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    await fetch(`/api/documents/${id}`, { method: "DELETE" });
    router.push("/");
  }, [id, router]);

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
    </div>
  );
}
