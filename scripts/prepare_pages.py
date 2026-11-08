"""Publish current media; retain retired Ego2Sim iterations in Git only."""
import json
from pathlib import Path
import shutil
import sys

source = Path(sys.argv[1]).resolve()
target = Path(sys.argv[2]).resolve()
if target.exists() or source == target or source in target.parents:
    raise SystemExit("Use a new output directory outside the source site.")

# None of these archives are referenced by the current website. Keeping the
# files in Git preserves previous experiments without shipping them to Pages.
archived = {
    "agent-conversion.js",
    "pipeline/media/ego-original-web-r12.mp4",
    "assets/ego2sim",
    "assets/ego-img-6263-clean-2x.mp4",
    "assets/ego-img-6263-edit-2x.mp4",
    "assets/ego-img-6263-clean-equipment-2x.mp4",
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
