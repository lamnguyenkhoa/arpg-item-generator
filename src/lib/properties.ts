import type { Defences, Item, LocalStat, RolledMod } from '../types.ts';

/** A base stat shown at the top of the item card, with local mods applied. */
export interface Property {
  key: string;
  label: string;
  value: number;
  text: string;
  /** Modified by a local affix (shown highlighted, like PoE). */
  augmented: boolean;
  decimals: number;
  unit?: '%';
  /** Shown in the compare view. */
  compare: boolean;
  /** Summed in the equipment totals. */
  total: boolean;
}

export interface PropertyDelta {
  key: string;
  label: string;
  delta: number;
  decimals: number;
  unit?: '%';
}

type StatHolder = Pick<Item, 'weapon' | 'defences'>;

const DEFENCES: [keyof Defences, string][] = [
  ['armour', 'Armour'],
  ['evasion', 'Evasion Rating'],
  ['energyShield', 'Energy Shield'],
];

export function hasLocalStat(holder: StatHolder, stat: LocalStat): boolean {
  switch (stat) {
    case 'physicalDamage':
    case 'attackSpeed':
      return holder.weapon !== undefined;
    case 'armour':
    case 'evasion':
    case 'energyShield':
      return (holder.defences?.[stat] ?? 0) > 0;
  }
}

/** True when the mod modifies the item's own base stats instead of the character. */
export const isLocal = (item: StatHolder, mod: RolledMod): boolean =>
  mod.local !== undefined && hasLocalStat(item, mod.local);

const localPercent = (item: Item, stat: LocalStat): number =>
  [...item.prefixes, ...item.suffixes].filter((m) => m.local === stat).reduce((sum, m) => sum + m.value, 0);

const round = (n: number, decimals: number) => Number(n.toFixed(decimals));

export function itemProperties(item: Item): Property[] {
  const props: Property[] = [];

  if (item.weapon) {
    const w = item.weapon;
    const physPct = localPercent(item, 'physicalDamage');
    const speedPct = localPercent(item, 'attackSpeed');
    const min = Math.round(w.physMin * (1 + physPct / 100));
    const max = Math.round(w.physMax * (1 + physPct / 100));
    const aps = round(w.attacksPerSecond * (1 + speedPct / 100), 2);
    const dps = round(((min + max) / 2) * aps, 1);

    props.push(
      { key: 'physicalDamage', label: 'Physical Damage', value: (min + max) / 2, text: `${min}–${max}`, augmented: physPct > 0, decimals: 1, compare: false, total: false },
      { key: 'critChance', label: 'Critical Strike Chance', value: w.critChance, text: `${w.critChance.toFixed(2)}%`, augmented: false, decimals: 2, unit: '%', compare: true, total: false },
      { key: 'attacksPerSecond', label: 'Attacks per Second', value: aps, text: aps.toFixed(2), augmented: speedPct > 0, decimals: 2, compare: true, total: false },
      { key: 'physicalDps', label: 'Physical DPS', value: dps, text: dps.toFixed(1), augmented: physPct > 0 || speedPct > 0, decimals: 1, compare: true, total: true },
    );
  }

  for (const [key, label] of DEFENCES) {
    const base = item.defences?.[key];
    if (!base) continue;
    const pct = localPercent(item, key);
    const value = Math.round(base * (1 + pct / 100));
    props.push({ key, label, value, text: String(value), augmented: pct > 0, decimals: 0, compare: true, total: true });
  }

  return props;
}

/** Property changes from replacing `current` with `candidate`. Unchanged values are omitted. */
export function diffProperties(candidate: Item, current: Item | undefined): PropertyDelta[] {
  const next = itemProperties(candidate).filter((p) => p.compare);
  const prev = current ? itemProperties(current).filter((p) => p.compare) : [];
  const keys = new Set([...next, ...prev].map((p) => p.key));

  return [...keys]
    .map((key) => {
      const a = next.find((p) => p.key === key);
      const b = prev.find((p) => p.key === key);
      const meta = (a ?? b)!;
      const delta = round((a?.value ?? 0) - (b?.value ?? 0), meta.decimals);
      return { key, label: meta.label, delta, decimals: meta.decimals, unit: meta.unit };
    })
    .filter((d) => d.delta !== 0);
}

export const formatPropertyDelta = (d: PropertyDelta): string =>
  `${d.delta > 0 ? '+' : ''}${d.delta.toFixed(d.decimals)}${d.unit ?? ''} ${d.label}`;

/** Sums `total` properties across all equipped items, e.g. total Armour. */
export function propertyTotals(items: (Item | undefined)[]): { key: string; label: string; text: string }[] {
  const totals = new Map<string, { label: string; value: number; decimals: number }>();
  for (const item of items) {
    if (!item) continue;
    for (const p of itemProperties(item)) {
      if (!p.total) continue;
      const entry = totals.get(p.key) ?? { label: p.label, value: 0, decimals: p.decimals };
      entry.value += p.value;
      totals.set(p.key, entry);
    }
  }
  return [...totals].map(([key, t]) => ({ key, label: t.label, text: t.value.toFixed(t.decimals) }));
}
