// @ts-check
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real production domain before deploying.
  // Required for @astrojs/sitemap to generate absolute URLs.
  site: 'https://example.com',
  output: 'static',
  integrations: [svelte(), sitemap()],
});
