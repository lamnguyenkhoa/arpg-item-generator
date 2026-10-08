import type { BaseDef } from '../types.ts';

// All values are item level 1; damage and defences scale with item level (see scaling.ts).
// Balance bands and naming rules: CONTENT_GUIDE.md section 4.

// --- Weapons ---

const WEAPONS: BaseDef[] = [
  // Fast / light: low damage, high speed and crit.
  {
    name: 'Rune Dagger',
    slot: 'weapon',
    weapon: { physMin: 5, physMax: 20, critChance: 6.5, attacksPerSecond: 1.45 },
    implicit: { text: '+{v}% Critical Strike Chance', min: 20, max: 30 },
  },
  { name: 'Glass Shank', slot: 'weapon', weapon: { physMin: 4, physMax: 17, critChance: 7.5, attacksPerSecond: 1.5 } },
  {
    name: 'Nailed Fist',
    slot: 'weapon',
    weapon: { physMin: 4, physMax: 16, critChance: 6, attacksPerSecond: 1.6 },
    implicit: { text: '+{v} Life gained for each Enemy hit by Attacks', min: 2, max: 4 },
  },

  // Balanced: middling damage and speed.
  {
    name: 'Shortsword',
    slot: 'weapon',
    weapon: { physMin: 6, physMax: 14, critChance: 8, attacksPerSecond: 1.55 },
    implicit: { text: '+{v} to Accuracy Rating', min: 40, max: 80 },
  },
  { name: 'Broad Sword', slot: 'weapon', weapon: { physMin: 8, physMax: 16, critChance: 5, attacksPerSecond: 1.4 } },
  {
    name: 'Cutlass',
    slot: 'weapon',
    weapon: { physMin: 7, physMax: 14, critChance: 5, attacksPerSecond: 1.55 },
    implicit: { text: '+{v} to Accuracy Rating', min: 30, max: 60 },
  },

  // Slow / heavy: high damage per hit, low speed.
  { name: 'War Axe', slot: 'weapon', weapon: { physMin: 18, physMax: 32, critChance: 5, attacksPerSecond: 1.2 } },
  { name: 'Cleaver', slot: 'weapon', weapon: { physMin: 20, physMax: 34, critChance: 5, attacksPerSecond: 1.15 } },
  {
    name: 'War Hammer',
    slot: 'weapon',
    weapon: { physMin: 16, physMax: 30, critChance: 5, attacksPerSecond: 1.2 },
    implicit: { text: '+{v} to Strength', min: 8, max: 14 },
  },
  { name: 'Sledgehammer', slot: 'weapon', weapon: { physMin: 22, physMax: 40, critChance: 5, attacksPerSecond: 1.1 } },
];

// --- Helmets ---

const HELMETS: BaseDef[] = [
  // Pure
  { name: 'Iron Hat', slot: 'helmet', defences: { armour: 40 } },
  { name: 'Cone Helmet', slot: 'helmet', defences: { armour: 50 } },
  { name: 'Leather Cap', slot: 'helmet', defences: { evasion: 34 } },
  { name: 'Silken Hood', slot: 'helmet', defences: { evasion: 46 } },
  { name: 'Vine Circlet', slot: 'helmet', defences: { energyShield: 20 } },
  { name: 'Iron Circlet', slot: 'helmet', defences: { energyShield: 26 } },
  // Hybrid
  { name: 'Battered Helm', slot: 'helmet', defences: { armour: 28, evasion: 28 } },
  { name: 'Soldier Helmet', slot: 'helmet', defences: { armour: 28, energyShield: 15 } },
  { name: 'Great Helmet', slot: 'helmet', defences: { armour: 34, energyShield: 18 } },
  { name: 'Scare Mask', slot: 'helmet', defences: { evasion: 28, energyShield: 15 } },
];

// --- Body Armours ---

const BODY_ARMOURS: BaseDef[] = [
  // Pure
  { name: 'Plate Vest', slot: 'body', defences: { armour: 110 } },
  { name: 'Chestplate', slot: 'body', defences: { armour: 128 } },
  { name: 'Shabby Jerkin', slot: 'body', defences: { evasion: 95 } },
  { name: 'Strapped Leather', slot: 'body', defences: { evasion: 120 } },
  { name: 'Simple Robe', slot: 'body', defences: { energyShield: 44 } },
  { name: 'Silk Robe', slot: 'body', defences: { energyShield: 56 } },
  // Hybrid
  { name: 'Scale Doublet', slot: 'body', defences: { armour: 70, evasion: 70 } },
  { name: 'Chainmail Vest', slot: 'body', defences: { armour: 90, energyShield: 25 } },
  { name: 'Padded Jacket', slot: 'body', defences: { evasion: 72, energyShield: 34 } },
];

