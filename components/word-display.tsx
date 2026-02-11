"use client";

import { cn } from "@/lib/utils";

interface WordDisplayProps {
  text: string;
  isBlackedOut: boolean;
  onClick: () => void;
}

export function WordDisplay({ text, isBlackedOut, onClick }: WordDisplayProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative inline-block cursor-pointer select-none rounded px-1 py-0.5 transition-all duration-150",
        isBlackedOut
          ? "bg-zinc-100 dark:bg-zinc-200"
          : "hover:bg-zinc-700/50"
      )}
    >
      <span
        className={cn(
          "transition-opacity duration-150",
          isBlackedOut
            ? "opacity-0 group-hover:opacity-100"
            : "opacity-100"
        )}
      >
        {text}
      </span>
    </span>
  );
}
