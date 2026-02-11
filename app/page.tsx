"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { useStorage } from "@/lib/use-storage";
import { seedIfNeeded } from "@/lib/seed";
import { DocumentSummary } from "@/lib/types";
import { DocumentCard } from "@/components/document-card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { loading: authLoading } = useAuth();
  const storage = useStorage();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

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
        <div className="grid gap-4 sm:grid-cols-2">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
