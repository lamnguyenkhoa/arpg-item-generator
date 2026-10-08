import { BASES } from '../data/bases.ts';
import { EQUIP_SLOTS } from '../data/equipment.ts';
import { RARE_FIRST, RARE_SECOND } from '../data/names.ts';
import { PREFIXES } from '../data/prefixes.ts';
import { ITEM_RARITY_STAT, RARITIES } from '../data/rarities.ts';
import { STAT_EXPANSIONS } from '../data/statExpansions.ts';
import { SUFFIXES } from '../data/suffixes.ts';
import type { AffixDef, BaseDef, EquipSlotDef, ModDef, RarityDef } from '../types.ts';
import { canRoll, MAX_ITEM_LEVEL } from './generator.ts';

export interface Issue {
  severity: 'error' | 'warning';
  /** Where the problem is, e.g. "prefixes › +{v} to Maximum Life › T2". */
  where: string;
  message: string;
}

export interface GameData {
  bases: BaseDef[];
  prefixes: AffixDef[];
  suffixes: AffixDef[];
  rarities: RarityDef[];
  equipSlots: EquipSlotDef[];
  rareNames: [first: string[], second: string[]];
  statExpansions: Record<string, string[]>;
}

export const DEFAULT_DATA: GameData = {
  bases: BASES,
  prefixes: PREFIXES,
  suffixes: SUFFIXES,
  rarities: RARITIES,
  equipSlots: EQUIP_SLOTS,
  rareNames: [RARE_FIRST, RARE_SECOND],
  statExpansions: STAT_EXPANSIONS,
};

/** Standard tier count per affix (CONTENT_GUIDE.md 3.2). */
export const STANDARD_TIER_COUNT = 5;

const duplicates = (values: string[]) => [...new Set(values.filter((v, i) => values.indexOf(v) !== i))];

