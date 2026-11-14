# LUNA NAV

LUNA NAV is an interactive lunar exploration and preliminary mission-planning platform designed to support the assessment of potential landing regions near the Moon’s south pole. It brings lunar imagery, topographic information, and mission-planning tools together in a single browser-based workspace.

The platform enables users to explore the lunar surface, inspect candidate locations, compare landing regions, and evaluate preliminary mission conditions using public NASA datasets. It is intended to make complex lunar data more accessible, interpretable, and useful for research, education, and early-stage planning.

---

## Overview

The Moon’s south pole is a high-interest region for future exploration due to its unique terrain, illumination conditions, and scientific potential. However, evaluating suitable landing regions requires a careful understanding of slope, terrain variability, lighting, accessibility, and mission constraints.

LUNA NAV addresses this challenge by combining map-based exploration with structured planning tools. Users can inspect candidate landing sites, compare terrain characteristics, review preliminary visibility considerations, and analyse mission-relevant metrics in a clear and accessible interface.

---

## Key capabilities

- Interactive lunar map and exploration workspace
- Candidate landing-site comparison for the south polar region
- Terrain and illumination analysis using NASA datasets
- Mission metrics such as distance, bearing, and approximate traverse time
- Weighted decision matrix for comparing site options
- Shareable candidate selection links
- Export support for GeoJSON, CSV, and JSON
- NASA data hub with source checks and dataset references
- Local rule-based assistant for mission guidance and site interpretation

---

## Why this project matters

Landing-site selection depends on several interconnected considerations, including:

- terrain slope and roughness
- illumination and solar visibility
- proximity to scientifically valuable features
- traverse accessibility and regional context
- mission constraints and operational assumptions

LUNA NAV makes these criteria easier to reason about through a map-based workflow, candidate comparison tools, and mission-planning features. The project is designed to help users understand both the opportunities and limitations of early lunar site analysis.

---

## Data sources and scientific context

LUNA NAV uses publicly available NASA lunar data and imagery, including:

- NASA Moon Trek imagery
- Lunar Orbiter Laser Altimeter (LOLA) datasets
- Public planetary datasets relevant to lunar terrain analysis

The project is grounded in scientific transparency: retrieved measurements are distinguished from calculated estimates, and unavailable information is presented as unavailable rather than implied. This helps users interpret results with greater awareness of data limitations.

For deeper scientific and dataset context, see:

- `SCIENCE_AND_DATA.md`
- `HACKATHON_DEMO.md`

---

## Typical workflow

1. Open the interactive lunar map.
2. Inspect the south polar region and identify candidate sites.
3. Review available terrain and illumination information.
4. Compare candidate locations using planning tools and metrics.
5. Share or export findings for further review.

---

## Getting started

LUNA NAV is a lightweight static web application and does not require a build step or API key for the core experience.

```bash
git clone https://github.com/nyxaraindia/LUNA-NAV.git
cd LUNA-NAV
```

Then open `index.html` in a modern web browser.

Notes:
- Internet access is recommended for NASA-hosted layers and data sources.
- The project includes fallback handling and sample-data paths when remote retrieval is limited.

---

## Technology stack

- HTML
- CSS
- JavaScript
- Python utility scripts for data preparation and support tasks

---

## Project documentation

- `README.md` — project overview and run instructions
- `SCIENCE_AND_DATA.md` — scientific and dataset context
- `HACKATHON_DEMO.md` — demo and showcase notes
- `TEAM_CHECKLIST.md` — team planning and workflow notes

---

## Scope and limitations

LUNA NAV is a preliminary exploration and planning tool, not a certified lunar landing safety system or operational flight software. Its analyses are intended for research, education, and concept-level exploration.

Users should interpret results in the context of source data quality, coverage, resolution, and the exploratory nature of the platform. It is designed to support early-stage analysis rather than replace validated engineering assessment or mission-specific review.

---

## References

- Barker et al. (2023), A New View of the Lunar South Pole from LOLA
- NASA/GSFC/Arizona State University LRO WAC imagery via NASA Moon Trek

Additional references and dataset notes are available in the project files.

---

## Contributing

Contributions are welcome in areas such as scientific validation, dataset improvements, UI/UX enhancements, visualization refinements, accessibility, mobile usability, and documentation.

---

## License

No formal license is currently declared in the repository metadata. Please review the repository files and confirm permissions before reusing or redistributing the project.

---

LUNA NAV is intended to support accessible, transparent, and evidence-informed exploration of future lunar missions.
