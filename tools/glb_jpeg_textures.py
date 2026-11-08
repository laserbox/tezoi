"""Re-encode a GLB's embedded PNG colour textures as high-quality JPEG.

    uv run --no-project --with pillow python tools/glb_jpeg_textures.py IN.glb OUT.glb [QUALITY]

Only images used as base-colour or emissive textures of opaque materials are
converted, because JPEG has no alpha. Chroma is kept at full resolution (4:4:4)
and the colour profile is carried over. Geometry and every other buffer view
are copied byte for byte. The script prints each image's size and its PSNR
against the PNG, so the result can be judged before it is published.
"""
import io
import json
import math
import struct
import sys

from PIL import Image, ImageChops, ImageStat

src, dst = sys.argv[1], sys.argv[2]
quality = int(sys.argv[3]) if len(sys.argv) > 3 else 95

data = open(src, "rb").read()
magic, version, _ = struct.unpack("<4sII", data[:12])
assert magic == b"glTF" and version == 2, "not a glTF 2 binary"
chunks, at = [], 12
while at < len(data):
    length, kind = struct.unpack("<I4s", data[at:at + 8])
    chunks.append((kind, data[at + 8:at + 8 + length]))
    at += 8 + length
doc = json.loads(chunks[0][1])
binary = chunks[1][1]
assert chunks[0][0] == b"JSON" and chunks[1][0] == b"BIN\x00" and len(chunks) == 2
assert len(doc["buffers"]) == 1 and all(v["buffer"] == 0 for v in doc["bufferViews"])

# Which images feed only opaque colour slots.
colour_only = {}
for material in doc.get("materials", []):
    opaque = material.get("alphaMode", "OPAQUE") == "OPAQUE"
    slots = {
        "base": material.get("pbrMetallicRoughness", {}).get("baseColorTexture"),
        "emissive": material.get("emissiveTexture"),
        "normal": material.get("normalTexture"),
        "occlusion": material.get("occlusionTexture"),
        "metal": material.get("pbrMetallicRoughness", {}).get("metallicRoughnessTexture"),
    }
    for slot, ref in slots.items():
        if ref is None:
            continue
        image = doc["textures"][ref["index"]].get("source")
        ok = opaque and slot in {"base", "emissive"}
        colour_only[image] = colour_only.get(image, True) and ok

views = doc["bufferViews"]
replace = {}
for index, image in enumerate(doc.get("images", [])):
    if image.get("mimeType") != "image/png" or not colour_only.get(index):
        continue
    view = views[image["bufferView"]]
    start = view.get("byteOffset", 0)
    png = Image.open(io.BytesIO(binary[start:start + view["byteLength"]]))
    icc = png.info.get("icc_profile")
    rgb = png.convert("RGB")
    out = io.BytesIO()
    rgb.save(out, "JPEG", quality=quality, subsampling=0, optimize=True,
             **({"icc_profile": icc} if icc else {}))
    jpeg = out.getvalue()
    mse = sum(v ** 2 for v in ImageStat.Stat(ImageChops.difference(
        rgb, Image.open(io.BytesIO(jpeg)).convert("RGB"))).rms) / 3
    psnr = 10 * math.log10(255 ** 2 / mse) if mse else math.inf
    print(f"image {index} {image.get('name', '')}: {view['byteLength']} -> {len(jpeg)} bytes, PSNR {psnr:.1f} dB")
    replace[image["bufferView"]] = jpeg
    image["mimeType"] = "image/jpeg"

# Rebuild the binary chunk view by view, keeping 4-byte alignment.
rebuilt = bytearray()
for index, view in enumerate(views):
    start = view.get("byteOffset", 0)
    body = replace.get(index, binary[start:start + view["byteLength"]])
    rebuilt += b"\0" * (-len(rebuilt) % 4)
    view["byteOffset"] = len(rebuilt)
    view["byteLength"] = len(body)
    rebuilt += body
rebuilt += b"\0" * (-len(rebuilt) % 4)
doc["buffers"][0]["byteLength"] = len(rebuilt)

text = json.dumps(doc, separators=(",", ":")).encode()
text += b" " * (-len(text) % 4)
total = 12 + 8 + len(text) + 8 + len(rebuilt)
with open(dst, "wb") as f:
    f.write(struct.pack("<4sII", b"glTF", 2, total))
    f.write(struct.pack("<I4s", len(text), b"JSON") + text)
    f.write(struct.pack("<I4s", len(rebuilt), b"BIN\x00") + bytes(rebuilt))
print(f"{src}: {len(data)} -> {total} bytes")
