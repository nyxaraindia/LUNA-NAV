<div align="center">

# 🌕 LUNA NAV

### Explore the lunar south pole. Compare candidate sites. Plan with evidence.

**An interactive lunar exploration and preliminary mission-planning platform powered by NASA open data.**

[Explore the project](https://github.com/nyxaraindia/LUNA-NAV) · [Run it locally](#-get-started) · [Science & data](SCIENCE_AND_DATA.md)

</div>

---

## 🚀 The challenge

The lunar south pole is a compelling destination for future exploration—and a demanding place to plan surface operations. Terrain, illumination, traverse access, and mission constraints all matter when evaluating a potential landing region.

**LUNA NAV brings these considerations into one browser-based workspace.** Explore the lunar surface, inspect available terrain and illumination information, and compare candidate sites using clear, practical planning tools.

## 🗺️ What you can do

- **Explore the Moon** with an interactive lunar map and polar viewing mode.
- **Compare candidate landing sites** in the south polar region.
- **Review terrain and illumination context** from NASA datasets and linked sources.
- **Estimate mission metrics**, including distance, bearing, and approximate drive time.
- **Use a weighted decision matrix** to compare site options against selected criteria.
- **Share candidate selections** through shareable links.
- **Export your work** in GeoJSON, CSV, and JSON formats.
- **Consult the NASA data hub** for source checks and dataset references.
- **Ask the local, rule-based assistant** for mission guidance and site interpretation.

## 🌑 Why LUNA NAV?

Lunar science data can be difficult to navigate and compare. LUNA NAV connects maps, source information, and early-stage planning concepts in an accessible interface—helping students, researchers, and space enthusiasts investigate candidate regions and understand the questions mission planners face.

The project is designed around **transparent exploration**: distinguish data from interpretation, make source references easy to find, and show unavailable information as unavailable rather than presenting unsupported values as facts.

## 🛰️ Data and scientific context

LUNA NAV references publicly available lunar data and imagery, including:

- **NASA Moon Trek** imagery
- **Lunar Reconnaissance Orbiter (LRO) LOLA** data and derived terrain context
- Publicly available planetary datasets for research exploration

Data availability, coverage, and resolution can vary. See [`SCIENCE_AND_DATA.md`](SCIENCE_AND_DATA.md) for additional scientific and dataset context, and [`HACKATHON_DEMO.md`](HACKATHON_DEMO.md) for showcase notes.

## 🧭 Typical workflow

1. Open the map and explore the lunar south pole.
2. Select a candidate site or define locations for comparison.
3. Review the available terrain, illumination, and mission metrics.
4. Compare candidates with the decision matrix.
5. Share or export selections for further review.

## 💻 Get started

LUNA NAV is a lightweight static web application. There is no build step or API key required for the core experience.

```bash
git clone https://github.com/nyxaraindia/LUNA-NAV.git
cd LUNA-NAV
```

Then open `index.html` in a modern web browser.

**Notes:** Internet access is recommended for remotely hosted NASA layers and data. If remote retrieval is limited by CORS or other access restrictions, the app includes fallback handling and sample-data paths.

## 🧰 Built with

- HTML, CSS, and JavaScript
- Python utility scripts for data preparation and sample support
- NASA open imagery and lunar data products

## 📁 Project documentation

| Document | What it covers |
| --- | --- |
| [`SCIENCE_AND_DATA.md`](SCIENCE_AND_DATA.md) | Scientific context, datasets, and sources |
| [`HACKATHON_DEMO.md`](HACKATHON_DEMO.md) | Demo and showcase notes |
| [`TEAM_CHECKLIST.md`](TEAM_CHECKLIST.md) | Team workflow and planning checklists |

## ⚠️ Scope and limitations

**LUNA NAV is a preliminary exploration and planning tool—not a certified lunar landing safety system or operational flight software.** Its maps, metrics, and comparisons are intended for research exploration, education, and early-stage concept work. They do not replace validated engineering analysis, mission-specific data, or expert review. Approximate calculations and remote dataset limitations should be considered when interpreting results.

## 📚 References

- Barker et al. (2023), *A New View of the Lunar South Pole from LOLA*.
- NASA/GSFC/Arizona State University LRO WAC imagery via NASA Moon Trek.

Additional references and dataset notes are documented in the project files.

## 🤝 Contributing

Contributions and feedback are welcome, especially on scientific validation, dataset quality, visualization, accessibility, mobile usability, and documentation. Please open an issue to discuss a proposed change.

## 📄 License

No formal license is currently declared in the repository metadata. Please review the repository files and confirm permissions before reusing or redistributing the project.

---

<div align="center">

**Explore the terrain. Compare the possibilities. Look toward the Moon.**

</div>
