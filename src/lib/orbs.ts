import { ORB_DROP_CHANCE, ORBS } from '../data/orbs.ts';
import type { Item, OrbDef, OrbId } from '../types.ts';
import { chaosStep, corruptItem, rerollValue } from './corruption.ts';
import { addableAffixes, addRandomAffix } from './generator.ts';
import { pickWeighted } from './random.ts';

/** Rolls whether a discarded item drops an orb, and which one. */
export function rollOrbDrop(item: Item): OrbDef | null {
  return Math.random() < ORB_DROP_CHANCE[item.rarity] ? pickWeighted(ORBS) : null;
}

export interface OrbResult {
  item: Item;
  /** Short description of what happened, shown under the controls. */
  note: string;
}

const hasRange = (item: Item) =>
  [item.implicit, ...item.prefixes, ...item.suffixes].some((m) => m && m.min < m.max);

/** Why the orb can't be used on this item, or null if it can. Follows PoE rules. */
export function orbBlocker(orb: OrbId, item: Item): string | null {
  if (item.corrupted) return 'Corrupted items cannot be modified';
  switch (orb) {
    case 'exalted':
      if (item.rarity !== 'rare') return 'Exalted Orb only works on rare items';
      return addableAffixes(item).length ? null : 'No room for another affix';
    case 'chaos':
      return item.rarity === 'rare' ? null : 'Chaos Orb only works on rare items';
    case 'divine':
      return hasRange(item) ? null : 'No modifier values to reroll';
    case 'vaal':
      return null;
  }
}

/** Applies the orb. Call orbBlocker first; this assumes the orb is allowed. */
export function applyOrb(orb: OrbId, item: Item): OrbResult {
  switch (orb) {
    case 'exalted':
      return { item: addRandomAffix(item), note: 'Exalted Orb: added a new affix' };
    case 'chaos':
      // PoE2 behaviour: swaps one random modifier for a new one.
      return { item: chaosStep(item), note: 'Chaos Orb: replaced a random modifier' };
    case 'divine':
      return {
        item: {
          ...item,
          implicit: item.implicit && rerollValue(item.implicit),
          prefixes: item.prefixes.map(rerollValue),
          suffixes: item.suffixes.map(rerollValue),
        },
        note: 'Divine Orb: rerolled modifier values',
      };
    case 'vaal': {
      const result = corruptItem(item);
      return { item: result.item, note: `Vaal Orb: ${result.label}` };
    }
  }
}
