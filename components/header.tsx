import Link from "next/link";
import { BookOpen } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-zinc-100 hover:text-white transition-colors">
          <BookOpen className="h-5 w-5" />
          <span className="text-lg font-semibold">Memorize</span>
        </Link>
      </div>
    </header>
  );
}
