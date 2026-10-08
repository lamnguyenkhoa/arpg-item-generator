import type { SaveSlots } from '../hooks/useSaves.ts';
import { averageItemLevel } from '../lib/progression.ts';

interface Props {
  slots: SaveSlots;
  /** False when there's no game in progress to save. */
  canSave: boolean;
  onSave: (index: number) => void;
  onLoad: (index: number) => void;
  onDelete: (index: number) => void;
}

const formatDate = (ms: number) =>
  new Date(ms).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export function SavePanel({ slots, canSave, onSave, onLoad, onDelete }: Props) {
  return (
    <aside className="panel saves">
      <h3>Save Slots</h3>
      <ul className="save-slots">
        {slots.map((save, i) => {
          const label = `Slot ${i + 1}`;
          const itemCount = save ? Object.keys(save.equipment).length : 0;
          return (
            <li key={i} className="save-slot">
              <div className="save-info">
                <span className="save-label">{label}</span>
                {save ? (
                  <span className="save-meta">
                    {itemCount} equipped · Avg ilvl {averageItemLevel(save.equipment)} · {formatDate(save.savedAt)}
                  </span>
                ) : (
                  <span className="save-meta muted">Empty</span>
                )}
              </div>
              <div className="save-actions">
                <button
                  type="button"
                  disabled={!canSave}
                  onClick={() => {
                    if (!save || confirm(`Overwrite ${label}?`)) onSave(i);
                  }}
                >
                  Save
                </button>
                <button type="button" disabled={!save} onClick={() => onLoad(i)}>
                  Load
                </button>
                <button
                  type="button"
                  disabled={!save}
                  aria-label={`Delete ${label}`}
                  onClick={() => {
                    if (confirm(`Delete ${label}?`)) onDelete(i);
                  }}
                >
                  ×
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
