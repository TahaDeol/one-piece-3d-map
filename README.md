# One Piece Interactive World Map

A Google Earth-style 3D globe of the One Piece world — built with CesiumJS, hosted on Cloudflare R2, and deployed on Vercel. V2 will expand this into a full social web app with React, Node.js, and Supabase.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://one-piece-3d-map-7j5l.vercel.app/)
[![CesiumJS](https://img.shields.io/badge/CesiumJS-1.x-blue?style=for-the-badge)](https://cesium.com)
[![Cloudflare R2](https://img.shields.io/badge/Tiles-Cloudflare%20R2-orange?style=for-the-badge)](https://developers.cloudflare.com/r2/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge)](https://vercel.com)

![Demo](https://i.imgur.com/qdx7tnb.mp4)

</div>

---

## ✨ Features

### Shipped
- **3D interactive globe** — rotate, zoom, and fly around the One Piece world rendered on a WebGL globe
- **173+ location markers** — color-coded by sea region, manually pinned using a custom coordinate recording tool
- **Spoiler-aware filtering** — story progress slider hides locations beyond the selected arc in canonical order
- **Straw Hat route overlay** — animated Jolly Roger ship interpolates across 36 waypoints through the crew's full journey
- **Live search** — dropdown suggestions filtered by story progress and region visibility
- **Fly-to animations** — smooth camera transitions on location select with cinematic opening animation
- **Parchment-themed UI** — info panel, loading screen, and filter panel styled to match a pirate map aesthetic
- **Collapsible filter panel** — filter by sea region, location type, and arc
- **Keyboard shortcuts** — full keyboard navigation for all major actions
- **Mobile responsive** — slide-out drawer menu with touch-friendly controls
- **Hide UI mode** — clean globe viewing with a single keypress
- **URL state** — deep-linkable locations via query string

### Planned — V2 (Social Features)
- **User accounts** — register, log in, and maintain a persistent profile
- **Location comments** — leave notes and reactions at any location on the map
- **Crew system** — add friends as "crew mates" and see their activity on the globe
- **Custom saved locations** — pin and share personal favourite spots with crew mates
- **Real-time updates** — friend saves and comments appear live via Supabase subscriptions
- **React + Node.js rewrite** — V2 will migrate to a component-based React frontend and a Node.js/Express backend API to support auth, database reads/writes, and real-time data

---

## 🛠️ Tech Stack

| Tool | Purpose |
|------|---------|
| [CesiumJS](https://cesium.com) | 3D globe rendering, camera animations, entity markers |
| [GDAL](https://gdal.org) | Slicing the fan map into a 7-zoom-level mercator tile set |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | Hosting 5,461 map tiles with public CDN access |
| [Vercel](https://vercel.com) | Static site deployment with GitHub auto-deploy |
| Vanilla JavaScript | All application logic — no frameworks |
| CSS3 | Parchment UI theme with `Uncial Antiqua` and `IM Fell English` fonts |

**Planned for V2**

| Tool | Purpose |
|------|---------|
| [React](https://react.dev) | Component-based frontend rewrite |
| [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | Backend API — auth, comments, friendships, saved locations |
| [Supabase](https://supabase.com) | Postgres database, auth, and real-time subscriptions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (for local server)
- GDAL (for tile generation)
- A [CesiumJS Ion](https://ion.cesium.com) token (free tier works)

### Installation

```bash
git clone https://github.com/TahaDeol/one-piece-3d-map.git
cd one-piece-3d-map
```

### Generate Map Tiles

Tiles are not tracked in Git. Generate them locally from the source map image:

```bash
gdal_translate -a_srs EPSG:4326 -a_ullr -180 90 180 -90 \
  images/one-piece-map.jpg images/one-piece-map-geo.jpg

gdal2tiles.py --profile=mercator --zoom=0-6 \
  --webviewer=none --no-kml --tiledriver=JPEG \
  images/one-piece-map-geo.jpg tiles/
```

### Run Locally

```bash
npm install -g serve
serve .
```

Open `http://localhost:3000`

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Focus search bar |
| `F` | Toggle filter panel |
| `R` | Toggle Straw Hat route |
| `C` | Close all panels |
| `H` | Hide / show all UI |
| `←` `→` | Step story progress backward / forward |

---

## 🗂️ Project Structure

```
one-piece-3d-map/
├── index.html              # Main application entry point
├── recorder.html           # Internal coordinate recording tool
├── src/
│   ├── map.js              # Core globe logic — markers, search, filters, route
│   ├── map.css             # All styling — loading screen, panels, theme
│   ├── recorder.js         # Coordinate recording tool logic
│   └── recorder.css        # Recorder tool styling
├── data/
│   └── locations.json      # 190+ locations with coordinates and metadata
├── assets/
│   └── straw-hat-jolly-roger.png
└── tiles/                  # Generated map tiles (not tracked in git)
```

---

## 🌊 Region Color Key

| Region | Color |
|--------|-------|
| East Blue | 🔵 Blue |
| West Blue | 🟣 Purple |
| North Blue | 🟢 Green |
| South Blue | 🟠 Orange |
| Grand Line | 🟡 Gold |
| New World | ⚫ Black |
| Calm Belt | ⚪ White |
| Red Line | 🔴 Red |

---

## 🗺️ Roadmap

### V1 — Static Portfolio (Complete ✅)
| Status | Item |
|--------|------|
| ✅ | Core 3D globe with tiled map architecture |
| ✅ | 190+ manually pinned locations |
| ✅ | Spoiler filter, live search, route overlay |
| ✅ | Parchment UI theme, mobile drawer |
| ✅ | Cloudflare R2 tile hosting |
| ✅ | Vercel deployment |

### V2 — Social Web Application (Planned)
| Status | Item |
|--------|------|
| 🔲 | React frontend — component-based rewrite |
| 🔲 | Node.js + Express backend API |
| 🔲 | Supabase auth — user accounts and sessions |
| 🔲 | Supabase database — users, comments, friendships, saved locations |
| 🔲 | Crew system — add friends and view their saved locations |
| 🔲 | Location comments — per-location community notes |
| 🔲 | Real-time updates — live friend activity via Supabase subscriptions |

See open [Issues](https://github.com/TahaDeol/one-piece-3d-map/issues) for detailed tracking.

---

## 📦 Data

All 173+ location coordinates were manually recorded using a custom-built coordinate recording tool (`recorder.html`) that logs clicked globe positions to JSON. Each entry includes name, sea region, location type, story arc, and lore notes.

---

## 🙏 Credits

- Map image by [Xads181](https://www.deviantart.com/xads181) on DeviantArt (labelless version)
- One Piece is created by Eiichiro Oda / Shueisha

---

<div align="center">
  <i>The One Piece is Real.</i> 🏴‍☠️
</div>
