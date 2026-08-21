# Vaeloria — World Index

A trademark-free heroic fantasy world. Magic is **rare and feared**; the world lives in the long shadow of the **Sundering**.

## Layout

```
world/
├── meta.json            World settings, calendar, currency, languages
├── history.json         Six ages, sub-eras, per-age year counts
├── cosmology.json       Creation myth, planes, magic, prophecies
├── magic.json           The Glimmer: mechanics, costs, traditions, law
├── continents/
│   └── aurelith.json    Main continent + regions
├── cities/
│   ├── velkash.json         Capital city (districts, landmarks, conflicts)
│   ├── ashveil-cross.json   Ashlands garrison town at the Quiet's crossing
│   ├── hallord.json         Eldest deep-folk hold in the Stone Crown
│   ├── hollow-wells.json    Oasis city and caravan hub of the sands
│   ├── karvess-ruin.json    Lost: the glass kingdom vitrified by the Rent
│   ├── solmere-city.json    Lost: silence-zone of the Backfiring
│   └── hearthvale.json      Lost: sacred vale of the Nine Hearths
├── species/
│   ├── human.json       Humans — makers of the current age
│   ├── dwarf.json       Deep-folk of the Stone Crown
│   ├── elf.json         Greenfolk of the Greenwood
│   └── hollowborn.json  Desert people of the Burning Sands
├── realms/
│   ├── the-velkash-crown.json   Elected reeve-dom; dominant Crownlands power
│   ├── the-wealdmark.json       Old river kingdom, Velkash's rival
│   ├── the-septuary.json        Oath-Sept temple-state of contracts
│   ├── the-ash-march.json       Disputed Crown claim over the Ashlands
│   ├── the-sunken-holds.json    Deep-folk clan federation (Hallord)
│   ├── the-greenwood-compact.json Greenfolk realm under the Root-Wardens
│   ├── northmarch.json          Frontier earldom of the passes
│   ├── ashveil-free-town.json   Chartered city-state at the Quiet crossing
│   ├── ash-baron-wilds.json     Lawless salvage country
│   ├── the-well-league.json     Hollowborn oasis confederation
│   ├── the-shard-cities.json    Excavation city-states of the Glass Reach
│   ├── the-dhar-roads.json      Nomadic caravan confederacy
│   └── the-skeleton-courts.json Pirate confederacy of the Bone Archipelago
├── factions/
│   ├── the-censer.json      Glimmer hunters (multi-age history)
│   ├── reeves-court.json    Velkash civil authority
│   ├── the-hollow-mile.json Black market of the forbidden
│   ├── storm-bound.json     Vaelmarr's wave-oathed order
│   ├── the-rememberers.json Underground keepers of Old Weaver
│   ├── extinct-orders.json  Colleges, High Concord, Unbinding, Whisperers
│   └── religious-orders.json Clergy of all deities
└── deities/
    └── pantheon.json    The Chorus: 8 deities
```

## Conventions

- Every entity has an `id` used as the cross-reference key.
- References to other entities use their `id` (e.g. `"cities": ["velkash"]`).
- Lore lives in JSON; rich prose goes in companion `.md` files beside the JSON when needed.
- **Lost settlements** carry `"status": "lost"` and a `destroyed` field, and document `sites` rather than districts (see `cities/karvess-ruin.json`).
- **Collection files** (`factions/extinct-orders.json`, `factions/religious-orders.json`) wrap multiple entities under an `orders` array; the inner ids are valid cross-reference targets.

## Quick orientation

- **World:** Vaeloria — Age of Ashes, year 812 AA (per-age count).
- **Timeline:** see [history.json](history.json) — First Stillness → Age of Stone → Concord of Weavers → the Sundering → Age of Silence → Age of Ashes.
- **Continent:** Aurelith, five regions (Crownlands, Ashlands, Dusk Reach, Burning Sands, Bone Archipelago).
- **Realms:** 13 political entities across the continent — see [realms/](realms/). Central tension: the Velkash Crown vs the Wealdmark on the river; the Censer's writ runs through every realm.
- **Capital:** Velkash, on the Weavers' River.
- **Settlements:** every region has a living hub (Velkash, Ashveil Cross, Hallord, Hollow Wells) and lost sites from prior ages (`status: "lost"` — Karvess, Solmere City, Hearthvale).
- **Magic:** the Glimmer — rare, feared, contained by the Censer order. See [magic.json](magic.json): workings cost the caster the Greying and thin the Veil; five traditions from forbidden Old Weaver craft to hedge-craft.
- **The Quiet:** a rent in reality left by the Sundering, running across Aurelith.
- **Deities:** the Chorus — Solvane, Luneth, Orbren, Veyra, Vaelmarr, Mornath, Ithyn, Cayren — worshipped differently by each species (same names, recast names, or rejected). Unique deities: Khord (dwarf), the Eldertree (elf), Akhmat (hollowborn). Minor deities: Glass-Thane (ash and ruin), Deep-Eye (the deep forest silence), Oath-Keeper (lawful succession), the-Remembered (forbidden knowledge), the-Veil-Thread (the thinning Veil), First-Heard (the song's return in year 812).
- **Species:** humans (Crownlands), deep-folk (Dusk Reach), greenfolk (Dusk Reach), hollowborn (Burning Sands).
- **Factions:** the Censer vs the Reeve's court is the central rivalry; the Hollow Mile feeds on both; the Rememberers outlast them all. See [factions/](factions/).

## Next steps

- Begin campaign documents referencing this world.