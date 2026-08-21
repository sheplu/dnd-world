#!/usr/bin/env node
/**
 * Vaeloria world validator.
 *
 * Checks every JSON document in world/ for:
 *   1. Valid JSON
 *   2. Required fields per entity type
 *   3. Cross-reference integrity (every id reference resolves)
 *   4. Calendar arithmetic
 *   5. Duplicate ids inside history collections
 *   6. Item rarity values
 *
 * Usage:
 *   node tools/validate.js            # full check
 *   node tools/validate.js --quiet    # errors only
 *
 * Exit code 0 = world is consistent; 1 = problems found.
 *
 * No dependencies: Node.js standard library only.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.dirname(path.dirname(__filename));
const WORLD = path.join(ROOT, "world");

const errors = [];
const warnings = [];
const quiet = process.argv.includes("--quiet");

function err(msg) {
  errors.push(msg);
}

function warn(msg) {
  warnings.push(msg);
}

function rel(p) {
  return path.relative(ROOT, p);
}

/** Recursively collect *.json files under a directory. */
function jsonFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...jsonFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

function filesUnder(folder) {
  return jsonFiles(path.join(WORLD, folder));
}

function readDoc(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    err(`${rel(file)}: invalid JSON (${e.message})`);
    return undefined;
  }
}

function missingFields(d, required) {
  return required.filter((k) => !(k in d));
}

// ---------------------------------------------------------------- registries

function buildRegistries(docs) {
  const reg = {
    species: new Set(["human", "dwarf", "elf", "hollowborn"]),
    cities: new Map(), // id -> doc
    realms: new Set(),
    factions: new Set(), // includes collection inner ids
    deities: new Set(),
    events: new Set(),
    items: new Set(),
    regions: new Set(),
    ages: new Set(),
    geography: new Set(), // includes index-file inner ids (waters, landmasses, rumors)
  };

  for (const f of filesUnder("cities")) {
    const d = docs.get(rel(f));
    if (d && d.id) reg.cities.set(d.id, d);
  }
  for (const f of filesUnder("realms")) {
    const d = docs.get(rel(f));
    if (d && d.id) reg.realms.add(d.id);
  }
  for (const f of filesUnder("events")) {
    const d = docs.get(rel(f));
    if (d && d.id) reg.events.add(d.id);
  }
  for (const f of filesUnder("items")) {
    const d = docs.get(rel(f));
    if (d && d.id) reg.items.add(d.id);
  }
  for (const f of filesUnder("geography")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    if (Array.isArray(d.waters)) {
      // Index file: register the document id plus every inner id it declares.
      if (d.id) reg.geography.add(d.id);
      for (const w of d.waters) if (w.id) reg.geography.add(w.id);
      for (const l of d.charted_landmasses || []) if (l.id) reg.geography.add(l.id);
      for (const r of d.uncharted_rumors || []) if (r.id) reg.geography.add(r.id);
    } else if (d.id) {
      reg.geography.add(d.id);
    }
  }
  for (const f of filesUnder("factions")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    if (Array.isArray(d.orders)) {
      for (const o of d.orders) if (o.id) reg.factions.add(o.id);
    } else if (d.id) {
      reg.factions.add(d.id);
    }
  }

  const pantheon = docs.get(rel(path.join(WORLD, "deities", "pantheon.json"))) || {};
  for (const d of pantheon.deities || []) if (d.id) reg.deities.add(d.id);
  for (const d of pantheon.species_unique_deities || []) if (d.id) reg.deities.add(d.id);
  for (const f of filesUnder("deities")) {
    if (f.endsWith("pantheon.json")) continue;
    const d = docs.get(rel(f));
    if (d && d.id) reg.deities.add(d.id);
  }

  const history = docs.get(rel(path.join(WORLD, "history.json"))) || {};
  for (const age of history.ages || []) if (age.id) reg.ages.add(age.id);

  const aurelith = docs.get(rel(path.join(WORLD, "continents", "aurelith.json"))) || {};
  for (const r of aurelith.regions || []) if (r.id) reg.regions.add(r.id);

  return reg;
}

// ------------------------------------------------------------- schema checks

