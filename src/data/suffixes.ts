import type { AffixDef } from '../types.ts';

// Tiers are listed strongest first (T1). Standard is 5 tiers at item levels 1 / 18 / 36 / 54 / 72.
export const SUFFIXES: AffixDef[] = [
  {
    text: '+{v} to Strength',
    tiers: [
      { name: 'of the Goliath', minLevel: 72, min: 26, max: 30 },
      { name: 'of the Lion', minLevel: 54, min: 21, max: 25 },
      { name: 'of the Bear', minLevel: 36, min: 15, max: 20 },
      { name: 'of the Wrestler', minLevel: 18, min: 10, max: 14 },
      { name: 'of the Brute', minLevel: 1, min: 5, max: 9 },
    ],
  },
  {
    text: '+{v} to Dexterity',
    tiers: [
      { name: 'of the Panther', minLevel: 72, min: 26, max: 30 },
      { name: 'of the Falcon', minLevel: 54, min: 21, max: 25 },
      { name: 'of the Fox', minLevel: 36, min: 15, max: 20 },
      { name: 'of the Lynx', minLevel: 18, min: 10, max: 14 },
      { name: 'of the Mongoose', minLevel: 1, min: 5, max: 9 },
    ],
  },
  {
    text: '+{v} to Intelligence',
    tiers: [
      { name: 'of the Sage', minLevel: 72, min: 26, max: 30 },
      { name: 'of the Philosopher', minLevel: 54, min: 21, max: 25 },
      { name: 'of the Prodigy', minLevel: 36, min: 15, max: 20 },
      { name: 'of the Student', minLevel: 18, min: 10, max: 14 },
      { name: 'of the Pupil', minLevel: 1, min: 5, max: 9 },
    ],
  },
  {
    // Local version: speeds up the weapon itself.
    text: '{v}% increased Attack Speed',
    local: 'attackSpeed',
    tiers: [
      { name: 'of Celebration', minLevel: 72, min: 23, max: 26 },
      { name: 'of Renown', minLevel: 54, min: 19, max: 22 },
      { name: 'of Mastery', minLevel: 36, min: 16, max: 18 },
      { name: 'of Ease', minLevel: 18, min: 12, max: 15 },
      { name: 'of Skill', minLevel: 1, min: 8, max: 11 },
    ],
  },
  {
    // Global version: applies to the character.
    text: '{v}% increased Attack Speed',
    slots: ['gloves', 'ring'],
    tiers: [
      { name: 'of Fleetness', minLevel: 72, min: 14, max: 15 },
      { name: 'of Celerity', minLevel: 54, min: 12, max: 13 },
      { name: 'of Haste', minLevel: 36, min: 9, max: 11 },
      { name: 'of Swiftness', minLevel: 18, min: 7, max: 8 },
      { name: 'of Alacrity', minLevel: 1, min: 5, max: 6 },
    ],
  },
  {
    text: '+{v}% to Fire Resistance',
    tiers: [
      { name: 'of the Volcano', minLevel: 72, min: 34, max: 40 },
      { name: 'of the Kiln', minLevel: 54, min: 27, max: 33 },
      { name: 'of the Drake', minLevel: 36, min: 20, max: 26 },
      { name: 'of the Salamander', minLevel: 18, min: 13, max: 19 },
      { name: 'of the Whelpling', minLevel: 1, min: 6, max: 12 },
    ],
  },
  {
    text: '+{v}% to Cold Resistance',
    tiers: [
      { name: 'of the Polar Bear', minLevel: 72, min: 34, max: 40 },
      { name: 'of the Walrus', minLevel: 54, min: 27, max: 33 },
      { name: 'of the Yeti', minLevel: 36, min: 20, max: 26 },
      { name: 'of the Penguin', minLevel: 18, min: 13, max: 19 },
      { name: 'of the Seal', minLevel: 1, min: 6, max: 12 },
    ],
  },
  {
    text: '+{v}% to Lightning Resistance',
    tiers: [
      { name: 'of the Tempest', minLevel: 72, min: 34, max: 40 },
      { name: 'of the Thunderhead', minLevel: 54, min: 27, max: 33 },
      { name: 'of the Storm', minLevel: 36, min: 20, max: 26 },
      { name: 'of the Squall', minLevel: 18, min: 13, max: 19 },
      { name: 'of the Cloud', minLevel: 1, min: 6, max: 12 },
    ],
  },
  {
    // Expands into all three resistances (see statExpansions.ts).
    text: '+{v}% to all Elemental Resistances',
    slots: ['ring', 'amulet'],
    tiers: [
      { name: 'of the Rainbow', minLevel: 72, min: 14, max: 16 },
      { name: 'of Variegation', minLevel: 54, min: 11, max: 13 },
      { name: 'of the Kaleidoscope', minLevel: 36, min: 9, max: 10 },
      { name: 'of the Prism', minLevel: 18, min: 6, max: 8 },
      { name: 'of the Crystal', minLevel: 1, min: 3, max: 5 },
    ],
  },
  {
    text: '+{v}% Critical Strike Chance',
    slots: ['weapon', 'amulet', 'ring'],
    tiers: [
      { name: 'of Penetrating', minLevel: 72, min: 27, max: 30 },
      { name: 'of Puncturing', minLevel: 54, min: 23, max: 26 },
      { name: 'of Piercing', minLevel: 36, min: 18, max: 22 },
      { name: 'of Stinging', minLevel: 18, min: 14, max: 17 },
      { name: 'of Needling', minLevel: 1, min: 10, max: 13 },
    ],
  },
  {
    // Text must match ITEM_RARITY_STAT (data/rarities.ts) to affect drop odds.
    text: '+{v}% Item Rarity',
    slots: ['helmet', 'gloves', 'amulet', 'ring'],
    tiers: [
      { name: 'of Excavation', minLevel: 72, min: 24, max: 28 },
      { name: 'of Archaeology', minLevel: 54, min: 20, max: 23 },
      { name: 'of Raiding', minLevel: 36, min: 15, max: 19 },
      { name: 'of Plunder', minLevel: 18, min: 11, max: 14 },
      { name: 'of Scavenging', minLevel: 1, min: 6, max: 10 },
    ],
  },
];
