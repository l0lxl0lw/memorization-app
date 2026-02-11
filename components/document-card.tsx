import Link from "next/link";
import { DocumentSummary } from "@/lib/types";
import { ProgressBar } from "./ui/progress-bar";

interface DocumentCardProps {
  document: DocumentSummary;
}

export function DocumentCard({ document: doc }: DocumentCardProps) {
  return (
    <Link
      href={`/documents/${doc.id}`}
      className="block rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-600 hover:bg-zinc-800/80"
    >
      <h3 className="mb-3 text-lg font-semibold text-zinc-100 truncate">{doc.title}</h3>
      <ProgressBar value={doc.progress} className="mb-2" />
      <p className="text-sm text-zinc-400">
        {Math.round(doc.progress)}% memorized &middot; {doc.blackedOutCount}/{doc.totalWords} words
      </p>
    </Link>
  );
}
