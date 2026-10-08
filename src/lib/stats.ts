import type { Item } from '../types.ts';

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
    for (const mod of [item.implicit, ...item.prefixes, ...item.suffixes]) {
      totals.set(mod.text, (totals.get(mod.text) ?? 0) + mod.value);
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