export function validateData(data: GameData = DEFAULT_DATA): Issue[] {
  const issues: Issue[] = [];
  const error = (where: string, message: string) => issues.push({ severity: 'error', where, message });
  const warn = (where: string, message: string) => issues.push({ severity: 'warning', where, message });

  const checkText = (where: string, text: string) => {
    const count = text.split('{v}').length - 1;
    if (count !== 1) error(where, `text must contain exactly one {v}, found ${count}`);
  };

  const checkRange = (where: string, { min, max }: { min: number; max: number }) => {
    if (min > max) error(where, `min (${min}) is greater than max (${max})`);
  };

  // --- Affixes ---
  const checkPool = (poolName: 'prefixes' | 'suffixes', pool: AffixDef[]) => {
    for (const affix of pool) {
      const where = `${poolName} › ${affix.text}`;
      checkText(where, affix.text);

      if (affix.tiers.length === 0) {
        error(where, 'has no tiers');
        continue;
      }

      if (affix.tiers.length !== STANDARD_TIER_COUNT) {
        warn(where, `has ${affix.tiers.length} tiers; the standard is ${STANDARD_TIER_COUNT}`);
      }

      affix.tiers.forEach((tier, i) => {
        const tierWhere = `${where} › T${i + 1} "${tier.name}"`;
        checkRange(tierWhere, tier);
        if (tier.minLevel < 1 || tier.minLevel > MAX_ITEM_LEVEL) {
          error(tierWhere, `minLevel ${tier.minLevel} is outside 1–${MAX_ITEM_LEVEL}, so it can never roll`);
        }
        const isSuffixName = tier.name.startsWith('of ');
        if (poolName === 'suffixes' && !isSuffixName) warn(tierWhere, 'suffix names usually start with "of "');
        if (poolName === 'prefixes' && isSuffixName) warn(tierWhere, 'prefix name looks like a suffix ("of …")');

        // Tiers are strongest first, so the next tier must be weaker.
        const next = affix.tiers[i + 1];
        if (!next) return;
        if (next.minLevel >= tier.minLevel) {
          error(tierWhere, `tiers must be ordered strongest first: T${i + 2} minLevel (${next.minLevel}) should be below ${tier.minLevel}`);
        }
        if (next.min > tier.min || next.max > tier.max) {
          error(tierWhere, `T${i + 2} rolls higher values (${next.min}–${next.max}) than T${i + 1} (${tier.min}–${tier.max})`);
        }
      });

      const lowest = affix.tiers[affix.tiers.length - 1]!;
      if (lowest.minLevel !== 1) warn(where, `lowest tier needs item level ${lowest.minLevel}, so low-level items can never roll this affix`);

      if (!data.bases.some((b) => canRoll(affix, b))) {
        warn(where, affix.local ? `no base has "${affix.local}", so this local affix never rolls` : 'no base can roll this affix');
      }
    }

    // Tier names show up in item names, so they should be unique within a pool.
    for (const name of duplicates(pool.flatMap((a) => a.tiers.map((t) => t.name)))) {
      warn(poolName, `tier name "${name}" is used more than once`);
    }

    // Same stat text twice on one base would let an item roll the same stat twice.
    const clashes = new Map<string, string[]>();
    for (const base of data.bases) {
      const texts = pool.filter((a) => canRoll(a, base)).map((a) => a.text);
      for (const text of duplicates(texts)) clashes.set(text, [...(clashes.get(text) ?? []), base.name]);
    }
    for (const [text, baseNames] of clashes) {
      const shown = baseNames.length > 3 ? `${baseNames.slice(0, 3).join(', ')} +${baseNames.length - 3} more` : baseNames.join(', ');
      error(`${poolName} › ${text}`, `more than one affix with this text can roll on the same base (${shown})`);
    }
  };

  checkPool('prefixes', data.prefixes);

  // Magic names are "<Prefix> <Base>", so a prefix equal to a base's first word reads "Sapphire Sapphire Ring".
  // Base names follow PoE, so the prefix is the one to rename.
  for (const affix of data.prefixes) {
    for (const tier of affix.tiers) {
      const clash = data.bases.find((b) => b.name.split(' ')[0] === tier.name && canRoll(affix, b));
      if (clash) warn(`prefixes › ${affix.text} › "${tier.name}"`, `forms "${tier.name} ${clash.name}"; rename the prefix`);
    }
  }
  checkPool('suffixes', data.suffixes);

  // --- Bases ---
  for (const name of duplicates(data.bases.map((b) => b.name))) error('bases', `base name "${name}" is used more than once`);

  for (const base of data.bases) {
    const where = `bases › ${base.name}`;
    if (base.implicit) {
      const implicit: ModDef = base.implicit;
      checkText(`${where} › implicit`, implicit.text);
      checkRange(`${where} › implicit`, implicit);
    }
    if (base.weapon) {
      const w = base.weapon;
      if (w.physMin <= 0 || w.physMin > w.physMax) error(where, `invalid physical damage ${w.physMin}–${w.physMax}`);
      if (w.attacksPerSecond <= 0) error(where, 'attacksPerSecond must be above 0');
      if (w.critChance < 0 || w.critChance > 100) error(where, 'critChance must be between 0 and 100');
    }
    if (base.defences && !Object.values(base.defences).some((v) => v !== undefined && v > 0)) {
      error(where, 'defences is set but has no value above 0');
    }
    if (base.weapon && base.defences) warn(where, 'has both weapon stats and defences');

    // Every rarity must be able to fill its minimum affix count on every base.
    const prefixCount = data.prefixes.filter((a) => canRoll(a, base)).length;
    const suffixCount = data.suffixes.filter((a) => canRoll(a, base)).length;
    for (const rarity of data.rarities) {
      const tooFew = prefixCount < rarity.prefixes[0] || suffixCount < rarity.suffixes[0] || prefixCount + suffixCount < (rarity.minAffixes ?? 0);
      if (tooFew) {
        error(where, `only ${prefixCount} prefixes / ${suffixCount} suffixes can roll, not enough for ${rarity.id} items`);
      } else if (prefixCount < rarity.prefixes[1] || suffixCount < rarity.suffixes[1]) {
        warn(where, `only ${prefixCount} prefixes / ${suffixCount} suffixes can roll, so ${rarity.id} items can't reach their max affix count`);
      }
    }
  }

  // --- Equipment slots ---
  for (const slot of data.equipSlots) {
    if (!data.bases.some((b) => b.slot === slot.accepts)) warn(`equipment › ${slot.label}`, `no base exists for slot type "${slot.accepts}"`);
  }

  // --- Rarities ---
  for (const id of duplicates(data.rarities.map((r) => r.id))) error('rarities', `rarity "${id}" is defined more than once`);
  for (const rarity of data.rarities) {
    const where = `rarities › ${rarity.id}`;
    if (rarity.weight <= 0) warn(where, 'weight is 0 or less, so it never drops');
    if (rarity.prefixes[0] > rarity.prefixes[1]) error(where, 'prefixes [min, max] is reversed');
    if (rarity.suffixes[0] > rarity.suffixes[1]) error(where, 'suffixes [min, max] is reversed');
    if ((rarity.itemRarityScaling ?? 0) < 0) error(where, 'itemRarityScaling must not be negative');
  }

  const allStatTexts = [
    ...data.bases.flatMap((b) => (b.implicit ? [b.implicit.text] : [])),
    ...data.prefixes.map((a) => a.text),
    ...data.suffixes.map((a) => a.text),
  ];
  if (!allStatTexts.includes(ITEM_RARITY_STAT)) {
    warn('rarities', `nothing grants "${ITEM_RARITY_STAT}" (ITEM_RARITY_STAT), so Item Rarity has no source`);
  }

  // --- Stat expansions ---
  for (const [combined, parts] of Object.entries(data.statExpansions)) {
    const where = `statExpansions › ${combined}`;
    checkText(where, combined);
    parts.forEach((part) => checkText(`${where} › ${part}`, part));
    if (!allStatTexts.includes(combined)) warn(where, 'no base or affix uses this combined stat');
    for (const part of parts) {
      if (!allStatTexts.includes(part)) warn(where, `"${part}" isn't used by any base or affix; check the spelling`);
      if (data.statExpansions[part]) error(where, `"${part}" is itself a combined stat; nested expansions aren't supported`);
    }
  }

  // --- Rare names ---
  data.rareNames.forEach((list, i) => {
    const where = `names › ${i === 0 ? 'RARE_FIRST' : 'RARE_SECOND'}`;
    if (list.length === 0) error(where, 'is empty');
    for (const word of duplicates(list)) warn(where, `"${word}" is listed more than once`);
  });

  return issues;
}

export function formatIssues(issues: Issue[]): string {
  return issues.map((i) => `${i.severity === 'error' ? '✖' : '⚠'} [${i.where}] ${i.message}`).join('\n');
}
