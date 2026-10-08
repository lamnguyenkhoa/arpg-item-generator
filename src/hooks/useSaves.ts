import { useCallback, useEffect, useState } from 'react';
import type { SaveData } from '../types.ts';

const STORAGE_KEY = 'arpg-item-generator.saves.v1';
export const SAVE_SLOT_COUNT = 3;

export type SaveSlots = (SaveData | null)[];

function isSaveData(value: unknown): value is SaveData {
  if (typeof value !== 'object' || value === null) return false;
  const save = value as Partial<SaveData>;
  return save.version === 1 && typeof save.equipment === 'object' && typeof save.currentItem === 'object';
}

function load(): SaveSlots {
  let parsed: unknown = [];
  try {
    parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    // Corrupt or unavailable storage — start with empty slots.
  }
  const list = Array.isArray(parsed) ? parsed : [];
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, i) => (isSaveData(list[i]) ? list[i] : null));
}

export function useSaves() {
  const [slots, setSlots] = useState<SaveSlots>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
    } catch {
      // Storage unavailable — saves only last for this session.
    }
  }, [slots]);

  const save = useCallback((index: number, data: SaveData) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? data : s)));
  }, []);

  const remove = useCallback((index: number) => {
    setSlots((prev) => prev.map((s, i) => (i === index ? null : s)));
  }, []);

  return { slots, save, remove };
}
