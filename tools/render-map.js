#!/usr/bin/env node
/**
 * Vaeloria map renderer.
 *
 * Reads world/geography/world-geography.json, continents/aurelith.json,
 * geography feature files, and cities, then renders:
 *
 *   maps/world.svg     global view — seas, continent outline, isles
 *   maps/aurelith.svg  detail view — regions, features, settlements
 *
 * Usage: node tools/render-map.js
 *
 * No dependencies: Node.js standard library only.
 */

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.dirname(path.dirname(__filename));
const WORLD = path.join(ROOT, "world");
const OUTDIR = path.join(ROOT, "maps");
const SCALE = 10; // 0-100 grid -> 1000x1000 canvas

function load(p) {
  return JSON.parse(fs.readFileSync(path.join(WORLD, p), "utf8"));
}

function jsonFiles(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...jsonFiles(full));
    else if (e.isFile() && e.name.endsWith(".json")) out.push(full);
  }
  return out.sort();
}

// ------------------------------------------------------------------ styling

const SEA = "#aecde0";
const LAND = "#e8dfc6";
const LAND_EDGE = "#a89a78";

const REGION_FILL = {
  "the-crownlands": "#f2e9c9",
  "the-ashlands": "#cfcabc",
  "the-dusk-reach": "#d7e1d3",
  "the-burning-sands": "#eedfb4",
};

const FEATURE_STYLE = {
  "mountain-range": { fill: "#c8bda8", stroke: "#8f8266", label: "range" },
  forest: { fill: "#adc9a4", stroke: "#7fa075" },
  vale: { fill: "#e9dfb2", stroke: "#b3a06a", dash: "1.2 0.8" },
  desert: { fill: "#ecd9a8", stroke: "#c2a76a", dash: "1.5 0.8" },
  "glass-dunes": { fill: "#dfe7dc", stroke: "#9fb3a4", dash: "1.5 0.8" },
  oasis: { fill: "#9fd0dd", stroke: "#4a90a5" },
  river: { stroke: "#41729c", width: 0.55 },
  road: { stroke: "#7a5c38", width: 0.35, dash: "2 1" },
  "ruin-road": { stroke: "#a3947a", width: 0.3, dash: "0.9 0.9" },
  "trade-route": { stroke: "#b08a2e", width: 0.45, dash: "2.4 1.2" },
  "scar-anomaly": { stroke: "#8e95a3", width: 1.3, opacity: 0.85 },
  pass: { fill: "#b0533a" },
  "underground-complex": { fill: "none", stroke: "#6b5d49", hollow: true },
  "shrine-network": { fill: "#8a7f95" },
  sea: { fill: SEA },
};

// ---------------------------------------------------------------- svg utils

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const P = (pt) => `${(pt[0] * SCALE).toFixed(1)},${(pt[1] * SCALE).toFixed(1)}`;

function polyEl(coords, attrs) {
  return `<polygon points="${coords.map(P).join(" ")}" ${attrs}/>`;
}
function lineEls(coords, attrs) {
  return `<polyline points="${coords.map(P).join(" ")}" fill="none" ${attrs}/>`;
}
function text(x, y, str, size, opts = {}) {
  const anchor = opts.anchor || "middle";
  const weight = opts.weight || "normal";
  const fill = opts.fill || "#33302a";
  const style = opts.style ? ` font-style="${opts.style}"` : "";
  const halo =
    opts.halo === false
      ? ""
      : ` stroke="#f7f3e8" stroke-width="${(size * 0.28).toFixed(2)}" paint-order="stroke"`;
  return `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Georgia, serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${fill}"${style}${halo}>${esc(str)}</text>`;
}

function centroid(coords) {
  let x = 0, y = 0;
  for (const [cx, cy] of coords) { x += cx; y += cy; }
  return [x / coords.length, y / coords.length];
}
function midpoint(coords) {
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    total += Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]);
  }
  let half = total / 2, acc = 0;
  for (let i = 1; i < coords.length; i++) {
    const seg = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]);
    if (acc + seg >= half) {
      const t = (half - acc) / seg;
      return [
        coords[i - 1][0] + t * (coords[i][0] - coords[i - 1][0]),
        coords[i - 1][1] + t * (coords[i][1] - coords[i - 1][1]),
      ];
    }
    acc += seg;
  }
  return coords[0];
}

