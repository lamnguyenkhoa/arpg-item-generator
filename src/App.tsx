import { useEffect, useState } from 'react';
import { EquipmentPanel } from './components/EquipmentPanel.tsx';
import { ItemCard } from './components/ItemCard.tsx';
import { OrbDropToast } from './components/OrbDropToast.tsx';
import { OrbPanel } from './components/OrbPanel.tsx';
import { OrbTarget } from './components/OrbTarget.tsx';
import { SavePanel } from './components/SavePanel.tsx';
import { StatDiff } from './components/StatDiff.tsx';
import { slotsFor } from './data/equipment.ts';
import { ITEM_LEVEL_SPREAD } from './data/scaling.ts';
import { ORBS } from './data/orbs.ts';
import { useEquipment } from './hooks/useEquipment.ts';
import { useOrbs } from './hooks/useOrbs.ts';
import { useSaves } from './hooks/useSaves.ts';
import { generateItem } from './lib/generator.ts';
import { applyOrb, orbBlocker, rollOrbDrop } from './lib/orbs.ts';
import { averageItemLevel, dropLevelRange } from './lib/progression.ts';
import { itemRarityFrom, rarityChances } from './lib/rarity.ts';
import { compareItems } from './lib/stats.ts';
import type { EquipSlotId, Item, OrbDrop, OrbId } from './types.ts';

export function App() {
  const { equipment, equip, unequip, replaceAll } = useEquipment();
  const itemRarity = itemRarityFrom(equipment);
  const levelRange = dropLevelRange(equipment);
  const [item, setItem] = useState(() => generateItem({ itemRarity, levelRange }));
  const [chosenSlot, setChosenSlot] = useState<EquipSlotId | null>(null);
  const [actionNote, setActionNote] = useState<string | null>(null);
  const [orbDrop, setOrbDrop] = useState<OrbDrop | null>(null);
  const { slots: saveSlots, save, remove: deleteSave } = useSaves();
  const { orbs, addOrb, spendOrb } = useOrbs();
  const [armedOrb, setArmedOrb] = useState<OrbId | null>(null);
  const [orbFlash, setOrbFlash] = useState<{ itemId: string; key: number; orb: OrbId } | null>(null);

  // Esc puts the picked-up orb back.
  useEffect(() => {
    if (!armedOrb) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setArmedOrb(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [armedOrb]);

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
    setItem(generateItem({ itemRarity, levelRange }));
    setChosenSlot(null);
    setActionNote(null);
  };

  /** Uses the armed orb on an item, updating both the rolled and equipped copies if it's the same item. */
  const applyArmedOrb = (target: Item) => {
    if (!armedOrb || orbBlocker(armedOrb, target)) return;
    const result = applyOrb(armedOrb, target);
    spendOrb(armedOrb);
    if (item.id === target.id) setItem(result.item);
    for (const slot of Object.keys(equipment) as EquipSlotId[]) {
      if (equipment[slot]?.id === target.id) equip(slot, result.item);
    }
    setActionNote(result.note);
    setOrbFlash({ itemId: target.id, key: Date.now(), orb: armedOrb });
    // Stay armed for repeated use (like holding Shift in PoE) until this was the last one.
    if ((orbs[armedOrb] ?? 0) <= 1) setArmedOrb(null);
  };

  const armOrb = (orb: OrbId | null) => {
    setArmedOrb(orb);
    setActionNote(null);
  };

  const armed = ORBS.find((o) => o.id === armedOrb);
  const flashFor = (target: Item | undefined) => (target && orbFlash?.itemId === target.id ? orbFlash : null);

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
    setActionNote(null);
    setOrbDrop(null);
  };

  return (
    <main className="layout">
      <EquipmentPanel
        equipment={equipment}
        highlight={target.id}
        onUnequip={unequip}
        armedOrb={armedOrb}
        onApplyOrb={applyArmedOrb}
        orbFlash={orbFlash}
      />

      <section className="roll">
        <div className="roll-controls">
          <div className="actions">
            <button type="button" onClick={reroll}>
              Reroll
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
            <span
              className="muted"
              title={`Drops roll within ±${ITEM_LEVEL_SPREAD} of your average equipped item level (empty slots count as 0)`}
            >
              Avg ilvl {averageItemLevel(equipment)} · Drops ilvl {levelRange[0]}–{levelRange[1]} ·
            </span>
            <span className="muted">Item Rarity +{itemRarity}% ·</span>
            {rarityChances(itemRarity).map((r) => (
              <span key={r.id} className={`chance ${r.id}`}>
                {r.id} {(r.chance * 100).toFixed(1)}%
              </span>
            ))}
          </p>

          <OrbPanel orbs={orbs} lastDrop={orbDrop} armed={armedOrb} onArm={armOrb} />
          <div className="orb-drop-slot">{orbDrop && <OrbDropToast key={orbDrop.key} orb={orbDrop.orb} />}</div>

          {/* Always rendered (with a min-height) so the cards below don't shift when a note appears. */}
          <p className="action-note">
            {actionNote ??
              (armed && `${armed.name}: ${armed.description}. Click an item to use it · Esc to cancel`)}
          </p>
        </div>

        <div className="compare">
          <div className="column">
            <h3>Rolled</h3>
            <OrbTarget armed={armedOrb} item={item} onApply={applyArmedOrb} flash={flashFor(item)}>
              <ItemCard item={item} />
            </OrbTarget>
          </div>
          {/* Keep the second column when equipped so the rolled card doesn't jump sideways. */}
          <div className="column">
            <h3>Equipped · {target.label}</h3>
            {isEquipped ? (
              <p className="empty-slot muted">Rolled item is equipped</p>
            ) : current ? (
              <OrbTarget armed={armedOrb} item={current} onApply={applyArmedOrb} flash={flashFor(current)}>
                <ItemCard item={current} />
              </OrbTarget>
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
