import { EQUIP_SLOTS } from '../data/equipment.ts';
import { propertyTotals } from '../lib/properties.ts';
import { attributeBonuses, formatTotal, gearStatTotals, sortedStatTotals, statTotals, totalBreakdown } from '../lib/stats.ts';
import { orbBlocker } from '../lib/orbs.ts';
import type { EquipSlotId, Equipment, Item, OrbId } from '../types.ts';
import { ItemCard } from './ItemCard.tsx';

interface Props {
  equipment: Equipment;
  /** Slot the current roll would go into. */
  highlight?: EquipSlotId;
  onUnequip: (slot: EquipSlotId) => void;
  /** Orb waiting for a target; clicking an equipped slot uses it on that item. */
  armedOrb: OrbId | null;
  onApplyOrb: (item: Item) => void;
  /** Last item an orb was used on, so its row can flash. */
  orbFlash: { itemId: string; key: number; orb: OrbId } | null;
}

export function EquipmentPanel({ equipment, highlight, onUnequip, armedOrb, onApplyOrb, orbFlash }: Props) {
  const items = Object.values(equipment);
  const properties = propertyTotals(items);
  const gearTotals = gearStatTotals(items);
  const bonuses = attributeBonuses(gearTotals);
  const totals = sortedStatTotals(statTotals(items));

  return (
    <aside className="panel equipment">
      <h3>Equipment</h3>
      <ul className="slots">
        {EQUIP_SLOTS.map((slot) => {
          const item = equipment[slot.id];
          const blocker = armedOrb && item ? orbBlocker(armedOrb, item) : null;
          const orbState = !armedOrb || !item ? '' : blocker ? ' orb-invalid' : ' orb-valid';
          return (
            <li
              key={slot.id}
              className={`slot-row${slot.id === highlight ? ' highlight' : ''}${orbState}`}
              tabIndex={item ? 0 : undefined}
              title={blocker ?? undefined}
              onClick={armedOrb && item && !blocker ? () => onApplyOrb(item) : undefined}
            >
              <span className="slot-label">{slot.label}</span>
              {item ? (
                <>
                  <span className={`slot-item ${item.rarity}`}>{item.name}</span>
                  <button
                    type="button"
                    className="unequip"
                    aria-label={`Unequip ${slot.label}`}
                    onClick={(e) => {
                      e.stopPropagation(); // Don't also use an armed orb on the item.
                      onUnequip(slot.id);
                    }}
                  >
                    ×
                  </button>
                  {orbFlash?.itemId === item.id && (
                    <span key={orbFlash.key} className={`orb-flash ${orbFlash.orb}`} />
                  )}
                  <div className="slot-tooltip">
                    <ItemCard item={item} />
                  </div>
                </>
              ) : (
                <span className="slot-item muted">Empty</span>
              )}
            </li>
          );
        })}
      </ul>

      <h3>Total Stats</h3>
      {totals.length === 0 && properties.length === 0 ? (
        <p className="muted">Nothing equipped</p>
      ) : (
        <ul className="totals">
          {properties.map((p) => (
            <li key={p.key} className="property-total">
              {p.label}: {p.text}
            </li>
          ))}
          {totals.map(([text, value]) => (
            <li key={text}>
              {/* Totals boosted by attributes get a hover breakdown. */}
              {bonuses.has(text) ? (
                <span className="has-breakdown" title={totalBreakdown(text, gearTotals, bonuses)}>
                  {formatTotal(text, value)}
                </span>
              ) : (
                formatTotal(text, value)
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
