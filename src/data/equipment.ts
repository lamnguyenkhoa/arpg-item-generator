import type { EquipSlotDef, Slot } from '../types.ts';

export const EQUIP_SLOTS: EquipSlotDef[] = [
  { id: 'helmet', label: 'Helmet', accepts: 'helmet' },
  { id: 'amulet', label: 'Amulet', accepts: 'amulet' },
  { id: 'weapon', label: 'Weapon', accepts: 'weapon' },
  { id: 'body', label: 'Body Armour', accepts: 'body' },
  { id: 'gloves', label: 'Gloves', accepts: 'gloves' },
  { id: 'belt', label: 'Belt', accepts: 'belt' },
  { id: 'ring1', label: 'Ring 1', accepts: 'ring' },
  { id: 'ring2', label: 'Ring 2', accepts: 'ring' },
];

/** Equipment slots an item of the given slot type can go into. */
export const slotsFor = (slot: Slot): EquipSlotDef[] => EQUIP_SLOTS.filter((s) => s.accepts === slot);
