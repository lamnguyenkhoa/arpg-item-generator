import { useCallback, useEffect, useState } from 'react';
import type { EquipSlotId, Equipment, Item } from '../types.ts';

// Bump the version when the Item shape changes so stale saves are ignored.
const STORAGE_KEY = 'arpg-item-generator.equipment.v1';

function load(): Equipment {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Equipment) : {};
  } catch {
    return {};
  }
}

export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
    } catch {
      // Storage unavailable (private mode, quota) — equipment just won't persist.
    }
  }, [equipment]);

  const equip = useCallback((slot: EquipSlotId, item: Item) => {
    setEquipment((prev) => ({ ...prev, [slot]: item }));
  }, []);

  const unequip = useCallback((slot: EquipSlotId) => {
    setEquipment((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  return { equipment, equip, unequip, replaceAll: setEquipment };
}
