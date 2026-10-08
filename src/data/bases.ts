import type { BaseDef } from '../types.ts';

export const BASES: BaseDef[] = [
  {
    name: 'Short Sword',
    slot: 'weapon',
    weapon: { physMin: 6, physMax: 14, critChance: 8, attacksPerSecond: 1.55 },
    implicit: { text: '+{v} to Accuracy Rating', min: 40, max: 80 },
  },
  { name: 'War Axe', slot: 'weapon', weapon: { physMin: 18, physMax: 32, critChance: 5, attacksPerSecond: 1.2 } },
  {
    name: 'Rune Dagger',
    slot: 'weapon',
    weapon: { physMin: 5, physMax: 20, critChance: 6.5, attacksPerSecond: 1.45 },
    implicit: { text: '+{v}% Critical Strike Chance', min: 20, max: 30 },
  },
  { name: 'Iron Hat', slot: 'helmet', defences: { armour: 40 } },
  { name: 'Silken Hood', slot: 'helmet', defences: { energyShield: 22 } },
  { name: 'Chainmail Vest', slot: 'body', defences: { armour: 90, energyShield: 25 } },
  { name: 'Leather Jerkin', slot: 'body', defences: { evasion: 110 } },
  { name: 'Wool Gloves', slot: 'gloves', defences: { energyShield: 12 } },
  { name: 'Rawhide Gloves', slot: 'gloves', defences: { evasion: 26 } },
  { name: 'Leather Belt', slot: 'belt', implicit: { text: '+{v} to Maximum Life', min: 15, max: 30 } },
  { name: 'Gold Ring', slot: 'ring', implicit: { text: '+{v}% Item Rarity', min: 6, max: 15 } },
  { name: 'Amber Amulet', slot: 'amulet', implicit: { text: '+{v} to Strength', min: 12, max: 24 } },
];
