import { useState } from 'react';
import { EquipmentPanel } from './components/EquipmentPanel.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { OrbDropToast } from './components/OrbDropToast.tsx';
import { OrbPanel } from './components/OrbPanel.tsx';
import { SavePanel } from './components/SavePanel.tsx';
import { StatDiff } from './components/StatDiff.tsx';
import { slotsFor } from './data/equipment.ts';
import { useEquipment } from './hooks/useEquipment.ts';
import { useOrbs } from './hooks/useOrbs.ts';
import { useSaves } from './hooks/useSaves.ts';
import { corruptItem } from './lib/corruption.ts';
import { generateItem } from './lib/generator.ts';
import { rollOrbDrop } from './lib/orbs.ts';
import { itemRarityFrom, rarityChances } from './lib/rarity.ts';
import { compareItems } from './lib/stats.ts';
import type { EquipSlotId, OrbDrop } from './types.ts';

export function App() {
  const { equipment, equip, unequip, replaceAll } = useEquipment();
  const itemRarity = itemRarityFrom(equipment);
  const [item, setItem] = useState(() => generateItem({ itemRarity }));
  const [chosenSlot, setChosenSlot] = useState<EquipSlotId | null>(null);
  const [corruptionNote, setCorruptionNote] = useState<string | null>(null);
  const [orbDrop, setOrbDrop] = useState<OrbDrop | null>(null);
  const { slots: saveSlots, save, remove: deleteSave } = useSaves();
  const { orbs, addOrb } = useOrbs();

  const targets = slotsFor(item.slot);
  // Default to the first empty compatible slot (e.g. Ring 2 when Ring 1 is taken).
  const target =
    targets.find((s) => s.id === chosenSlot) ?? targets.find((s) => !equipment[s.id]) ?? targets[0]!;
  const current = equipment[target.id];
  const isEquipped = Object.values(equipment).some((e) => e?.id === item.id);

  const reroll = () => {
    // Passing on an item without equipping it can drop an orb; rarer items drop more often.
    const orb = isEquipped ? null : rollOrbDrop(item);
    if (orb) addOrb(orb.id);
    // A fresh key restarts the animation even when the same orb drops twice in a row.
    setOrbDrop(orb && { orb, key: Date.now() });
    setItem(generateItem({ itemRarity }));
    setChosenSlot(null);
    setCorruptionNote(null);
  };

  const corrupt = () => {
    const result = corruptItem(item);
    setItem(result.item);
    setCorruptionNote(result.label);
    // Keep the equipped copy in sync if this item is already worn.
    const wornIn = (Object.keys(equipment) as EquipSlotId[]).find((slot) => equipment[slot]?.id === item.id);
    if (wornIn) equip(wornIn, result.item);
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
    setCorruptionNote(null);
    setOrbDrop(null);
  };

  return (
    <main className="layout">
      <EquipmentPanel equipment={equipment} highlight={target.id} onUnequip={unequip} />

      <section className="roll">
        <div className="roll-controls">
          <div className="actions">
            <button type="button" onClick={reroll}>
              Reroll
            </button>
            <button type="button" className="corrupt" onClick={corrupt} disabled={item.corrupted}>
              {item.corrupted ? 'Corrupted' : 'Corrupt'}
            </button>
            <button type="button" className="equip" onClick={equipCurrent} disabled={isEquipped}>
              {isEquipped ? `Equipped to ${target.label}` : `Equip to ${target.label}`}
            </button>
          </div>

          {/* Always rendered at a fixed height so the controls below don't jump when it's empty. */}
          <div className="slot-picker">
            {targets.length > 1 &&
              !isEquipped &&
              targets.map((s) => (
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

          <p className="drop-chances">
            <span className="muted">Item Rarity +{itemRarity}% ·</span>
            {rarityChances(itemRarity).map((r) => (
              <span key={r.id} className={`chance ${r.id}`}>
                {r.id} {(r.chance * 100).toFixed(1)}%
              </span>
            ))}
          </p>

          <OrbPanel orbs={orbs} lastDrop={orbDrop} />
          <div className="orb-drop-slot">{orbDrop && <OrbDropToast key={orbDrop.key} orb={orbDrop.orb} />}</div>

          {/* Always rendered (with a min-height) so the cards below don't shift when a note appears. */}
          <p className="corruption-note">{corruptionNote && `Vaal: ${corruptionNote}`}</p>
        </div>

        <div className="compare">
          <div className="column">
            <h3>Rolled</h3>
            <ItemCard item={item} />
          </div>
          {/* Keep the second column when equipped so the rolled card doesn't jump sideways. */}
          <div className="column">
            <h3>Equipped · {target.label}</h3>
            {isEquipped ? (
              <p className="empty-slot muted">Rolled item is equipped</p>
            ) : current ? (
              <ItemCard item={current} />
            ) : (
              <p className="empty-slot muted">Empty slot</p>
            )}
          </div>
        </div>

        {!isEquipped && <StatDiff lines={compareItems(item, current)} />}
      </section>

      <SavePanel slots={saveSlots} onSave={saveTo} onLoad={loadFrom} onDelete={deleteSave} />
    </main>
  );
}
