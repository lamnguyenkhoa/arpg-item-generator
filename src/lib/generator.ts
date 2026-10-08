import { BASES, PREFIXES, SUFFIXES, RARE_FIRST, RARE_SECOND, RARITIES } from '../data/items.ts';
import type { AffixDef, Item, ModDef, RolledMod, Slot } from '../types.ts';
import { pick, pickWeighted, randInt, sample } from './random.ts';

const rollMod = (mod: ModDef & { name?: string }): RolledMod => ({
  ...mod,
  value: randInt(mod.min, mod.max),
});

const affixesFor = (pool: AffixDef[], slot: Slot) =>
  pool.filter((a) => !a.slots || a.slots.includes(slot));

export const formatMod = (mod: RolledMod): string => mod.text.replace('{v}', String(mod.value));

export function generateItem(): Item {
  const base = pick(BASES);
  const rarity = pickWeighted(RARITIES);

  let prefixCount = randInt(...rarity.prefixes);
  let suffixCount = randInt(...rarity.suffixes);
  if (rarity.minAffixes && prefixCount + suffixCount < rarity.minAffixes) {
    if (Math.random() < 0.5) prefixCount++;
    else suffixCount++;
  }

  const prefixes = sample(affixesFor(PREFIXES, base.slot), prefixCount).map(rollMod);
  const suffixes = sample(affixesFor(SUFFIXES, base.slot), suffixCount).map(rollMod);

  let name: string;
  switch (rarity.id) {
    case 'rare':
      name = `${pick(RARE_FIRST)} ${pick(RARE_SECOND)}`;
      break;
    case 'magic':
      name = [prefixes[0]?.name, base.name, suffixes[0]?.name].filter(Boolean).join(' ');
      break;
    case 'normal':
      name = base.name;
      break;
  }

  return {
    id: crypto.randomUUID(),
    name,
    baseName: base.name,
    slot: base.slot,
    rarity: rarity.id,
    itemLevel: randInt(1, 80),
    implicit: rollMod(base.implicit),
    prefixes,
    suffixes,
  };
}
