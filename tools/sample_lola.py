#!/usr/bin/env python3
"""Sample the official NASA PGDA LOLA 80S/80 m products at your candidate sites and write data/lola_samples.json.
Needs internet, `pip install rasterio pyproj`. Reads only the needed bytes (the TIFFs are cloud-optimized).
Usage: python tools/sample_lola.py            (uses the three default candidates)
       python tools/sample_lola.py "Name,-88.5,-87.1" "Other,-85,10"
Check a couple of values in QGIS before you quote them."""
import json, sys, datetime, rasterio
from pyproj import Transformer
BASE = "https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/"
LAYERS = {"elevation": "LDEM_80S_80MPP_ADJ.TIF", "slope": "LDSM_80S_80MPP_ADJ.TIF",
          "error": "LDEM_80S_80MPP_ADJ_ERR.TIF", "slopeError": "LDSM_80S_80MPP_ADJ_ERR.TIF"}
sites = [("Shackleton vicinity", -89.9, 0.0), ("de Gerlache vicinity", -88.5, -87.1), ("Malapert massif vicinity", -85.0, 0.0)]
if len(sys.argv) > 1:
    sites = [(a.split(",")[0], float(a.split(",")[1]), float(a.split(",")[2])) for a in sys.argv[1:]]
out = []
for name, lat, lon in sites:
    row = {"name": name, "lat": lat, "lon": lon}
    for key, fn in LAYERS.items():
        try:
            with rasterio.open(BASE + fn) as src:
                tr = Transformer.from_crs("+proj=longlat +R=1737400 +no_defs", src.crs, always_xy=True)
                x, y = tr.transform(lon, lat)
                v = next(src.sample([(x, y)]))[0]
                row[key] = None if src.nodata is not None and v == src.nodata else float(v)
        except Exception as e:
            row[key] = None; print("!", name, key, e)
    out.append(row); print(row)
json.dump({"source": "NASA GSFC PGDA LOLA 80S 80 m/pixel (Barker et al. 2023), sampled offline with rasterio",
           "generated": datetime.datetime.utcnow().isoformat() + "Z", "samples": out},
          open("data/lola_samples.json", "w"), indent=2)
