# ARPG Item Generator: Project Summary

A browser game for rolling, equipping and crafting loot in the style of Path of Exile. It generates random items with tiered affixes, lets you build up a set of gear, and collects currency orbs you can spend to modify items. It runs entirely in the browser with no backend, and progress is saved to `localStorage`.

Stack: React 19, TypeScript, Vite.

```
npm run dev          # start the dev server
npm run check:data   # validate game data (src/data) against the content rules
npm run build        # data check + type check + production build
```

## How it plays

1. **Roll.** Press **Reroll** to generate a new item. Its slot, base, rarity and item level (1–80) are random.
2. **Compare.** The rolled item is shown next to what you have equipped in that slot. Below the cards, an "If equipped" list shows every stat that would change.
3. **Equip or skip.** Equip the item into a slot, or reroll past it. Skipping an item you didn't equip can drop a currency orb.
4. **Craft.** Click an orb to pick it up, then click an item to use it on: the rolled item, the equipped card, or any equipped slot.
5. **Save.** Store the current equipment and rolled item in one of 3 save slots and load it back later.

## Features

### Item generation
- **Slots:** weapon, helmet, body armour, gloves, belt, 2 rings and amulet. Base names follow real PoE bases, and some bases have an implicit modifier.
- **Rarities:** Normal (no affixes), Magic (1–2 affixes, named "Prefix Base Suffix") and Rare (2–6 affixes, with a random two-word name such as "Kraken Visage").
- **Affixes:** prefixes and suffixes each have 5 tiers, unlocked at item level 1, 18, 36, 54 and 72. Higher item levels give better odds of top tiers. Affixes can be restricted to certain slots, and **local** affixes (for example % Physical Damage on a weapon) modify the item's own base stats.
- **Item level scaling:** base damage and defences grow by 5% per item level.
- **Item Rarity:** an "Item Rarity" stat on equipped gear increases the odds of rolling magic and rare items. The current drop odds are shown above the item.

### Character stats
- **Total Stats:** the equipment panel adds up all equipped stats. Related stats are listed together: attributes, life and mana, defences, resistances, damage, speed and crit, then utility.
- **Combined stats** such as "+X to all Attributes" or "all Elemental Resistances" count toward each stat they cover.
- **Attribute bonuses (PoE2 values):** each point of Strength gives +2 Life, Dexterity +6 Accuracy and Intelligence +2 Mana. Hovering a boosted total shows where it comes from.

### Currency orbs
- **Drops:** rerolling past an item you didn't equip has a chance to drop an orb. The chance is 10% for Normal, 30% for Magic and 70% for Rare items. The drop plays a short burst animation that doesn't block input.
- **Which orb:** drops are weighted Exalted (45) > Vaal (28) > Chaos (19) > Divine (8).
- **Effects:**

| Orb | Effect | Works on |
|---|---|---|
| Exalted | Adds a new random affix | Rare items with room for another affix |
| Chaos | Removes one random modifier and adds a new one (PoE2) | Rare items |
| Divine | Rerolls the values of all modifiers within their ranges | Items with modifiers whose values can change |
| Vaal | Corrupts with one of four equally likely outcomes: no change, a corrupted enchantment, modifiers swapped 1–3 times, or values rerolled | Any item |

- **Corrupted items** can't be modified further.

## Code layout

```
src/
  App.tsx              Main screen: roll, compare, equip, orb use
  types.ts             Shared types (Item, AffixDef, OrbDef, ...)
  data/                Game content, kept separate from logic
    bases.ts           Base items per slot
    prefixes.ts        Prefix affixes and tiers
    suffixes.ts        Suffix affixes and tiers
    names.ts           Word pools for rare names
    rarities.ts        Rarity weights and affix counts
    corruptions.ts     Vaal outcomes and corrupted enchantments
    orbs.ts            Orb drop chances, weights and descriptions
    attributes.ts      Stats granted per attribute point
    statExpansions.ts  Combined stats (e.g. all Attributes)
    scaling.ts         Base stat growth per item level
    equipment.ts       Equipment slots
    CONTENT_GUIDE.md   Rules for adding new content
  lib/                 Pure game logic
    generator.ts       Item and affix rolling
    corruption.ts      Vaal corruption
    orbs.ts            Orb drops and orb effects
    stats.ts           Stat totals, sorting, attribute bonuses, comparisons
    properties.ts      Base properties (DPS, defences) after local mods
    rarity.ts          Item Rarity → drop odds
    validateData.ts    Data rules used by `npm run check:data`
  hooks/               Saving state to localStorage: equipment, saves, orbs
  components/          UI: ItemCard, EquipmentPanel, OrbPanel, OrbTarget, OrbDropToast, StatDiff, SavePanel
scripts/check-data.mjs Runs the data check from the command line
```

## Adding content

All content lives in `src/data/`. [`CONTENT_GUIDE.md`](src/data/CONTENT_GUIDE.md) covers naming, tiers, balance ranges and slot rules. It's written so a person or an AI model can add bases, affixes or names. Run `npm run check:data` after any change; it catches duplicate names, bad tiers, bases that can't roll enough affixes, and similar mistakes.

## Ideas not yet built
- Use Divine's PoE2 rule, which leaves implicits unchanged.
- Add more weapon suffixes: Critical Strike Multiplier, Accuracy, Life on Hit, Cast Speed.
- Add sockets, to replace the placeholder fourth Vaal outcome.
- Include orb counts in save slots.
