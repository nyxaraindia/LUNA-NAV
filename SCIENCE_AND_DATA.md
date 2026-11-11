# Scientific method and data provenance

## Study area
Lunar south-polar region, 80°S to 90°S, using the NASA GSFC PGDA LOLA 80S 80MPP products.

## Data products
| Product | Meaning | Unit |
|---|---|---|
| LDEM_80S_80MPP_ADJ.TIF | LOLA digital elevation model | metres |
| LDSM_80S_80MPP_ADJ.TIF | LOLA digital slope map | degrees |
| LDEM_80S_80MPP_ADJ_ERR.TIF | Surface height error | metres |

Catalogue: https://pgda.gsfc.nasa.gov/products/90

These products are cloud-optimized GeoTIFFs with south-polar stereographic X/Y coordinates in the MOON_ME frame associated with JPL DE421. The 80 m/pixel DEM is approximately 181 MB; it is accessed remotely and is not placed in the source ZIP.

## Sampling method
The browser reads GeoTIFF origin and pixel resolution from metadata, transforms candidate latitude/longitude to south-polar stereographic X/Y, then requests a small pixel window. The central pixel is the nearest-cell estimate. The companion slope and elevation-error layers are sampled independently. No value is invented when the request fails.

The conversion in the client uses a spherical polar-stereographic approximation with lunar radius 1,737,400 m. Before scientific publication, cross-check the exact projection parameters and pixel registration against the official product labels and validate test coordinates against a GIS implementation. This is a prototype method, not a substitute for full geodetic validation.

## Validation plan
1. Compare sample coordinates and values with the same GeoTIFF opened in QGIS.
2. Check pixel registration, axis orientation, longitude convention and the product's projection metadata.
3. Test known locations and no-data regions.
4. Compare LOLA slope values with a separately derived DEM slope.
5. Report the raster cell size, product version, error layer, and date of access.
6. Assess landing ellipse scale and hazards with higher-resolution datasets before drawing mission conclusions.

## Interpretation
A point elevation and slope value are terrain descriptors, not a landing safety decision. Do not equate a low slope with safe terrain. Local hazards, roughness, illumination history, horizon obstruction, communications, thermal constraints, navigation, and lander engineering all matter.

## 2.0 geometry assumptions
- **Distance:** haversine on a sphere, R = 1,737.4 km. Drive time = distance × winding factor ÷ speed. Both factor and speed are user assumptions.
- **Sun ceiling:** 90° − (|lat| − 1.54°), using the Moon's ~1.54° axial tilt. Flat terrain, no horizon, point Sun.
- **Earth ceiling:** maximum of sin(el) = sin φ sin β + cos φ cos β cos(λ_site − λ_E) over libration β ≈ ±6.7°, λ_E ≈ ±7.9° (0.5° grid). Flat terrain, no horizon. Verify constants against an ephemeris (SPICE) before publication.
- **Decision matrix:** min–max normalisation across candidates that have every weighted input; relative, not absolute.
- **Map imagery:** LRO WAC mosaic, equirectangular Moon Trek tiles (max native zoom 7 assumed).
