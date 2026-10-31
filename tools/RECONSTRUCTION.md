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

Renderer files were copied from local `photara-webgs/src` on 2026-10-31.
`studio-controls.js` ports Studio's camera equations; refresh it deliberately
when updating the renderer. No CDN scripts or runtime npm dependencies are used.
