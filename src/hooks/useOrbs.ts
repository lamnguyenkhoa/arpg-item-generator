import { useCallback, useEffect, useState } from 'react';
import type { OrbCounts, OrbId } from '../types.ts';

const STORAGE_KEY = 'arpg-item-generator.orbs.v1';

function load(): OrbCounts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as OrbCounts) : {};
  } catch {
    return {};
  }
}

export function useOrbs() {
  const [orbs, setOrbs] = useState<OrbCounts>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orbs));
    } catch {
      // Storage unavailable (private mode, quota) — orbs just won't persist.
    }
  }, [orbs]);

  const addOrb = useCallback((id: OrbId) => {
    setOrbs((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const spendOrb = useCallback((id: OrbId) => {
    setOrbs((prev) => ({ ...prev, [id]: Math.max(0, (prev[id] ?? 0) - 1) }));
  }, []);

  return { orbs, addOrb, spendOrb };
}
