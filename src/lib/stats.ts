import { ATTRIBUTE_BONUSES } from '../data/attributes.ts';
import { STAT_EXPANSIONS } from '../data/statExpansions.ts';
import type { Item } from '../types.ts';
import { diffProperties, formatPropertyDelta, isLocal } from './properties.ts';

/** Stat totals keyed by mod text template, so identical stats from different mods stack. */
export type StatTotals = Map<string, number>;

export interface StatDelta {
  text: string;
  delta: number;
}

/** Totals from gear modifiers only, before attribute bonuses. */
export function gearStatTotals(items: (Item | undefined)[]): StatTotals {
  const totals: StatTotals = new Map();
  for (const item of items) {
    if (!item) continue;
    for (const mod of [item.enchant, item.implicit, ...item.prefixes, ...item.suffixes]) {
      // Local mods are already reflected in the item's base properties.
      if (!mod || isLocal(item, mod)) continue;
      // Combined stats (e.g. all Attributes) count toward each stat they grant.
      for (const text of STAT_EXPANSIONS[mod.text] ?? [mod.text]) {
        totals.set(text, (totals.get(text) ?? 0) + mod.value);
      }
    }
  }
  return totals;
}

export interface AttributeBonus {
  /** Attribute name, e.g. "Strength". */
  name: string;
  points: number;
  perPoint: number;
  amount: number;
}

/** Stats granted by attributes (e.g. Strength → Life), keyed by the granted stat text. */
export function attributeBonuses(gearTotals: StatTotals): Map<string, AttributeBonus[]> {
  const bonuses = new Map<string, AttributeBonus[]>();
  for (const { name, attribute, grants, perPoint } of ATTRIBUTE_BONUSES) {
    const points = gearTotals.get(attribute);
    if (!points) continue;
    bonuses.set(grants, [...(bonuses.get(grants) ?? []), { name, points, perPoint, amount: points * perPoint }]);
  }
  return bonuses;
}

/** Full stat totals: gear modifiers plus attribute bonuses merged into the same stats. */
export function statTotals(items: (Item | undefined)[]): StatTotals {
  const totals = gearStatTotals(items);
  for (const [text, bonuses] of attributeBonuses(totals)) {
    totals.set(text, (totals.get(text) ?? 0) + bonuses.reduce((sum, b) => sum + b.amount, 0));
  }
  return totals;
}

/** Hover text explaining where a total comes from, or undefined if it's all from gear. */
export function totalBreakdown(text: string, gearTotals: StatTotals, bonuses: Map<string, AttributeBonus[]>) {
  const fromAttributes = bonuses.get(text);
  if (!fromAttributes) return undefined;
  const gear = gearTotals.get(text) ?? 0;
  return [
    ...(gear ? [`${gear} from gear`] : []),
    ...fromAttributes.map((b) => `${b.amount} from ${b.points} ${b.name} (×${b.perPoint})`),
  ].join(' + ');
}

// Display order for stat totals: related stats sit together (attributes, then life/mana, defences,
// resistances, damage, speed/crit, utility). Earlier patterns win; unmatched stats go last.
const STAT_ORDER: RegExp[] = [
  /Strength/, /Dexterity/, /Intelligence/,
  /Maximum Life/, /Life per second/, /Life gained/, /Leeched as Life/,
  /Maximum Mana/, /Mana Regeneration/,
  /Armour/, /Evasion/, /Energy Shield/,
  /Fire Resistance/, /Cold Resistance/, /Lightning Resistance/, /Resistance/,
  /Adds .* Physical Damage/, /Adds .* Fire Damage/, /Adds .* Cold Damage/, /Adds .* Lightning Damage/, /Adds /,
  /Physical Damage/, /Damage/,
  /Attack Speed/, /Accuracy/, /Critical/,
  /Rarity/,
];

const statRank = (text: string): number => {
  const i = STAT_ORDER.findIndex((re) => re.test(text));
  return i === -1 ? STAT_ORDER.length : i;
};

/** Totals as entries, grouped so related stats are listed next to each other. */
export const sortedStatTotals = (totals: StatTotals): [string, number][] =>
  [...totals].sort(([a], [b]) => statRank(a) - statRank(b));

/** Stat changes from replacing `current` with `candidate`. Unchanged stats are omitted. */
export function diffStats(candidate: Item, current: Item | undefined): StatDelta[] {
  const next = statTotals([candidate]);
  const prev = statTotals([current]);
  const keys = new Set([...next.keys(), ...prev.keys()]);
  return [...keys]
    .map((text) => ({ text, delta: (next.get(text) ?? 0) - (prev.get(text) ?? 0) }))
    .filter((d) => d.delta !== 0)
    .sort((a, b) => statRank(a.text) - statRank(b.text));
}

export const formatTotal = (text: string, value: number): string => text.replace('{v}', String(value));

/** Always shows the sign, e.g. "+12 to Strength" / "-5% increased Armour". */
export const formatDelta = ({ text, delta }: StatDelta): string =>
  text.replace(/^\+/, '').replace('{v}', delta > 0 ? `+${delta}` : String(delta));

export interface DiffLine {
  key: string;
  text: string;
  delta: number;
}

/** Full comparison: base property changes (DPS, Armour…) first, then stat changes. */
export function compareItems(candidate: Item, current: Item | undefined): DiffLine[] {
  return [
    ...diffProperties(candidate, current).map((d) => ({ key: `prop:${d.key}`, text: formatPropertyDelta(d), delta: d.delta })),
    ...diffStats(candidate, current).map((d) => ({ key: d.text, text: formatDelta(d), delta: d.delta })),
  ];
}
