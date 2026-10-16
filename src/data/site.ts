export const site = {
  name: 'Youssef Studio',
  // Describes owner-confirmed scope only; asserts no results or credits.
  tagline: 'Engineering precision. Cinematic imagination.',
  footerLine: 'CGI, 3D rendering, VFX and engineering.',
  description:
    'Portfolio covering CGI, 3D rendering, VFX, product visualization, mechatronics engineering and CAD.',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/work/', label: 'VFX Portfolio' },
  { href: '/engineering/', label: 'Engineering' },
  { href: '/about/', label: 'About' },
] as const;
