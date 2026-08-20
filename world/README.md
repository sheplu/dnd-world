# Vaeloria — World Index

A trademark-free heroic fantasy world. Magic is **rare and feared**; the world lives in the long shadow of the **Sundering**.

## Layout

```
world/
├── meta.json            World settings, calendar, currency, languages
├── history.json         Six ages, sub-eras, per-age year counts
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

- **World:** Vaeloria — Age of Ashes, year 812 AA (per-age count).
- **Timeline:** see [history.json](history.json) — First Stillness → Age of Stone → Concord of Weavers → the Sundering → Age of Silence → Age of Ashes.
- **Continent:** Aurelith, four regions (Crownlands, Ashlands, Dusk Reach, Burning Sands).
- **Capital:** Velkash, on the Weavers' River.
- **Magic:** the Glimmer — rare, feared, contained by the Censer order.
- **The Quiet:** a rent in reality left by the Sundering, running across Aurelith.
- **Deities:** the Chorus — Solvane, Luneth, Orbren, Veyra, Vaelmarr, Mornath, Ithyn, Cayren — worshipped differently by each species (same names, recast names, or rejected). Unique deities: Khord (dwarf), the Eldertree (elf), Akhmat (hollowborn).

## Next steps

- Flesh out the remaining cities (Dusk Reach holds, Ashlands towns, Burning Sands oases).
- Add factions (the Censer, the Reeve's court, the Hollow Mile, Storm-Bound).
- Add species/ancestries document.
- Begin campaign documents referencing this world.