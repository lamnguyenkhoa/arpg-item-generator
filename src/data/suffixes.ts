import type { AffixDef } from '../types.ts';

// Tiers are listed strongest first (T1). Every affix keeps a level-1 tier so low-level items can still roll it.
export const SUFFIXES: AffixDef[] = [
  {
    text: '+{v} to Strength',
    tiers: [
      { name: 'of the Lion', minLevel: 60, min: 23, max: 30 },
      { name: 'of the Bear', minLevel: 30, min: 13, max: 22 },
      { name: 'of the Brute', minLevel: 1, min: 5, max: 12 },
    ],
  },
  {
    text: '+{v} to Dexterity',
    tiers: [
      { name: 'of the Falcon', minLevel: 60, min: 23, max: 30 },
      { name: 'of the Fox', minLevel: 30, min: 13, max: 22 },
      { name: 'of the Mongoose', minLevel: 1, min: 5, max: 12 },
    ],
  },
  {
    text: '+{v} to Intelligence',
    tiers: [
      { name: 'of the Sage', minLevel: 60, min: 23, max: 30 },
      { name: 'of the Owl', minLevel: 30, min: 13, max: 22 },
      { name: 'of the Pupil', minLevel: 1, min: 5, max: 12 },
    ],
  },
  {
    // Local version: speeds up the weapon itself.
    text: '{v}% increased Attack Speed',
    local: 'attackSpeed',
    tiers: [
      { name: 'of Celebration', minLevel: 60, min: 20, max: 26 },
      { name: 'of Mastery', minLevel: 30, min: 14, max: 19 },
      { name: 'of Skill', minLevel: 1, min: 8, max: 13 },
    ],
  },
  {
    // Global version: applies to the character.
    text: '{v}% increased Attack Speed',
    slots: ['gloves', 'ring'],
    tiers: [
      { name: 'of Haste', minLevel: 60, min: 12, max: 15 },
      { name: 'of Ease', minLevel: 30, min: 8, max: 11 },
      { name: 'of Alacrity', minLevel: 1, min: 5, max: 7 },
    ],
  },
  {
    text: '+{v}% to Fire Resistance',
    tiers: [
      { name: 'of the Inferno', minLevel: 55, min: 30, max: 40 },
      { name: 'of the Salamander', minLevel: 25, min: 16, max: 29 },
      { name: 'of the Whelpling', minLevel: 1, min: 6, max: 15 },
    ],
  },
  {
    text: '+{v}% to Cold Resistance',
    tiers: [
      { name: 'of the Glacier', minLevel: 55, min: 30, max: 40 },
      { name: 'of the Penguin', minLevel: 25, min: 16, max: 29 },
      { name: 'of the Seal', minLevel: 1, min: 6, max: 15 },
    ],
  },
  {
    text: '+{v}% to Lightning Resistance',
    tiers: [
      { name: 'of the Storm', minLevel: 55, min: 30, max: 40 },
      { name: 'of the Squall', minLevel: 25, min: 16, max: 29 },
      { name: 'of the Cloud', minLevel: 1, min: 6, max: 15 },
    ],
  },
  {
    text: '+{v}% Critical Strike Chance',
    slots: ['weapon', 'amulet', 'ring'],
    tiers: [
      { name: 'of Precision', minLevel: 60, min: 23, max: 30 },
      { name: 'of Stinging', minLevel: 30, min: 15, max: 22 },
      { name: 'of Needling', minLevel: 1, min: 10, max: 14 },
    ],
  },
];
