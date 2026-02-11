import Link from "next/link";
import { Plus } from "lucide-react";
import { listDocuments } from "@/lib/documents";
import { DocumentCard } from "@/components/document-card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const documents = await listDocuments();

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
