import { formatMod } from '../lib/generator.ts';
import { itemProperties } from '../lib/properties.ts';
import type { Item, RolledMod } from '../types.ts';

function ModLine({ mod }: { mod: RolledMod }) {
  const range = `Range: ${mod.min}–${mod.max}`;
  return (
    <li title={mod.tier ? `${mod.name} · Tier ${mod.tier} · ${range}` : range}>
      {formatMod(mod)}
      {mod.tier && <span className={`tier t${mod.tier}`}>T{mod.tier}</span>}
    </li>
  );
}

export function ItemCard({ item }: { item: Item }) {
  const affixes = [...item.prefixes, ...item.suffixes];
  const properties = itemProperties(item);
  const rarityLabel = item.rarity[0]!.toUpperCase() + item.rarity.slice(1);

  return (
    <article className={`item ${item.rarity}${item.corrupted ? ' is-corrupted' : ''}`}>
      <header>
        <h1>{item.name}</h1>
        {/* Rare items show the base type on a second line, like PoE/D2. */}
        {item.rarity === 'rare' && <h2>{item.baseName}</h2>}
      </header>
      {properties.length > 0 && (
        <ul className="properties">
          {properties.map((p) => (
            <li key={p.key}>
              {p.label}: <span className={p.augmented ? 'augmented' : 'value'}>{p.text}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="meta">
        {rarityLabel} · Item Level {item.itemLevel}
      </p>
      {item.enchant && (
        <ul className="enchant">
          <ModLine mod={item.enchant} />
        </ul>
      )}
      {item.implicit && (
        <ul>
          <ModLine mod={item.implicit} />
        </ul>
      )}
      {affixes.length > 0 && (
        <ul>
          {affixes.map((mod, i) => (
            <ModLine key={i} mod={mod} />
          ))}
        </ul>
      )}
      {item.corrupted && <p className="corrupted">Corrupted</p>}
    </article>
  );
}
