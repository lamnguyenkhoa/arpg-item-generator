import { ORB_DROP_CHANCE, ORBS } from '../data/orbs.ts';
import type { Item, OrbDef } from '../types.ts';
import { pickWeighted } from './random.ts';

/** Rolls whether a discarded item drops an orb, and which one. */
export function rollOrbDrop(item: Item): OrbDef | null {
  return Math.random() < ORB_DROP_CHANCE[item.rarity] ? pickWeighted(ORBS) : null;
}
