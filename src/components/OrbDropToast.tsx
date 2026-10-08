import type { CSSProperties } from 'react';
import type { OrbDef } from '../types.ts';

// The rarest orb gets a bigger burst.
const SPARK_COUNT: Record<OrbDef['id'], number> = { exalted: 8, vaal: 8, chaos: 8, divine: 14 };

interface Props {
  orb: OrbDef;
}

/** One-shot drop celebration. Purely decorative: never blocks clicks, so rerolling stays instant. */
export function OrbDropToast({ orb }: Props) {
  const sparks = SPARK_COUNT[orb.id];
  return (
    <div className={`orb-drop ${orb.id}`} role="status" aria-live="polite">
      <span className="orb-drop-burst">
        <span className="orb-drop-rays" />
        {Array.from({ length: sparks }, (_, i) => (
          <span key={i} className="orb-drop-spark" style={{ '--angle': `${(360 / sparks) * i}deg` } as CSSProperties} />
        ))}
        <span className="orb-icon large" />
      </span>
      <span className="orb-drop-text">{orb.name}</span>
    </div>
  );
}
