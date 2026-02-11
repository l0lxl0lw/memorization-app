export interface SeedDocument {
  seedId: string;
  title: string;
  text: string;
}

export const SEED_DOCUMENTS: SeedDocument[] = [];

export function seedIfNeeded() {
  // No default seed documents
}
