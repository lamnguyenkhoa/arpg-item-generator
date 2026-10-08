import type { RarityDef } from '../types.ts';

/** Stat text whose equipped total boosts rarer drops. Must match the affix/implicit text exactly. */
export const ITEM_RARITY_STAT = '+{v}% Item Rarity';

// Effective weight = weight × (1 + itemRarityScaling × itemRarity% / 100).
// Higher scaling on rarer tiers means Item Rarity pushes odds toward rares, not just magic.
export const RARITIES: RarityDef[] = [
  { id: 'normal', weight: 30, itemRarityScaling: 0, prefixes: [0, 0], suffixes: [0, 0] },
  { id: 'magic', weight: 50, itemRarityScaling: 1, prefixes: [0, 1], suffixes: [0, 1], minAffixes: 1 },
  { id: 'rare', weight: 20, itemRarityScaling: 2, prefixes: [1, 3], suffixes: [1, 3] },
];
