import { STAT_EXPANSIONS } from '../data/statExpansions.ts';
import type { Item } from '../types.ts';
import { diffProperties, formatPropertyDelta, isLocal } from './properties.ts';

/** Stat totals keyed by mod text template, so identical stats from different mods stack. */
export type StatTotals = Map<string, number>;

export interface StatDelta {
  text: string;
  delta: number;
}

export function statTotals(items: (Item | undefined)[]): StatTotals {
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

/** Stat changes from replacing `current` with `candidate`. Unchanged stats are omitted. */
export function diffStats(candidate: Item, current: Item | undefined): StatDelta[] {
  const next = statTotals([candidate]);
  const prev = statTotals([current]);
  const keys = new Set([...next.keys(), ...prev.keys()]);
  return [...keys]
    .map((text) => ({ text, delta: (next.get(text) ?? 0) - (prev.get(text) ?? 0) }))
    .filter((d) => d.delta !== 0);
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
