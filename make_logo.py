"""
Generate Dr.Emmy logo as a 640x640 PNG matching the uploaded design.
Run: python3 make_logo.py
"""
from PIL import Image, ImageDraw, ImageFont
import math, os

BG          = (232, 168, 146)
DARK_GREEN  = (47,  74,  60)
SAGE        = (110, 139, 116)
LIGHT_GREEN = (163, 195, 166)
SIZE = 640

img  = Image.new("RGB", (SIZE, SIZE), BG)
draw = ImageDraw.Draw(img)


# ── helper: paste a rotated ellipse (leaf) onto img ───────────────────────────
def paste_leaf(base_img, cx, cy, rx, ry, angle_deg, color):
    """Draw a rotated ellipse by creating a temp layer and rotating it."""
    pad = max(rx, ry) + 4
    leaf_sz = int(pad * 2 + 2)
    leaf = Image.new("RGBA", (leaf_sz, leaf_sz), (0, 0, 0, 0))
    ld = ImageDraw.Draw(leaf)
    ld.ellipse([pad - rx, pad - ry, pad + rx, pad + ry],
               fill=color + (255,))
    leaf = leaf.rotate(-angle_deg, expand=True, resample=Image.BICUBIC)
    nx, ny = cx - leaf.width // 2, cy - leaf.height // 2
    base_img.paste(leaf, (int(nx), int(ny)), leaf)


# ── CRESCENT MOON ─────────────────────────────────────────────────────────────
moon_cx, moon_cy, moon_r = 165, 218, 162   # main circle
bite_cx, bite_cy, bite_r = 255, 192, 134   # subtracted circle

# Thin outer sage ring
draw.ellipse([moon_cx-moon_r, moon_cy-moon_r, moon_cx+moon_r, moon_cy+moon_r],
             outline=SAGE, width=3)

# Moon body
draw.ellipse([moon_cx-moon_r, moon_cy-moon_r, moon_cx+moon_r, moon_cy+moon_r],
             fill=DARK_GREEN)

# Inner sage arc (thin ring ~14px inside moon edge)
ir = moon_r - 14
draw.ellipse([moon_cx-ir, moon_cy-ir, moon_cx+ir, moon_cy+ir],
             outline=SAGE, width=2)

# Bite – restores background to create crescent
draw.ellipse([bite_cx-bite_r, bite_cy-bite_r, bite_cx+bite_r, bite_cy+bite_r],
             fill=BG)


# ── 8-POINTED STARS ───────────────────────────────────────────────────────────
def star8(cx, cy, R=13, r=6):
    pts = []
    for i in range(16):
        a = math.radians(i * 22.5 - 90)
        rad = R if i % 2 == 0 else r
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    return pts

def in_crescent(x, y):
    return (math.hypot(x-moon_cx, y-moon_cy) < moon_r - 10 and
            math.hypot(x-bite_cx, y-bite_cy) > bite_r + 10)

star_positions = [(90, 128), (48, 205), (65, 282), (115, 335), (178, 360)]
for sx, sy in star_positions:
    if in_crescent(sx, sy):
        draw.polygon(star8(sx, sy), fill=LIGHT_GREEN)


# ── OLIVE BRANCH ──────────────────────────────────────────────────────────────
# Stem from top-crescent tip area curving to upper-right
stem = [
    (190, 108), (208, 95), (228, 83), (250, 74),
    (272, 67),  (294, 63), (314, 61), (330, 62),
]
draw.line(stem, fill=DARK_GREEN, width=3)

# Leaf pairs along the stem (cx, cy, angle)
leaf_data = [
    (202, 100, -42), (222, 88, -50), (244, 78, -55),
    (266, 70, -52),  (288, 65, -47), (308, 62, -40), (326, 62, -32),
]
for lx, ly, ang in leaf_data:
    # upper leaf
    ux = lx + 14 * math.cos(math.radians(ang - 90))
    uy = ly + 14 * math.sin(math.radians(ang - 90))
    paste_leaf(img, ux, uy, 12, 5, ang, DARK_GREEN)
    # lower leaf (mirrored angle)
    lox = lx + 14 * math.cos(math.radians(ang + 90))
    loy = ly + 14 * math.sin(math.radians(ang + 90))
    paste_leaf(img, lox, loy, 12, 5, ang + 180, DARK_GREEN)

# Berry dots at tip
for bx, by, br in [(333, 60, 4), (340, 68, 3.5), (334, 76, 3)]:
    draw.ellipse([bx-br, by-br, bx+br, by+br], fill=DARK_GREEN)

# redraw draw after pasting leaves (draw object still works on img)
draw = ImageDraw.Draw(img)

# ── "Dr.Emmy" TEXT ────────────────────────────────────────────────────────────
text    = "Dr.Emmy"
font_paths = [
    "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSerif.ttf",
    "/usr/share/fonts/truetype/ubuntu/Ubuntu-R.ttf",
]
font = None
for fp in font_paths:
    if os.path.exists(fp):
        try:
            font = ImageFont.truetype(fp, size=64)
            break
        except Exception:
            pass
if font is None:
    font = ImageFont.load_default()

# Centre around x=285, baseline y~200
bbox = draw.textbbox((0, 0), text, font=font)
tw = bbox[2] - bbox[0]
th = bbox[3] - bbox[1]
tx = 285 - tw // 2
ty = 175
draw.text((tx, ty), text, fill=DARK_GREEN, font=font)

out = "/home/user/dremmycare/logo.png"
img.save(out, "PNG", optimize=True)
print(f"Saved {out}  ({SIZE}x{SIZE}px)")
