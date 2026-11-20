import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { BASE_PATH } from './src/lib/site.js';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      paths: { base: BASE_PATH.slice(0, -1), relative: false }
    })
  ]
});
