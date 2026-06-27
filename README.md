# Premier Schools Exhibition (PSE) — Landing Page

A pixel-faithful, fully responsive implementation of the **Premier Schools Exhibition** landing page,
built to the Figma design with **semantic HTML5 + custom CSS (BEM)** and **vanilla JavaScript** — no frameworks.

## Run it

It's a static site — serve the folder with any static server:

```bash
# Python
python -m http.server 5500
# or Node
npx serve .
```

Then open `http://localhost:5500`.

## Structure

```
index.html            # Semantic markup (header, hero, stats, schools, choose, CTA, exhibition, footer)
css/style.css         # Design tokens + BEM components + responsive + reduced-motion
js/main.js            # Collage auto-scroll, accessible form validation, reusable slider controller
assets/
  images/             # Hero collage photos, school cards, CTA photo, logos (exported & optimized from Figma)
  logos/              # Participating-school logo strips (marquee)
  icons/              # Exhibition feature icons (SVG, exported from Figma)
```

## Sections & interactions

| Section | Highlights |
|---|---|
| **Hero** | Dual-axis photo collage (vertical auto-scroll columns on desktop → horizontal band on mobile), pause on hover/focus + explicit pause button, gold gradient headline, glassmorphism "Enquire Now" form with accessible validation. |
| **Stats** | Laurel-wreath stat blocks (1M+ Parents · 22+ Years · 500+ Schools · 17 Cities). |
| **Participating Schools** | Two continuous logo marquees, alternating left↔right flow, pause on hover/focus. |
| **Choose the School** | 4-up image cards on desktop → swipeable slider with pagination dots on mobile. |
| **Pre-schedule CTA** | Lavender panel + photo, "Pre-schedule Now" action. |
| **Exhibition Highlights** | Section-wide slider (5 cards) with accessible prev/next arrows + dots, native swipe. |
| **Footer** | Offices, phone, social links, copyright. |

## Accessibility (WCAG 2.2 AA)

- Skip-to-content link, semantic landmarks (`header`/`main`/`footer`/`section` with labels).
- Keyboard operable: focusable scroll regions, real `<button>` controls, visible focus rings.
- Screen-reader support: `aria-label`/`aria-roledescription` on carousels, decorative images use empty `alt`, live `role="alert"`/`role="status"` for form messages.
- **Every animation honours `prefers-reduced-motion`** (collage, marquees, slider scrolling, transitions).
- **axe-core: 0 violations.** **W3C HTML validator: 0 errors / 0 warnings.**

## Cross-browser

Vendor-prefixed `backdrop-filter`, `mask-image`, `background-clip`, `user-select` for Chrome / Firefox / Safari / Edge (latest 2) + iOS/Android. Graceful colour fallbacks are provided for gradient-clipped text.

## Notes & assumptions

- **Fonts.** The Figma file uses **Museo Sans** (a paid/demo font) for the gold headline lines *"Discover Gurugram's"* and *"All In One Place"*. As it isn't freely redistributable, it's substituted with **Poppins** (closest free geometric match). The stylised *"Top 30+ Schools"* is the **exact Figma vector** (inline-quality SVG), so it's pixel-accurate. Body text uses **Open Sans** and the form heading uses **Archivo** — both as in the design (loaded from Google Fonts).
- **Footer social icons** are recreated as crisp inline SVG (Facebook, Instagram, YouTube). The third platform is an assumption — update the icon/`href` if it differs.
- **Forms are front-end only** (validation + success state, no backend), per spec. The hero form and CTA can be wired to an endpoint later.
- **Responsive layouts** for tablet/mobile were designed to match the desktop Figma (the file contained only the 1920px desktop frame).
- All imagery was exported from the Figma file and **optimised** (resized + recompressed) for the web.

## CSS validation note

W3C Jigsaw flags `mask-image` and `pointer-events` as "unknown" — these are **valid, widely-supported standard CSS** that Jigsaw's profile predates; `-webkit-` fallbacks are included. No genuine CSS errors remain.
