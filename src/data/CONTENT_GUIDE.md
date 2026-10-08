# Content Creation Guide

Rules for adding base items, prefixes, suffixes and rare names to `src/data/`.
Written so an AI model (or a person) can generate new content that type-checks, passes the data check, and matches the existing balance and naming style.

## For humans: how to use this guide

Give an AI model this file plus the data file(s) you want extended, then ask for content. Example prompt:

> Follow `src/data/CONTENT_GUIDE.md`. Add 6 new suffixes to `src/data/suffixes.ts` focused on chaos and physical defence. Run `npm run check:data` and fix any errors before you finish.

After any change, run:

```
npm run check:data   # data rules (src/lib/validateData.ts)
npm run build        # data check + TypeScript + production build
```

Errors must be fixed. Warnings should be fixed unless there is a stated design reason.

---

## For AI models: rules

### 0. Scope

- Only edit the data files listed below. Do **not** edit `src/types.ts`, `src/lib/`, or components unless the task explicitly asks for it.
- If a request needs something the data model can't express (a new item slot, a new local stat, a new mechanic), say so and stop. Section 7 lists what would need code changes.
- Read the target file first. Don't duplicate stats, names or bases that already exist.
- Append new entries; don't reorder or rewrite existing ones unless asked.

### 1. Files

| File | Export | Type (in `src/types.ts`) | Contents |
|-|-|-|-|
| `bases.ts` | `BASES` | `BaseDef[]` | Base item types |
| `prefixes.ts` | `PREFIXES` | `AffixDef[]` | Prefix affixes |
| `suffixes.ts` | `SUFFIXES` | `AffixDef[]` | Suffix affixes |
| `names.ts` | `RARE_FIRST`, `RARE_SECOND` | `string[]` | Rare item name words |
| `rarities.ts` | `RARITIES`, `ITEM_RARITY_STAT` | `RarityDef[]` | Rarity weights, affix counts, and how Item Rarity scales each weight (rarely changed). Any affix or implicit granting Item Rarity must use exactly `+{v}% Item Rarity`. |
| `scaling.ts` | `BASE_STAT_GROWTH_PER_LEVEL` | `number` | How base damage and defences grow with item level (global balance knob) |
| `equipment.ts` | `EQUIP_SLOTS` | `EquipSlotDef[]` | Character gear slots (code change territory, see section 7) |

Valid values (these are TypeScript unions; anything else fails to compile):

- `Slot`: `'weapon' | 'helmet' | 'body' | 'gloves' | 'belt' | 'ring' | 'amulet'`
- `LocalStat`: `'physicalDamage' | 'attackSpeed' | 'armour' | 'evasion' | 'energyShield'`
- Max item level: `80` (`MAX_ITEM_LEVEL` in `src/lib/generator.ts`)

### 2. Stat text (applies to affixes and implicits)

`text` is both the display string and the **stacking key**: identical text from different sources adds together in totals and comparisons. So:

1. **Reuse existing text exactly** when the stat already exists. Check `prefixes.ts`, `suffixes.ts` and the implicits in `bases.ts` first. A different spelling (`+{v} to maximum Life` vs `+{v} to Maximum Life`) creates a separate, non-stacking stat.
2. Exactly one `{v}` placeholder, where the rolled integer goes.
3. Follow these patterns:

| Kind | Pattern | Example |
|-|-|-|
| Flat stat | `+{v} to <Stat>` | `+{v} to Maximum Life` |
| Percent modifier | `{v}% increased <Stat>` (no leading `+`) | `{v}% increased Armour` |
| Resistance | `+{v}% to <Element> Resistance` | `+{v}% to Fire Resistance` |
| Added damage | `Adds {v} <Type> Damage to Attacks` | `Adds {v} Cold Damage to Attacks` |
| Chance / flat percent | `+{v}% <Stat>` | `+{v}% Critical Strike Chance` |
| Conversion-style | `{v}% of <X> <verb> as <Y>` | `{v}% of Physical Damage Leeched as Life` |

4. Title Case for stat names (`Maximum Life`, `Evasion Rating`, `Energy Shield`). British spelling for `Armour`, matching existing data.
5. Values are integers. Don't write decimals in ranges.

### 3. Affixes (`prefixes.ts`, `suffixes.ts`)

