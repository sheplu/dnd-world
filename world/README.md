# Vaeloria — World Index

A trademark-free heroic fantasy world. Magic is **rare and feared**; the world lives in the long shadow of the **Sundering**.

## Layout

```
world/
├── meta.json            World settings, calendar, currency, languages
├── history.json         Six ages, sub-eras, per-age year counts
├── cosmology.json       Creation myth, planes, magic, prophecies
├── magic.json           The Glimmer: mechanics, costs, traditions, law
├── events/
│   ├── the-divine-warring.json    First Stillness: the first quarrel and covenant
│   ├── the-deep-forging.json      Age of Stone: Orbren teaches the hammer
│   ├── the-war-of-heavens-edge.json Age of Stone: the nine-century god-war
│   ├── the-greenwood-compact.json Age of Stone: Veyra's vow, the oldest treaty
│   ├── the-bound-storms.json      Concord: storms chained — magic learns fear
│   ├── the-silent-war.json        Concord: the Weavers' civil war
│   ├── the-sundering.json         The cataclysm year itself
│   ├── the-edict-of-silence.json  Silence: writing banned for 800 years
│   ├── the-great-collection.json  Silence: the continental purge
│   ├── the-crown-re-set.json      Ashes: Velkash rebuilds the political order
│   ├── the-salt-roads.json        Ashes: the continent reconnects through trade
│   ├── the-river-toll-war.json    Ashes: the largest mortal war since the Sundering
│   ├── the-backfiring.json        Ashes: Solmere's fall and the Accords
│   └── the-waking-and-ashfall.json Ashes: the current crisis (812 AA)
├── items/
│   ├── ash-glass-charm.json           uncommon / echo-touched
│   ├── ash-line-seed.json             rare / echo-touched
│   ├── beleths-confession.json        unique / none
│   ├── bridge-stone.json              prized / wrought
│   ├── censers-of-ash.json            unique / echo-touched
│   ├── concord-glass-forks.json       prized / wrought
│   ├── deep-forge-coal.json           unique / echo-touched
│   ├── forged-warrants.json           rare / none
│   ├── greying-mirror.json            rare / hedge
│   ├── hollow-sign-slate.json         common / none
│   ├── karvess-glass-shard.json       prized / echo-touched (illegal)
│   ├── kells-tally.json               unique / none
│   ├── moonwarden-ledger-weights.json common / none
│   ├── oath-anchor-stone.json         uncommon / hedge
│   ├── quiet-lantern.json             rare / hedge
│   ├── road-knot-charm.json           common / hedge
│   ├── sella-dellets-ring.json        unique / none
│   ├── signed-steel-blade.json        uncommon / none
│   ├── song-unbinding-pages.json      unique / wrought
│   ├── storm-relay-shard.json         rare / echo-touched
│   ├── the-broken-seal-stone.json     unique / none
│   ├── the-grey-hourglass.json        unique / wrought
│   ├── the-last-bolt-of-white-silk.json unique / wrought
│   ├── the-last-legal-page.json       unique / wrought
│   ├── the-oath-rings.json            unique / none
│   ├── the-silence-bells.json         unique / echo-touched
│   ├── the-woven-chain-link.json      unique / wrought
│   ├── everfull-flask.json            prized / wrought
│   └── weaver-shears.json             prized / wrought
├── continents/
│   └── aurelith.json    Main continent + regions (+ region map polygons)
├── geography/
│   ├── world-geography.json          Global view: seas, charted lands, rumors, grid convention
│   ├── the-stone-crown.json          Mountain range of the Dusk Reach
│   ├── the-greenwood.json            The last great forest
│   ├── greyspire-pass.json           Northmarch's fortified valley pass
│   ├── the-sunken-halls.json         Deep-folk halls under the Stone Crown
│   ├── the-weavers-river.json        Great river: Stone Crown → Velkash → Veiled Sea
│   ├── the-kings-road.json           Velkash → Ashveil Cross → ruined east
│   ├── the-threshers-vale.json       Crownlands grain vale (First Kindling)
│   ├── the-sewers-road.json          Edict-era exile route north
│   ├── the-white-roads.json          Concord ruin roads (stump-lines)
│   ├── the-quiet-scar.json           The Sundering's wound on the land
│   ├── the-glass-reach.json          Glass dunes over buried Concord cities
│   ├── the-salt-roads.json           Caravan routes reconnected after the Sundering
│   ├── the-oasis-of-hollow-wells.json  The great oasis of the Burning Sands
│   ├── the-deep-dunes.json           Southern sand-sea
│   └── the-wreck-shrines.json        Pre-Compact shrines on the skeleton coasts
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
- **Map coordinates** use a normalized 0–100 grid (`x` west→east, `y` north→south) in a `map` block: `{ "shape": "point|points|line|multiline|poly", "coords": [[x, y], ...] }`. Regions and cities carry them too; render with `npm run maps`.
- Region `key_features` in `continents/aurelith.json` are geography feature ids.

## Quick orientation

- **World:** Vaeloria — Age of Ashes, year 812 AA (per-age count).
- **Timeline:** see [history.json](history.json) — First Stillness → Age of Stone → Concord of Weavers → the Sundering → Age of Silence → Age of Ashes. Major events per age: see [events/](events/).
- **Continent:** Aurelith, five regions (Crownlands, Ashlands, Dusk Reach, Burning Sands, Bone Archipelago).
- **Geography:** the Stone Crown (mountains) and the Greenwood in the north; the Weavers' River running to the Veiled Sea; the King's Road and the Quiet scar cutting northeast–southwest; the Glass Reach, salt roads, and Deep Dunes of the southern sands; wreck-shrines on the eastern isles. See [geography/](geography/) — maps: `maps/world.svg`, `maps/aurelith.svg` (`npm run maps`).
- **Realms:** 13 political entities across the continent — see [realms/](realms/). Central tension: the Velkash Crown vs the Wealdmark on the river; the Censer's writ runs through every realm.
- **Capital:** Velkash, on the Weavers' River.
- **Settlements:** every region has a living hub (Velkash, Ashveil Cross, Hallord, Hollow Wells) and lost sites from prior ages (`status: "lost"` — Karvess, Solmere City, Hearthvale).
- **Magic:** the Glimmer — rare, feared, contained by the Censer order. See [magic.json](magic.json): workings cost the caster the Greying and thin the Veil; five traditions from forbidden Old Weaver craft to hedge-craft.
- **The Quiet:** a rent in reality left by the Sundering, running across Aurelith.
- **Deities:** the Chorus — Solvane, Luneth, Orbren, Veyra, Vaelmarr, Mornath, Ithyn, Cayren — worshipped differently by each species (same names, recast names, or rejected). Unique deities: Khord (dwarf), the Eldertree (elf), Akhmat (hollowborn). Minor deities: Glass-Thane (ash and ruin), Deep-Eye (the deep forest silence), Oath-Keeper (lawful succession), the-Remembered (forbidden knowledge), the-Veil-Thread (the thinning Veil), First-Heard (the song's return in year 812).
- **Species:** humans (Crownlands), deep-folk (Dusk Reach), greenfolk (Dusk Reach), hollowborn (Burning Sands).
- **Factions:** the Censer vs the Reeve's court is the central rivalry; the Hollow Mile feeds on both; the Rememberers outlast them all. See [factions/](factions/).
- **Items & relics:** 30 artifacts in [items/](items/), classified by two-axis rarity:
  - **Tier** (scarcity): `common` → `uncommon` → `rare` → `prized` → `unique`
  - **Glimmer nature**: `none` (mundane) · `hedge` (coaxing craft, weak but real) · `echo-touched` (absorbed Glimmer from events/places) · `wrought` (deliberately worked, pre-Sundering)
  - Magic is scarce: even a modest wrought survival is a fortune; the Censer lists prized-and-up.

## Next steps

- Begin campaign documents referencing this world.