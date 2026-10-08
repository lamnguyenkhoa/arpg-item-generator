import type { ReactNode } from 'react';
import { orbBlocker } from '../lib/orbs.ts';
import type { Item, OrbId } from '../types.ts';

interface Props {
  /** Orb waiting for a target, if any. */
  armed: OrbId | null;
  item: Item | undefined;
  onApply: (item: Item) => void;
  /** Changes each time an orb is used on this item, replaying the flash. */
  flash?: { key: number; orb: OrbId } | null;
  children: ReactNode;
}

/** Makes its contents a click target for the armed orb. Always renders the same wrapper so arming doesn't shift layout. */
export function OrbTarget({ armed, item, onApply, flash, children }: Props) {
  const blocker = armed && item ? orbBlocker(armed, item) : null;
  const state = !armed || !item ? '' : blocker ? ' invalid' : ' valid';
  return (
    <div
      className={`orb-target${state}`}
      title={blocker ?? undefined}
      onClick={armed && item && !blocker ? () => onApply(item) : undefined}
    >
      {children}
      {flash && <span key={flash.key} className={`orb-flash ${flash.orb}`} />}
    </div>
  );
}