```ts
{
  text: '+{v} to Maximum Life',
  slots: ['helmet', 'body'],      // optional: omit = can roll on any slot
  local: 'armour',                // optional: see 3.3
  tiers: [                        // strongest first (T1 at index 0)
    { name: 'Stalwart', minLevel: 60, min: 45, max: 70 },
    { name: 'Sanguine', minLevel: 30, min: 25, max: 44 },
    { name: 'Healthy',  minLevel: 1,  min: 10, max: 24 },
  ],
},
```

#### 3.1 Prefix or suffix?

Follow ARPG convention (Path of Exile style):

- **Prefixes**: offence and "core" defence. Added damage, % increased damage, life, mana, energy shield, local defence %, leech.
- **Suffixes**: attributes, resistances, attack/cast speed, critical strike, utility (rarity, accuracy).

When unsure, look for similar stats in the existing files and match them.

#### 3.2 Tiers

| Rule | Detail |
|-|-|
| Order | Strongest first. `minLevel` strictly decreasing; `min` and `max` never increase down the list. |
| Count | 3 tiers is standard. 2–5 is allowed. |
| Levels | Lowest tier **must** be `minLevel: 1`. Standard spacing: `1 / 25–30 / 55–60`. For 4–5 tiers, keep at least 10 levels between tiers, highest no more than 75. |
| Ranges | Contiguous and non-overlapping where possible: the next-stronger tier starts at previous `max + 1`. For very small values (1–3) a 1-point overlap is fine (see leech). |
| Spread | T1 `max` is roughly 5–7× the lowest tier's `min` (e.g. Life 10 → 70, Strength 5 → 30, Armour % 10 → 60). |
| Names | Every tier has its own name. Names must be unique across the whole file (prefixes and suffixes are checked separately). |

#### 3.3 Local affixes (`local`)

A `local` affix modifies the item's own base stat instead of the character. It is shown in blue on the item card and excluded from character totals.

- Set `local` only for stats in `LocalStat`.
- A local affix rolls only on bases that have that base stat (`physicalDamage` and `attackSpeed` need `weapon`; defences need that defence above 0). Don't also set `slots`; the base stat already restricts it.
- If the same stat should also exist as a character-wide version, make it a **separate** affix with the same `text`, no `local`, and a `slots` list that doesn't overlap the local version's bases. Existing example: `{v}% increased Attack Speed` (local on weapons; global on gloves and rings). The data check errors if two affixes with the same text can roll on one base.

#### 3.4 Slot restrictions (`slots`)

- Omit `slots` for broadly useful stats (life, attributes, resistances).
- Restrict offence to offensive slots: weapon, plus ring/gloves/amulet where thematic.
- Don't create an affix nothing can roll. The data check warns about that.

#### 3.5 Affix naming

| | Prefix names | Suffix names |
|-|-|-|
| Form | One adjective or possessive: `Heavy`, `Flaming`, `Seraphim's` | Always start with `of `: `of the Bear`, `of Haste` |
| Used as | `<Prefix> <Base>` → `Heavy War Axe` | `<Base> <Suffix>` → `War Axe of the Bear` |
| Tone | Weak tiers mundane (`Heated`, `Healthy`), strong tiers evocative (`Merciless`, `Stalwart`) | Weak: humble animals or nouns (`of the Brute`, `of the Seal`); strong: powerful ones (`of the Lion`, `of the Glacier`) |

Names must read well in both magic item patterns. Avoid real-world brands, people, slurs, and names that already exist in the file. Use straight apostrophes inside double-quoted strings: `"Ghost's"`.

### 4. Bases (`bases.ts`)

```ts
// Weapon
{
  name: 'Rune Dagger',
  slot: 'weapon',
  weapon: { physMin: 5, physMax: 20, critChance: 6.5, attacksPerSecond: 1.45 },
  implicit: { text: '+{v}% Critical Strike Chance', min: 20, max: 30 }, // optional
},
// Armour
{ name: 'Chainmail Vest', slot: 'body', defences: { armour: 90, energyShield: 25 } },
// Jewellery: implicit only
{ name: 'Gold Ring', slot: 'ring', implicit: { text: '+{v}% Item Rarity', min: 6, max: 15 } },
```

Rules:

