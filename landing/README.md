# Impex Tiles — Landing Page

Single-page immersive landing page for Impex Tiles, a premium seller of bathtubs,
sanitaryware, tiles and fine ceramics.

## Stack

Static HTML / CSS / JS — no build step. Fonts loaded from Fontshare CDN
(Cormorant Garamond display, General Sans body).

## Run locally

Any static server works. From this directory:

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Or open `index.html` directly in a modern browser.

## Files

- `index.html` — semantic sections: hero, showcase, material, showroom, featured,
  benefits, contact, footer.
- `css/styles.css` — design tokens, layout, 3D parallax stage, scene composition,
  responsive breakpoints, `prefers-reduced-motion` support.
- `js/main.js` — sticky header state, hero pointer + scroll parallax, IntersectionObserver
  reveals, product-card 3D tilt, material-slab scroll explode, contact form ack.

## Design notes

- Showroom palette: deep charcoal background with ivory, clay and brass accents.
- Display: Cormorant Garamond. Body: General Sans. One serif/sans pair only.
- All product imagery is custom inline SVG — no third-party images, no AI gradients.
- 3D feel is built from CSS perspective + transform layers, not WebGL — keeps the
  page light and accessible.
- All motion respects `prefers-reduced-motion: reduce`.

## Known limitations / follow-ups

- Contact form is client-side only; wire to a backend or form provider before
  shipping to production.
- Copy is generic and contains no specific business claims (no address, phone,
  years in business or client names) — fill in real values when content is
  available.
- For production deploy, add `og:image`, a real favicon, and run an HTML/CSS
  minifier.
