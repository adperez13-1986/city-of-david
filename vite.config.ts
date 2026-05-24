import { defineConfig } from 'vite';

export default defineConfig({
  base: '/city-of-david/',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
  },
});
