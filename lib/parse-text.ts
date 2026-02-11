import { ParsedToken } from "./types";

export function parseText(text: string): ParsedToken[] {
  // Normalize <br> tags to newlines
  const normalized = text.replace(/<br\s*\/?>/gi, "\n");
  const lines = normalized.split("\n");
  const tokens: ParsedToken[] = [];
  let wordIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      tokens.push({ type: "linebreak" });
      continue;
    }

    // Detect markdown headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      tokens.push({
        type: "header",
        level: headerMatch[1].length,
        text: headerMatch[2],
      });
      tokens.push({ type: "linebreak" });
      continue;
    }

    // Split line into words
    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
    for (const word of words) {
      tokens.push({ type: "word", index: wordIndex, text: word });
      wordIndex++;
    }

    // Add linebreak between lines (but not after the last line)
    if (i < lines.length - 1) {
      tokens.push({ type: "linebreak" });
    }
  }

  return tokens;
}

export function countWords(text: string): number {
  const tokens = parseText(text);
  return tokens.filter((t) => t.type === "word").length;
}
