# IMPEX TILES — Water Collection (Page 2 / Showers & Taps)

A scroll-driven, mobile-responsive luxury product page for the Impex Tiles Water Collection. Pure black + ivory + copper-amber palette, Cormorant Garamond / Inter Tight / JetBrains Mono typography, custom copper cursor, Lenis smooth scrolling, and GSAP ScrollTrigger reveals.

This is **Page 2** of a two-page set. The companion **Page 1 (Tiles & Bathrooms)** lives at `../impex-tiles/` and is referenced from the cross-link section.

## Project structure

```
impex-tiles-water/
├── index.html                                   ← deployable entry point (uses /css, /js, /generated)
├── impex-tiles-showers-taps-single-file.html    ← portable, fully self-contained (CSS + JS + images base64)
├── css/styles.css
├── js/app.js
├── generated/                                   ← AI-generated WebP images
│   ├── hero_rain_ceiling.webp
│   ├── shower_a_thin_rain.webp
│   ├── shower_b_waterfall.webp
│   ├── shower_c_wall_panel.webp
│   ├── shower_d_jet_column.webp
│   ├── tap_a_waterfall.webp
│   ├── tap_b_mono_lever.webp
│   ├── tap_c_dual_cross.webp
│   ├── tap_d_wall_spout.webp
│   └── page1_tub.webp
└── build_single_html.py                          ← rebuilds the single-file bundle
```

## Sections

1. **Hero (100vh)** — fixed top nav, kicker, word-by-word reveal headline ("Engineered for the feel of water."), Cormorant italic subhead, copper-gradient CTA, AI-generated rain ceiling shower with parallax, copper scroll indicator.
2. **Shower Collection** — full-viewport swiper (image left 55% / copy right 45%) with arrows, dots, mouse drag, touch swipe, keyboard. Four products with live CSS water animations: thin rainfall, waterfall curtain, horizontal wall jets, bilateral + top rain.
3. **Tap Collection** — opposite layout (copy left 45% / image right 55%) on `#0A0A0A`. Four taps with CSS/SVG water animations: waterfall sheet, mono-lever arc + splash, dual-cross thicker turbulent arc + splash, wall-spout vertical fan + mist.
4. **Water Promise** — three pinned, scroll-revealed Cormorant Italic statements with copper underline draws.
5. **Cross-link** — full-bleed deep charcoal panel, copper-glow tub thumbnail, CTA to `../impex-tiles/index.html`.
6. **Footer** — wordmark, Blantyre + Lilongwe addresses, contact, copper hairline divider, mono micro-type.

## Deploy

### Option A — folder
Serve the entire `impex-tiles-water/` directory. `index.html` is the entry point and references `css/`, `js/`, `generated/`. Assumes Page 1 is deployed at the relative URL `../impex-tiles/`. If you're deploying just this page in isolation, the cross-link CTA still resolves harmlessly to `../impex-tiles/index.html` (404 only if Page 1 isn't co-deployed).

### Option B — single file
Open `impex-tiles-showers-taps-single-file.html` directly. All CSS, JS, and images are embedded; only fonts (Google) and GSAP/Lenis CDNs require an internet connection. Drop it on any static host or open from disk.

To rebuild the single file after editing `index.html`, `css/styles.css`, or `js/app.js`:

```bash
python3 build_single_html.py
```

## Image assets

All 9 product images are **AI-generated** with `gpt_image_2`, then compressed to WebP at quality 78. The Page 1 tub thumbnail is reused from `../impex-tiles/generated/tub.webp`.

Total size of `generated/` is ~360 KB.

## Accessibility & performance

- `prefers-reduced-motion: reduce` disables Lenis smooth scrolling, GSAP scroll effects, parallax, and CSS water animations.
- Hero image uses `fetchpriority="high"` and is preloaded; all other images are `loading="lazy"`.
- Body `overflow-x:hidden` and `min-width:0` track flooring on swiper grid columns prevents horizontal overflow.
- WCAG: copper-on-black CTA is `#000` text on copper gradient (>7:1); ivory body text on near-black background is >12:1.
- No `<form>` tags. No blue colors anywhere (`grep -inE 'blue|aqua|cyan|navy|teal'` returns empty).
- Native `<button>` controls; arrow keys and tab navigation work on each swiper.

## QA snapshots

Reference screenshots in the project root (`qa_*.png`) cover desktop (1440×900) and mobile (390×844) for hero, showers, taps, promise, crosslink, footer.

- `scrollWidth === clientWidth` at both 1440 and 390 viewports — no horizontal overflow.
- Swiper functional check: clicking next on `#showers` advances "Type A — Thin Rainfall." → "Type B — Waterfall Curtain.", and the active dot moves.
- Touch swipe on mobile (390 px viewport, simulated TouchEvent dx = −160 px) advances the same way.

## Caveats

- The cross-link CTA assumes Page 1 ships at `../impex-tiles/`. If deployed standalone, link to `#` or update the `href` in two places: the hero brand `<a>` and the crosslink section.
- The single-file build still depends on the Google Fonts and GSAP/Lenis CDNs to look perfect; system fallback fonts and a no-JS state are graceful but missing the cinematic motion.
- Water animations are intentionally stylised (CSS gradients + transforms) rather than canvas/WebGL — keeps the page light (~360 KB total assets) at the cost of physical realism. Only the photo of the products carries the photoreal water; overlays add motion.
