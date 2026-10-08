import type { AffixDef } from '../types.ts';

// Tiers are listed strongest first (T1). Every affix keeps a level-1 tier so low-level items can still roll it.
export const PREFIXES: AffixDef[] = [
  {
    text: '{v}% increased Physical Damage',
    local: 'physicalDamage',
    tiers: [
      { name: 'Merciless', minLevel: 60, min: 70, max: 99 },
      { name: 'Serrated', minLevel: 30, min: 40, max: 69 },
      { name: 'Heavy', minLevel: 1, min: 20, max: 39 },
    ],
  },
  {
    text: 'Adds {v} Fire Damage to Attacks',
    slots: ['weapon', 'ring', 'gloves'],
    tiers: [
      { name: 'Flaming', minLevel: 55, min: 12, max: 18 },
      { name: 'Smouldering', minLevel: 25, min: 6, max: 11 },
      { name: 'Heated', minLevel: 1, min: 2, max: 5 },
    ],
  },
  {
    text: 'Adds {v} Cold Damage to Attacks',
    slots: ['weapon', 'ring', 'gloves'],
    tiers: [
      { name: 'Frigid', minLevel: 55, min: 11, max: 16 },
      { name: 'Icy', minLevel: 25, min: 5, max: 10 },
      { name: 'Frosted', minLevel: 1, min: 2, max: 4 },
    ],
  },
  {
    text: '+{v} to Maximum Life',
    tiers: [
      { name: 'Stalwart', minLevel: 60, min: 45, max: 70 },
      { name: 'Sanguine', minLevel: 30, min: 25, max: 44 },
      { name: 'Healthy', minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '+{v} to Maximum Mana',
    tiers: [
      { name: 'Sapphire', minLevel: 60, min: 35, max: 50 },
      { name: 'Cobalt', minLevel: 30, min: 20, max: 34 },
      { name: 'Azure', minLevel: 1, min: 10, max: 19 },
    ],
  },
  {
    text: '{v}% increased Armour',
    local: 'armour',
    tiers: [
      { name: 'Fortified', minLevel: 60, min: 45, max: 60 },
      { name: 'Layered', minLevel: 30, min: 25, max: 44 },
      { name: 'Reinforced', minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '{v}% increased Evasion Rating',
    local: 'evasion',
    tiers: [
      { name: "Phantasm's", minLevel: 60, min: 45, max: 60 },
      { name: "Ghost's", minLevel: 30, min: 25, max: 44 },
      { name: "Shade's", minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '{v}% increased Energy Shield',
    local: 'energyShield',
    tiers: [
      { name: "Seraphim's", minLevel: 60, min: 45, max: 60 },
      { name: "Priest's", minLevel: 30, min: 25, max: 44 },
      { name: 'Protective', minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '{v}% of Physical Damage Leeched as Life',
    slots: ['weapon', 'ring', 'amulet'],
    tiers: [
      { name: 'Vampiric', minLevel: 50, min: 2, max: 3 },
      { name: 'Thirsty', minLevel: 1, min: 1, max: 2 },
    ],
  },
  // Flat global defences for jewellery/belts (armour pieces use the local % versions above).
  {
    text: '+{v} to Armour',
    slots: ['belt'],
    tiers: [
      { name: 'Ironclad', minLevel: 60, min: 45, max: 65 },
      { name: 'Studded', minLevel: 30, min: 25, max: 44 },
      { name: 'Lacquered', minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '+{v} to Evasion Rating',
    slots: ['belt', 'ring'],
    tiers: [
      { name: "Acrobat's", minLevel: 60, min: 45, max: 65 },
      { name: "Dancer's", minLevel: 30, min: 25, max: 44 },
      { name: 'Agile', minLevel: 1, min: 10, max: 24 },
    ],
  },
  {
    text: '+{v} to Maximum Energy Shield',
    slots: ['belt', 'ring', 'amulet'],
    tiers: [
      { name: 'Radiant', minLevel: 60, min: 21, max: 28 },
      { name: 'Glimmering', minLevel: 30, min: 11, max: 20 },
      { name: 'Shining', minLevel: 1, min: 4, max: 10 },
    ],
  },
  {
    // Text must match ITEM_RARITY_STAT (data/rarities.ts) to affect drop odds.
    text: '+{v}% Item Rarity',
    slots: ['ring'],
    tiers: [
      { name: "Dragon's", minLevel: 60, min: 23, max: 30 },
      { name: "Pirate's", minLevel: 30, min: 15, max: 22 },
      { name: "Magpie's", minLevel: 1, min: 8, max: 14 },
    ],
  },
];
