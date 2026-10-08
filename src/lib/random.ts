export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export function pick<T>(arr: readonly T[]): T {
  if (!arr.length) throw new Error('pick() called with an empty array');
  return arr[Math.floor(Math.random() * arr.length)]!;
}

export function pickWeighted<T extends { weight: number }>(items: readonly T[]): T {
  let roll = Math.random() * items.reduce((sum, i) => sum + i.weight, 0);
  for (const item of items) {
    roll -= item.weight;
    if (roll < 0) return item;
  }
  return items[items.length - 1]!;
}

/** Pick up to `count` distinct elements. */
export function sample<T>(arr: readonly T[], count: number): T[] {
  const pool = [...arr];
  const chosen: T[] = [];
  while (chosen.length < count && pool.length) {
    chosen.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]!);
  }
  return chosen;
}
