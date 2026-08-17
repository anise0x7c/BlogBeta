// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],

  // Self-hosted web fonts: downloaded at build time from Google and bundled
  // into ./dist — visitors never connect to fonts.googleapis.com.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Nunito',
      cssVariable: '--font-nunito',
      weights: [400, 600, 700, 800],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'Caveat',
      cssVariable: '--font-caveat',
      weights: [600, 700],
      styles: ['normal'],
      // Caveat has no CJK glyphs; a generic fallback here (e.g. sans-serif)
      // would swallow Chinese chars before they reach --font-mashanzheng.
      fallbacks: [],
    },
    {
      provider: fontProviders.google(),
      name: 'Ma Shan Zheng',
      cssVariable: '--font-mashanzheng',
      weights: [400],
      styles: ['normal'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains-mono',
      weights: [400, 700],
      styles: ['normal'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});