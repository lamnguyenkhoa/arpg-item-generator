import { ITEM_RARITY_STAT, RARITIES } from '../data/rarities.ts';
import type { Equipment, RarityDef, RarityId } from '../types.ts';
import { statTotals } from './stats.ts';

/** Total Item Rarity % from all equipped gear. */
export const itemRarityFrom = (equipment: Equipment): number =>
  statTotals(Object.values(equipment)).get(ITEM_RARITY_STAT) ?? 0;

/** Rarity definitions with weights adjusted for the given Item Rarity %. */
export const rarityWeights = (itemRarity: number): RarityDef[] =>
  RARITIES.map((r) => ({ ...r, weight: r.weight * (1 + ((r.itemRarityScaling ?? 0) * Math.max(0, itemRarity)) / 100) }));

/** Drop chance per rarity (0–1) at the given Item Rarity %. */
export function rarityChances(itemRarity: number): { id: RarityId; chance: number }[] {
  const weights = rarityWeights(itemRarity);
  const total = weights.reduce((sum, r) => sum + r.weight, 0);
  return weights.map((r) => ({ id: r.id, chance: r.weight / total }));
}
