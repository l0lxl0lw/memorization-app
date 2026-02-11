"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { MemorizationView } from "@/components/memorization-view";

function DocumentContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-zinc-400">Document not found</p>
      </div>
    );
  }

  return <MemorizationView id={id} />;
}

export default function DocumentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><p className="text-zinc-400">Loading...</p></div>}>
      <DocumentContent />
    </Suspense>
  );
}
