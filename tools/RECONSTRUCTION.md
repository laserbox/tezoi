# Full-model reconstruction explorer

The homepage's **Scene Reconstruction → 03 自由探索** uses the vendored Photara
WebGPU renderer in `site/assets/photara-webgs/`. The two video tabs are unchanged.
The model is fetched only after the visitor presses Enter. It preserves all
3,000,000 Gaussians, degree-3 SH and the PLY's `3dgut / mip2d` metadata.

## Local preview

```powershell
node tools/prepare-reconstruction.mjs 'D:/BaiduNetdiskDownload/1023/20261023_merged_dataset/images.cache/splat.sog'
python -m http.server 4176 --bind 127.0.0.1 --directory site
```

Open http://localhost:4176/#scene-reconstruction and select 03. WebGPU requires
HTTPS or localhost. Loading needs substantial system/GPU memory; the SH buffer
alone requires 576,000,000 bytes. Unsupported devices get an error before the
model download, and can still view the two videos.

Studio navigation uses world up −Y, a 50° vertical pinhole FOV, LMB orbit,
MMB/Shift+LMB pan, wheel zoom, RMB+WASD/QE travel, Shift 4× boost and Fly Z/C roll.
SOG position, rotation and SH are converted from RUB to Studio RDF on import.
The initial eye and direction come from the first COLMAP capture camera; roll is
levelled to Studio's world up. Navigation radius is explicitly 1 world unit in
`scene.json`; it is not Studio's sparse-scene auto radius. Double-click picking,
collision and Studio's scene placement transforms are not implemented.

## Model distribution

The default file is now `site/assets/reconstruction/splat.sog` (49,837,148 bytes),
converted from the original 792,001,815-byte PLY. It is a deployable asset
below GitHub's per-file limit. The PLY remains ignored and is not requested by
this viewer. The existing Pages workflow includes the SOG when these changes
are committed and deployed; this task does not publish it.

`scene.json` retains the original calibrated start camera and explicitly selects
`3dgut / mip2d`, because standard SOG metadata does not retain the Photara method.
The SOG uses lossy quantization and a SH palette, so image differences from PLY
are expected. Download size falls by about 93.7%; expanded GPU memory remains
the same.

The browser loader supports SOG v2, stored/deflated ZIP, lossless WebP/PNG, and
SH degree 0–3. A configured URL may point to an unbundled `meta.json`; set `bytes`
to the JSON byte size in that case. Companions are fetched relative to its URL.
SOG v1/v3, ZIP64, encrypted bundles, streamed LOD and 2DGS are rejected.

Renderer files were copied from local `photara-webgs/src` on 2026-11-05.
`studio-controls.js` ports Studio's camera equations; refresh it deliberately
when updating the renderer. No CDN scripts or runtime npm dependencies are used.


## WebGS runtime update

The explorer now uses the committed WebGS runtime in
`site/assets/photara-webgs/releases/f05490c/` (full provenance in `source.json`).
Versioned paths keep worker, JS modules and WGSL from mixing with cached older files.
The TEZOI Studio controls and website UI remain separate from the WebGS demo UI.

The loader explicitly selects packed SOG SH, avoiding canonical SH expansion.
The renderer enables tight GUT bounds, stable visible compaction, indirect draw,
exact Float32 SH palette storage and automatic spatial-block culling by default.
Stochastic rendering is not enabled. For this 3M-point scene the projection-buffer
precheck now requires 288,000,000 bytes rather than the old expanded 576 MB SH bound;
`setModel` still validates all actual allocations against device limits.

The 2026-11-05 sync includes the upstream EWA screen-footprint cap for 3DGS:
`sqrt(8 * lambda_max)` is limited to `min(1024, width, height)`, preserving the
ellipse orientation and axis ratio. Mip compensation uses the uncapped filtered
covariance. Central cameras use radial distance sorting for both GS and GUT;
orthographic cameras retain camera-Z sorting. The runtime JS, worker dependencies,
and all WGSL shaders are copied together without local renderer modifications.
The upstream `i18n.js` dependency is included; website navigation remains in
`studio-controls.js`. Both website module URLs are bumped when switching releases.


Previous release integration QA: full 3,000,000-point scene loads with `shLayout:packed`, palette
GPU storage and 11,719 spatial blocks. Requested model buffers total 565,804,032
bytes (including spatial indices). No page errors were observed. Navigation,
reset, hidden-tab pause/resume, single model download and 390px viewport overflow
checks passed. The local file selector remains absent. This update is local and
has not been published.

2026-11-05 sync validation: all vendored JS and WGSL files match the local
upstream source byte for byte (SHA-256). All 32 upstream Node tests pass.
The upstream browser GPU suite also passes in headless Edge with runtime modules
and shaders served from this website's `f05490c` directory, including EWA footprint
caps, radial/Z ordering, pixel oracles, picking and worker loading. No GPU or
page errors were reported. The full 3M-point website scene was not reloaded as
part of this sync. Changes remain local and have not been published.
