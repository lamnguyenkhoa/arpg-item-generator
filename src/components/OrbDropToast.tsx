import type { CSSProperties } from 'react';
import type { OrbDef } from '../types.ts';

// The rarest orb gets a bigger burst.
const SPARK_COUNT: Record<OrbDef['id'], number> = { exalted: 8, regal: 8, vaal: 8, chaos: 8, divine: 14 };

interface Props {
  /** Orbs that dropped together, most common first. */
  orbs: OrbDef[];
}

const dropLabel = (orbs: OrbDef[]) => (orbs.length <= 2 ? orbs.map((o) => o.name).join(' + ') : `${orbs.length} orbs`);

/** One-shot drop celebration. Purely decorative: never blocks clicks, so rerolling stays instant. */
export function OrbDropToast({ orbs }: Props) {
  // The text takes the rarest orb's color (and Divine's shimmer).
  const rarest = orbs[orbs.length - 1]!;
  return (
    <div className="orb-drop" role="status" aria-live="polite">
      <span className="orb-drop-icons">
        {orbs.map((orb, i) => {
          const sparks = SPARK_COUNT[orb.id];
          return (
            // Staggered so multiple orbs pop one after another.
            <span key={orb.id} className={`orb-drop-burst ${orb.id}`} style={{ '--delay': `${i * 0.12}s` } as CSSProperties}>
              <span className="orb-drop-rays" />
              {Array.from({ length: sparks }, (_, j) => (
                <span
                  key={j}
                  className="orb-drop-spark"
                  style={{ '--angle': `${(360 / sparks) * j}deg` } as CSSProperties}
                />
              ))}
              <span className="orb-icon large" title={orb.name} />
            </span>
          );
        })}
      </span>
      <span className={`orb-drop-text ${rarest.id}`}>{dropLabel(orbs)}</span>
    </div>
  );
}
