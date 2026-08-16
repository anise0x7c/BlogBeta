// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import svelte from '@astrojs/svelte';
import pagefind from 'astro-pagefind';

import tailwindcss from '@tailwindcss/vite';


// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), pagefind()],

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
    },
    {
      provider: fontProviders.google(),
      name: 'Ma Shan Zheng',
      cssVariable: '--font-mashanzheng',
      weights: [400],
      styles: ['normal'],
    },
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});