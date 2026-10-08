export type Slot = 'weapon' | 'helmet' | 'body' | 'gloves' | 'belt' | 'ring' | 'amulet';

export type RarityId = 'normal' | 'magic' | 'rare';

/** A stat definition. `text` contains `{v}` where the rolled value goes. */
export interface ModDef {
  text: string;
  min: number;
  max: number;
}

export interface AffixDef extends ModDef {
  /** Used in magic item names, e.g. "Heavy" or "of the Bear". */
  name: string;
  /** Slots this affix can roll on. Omit for any slot. */
  slots?: Slot[];
}

export interface BaseDef {
  name: string;
  slot: Slot;
  implicit: ModDef;
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
}

export interface Item {
  id: string;
  name: string;
  baseName: string;
  slot: Slot;
  rarity: RarityId;
  itemLevel: number;
  implicit: RolledMod;
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