// -------------------------------------------------------------- data loading

const index = load("geography/world-geography.json");
const aurelith = load("continents/aurelith.json");

const features = [];
for (const f of jsonFiles(path.join(WORLD, "geography"))) {
  const d = JSON.parse(fs.readFileSync(f, "utf8"));
  if (!Array.isArray(d.waters)) features.push(d);
}

const cities = [];
for (const f of jsonFiles(path.join(WORLD, "cities"))) {
  cities.push(JSON.parse(fs.readFileSync(f, "utf8")));
}

// ------------------------------------------------------------------- render

function renderWorld() {
  const parts = [];
  parts.push(`<rect width="100%" height="100%" fill="${SEA}"/>`);
  // Aurelith landmass
  parts.push(polyEl(aurelith.map.coords, `fill="${LAND}" stroke="${LAND_EDGE}" stroke-width="1"`));
  // Isles of the Bone Archipelago
  const isles = aurelith.regions.find((r) => r.id === "the-bone-archipelago");
  for (const seg of isles.map.coords) {
    parts.push(polyEl(seg, `fill="#dde3d8" stroke="${LAND_EDGE}" stroke-width="0.6"`));
  }
  // The Quiet scar, faintly, to show the wound splits the continent
  const scar = features.find((f) => f.id === "the-quiet-scar");
  if (scar) {
    parts.push(lineEls(scar.map.coords, `stroke="#8e95a3" stroke-width="1.1" opacity="0.55" stroke-linejoin="round"`));
  }
  // Sea labels from the index file
  for (const w of index.waters) {
    const c = w.label || centroid(w.map.coords);
    parts.push(text(c[0] * SCALE, c[1] * SCALE, w.name.toUpperCase(), 5, { weight: "bold", fill: "#5b7d97" }));
  }
  parts.push(
    text(aurelith.map.coords.reduce((s, p) => s + p[0], 0) / aurelith.map.coords.length * SCALE,
      aurelith.map.coords.reduce((s, p) => s + p[1], 0) / aurelith.map.coords.length * SCALE,
      "A U R E L I T H", 8, { weight: "bold", fill: "#6b6046" })
  );
  // Rumor horizon
  parts.push(`<line x1="${20 * SCALE}" y1="${97.5 * SCALE}" x2="${86 * SCALE}" y2="${97.5 * SCALE}" stroke="#5b7d97" stroke-width="0.6" stroke-dasharray="4 3"/>`);
  parts.push(text(53 * SCALE, 96.4 * SCALE, "? the Far Shore ?", 3.2, { fill: "#5b7d97", style: "italic" }));
  return wrapSvg("Vaeloria — The Charted World", parts);
}

