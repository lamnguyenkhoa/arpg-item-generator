import type { CorruptionOutcomeDef, EnchantDef } from '../types.ts';

/** Vaal Orb outcomes (PoE2): each has equal odds and exactly one happens. */
export const CORRUPTION_OUTCOMES: CorruptionOutcomeDef[] = [
  { id: 'none', weight: 1, label: 'No change' },
  { id: 'enchant', weight: 1, label: 'Gained a corrupted enchantment' },
  { id: 'chaos', weight: 1, label: 'Modifiers rerolled' },
  // PLACEHOLDER: PoE2's fourth outcome adds a socket. This game has no sockets yet, so this slot
  // rerolls modifier values instead. Expected to be replaced by a different outcome in the future.
  { id: 'values', weight: 1, label: 'Modifier values rerolled' },
];

/** The Chaos-style outcome removes one modifier and adds a new one, this many times. */
export const CHAOS_REROLL_TIMES: [min: number, max: number] = [1, 3];

/**
 * Corrupted enchantments: one is added on the "enchant" outcome, chosen from those that fit the item.
 * Same rules as affixes: `slots` restricts slot types, `local` needs the matching base stat.
 */
export const CORRUPTED_ENCHANTS: EnchantDef[] = [
  // Weapons
  { text: '{v}% increased Physical Damage', local: 'physicalDamage', min: 15, max: 25 },
  { text: '{v}% increased Attack Speed', local: 'attackSpeed', min: 5, max: 8 },
  { text: '+{v}% Critical Strike Chance', slots: ['weapon'], min: 15, max: 25 },
  { text: '{v}% of Physical Damage Leeched as Life', slots: ['weapon'], min: 2, max: 4 },
  // Armour pieces
  { text: '{v}% increased Armour', local: 'armour', min: 15, max: 25 },
  { text: '{v}% increased Evasion Rating', local: 'evasion', min: 15, max: 25 },
  { text: '{v}% increased Energy Shield', local: 'energyShield', min: 15, max: 25 },
  { text: '+{v} to Maximum Life', slots: ['helmet', 'body', 'belt'], min: 15, max: 30 },
  { text: '{v}% increased Attack Speed', slots: ['gloves'], min: 4, max: 6 },
  // Shared / jewellery
  { text: '+{v}% to all Elemental Resistances', slots: ['helmet', 'body', 'gloves', 'belt', 'ring', 'amulet'], min: 5, max: 10 },
  { text: '+{v}% Item Rarity', slots: ['helmet', 'ring', 'amulet'], min: 10, max: 20 },
  { text: '+{v} to all Attributes', slots: ['belt', 'ring', 'amulet'], min: 5, max: 10 },
];