// --- Gloves ---

const GLOVES: BaseDef[] = [
  // Pure
  { name: 'Iron Gauntlets', slot: 'gloves', defences: { armour: 26 } },
  { name: 'Rawhide Gloves', slot: 'gloves', defences: { evasion: 26 } },
  { name: 'Wool Gloves', slot: 'gloves', defences: { energyShield: 12 } },
  { name: 'Silk Gloves', slot: 'gloves', defences: { energyShield: 15 } },
  // Hybrid
  { name: 'Fishscale Gauntlets', slot: 'gloves', defences: { armour: 16, evasion: 16 } },
  { name: 'Chain Gloves', slot: 'gloves', defences: { armour: 15, energyShield: 8 } },
  { name: 'Wrapped Mitts', slot: 'gloves', defences: { evasion: 15, energyShield: 8 } },
];

// --- Belts ---

const BELTS: BaseDef[] = [
  { name: 'Leather Belt', slot: 'belt', implicit: { text: '+{v} to Maximum Life', min: 15, max: 30 } },
  { name: 'Heavy Belt', slot: 'belt', implicit: { text: '+{v} to Strength', min: 8, max: 14 } },
  { name: 'Chain Belt', slot: 'belt', implicit: { text: '+{v} to Maximum Energy Shield', min: 6, max: 13 } },
  { name: 'Rustic Sash', slot: 'belt', implicit: { text: '{v}% increased Physical Damage', min: 8, max: 16 } },
];

// --- Rings ---

const RINGS: BaseDef[] = [
  { name: 'Iron Ring', slot: 'ring', implicit: { text: 'Adds {v} Physical Damage to Attacks', min: 1, max: 4 } },
  { name: 'Coral Ring', slot: 'ring', implicit: { text: '+{v} to Maximum Life', min: 15, max: 30 } },
  { name: 'Paua Ring', slot: 'ring', implicit: { text: '+{v} to Maximum Mana', min: 12, max: 22 } },
  { name: 'Gold Ring', slot: 'ring', implicit: { text: '+{v}% Item Rarity', min: 6, max: 15 } },
  { name: 'Ruby Ring', slot: 'ring', implicit: { text: '+{v}% to Fire Resistance', min: 10, max: 18 } },
  { name: 'Sapphire Ring', slot: 'ring', implicit: { text: '+{v}% to Cold Resistance', min: 10, max: 18 } },
  { name: 'Topaz Ring', slot: 'ring', implicit: { text: '+{v}% to Lightning Resistance', min: 10, max: 18 } },
  { name: 'Prismatic Ring', slot: 'ring', implicit: { text: '+{v}% to all Elemental Resistances', min: 8, max: 10 } },
  { name: 'Diamond Ring', slot: 'ring', implicit: { text: '+{v}% Critical Strike Chance', min: 20, max: 30 } },
  { name: 'Moonstone Ring', slot: 'ring', implicit: { text: '+{v} to Maximum Energy Shield', min: 10, max: 18 } },
];

// --- Amulets ---

const AMULETS: BaseDef[] = [
  { name: 'Coral Amulet', slot: 'amulet', implicit: { text: 'Regenerate {v} Life per second', min: 2, max: 4 } },
  { name: 'Paua Amulet', slot: 'amulet', implicit: { text: '{v}% increased Mana Regeneration Rate', min: 20, max: 30 } },
  { name: 'Amber Amulet', slot: 'amulet', implicit: { text: '+{v} to Strength', min: 12, max: 24 } },
  { name: 'Jade Amulet', slot: 'amulet', implicit: { text: '+{v} to Dexterity', min: 12, max: 24 } },
  { name: 'Lapis Amulet', slot: 'amulet', implicit: { text: '+{v} to Intelligence', min: 12, max: 24 } },
  { name: 'Gold Amulet', slot: 'amulet', implicit: { text: '+{v}% Item Rarity', min: 10, max: 18 } },
  { name: 'Onyx Amulet', slot: 'amulet', implicit: { text: '+{v} to all Attributes', min: 6, max: 10 } },
];

export const BASES: BaseDef[] = [...WEAPONS, ...HELMETS, ...BODY_ARMOURS, ...GLOVES, ...BELTS, ...RINGS, ...AMULETS];
