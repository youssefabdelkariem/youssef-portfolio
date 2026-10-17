# Motion and typography pass

Status: implemented 2026-10-18 at the owner's request (aesthetic animation and fonts). Related: [design system](../DESIGN_SYSTEM.md), [contact form](../CONTACT_FORM.md).

## Typography

Headlines keep Instrument Serif. The body face changes from the system stack to **Hanken Grotesk** (variable weight, Latin subset, 34 KB), self-hosted in `public/fonts/` with its SIL OFL 1.1 licence (`OFL-HankenGrotesk.txt`, copied from the fontsource package, version 5.3.0). It is preloaded and uses `font-display: optional`, so a slow first load falls back to the system stack instead of swapping late and shifting layout.

## Motion (`src/styles/motion.css`)

All of it is decoration, uses transform, opacity or clip-path, and is switched off under `prefers-reduced-motion`:

- headline lines rise out of a mask on load, followed by the intro text and buttons;
- a slow drift on the hero still;
- a sheen across buttons on hover and focus;
- project tiles lift on hover, with a brass spotlight that follows a fine pointer (a few lines in `BaseLayout`);
- section hairlines draw in on scroll and a thin reading-progress line runs along the top (CSS scroll-driven animation, only where supported);
- a short crossfade between pages;
- a faint film grain on large screens with a hover-capable pointer only (off on phones and touch screens).

## Form changes

The link field is now a URL field that must be a full `https://` link, with an inline error otherwise. Choosing "Custom amount" as the budget reveals a required number field and a currency (USD, EUR, GBP, EGP, AED, SAR); without JavaScript the number field stays visible and optional. A blur-validation bug that could push the Send button away mid-click was fixed. `npm run test:contact` covers all of this.

## Limits

Motion was reviewed from screenshots and automated checks only; frame rate and feel were not measured on real devices. Homepage CSS gzip grew from about 8.7 KB to 14 KB.
