# LUNA NAV

LUNA NAV is a lunar mission planning and landing-site exploration platform built around NASA open data. The app helps researchers and mission planners explore the lunar south pole, compare candidate landing regions, analyze terrain and illumination, and assess mission-relevant constraints using interactive visualizations.

This project is a lightweight static web application: no install step, no build pipeline, and no API key required for the core experience.

## Why this project matters

The Moon remains a challenging environment for surface operations. Landing-site selection depends on several interacting factors:

- terrain slope and roughness
- illumination and solar visibility
- proximity to scientifically valuable features
- accessibility of traverse paths
- mission constraints such as line-of-sight and energy assumptions

LUNA NAV makes these criteria easier to reason about through a map-based workspace, a polar viewing mode, candidate comparison tables, and mission-planning tools.

## Key features

- Interactive lunar map and polar exploration view
- Candidate landing-site comparison for the south polar region
- Terrain and illumination analysis using NASA datasets
- Mission metrics including distance, bearing, and approximate drive time
- Decision matrix for comparing site options by weighted criteria
- Shareable candidate selection links
- Export support for GeoJSON, CSV, and JSON
- NASA data hub with source checks and dataset references
- Local rule-based assistant for mission guidance and site interpretation

## Project highlights

- Built as a static HTML/CSS/JavaScript application
- Uses NASA open imagery and lunar data products
- Built for browser-based exploration and rapid analysis
- Mobile-friendly interface for field and workshop usage
- Designed for research and concept exploration rather than operational flight software

## Tech stack

- HTML
- CSS
- JavaScript
- Python utility scripts for data preparation and sample support

## Repository structure

```text
LUNA-NAV/
├── README.md
├── HACKATHON_DEMO.md
├── SCIENCE_AND_DATA.md
├── TEAM_CHECKLIST.md
├── index.html
├── app.js
├── nasa.js
├── v2.js
├── styles.css
├── theme.css
├── manifest.webmanifest
├── assets/
├── data/
├── tools/
└── ...
```

## Run locally

1. Clone the repository.
2. Open the project folder.
3. Launch `index.html` in a modern browser.

Example:

```bash
git clone https://github.com/nyxaraindia/LUNA-NAV.git
cd LUNA-NAV
# Open index.html in your browser
```

Notes:

- Some layers and NASA-hosted data sources load from the web, so internet access is recommended.
- The project is designed to work without a build step or API key for the main workflow.
- If NASA data retrieval is limited by CORS or remote access restrictions, the project includes fallback handling and sample-data paths.

## Core user workflow

1. Open the map and inspect the lunar south pole region.
2. Select a candidate landing site or manually define locations.
3. View terrain and illumination information for each candidate.
4. Compare sites using the decision matrix and mission metrics.
5. Export or share the selected candidates for further review.

## Data and scientific background

LUNA NAV is grounded in publicly available NASA lunar data products, especially those relevant to south-pole terrain characterization and landing-site assessment.

The app references sources and methods including:

- NASA Moon Trek imagery
- LRO LOLA data and derived terrain context
- Polar-view mission and illumination analysis
- Open-source planetary datasets for research exploration

For a deeper scientific breakdown, see:

- `SCIENCE_AND_DATA.md`
- `HACKATHON_DEMO.md`

## Mission planning features

The app supports the following planning and analysis concepts:

- site prioritization based on mission constraints
- compare candidate landing areas across a set of criteria
- evaluate approximate traverse distance and direction
- review illumination and visibility assumptions
- provide structured summaries for researchers and hackathon teams

## Honesty and constraints

The project explicitly avoids inventing missing data. Where data is unavailable, values are shown as unavailable rather than estimated without evidence. This is important for scientific exploration and transparent mission analysis.

## Citation and references

The project includes references to lunar data literature and NASA dataset sources. Key references are documented in the project files and README notes.

Main scientific reference included in the repo:

- Barker et al. (2023), A New View of the Lunar South Pole from LOLA
- NASA/GSFC/Arizona State University LRO WAC imagery via NASA Moon Trek

## Project documentation

- `README.md` — overview and local run instructions
- `SCIENCE_AND_DATA.md` — deeper scientific and dataset context
- `HACKATHON_DEMO.md` — demo and showcase notes
- `TEAM_CHECKLIST.md` — team workflow and planning checklists

## License

This repository does not currently declare a formal license in the project metadata. Please check the repository files before reusing it in commercial or public deployments.

## Contributing

Contributions are welcome for:

- scientific validation and dataset improvements
- UX and visualization enhancements
- data-source integration and documentation
- performance and mobile usability improvements

## Contact

Repository: https://github.com/nyxaraindia/LUNA-NAV
