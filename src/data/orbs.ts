import type { OrbDef, RarityId } from '../types.ts';

/** Chance that rerolling past an unequipped item drops an orb, by the item's rarity. */
export const ORB_DROP_CHANCE: Record<RarityId, number> = {
  normal: 0.1,
  magic: 0.3,
  rare: 0.7,
};

// Which orb drops is weighted: Exalted most common, Divine rarest.
export const ORBS: OrbDef[] = [
  { id: 'exalted', name: 'Exalted Orb', weight: 45 },
  { id: 'vaal', name: 'Vaal Orb', weight: 28 },
  { id: 'chaos', name: 'Chaos Orb', weight: 19 },
  { id: 'divine', name: 'Divine Orb', weight: 8 },
];
