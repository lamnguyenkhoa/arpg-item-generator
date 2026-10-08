import { CHAOS_REROLL_TIMES, CORRUPTED_ENCHANTS, CORRUPTION_OUTCOMES } from '../data/corruptions.ts';
import { PREFIXES } from '../data/prefixes.ts';
import { RARITIES } from '../data/rarities.ts';
import { SUFFIXES } from '../data/suffixes.ts';
import type { AffixDef, CorruptionOutcomeId, Item, RolledMod } from '../types.ts';
import { affixesFor, canRoll, magicName, rollAffix, rollMod } from './generator.ts';
import { pick, pickWeighted, randInt } from './random.ts';

export interface CorruptionResult {
  item: Item;
  outcome: CorruptionOutcomeId;
  label: string;
}

const rerollValue = (mod: RolledMod): RolledMod => ({ ...mod, value: randInt(mod.min, mod.max) });

/** Removes one random modifier and adds a new one that fits (Chaos Orb style). */
function chaosStep(item: Item): Item {
  const current = [...item.prefixes, ...item.suffixes];
  if (current.length === 0) return item; // Normal items have nothing to reroll.

  const removed = pick(current);
  const prefixes = item.prefixes.filter((m) => m !== removed);
  const suffixes = item.suffixes.filter((m) => m !== removed);
  const rarity = RARITIES.find((r) => r.id === item.rarity)!;

  const available = (pool: AffixDef[], existing: RolledMod[], max: number) =>
    existing.length < max ? affixesFor(pool, item, item.itemLevel).filter((a) => !existing.some((m) => m.text === a.text)) : [];
  const options = [
    { into: prefixes, defs: available(PREFIXES, prefixes, rarity.prefixes[1]) },
    { into: suffixes, defs: available(SUFFIXES, suffixes, rarity.suffixes[1]) },
  ].filter((o) => o.defs.length > 0);

  if (options.length) {
    const option = pick(options);
    option.into.push(rollAffix(pick(option.defs), item.itemLevel));
  }
  return { ...item, prefixes, suffixes };
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
