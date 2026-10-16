"""Make the smaller copies the year-page cards use (images/grid/), one per photo in images/,
and images/grid/sizes.js, which tells the pages each photo's proportions before it loads.
Run from the site's top folder. Photos without a grid copy get one; photos named on the command line
(e.g. a replaced photo) are always redone."""
import os, sys
from PIL import Image, ImageOps

SRC, OUT, LONG_SIDE = "images", "images/grid", 1100
SKIP = {"og-image.jpg"}

os.makedirs(OUT, exist_ok=True)
redo = {os.path.basename(a) for a in sys.argv[1:]}
made = 0
for name in sorted(os.listdir(SRC)):
    src = os.path.join(SRC, name)
    if name in SKIP or not name.lower().endswith((".jpg", ".jpeg")) or not os.path.isfile(src):
        continue
    out = os.path.join(OUT, name)
    if os.path.exists(out) and name not in redo:
        continue
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    im.thumbnail((LONG_SIDE, LONG_SIDE), Image.LANCZOS)
    im.save(out, "JPEG", quality=80, progressive=True, optimize=True)
    if os.path.getsize(out) >= os.path.getsize(src):   # already small: keep the original bytes
        with open(src, "rb") as f, open(out, "wb") as g:
            g.write(f.read())
    made += 1
print(f"{made} grid image(s) written")

# width and height of every photo, so cards keep their shape while photos load
sizes = {}
for name in sorted(os.listdir(SRC)):
    src = os.path.join(SRC, name)
    if name in SKIP or not name.lower().endswith((".jpg", ".jpeg")) or not os.path.isfile(src):
        continue
    with Image.open(src) as im:
        w, h = ImageOps.exif_transpose(im).size
    sizes[name] = [w, h]
lines = ",\n".join(f'  "{k}": [{w}, {h}]' for k, (w, h) in sizes.items())
with open(os.path.join(OUT, "sizes.js"), "w") as f:
    f.write("/* made by .github/scripts/make_grid.py: width and height of each photo in images/ */\n")
    f.write("window.IMAGE_SIZES = {\n" + lines + "\n};\n")
print(f"sizes.js lists {len(sizes)} photos")