function renderAurelith() {
  const parts = [];
  parts.push(`<rect width="100%" height="100%" fill="${SEA}"/>`);
  // Landmass base
  parts.push(polyEl(aurelith.map.coords, `fill="${LAND}" stroke="${LAND_EDGE}" stroke-width="1"`));

  // Region fills
  for (const r of aurelith.regions) {
    if (!r.map) continue;
    if (r.map.shape === "poly") {
      parts.push(polyEl(r.map.coords, `fill="${REGION_FILL[r.id] || "#ddd5bd"}" stroke="none" opacity="0.75"`));
      parts.push(polyEl(r.map.coords, `fill="none" stroke="#b3a684" stroke-width="0.35" stroke-dasharray="1.6 1.2"`));
    } else if (r.map.shape === "multiline") {
      for (const seg of r.map.coords) {
        parts.push(polyEl(seg, `fill="#dde3d8" stroke="${LAND_EDGE}" stroke-width="0.6"`));
      }
    }
  }

  // Feature shapes under labels
  for (const f of features) {
    const st = FEATURE_STYLE[f.type] || {};
    const shape = f.map.shape;
    if (shape === "poly") {
      parts.push(polyEl(f.map.coords, `fill="${st.fill || "#ccc"}" fill-opacity="0.85" stroke="${st.stroke || "#888"}" stroke-width="0.4"${st.dash ? ` stroke-dasharray="${st.dash}"` : ""}`));
    } else if (shape === "line") {
      parts.push(lineEls(f.map.coords, `stroke="${st.stroke || "#777"}" stroke-width="${st.width || 0.4}"${st.dash ? ` stroke-dasharray="${st.dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"`));
    } else if (shape === "multiline") {
      for (const seg of f.map.coords) {
        parts.push(lineEls(seg, `stroke="${st.stroke || "#777"}" stroke-width="${st.width || 0.35}"${st.dash ? ` stroke-dasharray="${st.dash}"` : ""} stroke-linejoin="round" stroke-linecap="round"`));
      }
    } else if (shape === "point") {
      const [x, y] = f.map.coords[0];
      if (st.hollow) {
        parts.push(`<circle cx="${x * SCALE}" cy="${y * SCALE}" r="${1.1 * SCALE / 10}" fill="#f7f3e8" stroke="${st.stroke}" stroke-width="0.45"/>`);
      } else {
        parts.push(`<circle cx="${x * SCALE}" cy="${y * SCALE}" r="${0.9 * SCALE / 10}" fill="${st.fill || "#777"}" stroke="#f7f3e8" stroke-width="0.3"/>`);
      }
    } else if (shape === "points") {
      for (const [x, y] of f.map.coords) {
        parts.push(`<circle cx="${x * SCALE}" cy="${y * SCALE}" r="${0.6 * SCALE / 10}" fill="${st.fill || "#777"}" stroke="#f7f3e8" stroke-width="0.25"/>`);
      }
    }
  }

  // Cities
  for (const c of cities) {
    const [x, y] = c.map.coords[0];
    const px = x * SCALE, py = y * SCALE;
    if (c.status === "lost") {
      parts.push(`<path d="M ${px - 1} ${py - 1} L ${px + 1} ${py + 1} M ${px - 1} ${py + 1} L ${px + 1} ${py - 1}" stroke="#8a4a3a" stroke-width="0.5"/>`);
      parts.push(text(px, py - 1.6, c.name.replace(/\s*\(.*\)/, ""), 1.7, { fill: "#8a4a3a", style: "italic" }));
    } else {
      parts.push(`<circle cx="${px}" cy="${py}" r="1" fill="#2c2a26" stroke="#f7f3e8" stroke-width="0.35"/>`);
      parts.push(text(px, py + 3, c.name, 2.1, { weight: "bold" }));
    }
  }

  // Region labels
  const LABEL_POS = {
    "the-crownlands": [33, 44],
    "the-ashlands": [63, 48],
    "the-dusk-reach": [50, 16],
    "the-burning-sands": [42, 84],
    "the-bone-archipelago": [87, 62],
  };
  for (const r of aurelith.regions) {
    const [x, y] = LABEL_POS[r.id] || centroid(r.map?.coords?.flat?.() || [0]);
    parts.push(text(x * SCALE, y * SCALE, r.name.toUpperCase(), 3, { weight: "bold", fill: "#6b6046" }));
  }

  // Feature labels
  const SKIP_LABELS = new Set(["the-white-roads"]); // too many segments; keep map readable
  for (const f of features) {
    if (SKIP_LABELS.has(f.id)) continue;
    let pos;
    if (f.map.shape === "poly") pos = centroid(f.map.coords);
    else if (f.map.shape === "line") pos = midpoint(f.map.coords);
    else if (f.map.shape === "multiline") pos = midpoint(f.map.coords[0]);
    else pos = f.map.coords[0];
    const dx = f.label_dx || 0, dy = f.label_dy == null ? -2 : f.label_dy;
    const st = FEATURE_STYLE[f.type] || {};
    parts.push(text((pos[0] + dx) * SCALE, (pos[1] + dy) * SCALE, f.name, 1.6, { fill: st.stroke || "#55524a", style: "italic" }));
  }

  return wrapSvg("Aurelith — Age of Ashes, 812 AA", parts);
}

function wrapSvg(title, inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${100 * SCALE} ${100 * SCALE}" width="${100 * SCALE}" height="${100 * SCALE}">
<title>${esc(title)}</title>
<rect x="0" y="0" width="${100 * SCALE}" height="${100 * SCALE}" fill="#f7f3e8"/>
${inner.join("\n")}
</svg>
`;
}

// --------------------------------------------------------------------- main

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(path.join(OUTDIR, "world.svg"), renderWorld());
fs.writeFileSync(path.join(OUTDIR, "aurelith.svg"), renderAurelith());
console.log("Rendered maps/world.svg and maps/aurelith.svg");
