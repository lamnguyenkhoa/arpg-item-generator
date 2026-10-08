import { BASES } from '../data/bases.ts';
import { RARE_FIRST, RARE_SECOND } from '../data/names.ts';
import { PREFIXES } from '../data/prefixes.ts';
import { SUFFIXES } from '../data/suffixes.ts';
import type { AffixDef, BaseDef, Item, ModDef, RolledMod } from '../types.ts';
import { hasLocalStat } from './properties.ts';
import { pick, pickWeighted, randInt, sample } from './random.ts';
import { rarityWeights } from './rarity.ts';
import { scaleDefences, scaleWeapon } from './scaling.ts';

export const MAX_ITEM_LEVEL = 80;

const rollMod = (mod: ModDef): RolledMod => ({ ...mod, value: randInt(mod.min, mod.max) });

const tiersFor = (affix: AffixDef, itemLevel: number) => affix.tiers.filter((t) => t.minLevel <= itemLevel);

/** Whether the affix can ever roll on this base (ignoring item level). */
export const canRoll = (affix: AffixDef, base: BaseDef): boolean =>
  (!affix.slots || affix.slots.includes(base.slot)) && (!affix.local || hasLocalStat(base, affix.local));

/** Affixes that fit the base and have at least one tier unlocked at this item level. */
const affixesFor = (pool: AffixDef[], base: BaseDef, itemLevel: number) =>
  pool.filter((a) => canRoll(a, base) && tiersFor(a, itemLevel).length > 0);

/** Picks uniformly among unlocked tiers, so higher item levels raise the odds of top tiers. */
function rollAffix(affix: AffixDef, itemLevel: number): RolledMod {
  const tier = pick(tiersFor(affix, itemLevel));
  return {
    name: tier.name,
    text: affix.text,
    min: tier.min,
    max: tier.max,
    value: randInt(tier.min, tier.max),
    tier: affix.tiers.indexOf(tier) + 1,
    local: affix.local,
  };
}

export const formatMod = (mod: RolledMod): string => mod.text.replace('{v}', String(mod.value));

export interface GenerateOptions {
  /** Item Rarity % from equipped gear; raises the odds of magic and rare items. */
  itemRarity?: number;
}

export function generateItem({ itemRarity = 0 }: GenerateOptions = {}): Item {
  const base = pick(BASES);
  const rarity = pickWeighted(rarityWeights(itemRarity));

  let prefixCount = randInt(...rarity.prefixes);
  let suffixCount = randInt(...rarity.suffixes);
  if (rarity.minAffixes && prefixCount + suffixCount < rarity.minAffixes) {
    if (Math.random() < 0.5) prefixCount++;
    else suffixCount++;
  }

  const itemLevel = randInt(1, MAX_ITEM_LEVEL);
  const prefixes = sample(affixesFor(PREFIXES, base, itemLevel), prefixCount).map((a) => rollAffix(a, itemLevel));
  const suffixes = sample(affixesFor(SUFFIXES, base, itemLevel), suffixCount).map((a) => rollAffix(a, itemLevel));

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
    itemLevel,
    weapon: base.weapon && scaleWeapon(base.weapon, itemLevel),
    defences: base.defences && scaleDefences(base.defences, itemLevel),
    implicit: base.implicit && rollMod(base.implicit),
    prefixes,
    suffixes,
  };
}
