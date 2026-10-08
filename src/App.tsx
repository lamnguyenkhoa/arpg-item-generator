import { useState } from 'react';
import { EquipmentPanel } from './components/EquipmentPanel.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { SavePanel } from './components/SavePanel.tsx';
import { StatDiff } from './components/StatDiff.tsx';
import { slotsFor } from './data/equipment.ts';
import { useEquipment } from './hooks/useEquipment.ts';
import { useSaves } from './hooks/useSaves.ts';
import { generateItem } from './lib/generator.ts';
import { diffStats } from './lib/stats.ts';
import type { EquipSlotId } from './types.ts';

export function App() {
  const [item, setItem] = useState(generateItem);
  const [chosenSlot, setChosenSlot] = useState<EquipSlotId | null>(null);
  const { equipment, equip, unequip, replaceAll } = useEquipment();
  const { slots: saveSlots, save, remove: deleteSave } = useSaves();

  const targets = slotsFor(item.slot);
  // Default to the first empty compatible slot (e.g. Ring 2 when Ring 1 is taken).
  const target =
    targets.find((s) => s.id === chosenSlot) ?? targets.find((s) => !equipment[s.id]) ?? targets[0]!;
  const current = equipment[target.id];
  const isEquipped = Object.values(equipment).some((e) => e?.id === item.id);

  const reroll = () => {
    setItem(generateItem());
    setChosenSlot(null);
  };

  const equipCurrent = () => {
    equip(target.id, item);
    setChosenSlot(target.id);
  };

  const saveTo = (index: number) => {
    save(index, { version: 1, savedAt: Date.now(), equipment, currentItem: item });
  };

  const loadFrom = (index: number) => {
    const data = saveSlots[index];
    if (!data) return;
    replaceAll(data.equipment);
    setItem(data.currentItem);
    setChosenSlot(null);
  };

  return (
    <main className="layout">
      <EquipmentPanel equipment={equipment} highlight={target.id} onUnequip={unequip} />

      <section className="roll">
        <div className="compare">
          <div className="column">
            <h3>Rolled</h3>
            <ItemCard item={item} />
          </div>
          {!isEquipped && (
            <div className="column">
              <h3>Equipped · {target.label}</h3>
              {current ? <ItemCard item={current} /> : <p className="empty-slot muted">Empty slot</p>}
            </div>
          )}
        </div>

        {!isEquipped && <StatDiff deltas={diffStats(item, current)} />}

        {targets.length > 1 && !isEquipped && (
          <div className="slot-picker">
            {targets.map((s) => (
              <button
                key={s.id}
                type="button"
                className={s.id === target.id ? 'active' : ''}
                onClick={() => setChosenSlot(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="actions">
          <button type="button" onClick={reroll}>
            Reroll
          </button>
          <button type="button" onClick={equipCurrent} disabled={isEquipped}>
            {isEquipped ? `Equipped to ${target.label}` : `Equip to ${target.label}`}
          </button>
        </div>
      </section>

      <SavePanel slots={saveSlots} onSave={saveTo} onLoad={loadFrom} onDelete={deleteSave} />
    </main>
  );
}
