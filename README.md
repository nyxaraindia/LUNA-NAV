# LUNA NAV 2.0 — Lunar Mission Workspace

Static, phone-friendly lunar south-pole research workspace built on NASA LOLA data and NASA Moon Trek imagery. No build step and no API keys.

## What is new in 2.0
- **Real map (tab 2):** Leaflet map with NASA/GSFC/ASU LRO WAC imagery from NASA Moon Trek, click-to-pick coordinates, live cursor coordinates, 80°S LOLA limit, graticule, candidate markers and a reference landing. A **Polar plot** toggle keeps true south-polar geometry and works offline.
- **Mission lab (new tab):** great-circle traverse distance, bearing and drive time; idealised sun and Earth elevation ceilings; and a what-if decision matrix with adjustable weights.
- **Share and GIS:** copy a share link of your candidates, export GeoJSON, CSV and JSON.
- **Assistant:** more topics (PSRs, ice, Artemis regions, traverse, visibility) and awareness of your ranking. Still a local rule-based guide, not a generative model.
- **Fix:** de Gerlache default longitude corrected to 87.1°W (was 25°E). Old saved copies are migrated automatically.

## 2.1 changes (hackathon redesign)
- New regolith-and-sunlight look (theme.css), live polar plot as the hero, NASA open-data panel in the sidebar.
- **NASA data hub** tab: every NASA source with a live connection test, NASA Image Library search, offline LOLA sample import.
- LOLA analysis: add/remove candidates by name, retrieve one or all, slope error, offline fallback via `tools/sample_lola.py` and `data/lola_samples.json`.
- Decision matrix never shows an empty table: criteria without data for every candidate are left out and flagged as provisional.
- Reports: all-candidate comparison or single candidate, best-by-criterion, distance matrix, citations.

## Run
Open `index.html` in a modern browser with internet access (Leaflet, GeoTIFF.js, Google Fonts, NASA tiles and NASA rasters load from the web). For GitHub Pages, upload the folder contents to the repository root and enable Pages on `main` / root.

## Honesty rules (kept from 1.5.1)
Missing data is shown as unavailable, never invented. LOLA sampling needs the NASA host to allow CORS and byte-range requests. Slope and error scoring uses retrieved samples only. Sun and Earth ceilings are flat-terrain upper bounds and ignore horizons. Not a NASA product and not for operational landing decisions.

## Map note
Moon Trek tiles here are equirectangular, so imagery is stretched east–west near the pole. Use the Polar plot for true polar layout and NASA Moon Trek for polar-projection layers.

## Citation
Barker et al. (2023), *A New View of the Lunar South Pole from LOLA*, Planetary Science Journal 4, 183, https://doi.org/10.3847/PSJ/acf3e1 · Dataset DOI https://doi.org/10.60903/gsfcpgda-lola-spole
Imagery: NASA/GSFC/Arizona State University, LRO WAC, via https://trek.nasa.gov/moon/