const SCHEMAS = {
  species: ["id", "name", "type", "world", "homeland", "summary"],
  realms: [
    "id", "name", "type", "world", "continent", "region", "status",
    "summary", "government", "population", "laws", "relations",
    "adventure_hooks",
  ],
  events: [
    "id", "name", "type", "world", "age", "years", "scale", "summary",
    "participants", "course_of_events", "key_places", "consequences",
    "adventure_hooks",
  ],
  items: [
    "id", "name", "type", "category", "world", "status", "rarity", "summary",
    "origin", "current_whereabouts", "properties", "keepers",
    "value_or_danger", "adventure_hooks",
  ],
};

const LIVING_CITY_REQUIRED = ["id", "name", "type", "continent", "region", "realm", "summary"];
const LOST_CITY_REQUIRED = ["id", "name", "type", "status", "destroyed", "region", "summary"];

const GEOGRAPHY_REQUIRED = ["id", "name", "type", "world", "regions", "summary", "map"];
const MAP_SHAPES = new Set(["point", "points", "line", "multiline", "poly"]);

/** Validate a map block; returns an error string or null. */
function mapError(src, map) {
  if (!map) return null;
  if (!MAP_SHAPES.has(map.shape)) return `${src}: unknown map shape '${map.shape}'`;
  if (!Array.isArray(map.coords)) return `${src}: map.coords missing`;
  const flat = map.shape === "multiline" ? map.coords : [map.coords];
  for (const part of flat) {
    if (!Array.isArray(part)) return `${src}: malformed coords segment`;
    for (const pt of part) {
      if (
        !Array.isArray(pt) || pt.length !== 2 ||
        !Number.isFinite(pt[0]) || !Number.isFinite(pt[1])
      ) return `${src}: coordinate '${JSON.stringify(pt)}' is not [x,y]`;
      if (pt[0] < 0 || pt[0] > 100 || pt[1] < 0 || pt[1] > 100) {
        return `${src}: coordinate ${JSON.stringify(pt)} outside 0-100 grid`;
      }
    }
  }
  return null;
}

const TIERS = new Set(["common", "uncommon", "rare", "prized", "unique"]);
const GLIMMERS = new Set(["none", "hedge", "echo-touched", "wrought"]);

