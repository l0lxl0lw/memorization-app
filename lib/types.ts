export interface Document {
  id: string;
  title: string;
  text: string;
  blackedOutWordIndices: number[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSummary {
  id: string;
  title: string;
  totalWords: number;
  blackedOutCount: number;
  progress: number;
  createdAt: string;
}

export type ParsedToken =
  | { type: "word"; index: number; text: string }
  | { type: "linebreak" }
  | { type: "header"; level: number; text: string };
