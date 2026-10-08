import type { SaveSlots } from '../hooks/useSaves.ts';
import { SavePanel } from './SavePanel.tsx';

interface Props {
  /** A game is in progress (started this session, or autosaved from last time). */
  canContinue: boolean;
  onContinue: () => void;
  onNewGame: () => void;
  slots: SaveSlots;
  onSave: (index: number) => void;
  onLoad: (index: number) => void;
  onDelete: (index: number) => void;
}

export function TitleScreen({ canContinue, onContinue, onNewGame, slots, onSave, onLoad, onDelete }: Props) {
  return (
    <main className="title-screen">
      <header className="title-header">
        <h1 className="game-title">ARPG Item Generator</h1>
        <p className="game-subtitle">Roll loot · Gear up · Craft with orbs</p>
      </header>

      <nav className="title-menu">
        {canContinue && (
          <button type="button" className="primary" onClick={onContinue}>
            Continue
          </button>
        )}
        <button
          type="button"
          className={canContinue ? undefined : 'primary'}
          onClick={() => {
            if (!canContinue || confirm('Start a new game? Unsaved gear and orbs will be lost.')) onNewGame();
          }}
        >
          New Game
        </button>
      </nav>

      <SavePanel slots={slots} canSave={canContinue} onSave={onSave} onLoad={onLoad} onDelete={onDelete} />
    </main>
  );
}
