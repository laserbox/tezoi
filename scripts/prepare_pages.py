"""Publish current media; retain retired iterations and unused media in Git only."""
import json
from pathlib import Path
import shutil
import sys

source = Path(sys.argv[1]).resolve()
target = Path(sys.argv[2]).resolve()
if target.exists() or source == target or source in target.parents:
    raise SystemExit("Use a new output directory outside the source site.")

# None of these archives are referenced by the current website. Keeping the
# files in Git preserves previous experiments without shipping them to Pages;
# packaging fails if a page starts referencing one again.
archived = {
    "agent-conversion.js",
    "pipeline/media/ego-original-web-r12.mp4",
    "assets/ego2sim",
    "assets/ego-img-6263-clean-2x.mp4",
    "assets/ego-img-6263-edit-2x.mp4",
    "assets/ego-img-6263-clean-equipment-2x.mp4",
    # Earlier media no page uses any more (2026-11-08 size review). The
    # PNG originals were replaced on the page by visually identical JPEGs.
    "assets/gallery-labimus-medicine.mp4",
    "assets/gallery-labimus-medicine.jpg",
    "assets/gallery-labimus-weighing.mp4",
    "assets/gallery-labimus-weighing.jpg",
    "assets/gallery-rj45-attempt-hd.mp4",
    "assets/gallery-rj45-attempt-hd.jpg",
    "assets/robot-real-clean-r11.mp4",
    "assets/robot-real-clean-r11.jpg",
    "assets/robot-real-clean-r11.json",
    "assets/ego-img-6100-2x.mp4",
    "assets/ego-img-6100-2x.jpg",
    "assets/school-auto-tour.mp4",
    "assets/school-points-to-3dgs.mp4",
    "assets/haoxiang-porous.mp4",
    "assets/haoxiang-porous.jpg",
    "assets/haoxiang-lab-liquid.mp4",
    "assets/haoxiang-lab-liquid.jpg",
    "assets/visual-factory-v2.mp4",
    "assets/visual-factory-v2.webp",
    "assets/visual-warehouse-v2.mp4",
    "assets/visual-warehouse-v2.webp",
    "assets/visual-laboratory-v2.mp4",
    "assets/visual-laboratory-v2.webp",
    "assets/weigh-final.glb",
    "assets/weigh-final.glb.json",
    "assets/usedv6-scene.glb",
    "assets/usedv6-scene.json",
    "assets/usedv6-baked-scene.glb",
    "assets/usedv6-baked-scene.json",
    "assets/usedv6-baked-lighting.json",
    "assets/usedv6-baked-display-lut.png",
    "assets/usedv6-baked-fittings-diffuse.exr",
    "assets/usedv6-baked-furniture-diffuse.exr",
    "assets/usedv6-baked-shell-diffuse.exr",
    "assets/usedv6-baked-reflection.exr",
    "assets/usedv6-baked-reflection-wall-glass.exr",
    "assets/studio1-v9-web/studio1-baked-lighting.png",
    "assets/studio1-v9-web/baked-reference-preview.png",
    "assets/vendor/gaussian-splats-3d.js",
    "assets/vendor/gaussian-splats-LICENSE.txt",
    "assets/vendor/three.module.min.js",
    "assets/hero.webp",
    "assets/physics-cucumber-cutting.png",
    "assets/playground-m12-simulation-1080-cover.png",
    "assets/school-reconstruction-photo.png",
    "assets/school-reconstruction-render.png",
    "assets/visual-usedv6-real.png",
    "assets/visual-usedv6-render.png",
}


def ignore(directory, names):
    return [name for name in names
            if (Path(directory) / name).relative_to(source).as_posix() in archived]


shutil.copytree(source, target, ignore=ignore)
files = [p for p in target.rglob("*") if p.is_file()]
total = sum(p.stat().st_size for p in files)
if total >= 1_000_000_000:
    raise SystemExit(f"Pages package exceeds 1 GB: {total} bytes")
for p in files:
    if p.suffix in {".html", ".js", ".css"}:
        content = p.read_text()
        for old in archived:
            if old in content:
                raise SystemExit(f"Retired asset still referenced: {p}: {old}")
print(json.dumps({"files": len(files), "bytes": total,
                  "archives_kept_in_repository": sorted(archived)}))
