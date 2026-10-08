import { useEffect, useRef, useState } from 'react';
import type { SaveSlots } from '../hooks/useSaves.ts';

interface Props {
  slots: SaveSlots;
  /** Slot last saved to or loaded from this game; Save writes there straight away. */
  activeSlot: number | null;
  onSave: (index: number) => void;
}

/** In-game Save button: saves to the current slot, or asks which slot when the game has none yet. */
export function QuickSave({ slots, activeSlot, onSave }: Props) {
  const [picking, setPicking] = useState(false);
  const [savedTo, setSavedTo] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  // Brief "Saved" confirmation on the button.
  useEffect(() => {
    if (savedTo === null) return;
    const timer = setTimeout(() => setSavedTo(null), 1500);
    return () => clearTimeout(timer);
  }, [savedTo]);

  // Close the slot picker on outside click or Esc.
  useEffect(() => {
    if (!picking) return;
    const onClick = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setPicking(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPicking(false);
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [picking]);

  const saveTo = (index: number) => {
    onSave(index);
    setSavedTo(index);
    setPicking(false);
  };

  return (
    <div className="quick-save" ref={root}>
      <button
        type="button"
        className={savedTo !== null ? 'saved' : undefined}
        onClick={() => (activeSlot === null ? setPicking((p) => !p) : saveTo(activeSlot))}
      >
        {savedTo !== null ? `Saved to Slot ${savedTo + 1} ✓` : activeSlot === null ? 'Save' : `Save · Slot ${activeSlot + 1}`}
      </button>
      {picking && (
        <ul className="quick-save-slots panel">
          {slots.map((save, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  if (!save || confirm(`Overwrite Slot ${i + 1}?`)) saveTo(i);
                }}
              >
                <span className="save-label">Slot {i + 1}</span>
                <span className="save-meta">
                  {save ? `${Object.keys(save.equipment).length} equipped · overwrite` : 'Empty'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
