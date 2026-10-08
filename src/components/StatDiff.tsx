import { formatDelta, type StatDelta } from '../lib/stats.ts';

export function StatDiff({ deltas }: { deltas: StatDelta[] }) {
  return (
    <section className="stat-diff">
      <h3>If equipped</h3>
      {deltas.length === 0 ? (
        <p className="muted">No stat changes</p>
      ) : (
        <ul>
          {deltas.map((d) => (
            <li key={d.text} className={d.delta > 0 ? 'gain' : 'loss'}>
              {formatDelta(d)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
