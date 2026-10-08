/**
 * Combined stats that count as several individual stats in totals and comparisons.
 * Key and values are stat texts and must match the affix/implicit text exactly.
 * The combined stat itself doesn't appear in totals; only the stats it expands into do.
 */
export const STAT_EXPANSIONS: Record<string, string[]> = {
  '+{v} to all Attributes': ['+{v} to Strength', '+{v} to Dexterity', '+{v} to Intelligence'],
  '+{v}% to all Elemental Resistances': ['+{v}% to Fire Resistance', '+{v}% to Cold Resistance', '+{v}% to Lightning Resistance'],
};
