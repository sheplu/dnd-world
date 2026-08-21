# dnd-world

Original, trademark-free heroic fantasy world for roleplaying campaigns.

- **World:** Vaeloria — a classic heroic fantasy world where magic is rare and feared.
- **Index:** see [world/README.md](world/README.md).

## Layout

- `world/` — the setting: continents, realms, cities, species, deities, factions, history, events, items, as JSON + markdown.
- `tools/` — validation and map tooling.
- (future) `campaigns/` — adventures set in Vaeloria.

## Maps

Render the world maps from the geography data:

```bash
npm run maps                # writes maps/world.svg + maps/aurelith.svg
```

Geography data uses a normalized 0-100 grid (`x` west→east, `y` north→south); see `world/geography/world-geography.json` for the convention.

## Validation

Check the whole world for JSON validity, schema completeness, and broken cross-references:

```bash
npm run validate            # full report
node tools/validate.js --quiet  # errors only
```

Requires Node.js >= 24 (no dependencies). Exit code `0` means every reference resolves. Run it before opening a PR that touches `world/`.