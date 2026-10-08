import { BASE_STAT_GROWTH_PER_LEVEL } from '../data/scaling.ts';
import type { Defences, WeaponStats } from '../types.ts';

/** Multiplier applied to a base's level-1 damage and defences. */
export const baseStatMultiplier = (itemLevel: number): number => 1 + BASE_STAT_GROWTH_PER_LEVEL * (itemLevel - 1);

export function scaleWeapon(weapon: WeaponStats, itemLevel: number): WeaponStats {
  const m = baseStatMultiplier(itemLevel);
  const physMin = Math.max(1, Math.round(weapon.physMin * m));
  const physMax = Math.max(physMin, Math.round(weapon.physMax * m));
  return { ...weapon, physMin, physMax };
}

export function scaleDefences(defences: Defences, itemLevel: number): Defences {
  const m = baseStatMultiplier(itemLevel);
  const scaled: Defences = {};
  for (const [key, value] of Object.entries(defences) as [keyof Defences, number | undefined][]) {
    if (value !== undefined) scaled[key] = Math.round(value * m);
  }
  return scaled;
}
