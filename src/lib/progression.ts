import { EQUIP_SLOTS } from '../data/equipment.ts';
import { ITEM_LEVEL_SPREAD } from '../data/scaling.ts';
import type { Equipment } from '../types.ts';
import { MAX_ITEM_LEVEL } from './generator.ts';

/** Average item level across all equipment slots. Empty slots count as 0, so a fresh character is 0. */
export const averageItemLevel = (equipment: Equipment): number =>
  Math.round(EQUIP_SLOTS.reduce((sum, s) => sum + (equipment[s.id]?.itemLevel ?? 0), 0) / EQUIP_SLOTS.length);

/** Item level range new drops roll in: average ± spread, clamped to 1–MAX_ITEM_LEVEL. */
export function dropLevelRange(equipment: Equipment): [min: number, max: number] {
  const avg = averageItemLevel(equipment);
  const clamp = (n: number) => Math.min(MAX_ITEM_LEVEL, Math.max(1, n));
  return [clamp(avg - ITEM_LEVEL_SPREAD), clamp(avg + ITEM_LEVEL_SPREAD)];
}
