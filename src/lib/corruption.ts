import { CHAOS_REROLL_TIMES, CORRUPTED_ENCHANTS, CORRUPTION_OUTCOMES } from '../data/corruptions.ts';
import type { CorruptionOutcomeId, Item, RolledMod } from '../types.ts';
import { addRandomAffix, canRoll, magicName, rollMod } from './generator.ts';
import { pick, pickWeighted, randInt } from './random.ts';

export interface CorruptionResult {
  item: Item;
  outcome: CorruptionOutcomeId;
  label: string;
}

export const rerollValue = (mod: RolledMod): RolledMod => ({ ...mod, value: randInt(mod.min, mod.max) });

/** Removes one random modifier and adds a new one that fits (Chaos Orb style). */
export function chaosStep(item: Item): Item {
  const current = [...item.prefixes, ...item.suffixes];
  if (current.length === 0) return item; // Normal items have nothing to reroll.

  const removed = pick(current);
  const next: Item = {
    ...item,
    prefixes: item.prefixes.filter((m) => m !== removed),
    suffixes: item.suffixes.filter((m) => m !== removed),
  };
  return addRandomAffix(next);
}

/** Vaal Orb: corrupts the item and applies one random outcome. Corrupted items can't be corrupted again. */
export function corruptItem(item: Item): CorruptionResult {
  if (item.corrupted) return { item, outcome: 'none', label: 'Already corrupted' };

  const outcome = pickWeighted(CORRUPTION_OUTCOMES);
  let next: Item = { ...item, corrupted: true };

  switch (outcome.id) {
    case 'none':
      break;
    case 'enchant': {
      const pool = CORRUPTED_ENCHANTS.filter((e) => canRoll(e, item));
      if (pool.length) next.enchant = rollMod(pick(pool));
      break;
    }
    case 'chaos': {
      const times = randInt(...CHAOS_REROLL_TIMES);
      for (let i = 0; i < times; i++) next = chaosStep(next);
      break;
    }
    case 'values': // Placeholder for PoE2's socket outcome (see data/corruptions.ts).
      next = {
        ...next,
        implicit: next.implicit && rerollValue(next.implicit),
        prefixes: next.prefixes.map(rerollValue),
        suffixes: next.suffixes.map(rerollValue),
      };
      break;
  }

  if (next.rarity === 'magic') next.name = magicName(next.baseName, next.prefixes, next.suffixes);
  return { item: next, outcome: outcome.id, label: outcome.label };
}
