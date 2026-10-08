import type { OrbDef, RarityId } from '../types.ts';

/** Chance that rerolling past an unequipped item drops an orb, by the item's rarity. */
export const ORB_DROP_CHANCE: Record<RarityId, number> = {
  normal: 0.1,
  magic: 0.3,
  rare: 0.7,
};

// Which orb drops is weighted: Exalted most common, Divine rarest.
export const ORBS: OrbDef[] = [
  { id: 'exalted', name: 'Exalted Orb', weight: 45, description: 'Adds a new random affix to a rare item' },
  { id: 'vaal', name: 'Vaal Orb', weight: 28, description: 'Corrupts an item with an unpredictable outcome. Corrupted items cannot be modified further' },
  { id: 'chaos', name: 'Chaos Orb', weight: 19, description: 'Removes a random modifier from a rare item and adds a new random one' },
  { id: 'divine', name: 'Divine Orb', weight: 8, description: 'Rerolls the values of all modifiers within their ranges' },
];
