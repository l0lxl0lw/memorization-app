"use client";

import { ParsedToken } from "@/lib/types";
import { WordDisplay } from "./word-display";

interface WordGridProps {
  tokens: ParsedToken[];
  blackedOutIndices: Set<number>;
  onToggleWord: (index: number) => void;
}

export function WordGrid({ tokens, blackedOutIndices, onToggleWord }: WordGridProps) {
  return (
    <div className="leading-relaxed text-lg">
      {tokens.map((token, i) => {
        if (token.type === "linebreak") {
          return <br key={i} />;
        }
        if (token.type === "header") {
          const Tag = `h${Math.min(token.level, 6)}` as keyof React.JSX.IntrinsicElements;
          return (
            <Tag
              key={i}
              className="font-bold text-zinc-300 mt-4 mb-1"
              style={{ fontSize: `${1.5 - (token.level - 1) * 0.15}rem` }}
            >
              {token.text}
            </Tag>
          );
        }
        return (
          <WordDisplay
            key={i}
            text={token.text}
            isBlackedOut={blackedOutIndices.has(token.index)}
            onClick={() => onToggleWord(token.index)}
          />
        );
      })}
    </div>
  );
}
