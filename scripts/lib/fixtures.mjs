// Synthetic hero artwork for tests only (never shipped): SVGs with a marked safe area so crop and
// layout behaviour can be measured without any real asset. Written into dist-explore/ by build:explore.
const guide = (w, h, band) => {
  const y0 = h * (0.5 - band / 2);
  const bh = h * band;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a2c18"/><stop offset="1" stop-color="#14100c"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><rect x="${w * 0.15}" y="${y0}" width="${w * 0.7}" height="${bh}" fill="none" stroke="#c9a96e" stroke-width="${w / 400}" stroke-dasharray="${w / 60}"/><text x="${w / 2}" y="${h / 2}" fill="#ebe5da" font-family="sans-serif" font-size="${w / 30}" text-anchor="middle">TEST FIXTURE: SAFE AREA</text></svg>`;
};

export const fixtures = {
  'hero-desktop.svg': guide(2390, 1000, 0.7),
  'hero-mobile.svg': guide(1200, 1500, 0.7),
};
