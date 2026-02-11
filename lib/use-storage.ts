import { useMemo } from "react";
import { useAuth } from "@/components/auth-provider";
import * as local from "./storage";
import * as cloud from "./supabase-storage";
import { Document, DocumentSummary } from "./types";

export interface Storage {
  listDocuments: () => Promise<DocumentSummary[]>;
  getDocument: (id: string) => Promise<Document | null>;
  createDocument: (title: string, text: string) => Promise<Document>;
  updateDocument: (
    id: string,
    update: { toggleWordIndex?: number; blackedOutWordIndices?: number[] }
  ) => Promise<Document | null>;
  deleteDocument: (id: string) => Promise<boolean>;
}

export function useStorage(): Storage {
  const { user } = useAuth();

  return useMemo<Storage>(() => {
    if (user) {
      return {
        listDocuments: cloud.listDocuments,
        getDocument: cloud.getDocument,
        createDocument: (title, text) => cloud.createDocument(user.id, title, text),
        updateDocument: cloud.updateDocument,
        deleteDocument: cloud.deleteDocument,
      };
    }
    return {
      listDocuments: async () => local.listDocuments(),
      getDocument: async (id) => local.getDocument(id),
      createDocument: async (title, text) => local.createDocument(title, text),
      updateDocument: async (id, update) => local.updateDocument(id, update),
      deleteDocument: async (id) => local.deleteDocument(id),
    };
  }, [user]);
}
