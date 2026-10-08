import type { OrbDef, RarityId } from '../types.ts';

/**
 * Rerolling past an unequipped item rolls each orb separately, so several can drop at once.
 * An orb's chance = its `dropChance` × the item's rarity multiplier.
 */
export const ORB_RARITY_MULTIPLIER: Record<RarityId, number> = {
  normal: 1,
  magic: 3,
  rare: 7,
};

// Listed most common to rarest. dropChance is per Normal item (e.g. Exalted: 4.5% normal, 31.5% rare).
export const ORBS: OrbDef[] = [
  { id: 'exalted', name: 'Exalted Orb', dropChance: 0.05, description: 'Adds a new random affix to a rare item' },
  { id: 'regal', name: 'Regal Orb', dropChance: 0.05, description: 'Upgrades a magic item to rare, adding a new random affix and keeping the existing ones' },
  { id: 'vaal', name: 'Vaal Orb', dropChance: 0.028, description: 'Corrupts an item with an unpredictable outcome. Corrupted items cannot be modified further' },
  { id: 'chaos', name: 'Chaos Orb', dropChance: 0.019, description: 'Removes a random modifier from a rare item and adds a new random one' },
  { id: 'divine', name: 'Divine Orb', dropChance: 0.008, description: 'Rerolls the values of all modifiers within their ranges' },
];
