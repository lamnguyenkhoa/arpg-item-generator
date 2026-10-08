import { ORBS } from '../data/orbs.ts';
import type { OrbCounts, OrbDrop, OrbId } from '../types.ts';

interface Props {
  orbs: OrbCounts;
  lastDrop: OrbDrop | null;
  /** Orb currently picked up, waiting for a target item. */
  armed: OrbId | null;
  onArm: (orb: OrbId | null) => void;
}

export function OrbPanel({ orbs, lastDrop, armed, onArm }: Props) {
  return (
    <div className="orbs">
      {ORBS.map((orb) => {
        const count = orbs[orb.id] ?? 0;
        const justDropped = lastDrop?.orb.id === orb.id;
        const isArmed = armed === orb.id;
        return (
          <button
            key={orb.id}
            type="button"
            className={`orb ${orb.id}${isArmed ? ' armed' : ''}`}
            disabled={count === 0}
            aria-pressed={isArmed}
            title={`${orb.name}: ${orb.description}${isArmed ? ' (click again to put it back)' : ''}`}
            onClick={() => onArm(isArmed ? null : orb.id)}
          >
            <span className="orb-icon" />
            {orb.name}{' '}
            {/* Re-keyed on each drop so the count bump animation replays. */}
            <span key={justDropped ? lastDrop.key : 'idle'} className={`orb-count${justDropped ? ' bump' : ''}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
