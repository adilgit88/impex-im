#!/usr/bin/env python3
"""Inline CSS, JS, and images into a single portable HTML file."""
import base64, re, pathlib, sys

ROOT = pathlib.Path(__file__).parent
OUT  = ROOT / "impex-tiles-showers-taps-single-file.html"

def read(p):  return (ROOT / p).read_text(encoding="utf-8")
def b64(p):
    data = (ROOT / p).read_bytes()
    return base64.b64encode(data).decode("ascii")

html = read("index.html")
css  = read("css/styles.css")
js   = read("js/app.js")

# 1. inline CSS
html = re.sub(
    r'<link rel="stylesheet" href="css/styles\.css">',
    lambda _: f"<style>\n{css}\n</style>",
    html,
)

# 2. inline JS: remove the external script reference and append at end of body
#    (inline scripts ignore `defer`, so we move it after the markup is parsed and CDN libs loaded)
html = re.sub(
    r'<script src="js/app\.js"[^>]*></script>',
    "",
    html,
)
# Force GSAP/Lenis CDN scripts to load synchronously so they're available when our inlined script runs
html = html.replace(
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" defer></script>',
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>'
).replace(
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" defer></script>',
    '<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>'
).replace(
    '<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js" defer></script>',
    '<script src="https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.42/dist/lenis.min.js"></script>'
)
html = html.replace('</body>', f"<script>\n{js}\n</script>\n</body>")

# 3. inline images: replace generated/<file>.webp with data URI
def img_replace(m):
    path = m.group(1)
    full = ROOT / path
    if not full.exists():
        return m.group(0)
    data = b64(path)
    return f'data:image/webp;base64,{data}'

# Replace src attributes pointing to generated/*.webp
html = re.sub(r'(?<=src=")(generated/[^"]+\.webp)(?=")', img_replace, html)
# Also replace preload hrefs
html = re.sub(r'(?<=href=")(generated/[^"]+\.webp)(?=")', img_replace, html)

OUT.write_text(html, encoding="utf-8")
size_kb = OUT.stat().st_size / 1024
print(f"Wrote {OUT} ({size_kb:.1f} KB)")
