"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useStorage } from "@/lib/use-storage";

export default function NewDocumentPage() {
  const router = useRouter();
  const storage = useStorage();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !text.trim()) return;

    setSubmitting(true);
    const doc = await storage.createDocument(title.trim(), text.trim());
    router.push(`/documents?id=${doc.id}`);
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Library
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-zinc-100">New Document</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Romans 8:28-39 (NIV)"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            required
          />
        </div>

        <div>
          <label htmlFor="text" className="mb-1.5 block text-sm font-medium text-zinc-300">
            Text
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the text you want to memorize..."
            rows={12}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-y"
            required
          />
        </div>

        <Button type="submit" disabled={submitting || !title.trim() || !text.trim()}>
          {submitting ? "Creating..." : "Create Document"}
        </Button>
      </form>
    </div>
  );
}
