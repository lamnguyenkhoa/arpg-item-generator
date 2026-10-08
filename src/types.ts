export type Slot = 'weapon' | 'helmet' | 'body' | 'gloves' | 'belt' | 'ring' | 'amulet';

export type RarityId = 'normal' | 'magic' | 'rare';

/** A stat definition. `text` contains `{v}` where the rolled value goes. */
export interface ModDef {
  text: string;
  min: number;
  max: number;
}

export interface AffixTier {
  /** Used in magic item names, e.g. "Heavy" or "of the Bear". */
  name: string;
  /** Minimum item level required to roll this tier. */
  minLevel: number;
  min: number;
  max: number;
}

/** Base stats an item can have, which local affixes modify. */
export type LocalStat = 'physicalDamage' | 'attackSpeed' | 'armour' | 'evasion' | 'energyShield';

export interface WeaponStats {
  physMin: number;
  physMax: number;
  /** Percent, e.g. 5 = 5%. */
  critChance: number;
  attacksPerSecond: number;
}

export interface Defences {
  armour?: number;
  evasion?: number;
  energyShield?: number;
}

export interface AffixDef {
  /** Contains `{v}` where the rolled value goes. Also the key used to stack stats. */
  text: string;
  /** Strongest first: tiers[0] is T1. */
  tiers: AffixTier[];
  /** Slots this affix can roll on. Omit for any slot. */
  slots?: Slot[];
  /** Local affixes modify the item's own base stat and only roll on bases that have it. */
  local?: LocalStat;
}

export interface BaseDef {
  name: string;
  slot: Slot;
  implicit?: ModDef;
  weapon?: WeaponStats;
  defences?: Defences;
}

export interface RarityDef {
  id: RarityId;
  weight: number;
  prefixes: [min: number, max: number];
  suffixes: [min: number, max: number];
  minAffixes?: number;
}

export interface RolledMod extends ModDef {
  name?: string;
  value: number;
  /** 1 = best. Absent on implicits. */
  tier?: number;
  local?: LocalStat;
}

export interface Item {
  id: string;
  name: string;
  baseName: string;
  slot: Slot;
  rarity: RarityId;
  itemLevel: number;
  /** Unmodified base stats; see lib/properties.ts for values with local mods applied. */
  weapon?: WeaponStats;
  defences?: Defences;
  implicit?: RolledMod;
  prefixes: RolledMod[];
  suffixes: RolledMod[];
}

export type EquipSlotId = 'helmet' | 'amulet' | 'weapon' | 'body' | 'gloves' | 'belt' | 'ring1' | 'ring2';

export interface EquipSlotDef {
  id: EquipSlotId;
  label: string;
  /** Item slot type this equipment slot accepts. */
  accepts: Slot;
}

export type Equipment = Partial<Record<EquipSlotId, Item>>;

export interface SaveData {
  /** Bump when the save shape changes; mismatched saves are ignored on load. */
  version: 1;
  savedAt: number;
  equipment: Equipment;
  currentItem: Item;
}
