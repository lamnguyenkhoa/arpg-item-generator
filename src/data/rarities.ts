import type { RarityDef } from '../types.ts';

export const RARITIES: RarityDef[] = [
  { id: 'normal', weight: 30, prefixes: [0, 0], suffixes: [0, 0] },
  { id: 'magic', weight: 50, prefixes: [0, 1], suffixes: [0, 1], minAffixes: 1 },
  { id: 'rare', weight: 20, prefixes: [1, 3], suffixes: [1, 3] },
];
