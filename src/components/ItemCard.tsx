import { formatMod } from '../lib/generator.ts';
import type { Item, RolledMod } from '../types.ts';

function ModLine({ mod }: { mod: RolledMod }) {
  return <li title={`Range: ${mod.min}–${mod.max}`}>{formatMod(mod)}</li>;
}

export function ItemCard({ item }: { item: Item }) {
  const affixes = [...item.prefixes, ...item.suffixes];
  const rarityLabel = item.rarity[0]!.toUpperCase() + item.rarity.slice(1);

  return (
    <article className={`item ${item.rarity}`}>
      <header>
        <h1>{item.name}</h1>
        {/* Rare items show the base type on a second line, like PoE/D2. */}
        {item.rarity === 'rare' && <h2>{item.baseName}</h2>}
      </header>
      <p className="meta">
        {rarityLabel} · Item Level {item.itemLevel}
      </p>
      <ul>
        <ModLine mod={item.implicit} />
      </ul>
      {affixes.length > 0 && (
        <ul>
          {affixes.map((mod, i) => (
            <ModLine key={i} mod={mod} />
          ))}
        </ul>
      )}
    </article>
  );
}
