# Vaeloria — World Index

A trademark-free heroic fantasy world. Magic is **rare and feared**; the world lives in the long shadow of the **Sundering**.

## Layout

```
world/
├── meta.json            World settings, calendar, currency, languages
├── cosmology.json       Creation myth, planes, magic, prophecies
├── continents/
│   └── aurelith.json    Main continent + regions
├── cities/
│   └── velkash.json     Capital city (districts, landmarks, conflicts)
└── deities/
    └── pantheon.json    The Chorus: 8 deities
```

## Conventions

- Every entity has an `id` used as the cross-reference key.
- References to other entities use their `id` (e.g. `"cities": ["velkash"]`).
- Lore lives in JSON; rich prose goes in companion `.md` files beside the JSON when needed.

## Quick orientation

- **World:** Vaeloria — Age of Ashes, 812 years after the Sundering.
- **Continent:** Aurelith, four regions (Crownlands, Ashlands, Dusk Reach, Burning Sands).
- **Capital:** Velkash, on the Weavers' River.
- **Magic:** the Glimmer — rare, feared, contained by the Censer order.
- **The Quiet:** a rent in reality left by the Sundering, running across Aurelith.
- **Deities:** the Chorus — Solvane, Luneth, Orbren, Veyra, Vaelmarr, Mornath, Ithyn, Cayren.

## Next steps

- Flesh out the remaining cities (Dusk Reach holds, Ashlands towns, Burning Sands oases).
- Add factions (the Censer, the Reeve's court, the Hollow Mile, Storm-Bound).
- Add species/ancestries document.
- Begin campaign documents referencing this world.