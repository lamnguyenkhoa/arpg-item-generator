/**
 * Stats granted per point of each attribute (PoE2 values). Added to totals and comparisons.
 * Both texts must match the affix/implicit text exactly.
 */
export const ATTRIBUTE_BONUSES: { name: string; attribute: string; grants: string; perPoint: number }[] = [
  { name: 'Strength', attribute: '+{v} to Strength', grants: '+{v} to Maximum Life', perPoint: 2 },
  { name: 'Dexterity', attribute: '+{v} to Dexterity', grants: '+{v} to Accuracy Rating', perPoint: 6 },
  { name: 'Intelligence', attribute: '+{v} to Intelligence', grants: '+{v} to Maximum Mana', perPoint: 2 },
];
