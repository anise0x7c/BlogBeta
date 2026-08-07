// Deterministically map an arbitrary string (e.g. a tag) to one of the sticker
// palette colours. Returns a CSS var() string suitable for use as
// `--tag-color`. Same input always yields the same colour, so a given tag is
// colour-stable across the site.

const STICKER_VARS = [
  "var(--color-berry)",
  "var(--color-mint)",
  "var(--color-sky)",
  "var(--color-grape)",
  "var(--color-peach)",
  "var(--color-lemon)",
] as const;

export function stickerColor(key: string): string {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = (Math.imul(h, 31) + key.charCodeAt(i)) >>> 0;
  }
  return STICKER_VARS[h % STICKER_VARS.length]!;
}
