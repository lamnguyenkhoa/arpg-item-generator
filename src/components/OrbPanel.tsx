import { ORBS } from '../data/orbs.ts';
import type { OrbCounts, OrbDrop } from '../types.ts';

interface Props {
  orbs: OrbCounts;
  lastDrop: OrbDrop | null;
}

export function OrbPanel({ orbs, lastDrop }: Props) {
  return (
    <p className="orbs">
      {ORBS.map((orb) => {
        const justDropped = lastDrop?.orb.id === orb.id;
        return (
          <span key={orb.id} className={`orb ${orb.id}`}>
            <span className="orb-icon" />
            {orb.name}{' '}
            {/* Re-keyed on each drop so the count bump animation replays. */}
            <span key={justDropped ? lastDrop.key : 'idle'} className={`orb-count${justDropped ? ' bump' : ''}`}>
              {orbs[orb.id] ?? 0}
            </span>
          </span>
        );
      })}
    </p>
  );
}
