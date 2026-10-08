import type { AffixDef, BaseDef, RarityDef } from '../types.ts';

export const BASES: BaseDef[] = [
  { name: 'Short Sword', slot: 'weapon', implicit: { text: '+{v}% Critical Strike Chance', min: 3, max: 5 } },
  { name: 'War Axe', slot: 'weapon', implicit: { text: '+{v}% Attack Speed', min: 4, max: 8 } },
  { name: 'Iron Hat', slot: 'helmet', implicit: { text: '+{v} to Armour', min: 10, max: 20 } },
  { name: 'Leather Belt', slot: 'belt', implicit: { text: '+{v} to Maximum Life', min: 15, max: 30 } },
  { name: 'Gold Ring', slot: 'ring', implicit: { text: '+{v}% Item Rarity', min: 6, max: 15 } },
  { name: 'Amber Amulet', slot: 'amulet', implicit: { text: '+{v} to Strength', min: 12, max: 24 } },
  { name: 'Chainmail Vest', slot: 'body', implicit: { text: '+{v} to Armour', min: 40, max: 60 } },
  { name: 'Wool Gloves', slot: 'gloves', implicit: { text: '+{v} to Evasion', min: 8, max: 14 } },
];

export const PREFIXES: AffixDef[] = [
  { name: 'Heavy', text: '{v}% increased Physical Damage', min: 40, max: 80, slots: ['weapon'] },
  { name: 'Flaming', text: 'Adds {v} Fire Damage to Attacks', min: 5, max: 18, slots: ['weapon', 'ring', 'gloves'] },
  { name: 'Frosted', text: 'Adds {v} Cold Damage to Attacks', min: 4, max: 16, slots: ['weapon', 'ring', 'gloves'] },
  { name: 'Healthy', text: '+{v} to Maximum Life', min: 20, max: 70 },
  { name: 'Azure', text: '+{v} to Maximum Mana', min: 15, max: 50 },
  { name: 'Reinforced', text: '{v}% increased Armour', min: 20, max: 60, slots: ['helmet', 'body', 'gloves', 'belt'] },
  { name: 'Vampiric', text: '{v}% of Physical Damage Leeched as Life', min: 1, max: 3, slots: ['weapon', 'ring', 'amulet'] },
];

export const SUFFIXES: AffixDef[] = [
  { name: 'of the Bear', text: '+{v} to Strength', min: 8, max: 30 },
  { name: 'of the Fox', text: '+{v} to Dexterity', min: 8, max: 30 },
  { name: 'of the Owl', text: '+{v} to Intelligence', min: 8, max: 30 },
  { name: 'of Haste', text: '{v}% increased Attack Speed', min: 5, max: 15, slots: ['weapon', 'gloves', 'ring'] },
  { name: 'of the Inferno', text: '+{v}% to Fire Resistance', min: 10, max: 40 },
  { name: 'of the Glacier', text: '+{v}% to Cold Resistance', min: 10, max: 40 },
  { name: 'of the Storm', text: '+{v}% to Lightning Resistance', min: 10, max: 40 },
  { name: 'of Precision', text: '+{v}% Critical Strike Chance', min: 10, max: 30, slots: ['weapon', 'amulet', 'ring'] },
];

/** Word pools for rare item names, e.g. "Doom Grasp". */
export const RARE_FIRST = ['Doom', 'Blood', 'Storm', 'Grim', 'Ghoul', 'Rune', 'Wrath', 'Dusk', 'Viper', 'Soul'];
export const RARE_SECOND = ['Bane', 'Grasp', 'Song', 'Spiral', 'Fang', 'Veil', 'Mark', 'Bite', 'Brand', 'Shroud'];

export const RARITIES: RarityDef[] = [
  { id: 'normal', weight: 30, prefixes: [0, 0], suffixes: [0, 0] },
  { id: 'magic', weight: 50, prefixes: [0, 1], suffixes: [0, 1], minAffixes: 1 },
  { id: 'rare', weight: 20, prefixes: [1, 3], suffixes: [1, 3] },
];
