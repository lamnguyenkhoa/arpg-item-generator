import { EQUIP_SLOTS } from '../data/equipment.ts';
import { formatTotal, statTotals } from '../lib/stats.ts';
import type { EquipSlotId, Equipment } from '../types.ts';
import { ItemCard } from './ItemCard.tsx';

interface Props {
  equipment: Equipment;
  /** Slot the current roll would go into. */
  highlight?: EquipSlotId;
  onUnequip: (slot: EquipSlotId) => void;
}

export function EquipmentPanel({ equipment, highlight, onUnequip }: Props) {
  const totals = [...statTotals(Object.values(equipment))];

  return (
    <aside className="panel equipment">
      <h3>Equipment</h3>
      <ul className="slots">
        {EQUIP_SLOTS.map((slot) => {
          const item = equipment[slot.id];
          return (
            <li
              key={slot.id}
              className={`slot-row${slot.id === highlight ? ' highlight' : ''}`}
              tabIndex={item ? 0 : undefined}
            >
              <span className="slot-label">{slot.label}</span>
              {item ? (
                <>
                  <span className={`slot-item ${item.rarity}`}>{item.name}</span>
                  <button
                    type="button"
                    className="unequip"
                    aria-label={`Unequip ${slot.label}`}
                    onClick={() => onUnequip(slot.id)}
                  >
                    ×
                  </button>
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
      {totals.length === 0 ? (
        <p className="muted">Nothing equipped</p>
      ) : (
        <ul className="totals">
          {totals.map(([text, value]) => (
            <li key={text}>{formatTotal(text, value)}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}