function checkSchemas(docs, reg) {
  // species
  for (const s of ["human", "dwarf", "elf", "hollowborn"]) {
    const file = rel(path.join(WORLD, "species", `${s}.json`));
    const d = docs.get(file);
    if (!d) { err(`${file}: missing species document`); continue; }
    const miss = missingFields(d, SCHEMAS.species);
    if (miss.length) err(`${file}: missing fields ${JSON.stringify(miss)}`);
  }

  // cities
  for (const f of filesUnder("cities")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const lost = d.status === "lost";
    const req = lost ? LOST_CITY_REQUIRED : LIVING_CITY_REQUIRED;
    const miss = missingFields(d, req);
    if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
    if (lost && !("sites" in d)) warn(`${rel(f)}: lost settlement without 'sites' section`);
    if (!lost && !("landmarks" in d) && !("districts" in d)) {
      warn(`${rel(f)}: living settlement without districts/landmarks`);
    }
    const me = mapError(rel(f), d.map);
    if (me) err(me);
  }

  // geography features
  for (const f of filesUnder("geography")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    if (Array.isArray(d.waters)) {
      // Index file: validate inner map blocks only.
      for (const w of [...(d.waters || []), ...(d.charted_landmasses || [])]) {
        const me = mapError(`${rel(f)}/${w.id}`, w.map);
        if (me) err(me);
      }
      continue;
    }
    const miss = missingFields(d, GEOGRAPHY_REQUIRED);
    if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
    const me = mapError(rel(f), d.map);
    if (me) err(me);
  }

  // realms
  for (const f of filesUnder("realms")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const miss = missingFields(d, SCHEMAS.realms);
    if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
  }

  // standalone deities
  for (const f of filesUnder("deities")) {
    if (f.endsWith("pantheon.json")) continue;
    const d = docs.get(rel(f));
    if (!d) continue;
    const miss = missingFields(d, [
      "id", "name", "type", "world", "aspects", "symbol", "clergy",
      "temperament", "attitude_to_magic", "worship_by_species",
    ]);
    if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
  }

  // factions (single + collections)
  for (const f of filesUnder("factions")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    if (Array.isArray(d.orders)) {
      // Collection schemas differ by purpose:
      //   extinct-orders   -> historical polities, need era
      //   religious-orders -> active clergy, need deity
      const innerReq = f.includes("extinct-orders")
        ? ["id", "name", "era", "summary"]
        : ["id", "name", "deity", "summary"];
      for (const o of d.orders) {
        const miss = missingFields(o, innerReq);
        if (miss.length) err(`${rel(f)}: order '${o.id}' missing ${JSON.stringify(miss)}`);
      }
    } else {
      const miss = missingFields(d, ["id", "name", "type", "world", "status", "summary"]);
      if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
    }
  }

  // events
  for (const f of filesUnder("events")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const miss = missingFields(d, SCHEMAS.events);
    if (miss.length) err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`);
  }

  // items
  for (const f of filesUnder("items")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const miss = missingFields(d, SCHEMAS.items);
    if (miss.length) { err(`${rel(f)}: missing fields ${JSON.stringify(miss)}`); continue; }
    const r = d.rarity || {};
    if (!TIERS.has(r.tier)) err(`${rel(f)}: rarity tier '${r.tier}' invalid`);
    if (!GLIMMERS.has(r.glimmer)) err(`${rel(f)}: glimmer nature '${r.glimmer}' invalid`);
  }
}

// ---------------------------------------------------------- reference checks

function allIds(reg) {
  const out = new Set();
  for (const k of ["species", "realms", "factions", "deities", "events", "items", "regions", "ages", "geography"]) {
    for (const v of reg[k]) out.add(v);
  }
  for (const cid of reg.cities.keys()) out.add(cid);
  return out;
}

function checkReferences(docs, reg) {
  function ref(src, value, targetSet, label) {
    if (value && !targetSet.has(value)) {
      err(`${src}: reference '${value}' not found among ${label}`);
    }
  }

  // cities -> region / continent / realm
  for (const [cid, c] of reg.cities) {
    ref(`cities/${cid}`, c.region, reg.regions, "regions");
    ref(`cities/${cid}`, c.continent, new Set(["aurelith"]), "continents");
    if (c.status !== "lost") ref(`cities/${cid}`, c.realm, reg.realms, "realms");
  }

  // continent regions -> cities / lost / realms
  const aurelith = docs.get(rel(path.join(WORLD, "continents", "aurelith.json"))) || {};
  for (const r of aurelith.regions || []) {
    const rid = r.id;
    for (const c of r.cities || []) {
      if (!reg.cities.has(c)) err(`aurelith region '${rid}': unknown city '${c}'`);
    }
    for (const c of r.lost_settlements || []) {
      if (!reg.cities.has(c)) err(`aurelith region '${rid}': unknown lost settlement '${c}'`);
    }
    for (const rl of r.realms || []) {
      if (!reg.realms.has(rl)) err(`aurelith region '${rid}': unknown realm '${rl}'`);
    }
    for (const kf of r.key_features || []) {
      if (!reg.geography.has(kf)) err(`aurelith region '${rid}': unknown key feature '${kf}'`);
    }
    const me = mapError(`aurelith/${rid}`, r.map);
    if (me) err(me);
  }

  // geography -> continent / regions / settlements / adjacent features
  for (const f of filesUnder("geography")) {
    const d = docs.get(rel(f));
    if (!d || Array.isArray(d.waters)) continue;
    const gid = d.id || rel(f);
    ref(`geography/${gid}`, d.continent, new Set(["aurelith"]), "continents");
    for (const rg of d.regions || []) {
      ref(`geography/${gid}`, rg, reg.regions, "regions");
    }
    for (const s of d.nearby_settlements || []) {
      ref(`geography/${gid}`, s, new Set(reg.cities.keys()), "cities");
    }
    for (const a of d.adjacent_to || []) {
      ref(`geography/${gid}`, a, reg.geography, "geography");
    }
  }

  // realms -> capital / relations
  for (const f of filesUnder("realms")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const rid = d.id || rel(f);
    ref(`realms/${rid}`, d.capital, new Set(reg.cities.keys()), "cities");
    ref(`realms/${rid}`, d.region, reg.regions, "regions");
    for (const r of d.relations || []) {
      ref(`realms/${rid}`, r.realm, reg.realms, "realms");
      ref(`realms/${rid}`, r.faction, reg.factions, "factions");
    }
  }

  // magic.json legal_status_by_realm
  const magic = docs.get(rel(path.join(WORLD, "magic.json"))) || {};
  for (const row of (magic.detection_and_law || {}).legal_status_by_realm || []) {
    ref("magic.json", row.realm, reg.realms, "realms");
  }

  // faction cross-relations + realm links
  for (const f of filesUnder("factions")) {
    const d = docs.get(rel(f));
    if (!d || Array.isArray(d.orders)) continue;
    const fid = d.id || rel(f);
    ref(`factions/${fid}`, d.realm, reg.realms, "realms");
    for (const r of d.relations || []) {
      ref(`factions/${fid}`, r.faction, reg.factions, "factions");
    }
  }

  // extinct orders evolved_into
  const ext = docs.get(rel(path.join(WORLD, "factions", "extinct-orders.json"))) || {};
  for (const o of ext.orders || []) {
    for (const e of o.evolved_into || []) {
      ref(`extinct-orders/${o.id}`, e, reg.factions, "factions");
    }
  }

  // religious orders deity refs
  const ro = docs.get(rel(path.join(WORLD, "factions", "religious-orders.json"))) || {};
  for (const o of ro.orders || []) {
    ref(`religious-orders/${o.id}`, o.deity, reg.deities, "deities");
  }

  // pantheon worship_by_species
  const pantheon = docs.get(rel(path.join(WORLD, "deities", "pantheon.json"))) || {};
  for (const d of pantheon.deities || []) {
    for (const w of d.worship_by_species || []) {
      const sp = w.species;
      if (!reg.species.has(sp) && sp !== "absent" && sp !== "rejected") {
        err(`pantheon/${d.id}: unknown species '${sp}'`);
      }
    }
  }

  // history major_events + duplicates
  const history = docs.get(rel(path.join(WORLD, "history.json"))) || {};
  for (const age of history.ages || []) {
    const aid = age.id;
    for (const e of age.major_events || []) {
      ref(`history/${aid}`, e, reg.events, "events");
    }
    const se = (age.sub_eras || []).map((s) => s.id);
    const dupSe = se.filter((x, i) => se.indexOf(x) !== i);
    if (dupSe.length) err(`history/${aid}: duplicate sub-era ids ${JSON.stringify([...new Set(dupSe)])}`);
    const ev = (age.events || []).map((e) => e.title);
    const dupEv = ev.filter((x, i) => ev.indexOf(x) !== i);
    if (dupEv.length) err(`history/${aid}: duplicate event titles ${JSON.stringify([...new Set(dupEv)])}`);
  }

  // events -> age / key_places refs
  for (const f of filesUnder("events")) {
    const d = docs.get(rel(f));
    if (!d) continue;
    const eid = d.id || rel(f);
    ref(`events/${eid}`, d.age, reg.ages, "ages");
    for (const p of d.key_places || []) {
      ref(`events/${eid}`, p.ref, allIds(reg), "known entities");
    }
  }

  // calendar arithmetic
  const meta = docs.get(rel(path.join(WORLD, "meta.json"))) || {};
  const cal = meta.calendar || {};
  const total = (cal.months || []).reduce((sum, m) => sum + (m.days || 0), 0);
  if (cal.year_length_days && total !== cal.year_length_days) {
    err(`meta.json: months sum to ${total}, expected ${cal.year_length_days}`);
  }
}

// ---------------------------------------------------------------------- main

function main() {
  const files = jsonFiles(WORLD);
  const docs = new Map();
  for (const f of files) {
    const d = readDoc(f);
    if (d !== undefined) docs.set(rel(f), d);
  }
  if (errors.length) {
    report();
    process.exit(1);
  }

  const reg = buildRegistries(docs);
  checkSchemas(docs, reg);
  checkReferences(docs, reg);

  if (!quiet) {
    const counts = {
      cities: reg.cities.size,
      realms: reg.realms.size,
      factions: reg.factions.size,
      deities: reg.deities.size,
      events: reg.events.size,
      items: filesUnder("items").length,
      regions: reg.regions.size,
      ages: reg.ages.size,
      geography: reg.geography.size,
    };
    console.log("Vaeloria world validator");
    console.log("------------------------");
    console.log(
      "Registries: " +
        Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(", ")
    );
    if (warnings.length) {
      console.log(`\nWarnings (${warnings.length}):`);
      for (const w of warnings) console.log(`  ! ${w}`);
    }
  }
  report();
}

function report() {
  if (errors.length) {
    console.log(`\nERRORS (${errors.length}):`);
    for (const e of errors) console.log(`  x ${e}`);
    process.exit(1);
  }
  if (!quiet) console.log("\nAll checks passed.");
}

main();