"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, Plus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useStorage } from "@/lib/use-storage";
import { seedIfNeeded } from "@/lib/seed";
import { DocumentSummary } from "@/lib/types";
import { DocumentCard } from "@/components/document-card";
import { Button } from "@/components/ui/button";

type SortOption = "date" | "name-asc" | "name-desc" | "progress";

function sortDocuments(docs: DocumentSummary[], sort: SortOption): DocumentSummary[] {
  const sorted = [...docs];
  switch (sort) {
    case "date":
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case "name-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    case "progress":
      return sorted.sort((a, b) => b.progress - a.progress);
  }
}

export default function DashboardPage() {
  const { loading: authLoading } = useAuth();
  const storage = useStorage();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sort, setSort] = useState<SortOption>("date");

  const sortedDocuments = useMemo(() => sortDocuments(documents, sort), [documents, sort]);

  useEffect(() => {
    if (authLoading) return;

    storage.listDocuments().then((docs) => {
      setDocuments(docs);
      setLoaded(true);
    });
  }, [authLoading, storage]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Library</h1>
        <Link href="/documents/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Document
          </Button>
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-700 py-20 text-center">
          <p className="text-lg text-zinc-400">No documents yet</p>
          <p className="mt-1 text-sm text-zinc-500">
            Add a passage to start memorizing
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-zinc-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 outline-none focus:border-zinc-500"
            >
              <option value="date">Date Added</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="progress">Completion %</option>
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedDocuments.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
