import type { AffixDef } from '../types.ts';

// Tiers are listed strongest first (T1). Standard is 5 tiers at item levels 1 / 18 / 36 / 54 / 72.
export const PREFIXES: AffixDef[] = [
  {
    text: '{v}% increased Physical Damage',
    local: 'physicalDamage',
    tiers: [
      { name: 'Merciless', minLevel: 72, min: 84, max: 99 },
      { name: 'Vicious', minLevel: 54, min: 68, max: 83 },
      { name: 'Wicked', minLevel: 36, min: 52, max: 67 },
      { name: 'Serrated', minLevel: 18, min: 36, max: 51 },
      { name: 'Heavy', minLevel: 1, min: 20, max: 35 },
    ],
  },
  {
    text: 'Adds {v} Fire Damage to Attacks',
    slots: ['weapon', 'ring', 'gloves'],
    tiers: [
      { name: 'Flaming', minLevel: 72, min: 16, max: 18 },
      { name: 'Burning', minLevel: 54, min: 12, max: 15 },
      { name: 'Smoking', minLevel: 36, min: 9, max: 11 },
      { name: 'Smouldering', minLevel: 18, min: 5, max: 8 },
      { name: 'Heated', minLevel: 1, min: 2, max: 4 },
    ],
  },
  {
    text: 'Adds {v} Cold Damage to Attacks',
    slots: ['weapon', 'ring', 'gloves'],
    tiers: [
      { name: 'Freezing', minLevel: 72, min: 14, max: 16 },
      { name: 'Frigid', minLevel: 54, min: 11, max: 13 },
      { name: 'Icy', minLevel: 36, min: 8, max: 10 },
      { name: 'Chilled', minLevel: 18, min: 5, max: 7 },
      { name: 'Frosted', minLevel: 1, min: 2, max: 4 },
    ],
  },
  {
    text: '+{v} to Maximum Life',
    tiers: [
      { name: 'Virile', minLevel: 72, min: 59, max: 70 },
      { name: 'Robust', minLevel: 54, min: 47, max: 58 },
      { name: 'Stalwart', minLevel: 36, min: 34, max: 46 },
      { name: 'Sanguine', minLevel: 18, min: 22, max: 33 },
      { name: 'Healthy', minLevel: 1, min: 10, max: 21 },
    ],
  },
  {
    text: '+{v} to Maximum Mana',
    tiers: [
      { name: 'Mazarine', minLevel: 72, min: 43, max: 50 },
      { name: 'Cerulean', minLevel: 54, min: 35, max: 42 },
      { name: 'Azure', minLevel: 36, min: 26, max: 34 },
      { name: 'Cobalt', minLevel: 18, min: 18, max: 25 },
      { name: 'Beryl', minLevel: 1, min: 10, max: 17 },
    ],
  },
  {
    text: '{v}% increased Armour',
    local: 'armour',
    tiers: [
      { name: 'Impregnable', minLevel: 72, min: 51, max: 60 },
      { name: 'Buttressed', minLevel: 54, min: 41, max: 50 },
      { name: 'Lobstered', minLevel: 36, min: 30, max: 40 },
      { name: 'Layered', minLevel: 18, min: 20, max: 29 },
      { name: 'Reinforced', minLevel: 1, min: 10, max: 19 },
    ],
  },
  {
    text: '{v}% increased Evasion Rating',
    local: 'evasion',
    tiers: [
      { name: "Phantasm's", minLevel: 72, min: 51, max: 60 },
      { name: "Wraith's", minLevel: 54, min: 41, max: 50 },
      { name: "Spectre's", minLevel: 36, min: 30, max: 40 },
      { name: "Ghost's", minLevel: 18, min: 20, max: 29 },
      { name: "Shade's", minLevel: 1, min: 10, max: 19 },
    ],
  },
  {
    text: '{v}% increased Energy Shield',
    local: 'energyShield',
    tiers: [
      { name: 'Indomitable', minLevel: 72, min: 51, max: 60 },
      { name: 'Fearless', minLevel: 54, min: 41, max: 50 },
      { name: 'Resolute', minLevel: 36, min: 30, max: 40 },
      { name: 'Strong-Willed', minLevel: 18, min: 20, max: 29 },
      { name: 'Protective', minLevel: 1, min: 10, max: 19 },
    ],
  },
  {
    text: '{v}% of Physical Damage Leeched as Life',
    slots: ['weapon', 'ring', 'amulet'],
    tiers: [
      { name: 'Parasitic', minLevel: 72, min: 9, max: 10 },
      { name: "Vampire's", minLevel: 54, min: 7, max: 8 },
      { name: "Lamprey's", minLevel: 36, min: 5, max: 6 },
      { name: "Remora's", minLevel: 18, min: 3, max: 4 },
      { name: 'Thirsty', minLevel: 1, min: 1, max: 2 },
    ],
  },
  {
    // Flat global defences for jewellery/belts (armour pieces use the local % versions above).
    text: '+{v} to Armour',
    slots: ['belt'],
    tiers: [
      { name: 'Plated', minLevel: 72, min: 55, max: 65 },
      { name: 'Fortified', minLevel: 54, min: 44, max: 54 },
      { name: 'Ribbed', minLevel: 36, min: 32, max: 43 },
      { name: 'Studded', minLevel: 18, min: 21, max: 31 },
      { name: 'Lacquered', minLevel: 1, min: 10, max: 20 },
    ],
  },
  {
    text: '+{v} to Evasion Rating',
    slots: ['belt', 'ring'],
    tiers: [
      { name: 'Blurred', minLevel: 72, min: 55, max: 65 },
      { name: 'Fleet', minLevel: 54, min: 44, max: 54 },
      { name: "Acrobat's", minLevel: 36, min: 32, max: 43 },
      { name: "Dancer's", minLevel: 18, min: 21, max: 31 },
      { name: 'Agile', minLevel: 1, min: 10, max: 20 },
    ],
  },
  {
    text: '+{v} to Maximum Energy Shield',
    slots: ['belt', 'ring', 'amulet'],
    tiers: [
      { name: 'Radiating', minLevel: 72, min: 24, max: 28 },
      { name: 'Glowing', minLevel: 54, min: 19, max: 23 },
      { name: 'Glittering', minLevel: 36, min: 14, max: 18 },
      { name: 'Glimmering', minLevel: 18, min: 9, max: 13 },
      { name: 'Shining', minLevel: 1, min: 4, max: 8 },
    ],
  },
  {
    // Text must match ITEM_RARITY_STAT (data/rarities.ts) to affect drop odds.
    text: '+{v}% Item Rarity',
    slots: ['ring'],
    tiers: [
      { name: "Dragon's", minLevel: 72, min: 26, max: 30 },
      { name: "Freebooter's", minLevel: 54, min: 22, max: 25 },
      { name: "Pirate's", minLevel: 36, min: 17, max: 21 },
      { name: "Prospector's", minLevel: 18, min: 13, max: 16 },
      { name: "Magpie's", minLevel: 1, min: 8, max: 12 },
    ],
  },
];
