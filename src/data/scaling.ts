/**
 * How much base damage and defences grow per item level above 1, as a fraction of the level-1 value.
 * 0.05 → ilvl 20 ≈ 1.95×, ilvl 40 ≈ 2.95×, ilvl 80 ≈ 4.95×.
 * Attack speed and crit chance don't scale; they define the weapon archetype.
 */
export const BASE_STAT_GROWTH_PER_LEVEL = 0.05;