- `name`: unique, two words, `<Material/Adjective> <ItemType>` (`Iron Hat`, `Silken Hood`, `War Axe`). It must read naturally between a prefix and a suffix.
- Weapons have `weapon` and no `defences`. Helmet, body and gloves have `defences` and no `weapon`. Belt, ring and amulet have neither and usually have an `implicit`.
- `implicit` is optional. Use it for jewellery, belts, and weapons with a signature trait. Armour usually has none. Don't use an implicit that duplicates the base's own stat (no `+{v} to Armour` implicit on an armour piece).
- Base stats are **item level 1 values**. When an item rolls, damage (`physMin`/`physMax`) and defences are multiplied by `1 + BASE_STAT_GROWTH_PER_LEVEL × (itemLevel − 1)` (`data/scaling.ts`; currently 0.05, about 4.95× at item level 80). `critChance` and `attacksPerSecond` never scale. Don't pre-scale values for "high-level" bases.

#### 4.1 Balance bands (item level 1 values)

**Weapons**: physical DPS = `(physMin + physMax) / 2 × attacksPerSecond`.

| Archetype | physMin–physMax | APS | Crit % | Base DPS |
|-|-|-|-|-|
| Fast / light (dagger, claw) | 4–8 to 15–22 | 1.40–1.60 | 6–7.5 | 12–20 |
| Balanced (sword) | 5–8 to 12–18 | 1.40–1.55 | 5 | 14–20 |
| Slow / heavy (axe, mace) | 15–22 to 28–40 | 1.10–1.25 | 5 | 25–35 |

Keep `physMin` ≥ 1 and `physMin` < `physMax`. Higher base DPS should come with a trade-off: slower speed or lower crit. Item level scaling keeps these ratios, so a slow axe always out-damages a sword *of the same item level*.

**Armour pieces**: pure single-defence values:

| Slot | Armour | Evasion | Energy Shield |
|-|-|-|-|
| Helmet | 30–50 | 30–50 | 18–28 |
| Body | 90–130 | 90–130 | 40–60 |
| Gloves | 20–30 | 20–30 | 10–15 |

- Energy Shield is about 45% of the equivalent armour or evasion value.
- **Hybrid** bases (two defences) get about 60–75% of each pure value. For example, a body with 90 armour and 25 ES.
- Don't create three-defence bases.

**Implicits**: roughly half to two-thirds of an equivalent mid-tier (T2) affix range.

#### 4.2 Coverage

Every base must be able to roll enough prefixes and suffixes for rare items (at least 1 each, ideally 3 each). When adding a new armour base type, such as the first Evasion helmet, confirm its local defence % affix exists. Run the data check; it reports bases that can't reach the max affix count.

### 5. Rare names (`names.ts`)

- `RARE_FIRST`: dark, single-word nouns or adjectives (`Doom`, `Grim`, `Viper`).
- `RARE_SECOND`: single-word nouns that sound like an item or effect (`Bane`, `Grasp`, `Shroud`).
- Each word should work with any word from the other list. No duplicates, no multi-word entries.

### 6. Checklist before finishing

- [ ] Stat `text` reuses existing wording where the stat already exists, and has exactly one `{v}`.
- [ ] Tiers are strongest first, lowest tier at `minLevel: 1`, ranges ascending toward T1, integers only.
- [ ] Tier names are unique in their file; suffix names start with `of `.
- [ ] `local` affixes have no `slots`; any global twin has a non-overlapping `slots` list.
- [ ] Base names are unique; weapon or defence values are inside the balance bands.
- [ ] `npm run check:data` shows 0 errors, and any remaining warnings are explained.
- [ ] `npm run build` succeeds.

### 7. Out of scope for data-only changes

These need code changes. Flag them to the user instead of hacking around them:

| Want | Requires |
|-|-|
| New item slot (boots, shield, quiver) | `Slot` in `src/types.ts`, `EQUIP_SLOTS` in `equipment.ts` |
| New local stat (e.g. local block chance) | `LocalStat` and base stat types in `src/types.ts`, `hasLocalStat` and `itemProperties` in `src/lib/properties.ts` |
| Non-integer or ranged rolls (`Adds 3–7 Fire Damage`) | `RolledMod` and the generator |
| Tier drop weights, item-level-gated bases, uniques | Generator and types |
