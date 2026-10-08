import type { DiffLine } from '../lib/stats.ts';

export function StatDiff({ lines }: { lines: DiffLine[] }) {
  return (
    <section className="stat-diff">
      <h3>If equipped</h3>
      {lines.length === 0 ? (
        <p className="muted">No stat changes</p>
      ) : (
        <ul>
          {lines.map((d) => (
            <li key={d.key} className={d.delta > 0 ? 'gain' : 'loss'}>
              {d.text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
