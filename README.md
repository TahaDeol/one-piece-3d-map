# One Piece Interactive World Map

An interactive 3D globe web application built with CesiumJS, allowing users 
to explore the One Piece world with fly-to animations, location markers, 
and detailed island information.

## Live Demo
[Link to be added after deployment]

## Tech Stack
- **CesiumJS** — 3D globe rendering and camera animations
- **GDAL** — Map image tile generation
- **Cloudflare R2** — Tile hosting (coming soon)
- **Vercel** — Deployment (coming soon)
- **Vanilla JavaScript** — Application logic
- **CSS3** — Parchment themed UI

## Features
- 3D interactive globe with One Piece world map texture
- 191 location markers color coded by sea region
- Fly-to camera animations on location select
- Location info panel with arc and lore details
- Pirate map themed loading screen with animated progress bar
- Cinematic opening camera animation flying into Dawn Island
- Search bar with live dropdown suggestions
- Collapsible filter panel by region, type and arc
- Straw Hat journey route overlay with animated marker

## Region Color Key
- East Blue — Blue
- West Blue — Purple
- North Blue — Green
- South Blue — Orange
- Grand Line — Gold
- New World — Black
- Calm Belt — White
- Red Line — Red

## Development Setup

1. Clone the repository
2. Install a local server — `npm install -g serve`
3. Generate map tiles using GDAL:

```bash
gdal_translate -a_srs EPSG:4326 -a_ullr -180 90 180 -90 images/one-piece-map.jpg images/one-piece-map-geo.jpg
gdal2tiles.py --profile=mercator --zoom=0-6 --webviewer=none --no-kml --tiledriver=JPEG images/one-piece-map-geo.jpg tiles/
```

4. Run `serve .` and open `http://localhost:3000`

## Project Structure

    one-piece-3d-map/
      src/
        map.js          — Core globe logic, markers, search, filters, route
        map.css         — All styling including loading screen and panels
        recorder.js     — Location coordinate recording tool
        recorder.css    — Recorder tool styling
      data/
        locations.json  — All 191 location coordinates and metadata
      images/
        straw-hat-jolly-roger.png — Straw Hat Jolly Roger for route animation
      tiles/            — Generated map tiles (not tracked in git)
      index.html        — Main application
      recorder.html     — Internal coordinate recording tool

## Data

All location coordinates were manually recorded using a custom built 
coordinate recording tool. Each location includes name, region, type, 
story arc, and lore notes.

## Upcoming Features
- Smooth info panel animations
- Location counter showing filtered results
- Copy coordinates button
- Keyboard shortcuts
- Spoiler toggle
- URL state preservation
- Mobile responsive layout
- Marker clustering

## Credits
Map image created by Xads181 on DeviantArt.