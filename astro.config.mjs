// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

import pagefind from 'astro-pagefind';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), pagefind()],

  vite: {
    plugins: [tailwindcss()]
  }
});