import { BASES } from '../data/bases.ts';
import { RARE_FIRST, RARE_SECOND } from '../data/names.ts';
import { PREFIXES } from '../data/prefixes.ts';
import { SUFFIXES } from '../data/suffixes.ts';
import { RARITIES } from '../data/rarities.ts';
import type { AffixDef, BaseDef, Item, ModDef, RarityDef, RolledMod } from '../types.ts';

/** Anything with a slot and base stats: a base definition or a rolled item. */
type RollTarget = Pick<BaseDef, 'slot' | 'weapon' | 'defences'>;
import { hasLocalStat } from './properties.ts';
import { pick, pickWeighted, randInt, sample } from './random.ts';
import { rarityWeights } from './rarity.ts';
import { scaleDefences, scaleWeapon } from './scaling.ts';

export const MAX_ITEM_LEVEL = 80;

const SLOT_TYPES = [...new Set(BASES.map((b) => b.slot))];

export const rollMod = (mod: ModDef): RolledMod => ({ ...mod, value: randInt(mod.min, mod.max) });

const tiersFor = (affix: AffixDef, itemLevel: number) => affix.tiers.filter((t) => t.minLevel <= itemLevel);

/** Whether the affix (or enchant) can ever roll on this base or item (ignoring item level). */
export const canRoll = (affix: Pick<AffixDef, 'slots' | 'local'>, base: RollTarget): boolean =>
  (!affix.slots || affix.slots.includes(base.slot)) && (!affix.local || hasLocalStat(base, affix.local));

/** Affixes that fit the base and have at least one tier unlocked at this item level. */
export const affixesFor = (pool: AffixDef[], base: RollTarget, itemLevel: number) =>
  pool.filter((a) => canRoll(a, base) && tiersFor(a, itemLevel).length > 0);

/** Picks uniformly among unlocked tiers, so higher item levels raise the odds of top tiers. */
export function rollAffix(affix: AffixDef, itemLevel: number): RolledMod {
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

/** Rolls a fresh set of prefixes and suffixes for the given rarity. */
export function rollAffixes(base: RollTarget, rarity: RarityDef, itemLevel: number) {
  let prefixCount = randInt(...rarity.prefixes);
  let suffixCount = randInt(...rarity.suffixes);
  if (rarity.minAffixes && prefixCount + suffixCount < rarity.minAffixes) {
    if (Math.random() < 0.5) prefixCount++;
    else suffixCount++;
  }
  return {
    prefixes: sample(affixesFor(PREFIXES, base, itemLevel), prefixCount).map((a) => rollAffix(a, itemLevel)),
    suffixes: sample(affixesFor(SUFFIXES, base, itemLevel), suffixCount).map((a) => rollAffix(a, itemLevel)),
  };
}

/**
 * Affixes that could still be added to the item, grouped by prefix/suffix: they fit the base, are unlocked at its
 * item level, aren't already on it, and the item's rarity has room for another. Empty groups are left out.
 */
export function addableAffixes(item: Item): { kind: 'prefixes' | 'suffixes'; defs: AffixDef[] }[] {
  const rarity = RARITIES.find((r) => r.id === item.rarity)!;
  const available = (pool: AffixDef[], existing: RolledMod[], max: number) =>
    existing.length < max
      ? affixesFor(pool, item, item.itemLevel).filter((a) => !existing.some((m) => m.text === a.text))
      : [];
  return [
    { kind: 'prefixes' as const, defs: available(PREFIXES, item.prefixes, rarity.prefixes[1]) },
    { kind: 'suffixes' as const, defs: available(SUFFIXES, item.suffixes, rarity.suffixes[1]) },
  ].filter((o) => o.defs.length > 0);
}

/** Adds one random affix that fits (Exalted Orb style). Returns the item unchanged if there's no room. */
export function addRandomAffix(item: Item): Item {
  const options = addableAffixes(item);
  if (!options.length) return item;
  const { kind, defs } = pick(options);
  return { ...item, [kind]: [...item[kind], rollAffix(pick(defs), item.itemLevel)] };
}

export const rareName = (): string => `${pick(RARE_FIRST)} ${pick(RARE_SECOND)}`;

/** Magic item name: "<first prefix> <base> <first suffix>". */
export const magicName = (baseName: string, prefixes: RolledMod[], suffixes: RolledMod[]): string =>
  [prefixes[0]?.name, baseName, suffixes[0]?.name].filter(Boolean).join(' ');

export const formatMod = (mod: RolledMod): string => mod.text.replace('{v}', String(mod.value));

export interface GenerateOptions {
  /** Item Rarity % from equipped gear; raises the odds of magic and rare items. */
  itemRarity?: number;
  /** Item level range to roll in. Defaults to the full 1–MAX_ITEM_LEVEL range. */
  levelRange?: [min: number, max: number];
}

export function generateItem({ itemRarity = 0, levelRange = [1, MAX_ITEM_LEVEL] }: GenerateOptions = {}): Item {
  // Pick the slot type first so slots with many bases don't drop more often.
  const slot = pick(SLOT_TYPES);
  const base = pick(BASES.filter((b) => b.slot === slot));
  const rarity = pickWeighted(rarityWeights(itemRarity));

  const itemLevel = randInt(...levelRange);
  const { prefixes, suffixes } = rollAffixes(base, rarity, itemLevel);

  let name: string;
  switch (rarity.id) {
    case 'rare':
      name = rareName();
      break;
    case 'magic':
      name = magicName(base.name, prefixes, suffixes);
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
