/**
 * Responsive media lookup. Derivatives are produced by scripts/aurelia/make-derivatives.py and live in
 * public/media/aurelia/ together with a manifest.json. Only owner-approved derivatives are committed there
 * (see docs/CONTENT_MANIFEST.md). If the folder or an entry is missing, every lookup returns null and pages render
 * labelled placeholders instead, so the site builds either way.
 */
import fs from 'node:fs';
import path from 'node:path';

interface Variant { file: string; format: string; width: number; height: number; bytes: number }
interface Entry { id: string; variants: Variant[] }

export interface Source { type: string; srcset: string; media?: string; sizes?: string }
export interface Pic {
  id: string;
  alt: string;
  /** Fallback image (JPEG) shown by browsers without AVIF, and its intrinsic size. */
  src: string;
  width: number;
  height: number;
  sources: Source[];
  /** Largest AVIF, for an "open larger" link. */
  large: string;
  /** Size in bytes of the largest AVIF. */
  largeBytes: number;
}

const base = '/media/aurelia';
let cache: Record<string, Entry> | null = null;

function manifest(): Record<string, Entry> {
  if (cache) return cache;
  cache = {};
  try {
    const file = path.resolve('public/media/aurelia/manifest.json');
    if (fs.existsSync(file)) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8')) as { outputs: Entry[] };
      for (const e of data.outputs) {
        // only trust entries whose files all exist
        if (e.variants.every((v) => fs.existsSync(path.resolve('public/media/aurelia', v.file)))) cache[e.id] = e;
      }
    }
  } catch {
    cache = {};
  }
  return cache;
}

export function available(id: string): boolean {
  return Boolean(manifest()[id]);
}

/** Build picture data for one derivative id, or null when the files are not present. */
export function picture(id: string, alt: string, sizes = '100vw', media?: string): Pic | null {
  const e = manifest()[id];
  if (!e) return null;
  const avif = e.variants.filter((v) => v.format === 'avif').sort((a, b) => a.width - b.width);
  const jpg = e.variants.filter((v) => v.format === 'jpg').sort((a, b) => a.width - b.width);
  if (!avif.length || !jpg.length) return null;
  const fallback = jpg[jpg.length - 1];
  const largest = avif[avif.length - 1];
  const sources: Source[] = [
    { type: 'image/avif', srcset: avif.map((v) => `${base}/${v.file} ${v.width}w`).join(', '), sizes, media },
    { type: 'image/jpeg', srcset: jpg.map((v) => `${base}/${v.file} ${v.width}w`).join(', '), sizes, media },
  ];
  return { id, alt, src: `${base}/${fallback.file}`, width: fallback.width, height: fallback.height, sources, large: `${base}/${largest.file}`, largeBytes: largest.bytes };
}

/** Desktop picture plus an art-directed phone crop (<= 560 px). Falls back to the desktop picture alone. */
export function artDirected(desktopId: string, phoneId: string, alt: string, sizes = '100vw'): Pic | null {
  const d = picture(desktopId, alt, sizes);
  if (!d) return null;
  const m = picture(phoneId, alt, '100vw', '(max-width: 560px)');
  if (m) d.sources = [...m.sources, ...d.sources];
  return d;
}

export function bytesOf(id: string, format = 'avif'): number {
  const e = manifest()[id];
  return e ? e.variants.filter((v) => v.format === format).reduce((n, v) => n + v.bytes, 0) : 0;
}
